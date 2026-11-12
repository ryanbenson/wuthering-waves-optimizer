import { describe, it, expect } from "vitest";
import {
  attributeStatBuckets,
  formatSplitRow,
  type StatSplitRow,
  liveStatValueFor,
  resolveStatSelection,
  splitStat,
  statShare,
  type StatSourceInputs,
} from "../../src/calculator/statSplit";
import { buildCharacterCalculationContext } from "../../src/calculator/buildCharacterContext";
import { BUILD_ONLY_ENEMY_CONFIG, computeBuildOnlyStats, toLiveStatValues } from "../../src/calculator/buildOnlyStats";
import { calculateAllStats, computeTotalTuneBreakBoost } from "../../src/calculator/stats";
import { STAT_KEYS } from "../../src/calculator/pinnedStats";
import { allCharactersList, getCharByName } from "../../src/characters/characters";

function inputs(overrides: Partial<StatSourceInputs> = {}): StatSourceInputs {
  return {
    baseHp: 10000,
    baseAtk: 412,
    baseDef: 1000,
    weaponData: { attack: 588, modifier: null, modifierValue: 0, weaponPassiveStats: {} },
    selfBuffs: {},
    resonanceChains: {},
    echoStats: {},
    echoSetAdditionalBase: {},
    customBuffs: {},
    teamBuffs: {},
    tuneBreakBoost: { base: 0, selfBuffs: 0, resonanceChains: 0, teamBuffs: 0, echoes: 0 },
    ...overrides,
  };
}

// The canvas example: (412 + 588) × (1 + 80% + 150%) + 200 = 3,500.
const buildInputs = inputs({
  // echoes are whole-number percents (addEchoBuffs), everything else decimals
  echoStats: { ATK: 68, ATK_FLAT: 200 },
  weaponData: { attack: 588, modifier: null, modifierValue: 0, weaponPassiveStats: { ATK: 0.12 } },
});
const liveInputs = inputs({
  ...buildInputs,
  selfBuffs: { ATK: 0.5 },
  resonanceChains: { ATK: 0.3 },
  teamBuffs: { ATK: 0.7 },
});

describe("splitStat — scaled stats (ATK/HP/DEF)", () => {
  const split = splitStat("totalAtk", {
    build: { inputs: buildInputs, value: 2000 },
    live: { inputs: liveInputs, value: 3500 },
  })!;

  it("takes build/live from the given values and buffs as the difference", () => {
    expect(split.build).toBe(2000);
    expect(split.live).toBe(3500);
    expect(split.buffs).toBe(1500);
  });

  it("lists each build source, with weapon main stat/passive under Weapon", () => {
    const byKey = Object.fromEntries(split.buildRows.map((row) => [row.label, row]));
    expect(byKey["Character base ATK"].amount).toBe(412);
    expect(byKey["Weapon ATK"].amount).toBe(588);
    expect(byKey.Weapon.amount).toBeCloseTo(12);
    expect(byKey.Echoes.amount).toBeCloseTo(68);
    expect(byKey.Echoes.flat).toBeCloseTo(200);
    expect(split.buildRows.some((row) => row.source === "other")).toBe(false);
  });

  it("lists only the sources that changed between build and live under buffs", () => {
    expect(split.buffRows.map((row) => [row.source, Math.round(row.amount)])).toEqual([
      ["selfBuffs", 50],
      ["resonanceChains", 30],
      ["teamBuffs", 70],
    ]);
  });

  it("exposes the formula parts", () => {
    expect(split.formula).toEqual({
      base: 412,
      weaponAtk: 588,
      buildPercent: expect.closeTo(80, 6),
      buffPercent: expect.closeTo(150, 6),
      flat: 200,
    });
  });

  it("formats rows the way the stat detail shows them", () => {
    const echoes = split.buildRows.find((row) => row.source === "echoes")!;
    expect(formatSplitRow("totalAtk", echoes)).toBe("+68.0% · +200");
    const base = split.buildRows.find((row) => row.source === "base")!;
    expect(formatSplitRow("totalAtk", base)).toBe("412");
  });

  it("never signs an amount that shows as zero (#703)", () => {
    const tiny = { source: "echoes", label: "Echoes", amount: 0.01, flat: 0 } as StatSplitRow;
    expect(formatSplitRow("totalAtk", tiny)).toBe("0.0%");
    const tinyFlat = { source: "echoes", label: "Echoes", amount: 0, flat: 0.3 } as StatSplitRow;
    expect(formatSplitRow("totalAtk", tinyFlat)).toBe("0.0%");
    // Crit Rate amounts are fractions: -0.0001 is -0.01%.
    const tinyNegative = { source: "teamBuffs", label: "Team", amount: -0.0001 } as StatSplitRow;
    expect(formatSplitRow("totalCritRate", tinyNegative)).toBe("0.0%");
    const real = { source: "teamBuffs", label: "Team", amount: -0.025 } as StatSplitRow;
    expect(formatSplitRow("totalCritRate", real)).toBe("−2.5%");
  });

  it("puts a gap it can't explain in an explicit Other row instead of hiding it", () => {
    const off = splitStat("totalAtk", {
      build: { inputs: buildInputs, value: 2000 },
      live: { inputs: liveInputs, value: 3600 },
    })!;
    const other = off.buffRows.find((row) => row.source === "other");
    expect(other?.amount).toBeCloseTo(100);
    expect(off.buildRows.some((row) => row.source === "other")).toBe(false);
  });

  it("splits one source across both groups (Stat Bonus under build, conditional under buffs)", () => {
    const withStatBonus = inputs({ selfBuffs: { ATK: 0.1 } });
    const withBoth = inputs({ selfBuffs: { ATK: 0.3 } });
    const s = splitStat("totalAtk", {
      build: { inputs: withStatBonus, value: 1000 * 1.1 },
      live: { inputs: withBoth, value: 1000 * 1.3 },
    })!;
    expect(s.buildRows.find((row) => row.source === "selfBuffs")?.amount).toBeCloseTo(10);
    expect(s.buffRows.find((row) => row.source === "selfBuffs")?.amount).toBeCloseTo(20);
  });

  it("reports the echo set AdditionalBase part under Echoes, not Self buffs", () => {
    const withSetBase = inputs({ selfBuffs: { ATK: 0.25 }, echoSetAdditionalBase: { ATK: 0.1 } });
    const s = splitStat("totalAtk", {
      build: { inputs: withSetBase, value: 1000 * 1.25 },
      live: { inputs: withSetBase, value: 1000 * 1.25 },
    })!;
    expect(s.buildRows.find((row) => row.source === "echoes")?.amount).toBeCloseTo(10);
    expect(s.buildRows.find((row) => row.source === "selfBuffs")?.amount).toBeCloseTo(15);
  });
});

describe("splitStat — other stats", () => {
  it("includes the 5% crit rate base and keeps live units (decimals)", () => {
    const build = inputs({ echoStats: { CritRate: 20 } });
    const live = inputs({ echoStats: { CritRate: 20 }, teamBuffs: { CritRate: 0.12 } });
    const s = splitStat("totalCritRate", {
      build: { inputs: build, value: 0.25 },
      live: { inputs: live, value: 0.37 },
    })!;
    expect(s.buildRows.find((row) => row.source === "base")?.amount).toBeCloseTo(0.05);
    expect(s.buildRows.find((row) => row.source === "echoes")?.amount).toBeCloseTo(0.2);
    expect(s.buffRows).toHaveLength(1);
    expect(s.buffRows[0].amount).toBeCloseTo(0.12);
    expect(formatSplitRow("totalCritRate", s.buffRows[0])).toBe("+12.0%");
  });

  it("folds AllAttributeBonus into each attack-type DMG bonus", () => {
    const live = inputs({ teamBuffs: { AllAttributeBonus: 0.1 } });
    const s = splitStat("basicAttackDmgBonus", {
      build: { inputs: inputs(), value: 0 },
      live: { inputs: live, value: 10 },
    })!;
    expect(s.buffRows.map((row) => [row.source, row.amount])).toEqual([["teamBuffs", expect.closeTo(10, 6)]]);
  });

  it("resolves the element row's bucket from the element", () => {
    const live = inputs({ echoStats: { Fusion: 30 }, selfBuffs: { Fusion: 0.2 } });
    const s = splitStat(
      "elementDmgBonus",
      {
        build: { inputs: inputs({ echoStats: { Fusion: 30 } }), value: 30 },
        live: { inputs: live, value: 50 },
      },
      "Fusion",
    )!;
    expect(s.buffRows.map((row) => [row.source, row.amount])).toEqual([["selfBuffs", expect.closeTo(20, 6)]]);
    expect(splitStat("elementDmgBonus", { build: { inputs: live, value: 0 }, live: { inputs: live, value: 0 } })).toBeNull();
  });

  it("splits Tune Break Boost from its explicit parts (echoes in whole-number units)", () => {
    const build = inputs({ tuneBreakBoost: { base: 0.1, selfBuffs: 0, resonanceChains: 0, teamBuffs: 0, echoes: 5 } });
    const live = inputs({ tuneBreakBoost: { base: 0.1, selfBuffs: 0.2, resonanceChains: 0, teamBuffs: 0, echoes: 5 } });
    const s = splitStat("tuneBreakBoost", {
      build: { inputs: build, value: 0.15 },
      live: { inputs: live, value: 0.35 },
    })!;
    expect(s.buildRows.map((row) => row.source)).toEqual(["base", "echoes"]);
    expect(s.buffRows.map((row) => [row.source, row.amount])).toEqual([["selfBuffs", expect.closeTo(0.2, 6)]]);
  });

  it("returns null for a stat it doesn't know", () => {
    expect(
      splitStat("shieldBonus", { build: { inputs: inputs(), value: 0 }, live: { inputs: inputs(), value: 0 } }),
    ).toBeNull();
  });
});

describe("statShare", () => {
  it("returns the two widths and text that adds up on screen", () => {
    const share = statShare("totalAtk", 2000.7, 3500.4)!;
    expect(share.build).toBeCloseTo(2000.7 / 3500.4);
    expect(share.buffs).toBeCloseTo(1 - 2000.7 / 3500.4);
    // floor(3500.4) - floor(2000.7) = 1500, not floor(1499.7) = 1499
    expect(share.buildText).toBe("2,000");
    expect(share.buffsText).toBe("+1,500");
  });

  it("shows a full build bar and no text when buffs add nothing", () => {
    expect(statShare("totalCritDMG", 2.48, 2.48)).toEqual({
      build: 1,
      buffs: 0,
      hasBuffs: false,
      buildText: "248.0%",
      buffsText: "",
    });
  });

  it("draws nothing for a zero stat", () => {
    expect(statShare("healingBonus", 0, 0)).toBeNull();
  });

  it("shows a stat lowered by buffs as a signed difference with no teal segment", () => {
    const share = statShare("totalDef", 1200, 1000)!;
    expect(share.buffs).toBe(0);
    expect(share.build).toBe(1);
    expect(share.buffsText).toBe("−200");
  });

  it("formats percent stats in the same units as the Overview", () => {
    expect(statShare("totalCritRate", 0.624, 0.744)?.buffsText).toBe("+12.0%");
    expect(statShare("resonanceSkillDmgBonus", 12, 37)?.buffsText).toBe("+25.0%");
    expect(statShare("tuneBreakBoost", 0.1, 0.3)?.buffsText).toBe("+20");
  });
});

describe("resolveStatSelection / liveStatValueFor", () => {
  it("maps the UI's stat labels to STAT_KEYS keys", () => {
    expect(resolveStatSelection("ATK")).toEqual({ statKey: "totalAtk", element: null });
    expect(resolveStatSelection("Crit DMG")).toEqual({ statKey: "totalCritDMG", element: null });
    expect(resolveStatSelection("Fusion DMG Bonus")).toEqual({ statKey: "elementDmgBonus", element: "Fusion" });
    expect(resolveStatSelection("Basic Attack DMG Bonus")).toEqual({ statKey: "basicAttackDmgBonus", element: null });
    expect(resolveStatSelection("Nonsense")).toBeNull();
  });

  it("reads values by STAT_KEYS key", () => {
    const values = { totalCritDmg: 2.5, havoc: 40 } as Record<string, number>;
    expect(liveStatValueFor(values, "totalCritDMG")).toBe(2.5);
    expect(liveStatValueFor(values, "elementDmgBonus", "Havoc")).toBe(40);
  });
});

// Against the real pipeline: with every self buff and resonance chain node on,
// the per-source rows must add up to the real final stats for every
// character, so the "Other" row never appears in practice.
describe("splitStat against real characters", () => {
  // Character-specific post-processing outside calcCharStats
  // (applyCharacterStatEdgeCases) — the one place an Other row is expected.
  const EXPECTED_OTHER = new Set(["Rebecca:basicAttackDmgBonus"]);

  function everythingOn(defs: any[] = []) {
    return Object.fromEntries(
      defs.map((def) => [def.key, { isEnabled: true, stacks: def.maxStacks ?? def.stacks ?? 1 }]),
    );
  }

  async function liveSide(characterId: string, characters: Record<string, any>) {
    const built = await buildCharacterCalculationContext(characterId, characters, BUILD_ONLY_ENEMY_CONFIG);
    const tuneBreakBoost = computeTotalTuneBreakBoost({
      baseTuneBreakBoost: built.chosenChar?.basic?.tuneBreakBoost ?? 0,
      selfBuffs: built.charBuffsData as any,
      resonanceChainsBuffs: built.charResonanceChainsData as any,
      teamBuffs: built.teamBuffsData as any,
      echoStats: built.echoStats as any,
    });
    return {
      values: toLiveStatValues(built.finalStats, tuneBreakBoost),
      inputs: {
        baseHp: built.baseHp,
        baseAtk: built.baseAtk,
        baseDef: built.baseDef,
        weaponData: built.weaponData,
        selfBuffs: built.appliedCharBuffsData,
        resonanceChains: built.charResonanceChainsData,
        echoStats: built.echoStats,
        echoSetAdditionalBase: built.echoSetAdditionalBaseBuffsData,
        customBuffs: built.customBuffs,
        teamBuffs: built.teamBuffsData,
        tuneBreakBoost: {
          base: built.chosenChar?.basic?.tuneBreakBoost ?? 0,
          selfBuffs: (built.charBuffsData as any)?.tuneBreakBoost ?? 0,
          resonanceChains: (built.charResonanceChainsData as any)?.tuneBreakBoost ?? 0,
          teamBuffs: (built.teamBuffsData as any)?.tuneBreakBoost ?? 0,
          echoes: (built.echoStats as any)?.tuneBreakBoost ?? 0,
        },
      } satisfies StatSourceInputs,
    };
  }

  it("adds up for every character with all buffs and sequences on", async () => {
    const unexplained: string[] = [];
    for (const { key } of allCharactersList) {
      const chosenChar = await getCharByName(key);
      const characters = {
        [key]: {
          buffs: everythingOn(chosenChar?.buffs),
          resonanceChains: everythingOn(chosenChar?.resonanceChains),
          customBuffs: { ATK: 10, CritRate: 5 },
        },
      };
      const live = await liveSide(key, characters);
      const build = await computeBuildOnlyStats(key, characters);
      const element = chosenChar?.basic?.element ?? null;
      for (const statKey of STAT_KEYS) {
        const split = splitStat(
          statKey,
          {
            build: { inputs: build.inputs, value: liveStatValueFor(build.values as any, statKey, element) },
            live: { inputs: live.inputs, value: liveStatValueFor(live.values as any, statKey, element) },
          },
          element,
        );
        if (!split) continue;
        const hasOther = [...split.buildRows, ...split.buffRows].some((row) => row.source === "other");
        if (hasOther && !EXPECTED_OTHER.has(`${key}:${statKey}`)) {
          unexplained.push(`${key}:${statKey}`);
        }
      }
    }
    expect(unexplained).toEqual([]);
  }, 60_000);

  it("the build side matches the build card's own numbers", async () => {
    const characters = {
      Iuno: {
        weapon: "PulsationBracer",
        weapons: { PulsationBracer: { weaponLevel: "90", refinement: "1" } },
        weaponPassives: { PulsationBracerBasic: { isEnabled: true, stacks: 4 } },
        customBuffs: { ATK: 20 },
      },
    };
    const build = await computeBuildOnlyStats("Iuno", characters);
    const card = await buildCharacterCalculationContext("Iuno", characters, BUILD_ONLY_ENEMY_CONFIG, [], {
      alwaysEnabledOnly: true,
    });
    expect(build.finalStats).toEqual(card.finalStats);
    // custom buffs and the conditional passive are buffs, not build
    const live = await liveSide("Iuno", characters);
    const split = splitStat("totalAtk", {
      build: { inputs: build.inputs, value: build.values.totalAtk },
      live: { inputs: live.inputs, value: live.values.totalAtk },
    })!;
    expect(split.buffRows.map((row) => row.source)).toEqual(["customBuffs"]);
    expect(split.buffs).toBeGreaterThan(0);
  });
});

describe("attributeStatBuckets", () => {
  it("sums to the pipeline's own buckets", () => {
    const i = liveInputs;
    const attributed = attributeStatBuckets(i);
    const total = Object.values(attributed).reduce((sum, b) => sum + b.attackPercent, 0);
    const { finalStats } = calculateAllStats({
      baseHp: i.baseHp,
      baseAtk: i.baseAtk,
      baseDef: i.baseDef,
      weaponAtk: 588,
      weaponModifier: null,
      weaponModifierValue: 0,
      weaponPassiveData: { ATK: 0.12 },
      buffsConfig: {},
      resonanceChainsConfig: {},
      customBuffs: {},
      teamBuffsData: i.teamBuffs,
      echoStats: i.echoStats,
      buffsCharInfo: [],
      resonanceChainsCharInfo: [],
      character: "",
      talentData: {},
    });
    // self + chains aren't configured in the pipeline run above, so compare
    // just the parts it does include.
    expect(total - attributed.selfBuffs.attackPercent - attributed.resonanceChains.attackPercent).toBeCloseTo(
      finalStats.attackPercent,
    );
  });
});
