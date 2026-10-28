import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import {
  describeFrameChanges,
  matchAttacks,
  nameWords,
  OFF_FIELD,
  parseTalentValue,
  renderCharacterFramesFile,
  toAttackFrames,
  topTalent,
  wuwalabSlugFor,
  type OurAttack,
} from "../../cli/lib/frames.js";
import type { WuwalabAbility } from "../../cli/lib/wuwalab.js";
import { addFramesToIndex } from "../../cli/commands/importFrames.js";
import { getData as suomingData } from "../../src/characters/Suoming/index";
import { getData as shorekeeperData } from "../../src/characters/Shorekeeper/index";
import { getData as phoebeData } from "../../src/characters/Phoebe/index";

// Set A (ADR 0047): matcher tests on the committed wuwalab ability snapshots.
const fixturesDir = path.resolve(import.meta.dirname, "../fixtures/frames/abilities");
const snapshot = (slug: string): WuwalabAbility[] =>
  JSON.parse(fs.readFileSync(path.join(fixturesDir, `${slug}.json`), "utf8")).abilities;

const GROUPS = [
  "basicAttacks",
  "skillAttacks",
  "liberationAttacks",
  "forteCircuitAttacks",
  "introAttacks",
  "outroAttacks",
  "tuneBreakAttacks",
];
const ourAttacks = (data: any): OurAttack[] =>
  GROUPS.flatMap((group) =>
    (data[group]?.attacks ?? []).map((attack: any) => ({ key: attack.key, label: attack.label, group, talents: attack.talents })),
  );

function ability(name: string, values: number[], extra: Partial<WuwalabAbility> = {}): WuwalabAbility {
  return {
    id: 0,
    name,
    total_frames: 60,
    earliest_frame_cancel: 40,
    cooldown: null,
    hits: values.map((motion_value, i) => ({ frame: 10 + i, commit_frame: 10 + i, motion_value, energy: 0, concerto: 0 })),
    heals: [],
    ...extra,
  };
}

describe("parseTalentValue", () => {
  it("reads repeated and summed multipliers as ×100 integers", () => {
    expect(parseTalentValue("110.89%*2+36.97%*4")).toEqual({
      percents: [11089, 11089, 3697, 3697, 3697, 3697],
      flats: [],
    });
    expect(parseTalentValue("38.03%*3 + 57.04%*2")?.percents).toHaveLength(5);
    expect(parseTalentValue("120% ATK")?.percents).toEqual([12000]);
  });

  it("separates the flat part of a heal", () => {
    expect(parseTalentValue("259 + 1.20%")).toEqual({ percents: [120], flats: [259] });
  });

  it("returns null for anything it can't read", () => {
    expect(parseTalentValue(undefined)).toBeNull();
    expect(parseTalentValue("12% per stack")).toBeNull();
  });
});

describe("topTalent", () => {
  it("picks the highest level", () => {
    expect(topTalent({ "1": "1%", "10": "10%", "9": "9%" })).toBe("10%");
    expect(topTalent({ "1": "1%", "5": "5%" })).toBe("5%");
    expect(topTalent(undefined)).toBeUndefined();
  });
});

describe("nameWords", () => {
  it("splits keys into comparable words", () => {
    expect([...nameWords("MidAirHeavyAttackBreakdownFormDMG")]).toEqual(["mid", "air", "heavy", "breakdown", "form"]);
    expect([...nameWords("DestinedPromiseStage4DMG")]).toEqual(["destined", "promise", "stage", "4"]);
  });
});

describe("matchAttacks on real data", () => {
  it("matches every Suoming attack", () => {
    const result = matchAttacks("Suoming", ourAttacks(suomingData()), snapshot("suoming"));
    expect(result.unmatched).toEqual([]);
    expect(result.attacks.IntroSkillFurledCanopyFlashRiftDMG).toMatchObject({
      ability: "Intro: Furled Canopy - Flash Rift",
      total: 103,
      cancel: 85,
      noSwap: 90,
    });
    expect(result.attacks.ResonanceLiberationUmbralCanopyMiasmaLockDMG.timeStop).toEqual([0, 332]);
    expect(result.attacks.TuneBreakDMG.ability).toBe("Tune Break Skill");
    expect(result.attacks.ResonanceLiberationBlightRainMiasmicThunderDMG.offField).toBe(true);
  });

  it("marks attacks that are only part of a bigger ability as shared", () => {
    const result = matchAttacks("Suoming", ourAttacks(suomingData()), snapshot("suoming"));
    for (const key of ["BasicAttackUmbralCanopyEngravedHeartDMG", "BasicAttackUmbralCanopyEngravedHeartDMGHold"]) {
      expect(result.attacks[key]).toMatchObject({ ability: "Forte: Umbral Canopy - Engraved Heart", shared: true });
    }
  });

  it("matches healing by its base value and percent", () => {
    const result = matchAttacks("Shorekeeper", ourAttacks(shorekeeperData()), snapshot("shorekeeper"));
    expect(result.attacks.EnlightenmentHealing.ability).toBe("Intro: Enlightenment");
  });

  it("gives outros no field time", () => {
    // 180 frames long, yet the next character acts on the same frame.
    const result = matchAttacks("Phoebe", ourAttacks(phoebeData()), snapshot("phoebe"));
    expect(result.attacks.AttentiveHeartDMG).toMatchObject({ ability: "Outro: Attentive Heart", total: 180, offField: true });
  });
});

describe("matchAttacks rules", () => {
  const attack = (key: string, value: string, group = "basicAttacks", label = key): OurAttack => ({
    key,
    label,
    group,
    talents: { "10": value },
  });

  it("prefers the ability whose name fits when motion values tie", () => {
    const abilities = [
      ability("Basic: Destined Promise 2", [5000], { group_label: "basic attack" }),
      ability("Basic: Destined Promise 4", [5000], { group_label: "basic attack", total_frames: 90 }),
    ];
    const result = matchAttacks("X", [attack("DestinedPromiseStage4DMG", "50.00%")], abilities);
    expect(result.attacks.DestinedPromiseStage4DMG.ability).toBe("Basic: Destined Promise 4");
    expect(result.notices).toEqual([]);
  });

  it("flags a tie it can't break when the frames differ", () => {
    const abilities = [ability("A", [5000]), ability("B", [5000], { total_frames: 90 })];
    const result = matchAttacks("X", [attack("Thing", "50.00%")], abilities);
    expect(result.notices[0]).toContain("Check the pick");
  });

  it("applies overrides, including off-field and deliberate gaps", () => {
    const abilities = [ability("Forced", [100]), ability("Other", [5000])];
    const result = matchAttacks(
      "X",
      [attack("A", "50.00%"), attack("B", "50.00%"), attack("C", "50.00%"), attack("D", "50.00%")],
      abilities,
      { A: "Forced", B: OFF_FIELD, C: null, D: "Gone" },
    );
    expect(result.attacks.A.ability).toBe("Forced");
    expect(result.attacks.B).toEqual({ ability: OFF_FIELD, total: 0, hits: [], offField: true });
    expect(result.attacks.C).toBeUndefined();
    expect(result.unmatched).toEqual(["D"]);
    expect(result.notices[0]).toContain('"Gone"');
  });

  it("matches tune break by genre", () => {
    const abilities = [ability("Tune Break Skill", [160000], { genre: "tunebreak" })];
    const result = matchAttacks("X", [{ key: "TuneBreakDMG", group: "tuneBreakAttacks" }], abilities);
    expect(result.attacks.TuneBreakDMG.ability).toBe("Tune Break Skill");
  });

  it("reports what it can't place", () => {
    const result = matchAttacks("X", [attack("Lonely", "12.34%")], [ability("A", [5000])]);
    expect(result.unmatched).toEqual(["Lonely"]);
  });
});

describe("toAttackFrames", () => {
  it("keeps only the fields that carry information", () => {
    expect(toAttackFrames(ability("A", [100]))).toEqual({
      ability: "A",
      total: 60,
      cancel: 40,
      hits: [[10, 10, 0, 0]],
    });
  });
});

describe("generated files", () => {
  it("writes one line per attack", () => {
    const file = renderCharacterFramesFile({
      syncedAt: "2026-10-28",
      attacks: { Plain: { ability: "A", total: 1, hits: [] } },
    });
    expect(file).toContain('  syncedAt: "2026-10-28",');
    expect(file).toContain('    Plain: {"ability":"A","total":1,"hits":[]},');
  });

  it("adds frames to a character index once", () => {
    const index = 'import { rotations } from "./presets.ts";\r\n\r\nexport function getData() {\r\n  return {\r\n    rotations,\r\n  };\r\n}\r\n';
    const once = addFramesToIndex(index);
    expect(once).toContain('import { frames } from "./frames.ts";\r\n');
    expect(once).toContain("return {\r\n    frames,\r\n");
    expect(addFramesToIndex(once)).toBe(once);
  });

  it("reports frames that moved since the last import", () => {
    const lines = describeFrameChanges(
      "X",
      { A: { ability: "A", total: 40, hits: [] } },
      { A: { ability: "A", total: 42, hits: [] }, B: { ability: "B", total: 1, hits: [] } },
    );
    expect(lines).toEqual(["X: A changed (total 40→42, cancel -→-, no-swap -→-)."]);
  });
});

describe("wuwalabSlugFor", () => {
  it("maps our folders to wuwalab slugs", () => {
    expect(wuwalabSlugFor("Suoming")).toBe("suoming");
    expect(wuwalabSlugFor("LuukHerssen")).toBe("luukherssen");
    expect(wuwalabSlugFor("RoverSpectroMale")).toBe("roverspectro");
    expect(wuwalabSlugFor("Roverelectrofemale")).toBe("roverelectro");
    expect(wuwalabSlugFor("YangyangXuanling")).toBe("xuanling");
  });
});
