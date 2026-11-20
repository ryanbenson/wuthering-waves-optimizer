import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import {
  buildTeamDataReport,
  describeTeamBuff,
  findSignatureWeaponBuff,
  insertTag,
  listMissingTasks,
  previewChange,
  renderBasicWithTeams,
  renderTeamBuffDefaultsFile,
  renderTeamTagsFile,
  validateNewTag,
  type TeamDataCharacter,
} from "../../cli/lib/teamData.js";
import { TEAM_BUFF_DEFAULTS } from "../../src/buffs/teamBuffDefaults";
import { allWeaponTeamBuffs } from "../../src/buffs/index";
import { TEAM_TAGS } from "../../src/characters/teamTags";

const projectRoot = path.resolve(import.meta.dirname, "../..");
const read = (p: string) => fs.readFileSync(path.join(projectRoot, p), "utf8");

function character(key: string, teams: TeamDataCharacter["suggestedTeams"] = []): TeamDataCharacter {
  return { key, name: key, suggestedTeams: teams };
}

describe("buildTeamDataReport", () => {
  const characters = [
    character("Carlotta", [{ members: ["Zhezhi", "Shorekeeper"] }, { members: ["Zhezhi", "Verina"] }]),
    character("Jinhsi", [{ members: ["Zhezhi", "Shorekeeper"] }, { members: ["Yuanwu", "Verina"] }]),
    character("Zhezhi"),
    character("Shorekeeper"),
  ];
  const defaults = { Shorekeeper: [{ key: "OutroSkillBinaryButterfly" }], Verina: [] };
  const report = buildTeamDataReport(characters, defaults);

  it("lists characters without teams in roster order", () => {
    expect(report.missingTeams).toEqual(["Zhezhi", "Shorekeeper"]);
  });

  it("lists teammates without typical buffs, most-used first", () => {
    expect(report.missingDefaults).toEqual([
      { key: "Zhezhi", usedBy: ["Carlotta", "Jinhsi"] },
      { key: "Yuanwu", usedBy: ["Jinhsi"] },
    ]);
  });

  it("counts an empty list as 'no team buffs on purpose', not missing", () => {
    expect(report.noTeamBuffs).toEqual(["Verina"]);
    expect(report.missingDefaults.map((m) => m.key)).not.toContain("Verina");
  });

  it("walks supports' typical buffs before teams", () => {
    expect(listMissingTasks(report)).toEqual([
      { kind: "defaults", key: "Zhezhi" },
      { kind: "defaults", key: "Yuanwu" },
      { kind: "teams", key: "Zhezhi" },
      { kind: "teams", key: "Shorekeeper" },
    ]);
  });
});

describe("describeTeamBuff", () => {
  it("labels sequence, stacks, base value, exclusive buffs and all-element", () => {
    expect(
      describeTeamBuff(
        {
          key: "SequenceNode2Foo",
          name: "Sequence Node 2: Foo",
          hasStacks: true,
          minStacks: 1,
          maxStacks: 3,
          realisticMaxStacks: 2,
        },
        { exclusiveWith: ["Bar"], fullTeamElement: "Fusion" },
      ),
    ).toBe("Sequence Node 2: Foo · S2 · stacks 1–3 (usual 2) · can't be on with Bar · all-Fusion only");
    expect(
      describeTeamBuff({ key: "Stellarealm", name: "Stellarealm", inputBase: true, realisticBaseAttrValue: 250 }),
    ).toBe("Stellarealm · base 250");
  });

  it("shows stacks set on the entry", () => {
    expect(describeTeamBuff({ key: "A", name: "A", hasStacks: true, maxStacks: 4 }, { stacks: 2 })).toBe(
      "A · stacks 1–4 (set 2)",
    );
  });
});

describe("findSignatureWeaponBuff", () => {
  it("matches the weapon by image file name", () => {
    expect(findSignatureWeaponBuff("StellarSymphony", allWeaponTeamBuffs)?.key).toBe("StellarSymphonyATK");
  });

  it("is null when the signature weapon has no team buff", () => {
    expect(findSignatureWeaponBuff("TheLastDance", allWeaponTeamBuffs)).toBeNull();
    expect(findSignatureWeaponBuff(undefined, allWeaponTeamBuffs)).toBeNull();
  });
});

describe("renderTeamBuffDefaultsFile", () => {
  const file = read("src/buffs/teamBuffDefaults.ts");

  it("reproduces the current file when nothing changes", () => {
    expect(renderTeamBuffDefaultsFile(file, TEAM_BUFF_DEFAULTS)).toBe(file);
  });

  it("adds, sorts and writes every field; long lists go one buff per line", () => {
    const out = renderTeamBuffDefaultsFile(file, {
      Brant: [{ key: "OutroSkillAttentiveHeart" }],
      Aalto: [{ key: "OutroSkillDispersion" }, { key: "MoonlitClouds" }],
      Iuno: [],
      Lupa: [
        { key: "PackHuntFusionTeam", fullTeamElement: "Fusion", stacks: 2 },
        { key: "WildfireMarkDMGBonus", signature: true },
        { key: "SequenceNode2EveryGroundHerHuntingField" },
        { key: "FlamingClawprint" },
      ],
    });
    expect(out).toContain('  Aalto: [{ key: "OutroSkillDispersion" }, { key: "MoonlitClouds" }],\n  Brant:');
    expect(out).toContain("  Iuno: [],\n");
    expect(out).toContain(
      '  Lupa: [\n    { key: "PackHuntFusionTeam", stacks: 2, fullTeamElement: "Fusion" },\n    { key: "WildfireMarkDMGBonus", signature: true },\n',
    );
    // Header and imports are kept.
    expect(out.slice(0, out.indexOf("export const"))).toBe(file.slice(0, file.indexOf("export const")));
  });
});

const basics = import.meta.glob("../../src/characters/*/basic.ts", { eager: true }) as Record<
  string,
  { getCharacterBasicInfo: () => { suggestedTeams?: Array<{ members: [string, string]; tags?: string[] }> } }
>;

describe("renderBasicWithTeams", () => {
  const carlotta = read("src/characters/Carlotta/basic.ts");
  const shorekeeper = read("src/characters/Shorekeeper/basic.ts");
  const teams = [
    { members: ["Zhezhi", "Verina"] as [string, string], tags: ["Quickswap", "Budget"] },
    { members: ["Sanhua", "Shorekeeper"] as [string, string] },
  ];
  const block =
    '    suggestedTeams: [\n      { members: ["Zhezhi", "Verina"], tags: ["Quickswap", "Budget"] },\n      { members: ["Sanhua", "Shorekeeper"] },\n    ],\n';

  it("replaces an existing block and leaves the rest of the file alone", () => {
    const out = renderBasicWithTeams(carlotta, teams);
    const start = carlotta.indexOf("    suggestedTeams");
    const end = carlotta.indexOf("  };");
    expect(out).toBe(carlotta.slice(0, start) + block + carlotta.slice(end));
  });

  it("keeps every character's file when the teams are the same", () => {
    for (const [file, mod] of Object.entries(basics)) {
      const teams = mod.getCharacterBasicInfo().suggestedTeams ?? [];
      const content = read(path.join("src/characters", file.split("/").at(-2)!, "basic.ts"));
      expect(renderBasicWithTeams(content, teams), file).toBe(content);
    }
  });

  it("adds a block at the end of the returned object when there isn't one", () => {
    expect(shorekeeper).not.toContain("suggestedTeams");
    const out = renderBasicWithTeams(shorekeeper, teams);
    const end = shorekeeper.indexOf("  };");
    expect(out).toBe(shorekeeper.slice(0, end) + block + shorekeeper.slice(end));
  });

  it("adds a missing trailing comma before a new block", () => {
    const noComma = "export function f() {\n  return {\n    name: \"X\"\n  };\n}\n";
    expect(renderBasicWithTeams(noComma, [teams[1]!])).toBe(
      'export function f() {\n  return {\n    name: "X",\n    suggestedTeams: [\n      { members: ["Sanhua", "Shorekeeper"] },\n    ],\n  };\n}\n',
    );
  });

  it("removes the block when there are no teams", () => {
    const start = carlotta.indexOf("    suggestedTeams");
    const end = carlotta.indexOf("  };");
    expect(renderBasicWithTeams(carlotta, [])).toBe(carlotta.slice(0, start) + carlotta.slice(end));
    expect(renderBasicWithTeams(shorekeeper, [])).toBe(shorekeeper);
  });

  it("isn't confused by brackets inside strings", () => {
    const tricky =
      'export function f() {\n  return {\n    icons: ["a]b", "[c"],\n    suggestedTeams: [{ members: ["A", "B"] }],\n    other: 1,\n  };\n}\n';
    expect(renderBasicWithTeams(tricky, [teams[1]!])).toBe(
      'export function f() {\n  return {\n    icons: ["a]b", "[c"],\n    suggestedTeams: [\n      { members: ["Sanhua", "Shorekeeper"] },\n    ],\n    other: 1,\n  };\n}\n',
    );
  });
});

describe("team tags", () => {
  // A fixed sample file, so the tests don't depend on the real tag list.
  const TAGS = ["Hypercarry", "Quickswap", "Dual DPS", "Budget", "No healer"];
  const file = `/** header */\nexport const TEAM_TAGS = ${JSON.stringify(TAGS).replace(/","/g, '", "')} as const;\n\nexport type TeamTag = (typeof TEAM_TAGS)[number];\n`;

  it("rejects empty, duplicate (any case), long or odd names", () => {
    expect(validateNewTag("  ", TAGS)).toMatch(/Type/);
    expect(validateNewTag("hypercarry", TAGS)).toMatch(/already/);
    expect(validateNewTag("A very long tag name indeed", TAGS)).toMatch(/20/);
    expect(validateNewTag("<b>x</b>", TAGS)).toMatch(/letters/);
    expect(validateNewTag("Tune Break", TAGS)).toBeNull();
  });

  it("inserts a tag where asked", () => {
    expect(insertTag(["A", "B"], " C ", "A")).toEqual(["A", "C", "B"]);
    expect(insertTag(["A", "B"], "C", "B")).toEqual(["A", "B", "C"]);
    expect(insertTag(["A", "B"], "C", null)).toEqual(["C", "A", "B"]);
  });

  it("rewrites only the TEAM_TAGS line", () => {
    expect(renderTeamTagsFile(file, TAGS)).toBe(file);
    const out = renderTeamTagsFile(file, insertTag(TAGS, "Tune Break", "Dual DPS"));
    expect(out).toBe(
      file.replace(
        /export const TEAM_TAGS = .*/,
        'export const TEAM_TAGS = ["Hypercarry", "Quickswap", "Dual DPS", "Tune Break", "Budget", "No healer"] as const;',
      ),
    );
  });

  it("wraps a long list one tag per line, and reads it back", () => {
    const many = [...TAGS, "Fusion Burst", "Tune Break", "Echo DMG", "Coordinated", "Heavy Attack", "Aero Erosion"];
    const out = renderTeamTagsFile(file, many);
    expect(out).toContain('export const TEAM_TAGS = [\n  "Hypercarry",\n');
    expect(renderTeamTagsFile(out, TAGS)).toBe(file);
  });

  it("reproduces the real tag file", () => {
    const real = read("src/characters/teamTags.ts");
    expect(renderTeamTagsFile(real, TEAM_TAGS)).toBe(real);
  });
});

describe("previewChange", () => {
  it("shows only the changed lines", () => {
    expect(previewChange("a\nb\nc", "a\nB\nc")).toBe("- b\n+ B");
    expect(previewChange("a", "a")).toBe("(no changes)");
  });
});
