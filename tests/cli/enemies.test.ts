import { describe, expect, it } from "vitest";
import type { ApiMonsterDetail, ApiMonsterListItem } from "../../cli/lib/api.js";
import {
  assignUniqueEnemyKey,
  buildEnemyEntryBlock,
  buildOverwrittenEnemiesFile,
  buildResistFromProperties,
  getEnemyTypeFromRarity,
  hasUsableResistData,
  insertEnemyBlocks,
  parseEnemiesFile,
  resolveEnemyImageUrl,
  selectNewEnemies,
  shouldSkipApiMonster,
} from "../../cli/lib/enemies.js";

const sampleEnemiesFile = `export interface ResistStats {
  Aero?: number;
}

export interface Enemy {
  imageUrl: string;
  name: string;
  type: string;
  resist: ResistStats;
}

const enemies: Record<string, Enemy> = {
  hecate: {
    imageUrl: "https://example.com/hecate.webp",
    name: "Hecate",
    type: "Calamity",
    resist: {
      Aero: 10,
      Electro: 10,
      Fusion: 40,
      Glacio: 10,
      Havoc: 10,
      Physical: 10,
      Spectro: 10,
    },
  },
  // stayTuned: {
  //   imageUrl: "https://example.com/placeholder.webp",
  //   name: "Stay tuned",
  //   type: "Calamity",
  //   resist: { Aero: 10 },
  // },
  crownless: {
    imageUrl: "https://example.com/crownless.webp",
    name: "Crownless",
    type: "Overlord",
    resist: {
      Aero: 10,
      Electro: 10,
      Fusion: 10,
      Glacio: 10,
      Havoc: 40,
      Physical: 10,
      Spectro: 10,
    },
  },
};

export default enemies;
`;

function makeMonster(overrides: Partial<ApiMonsterListItem>): ApiMonsterListItem {
  return {
    Id: 1,
    Icon: "https://example.com/icon.png",
    Name: "Test Monster",
    Rarity: "Standard Class",
    RarityId: 1,
    Element: { Id: 0, Name: "Physical" },
    ...overrides,
  };
}

function makeDetail(overrides: Partial<ApiMonsterDetail>): ApiMonsterDetail {
  return {
    Id: 1,
    Name: "Test Monster",
    Icon: "https://example.com/icon.png",
    Rarity: "Standard Class",
    Properties: {
      DamageResistancePhys: { Value: 1000, Name: "Physical RES" },
      DamageResistanceElement1: { Value: 4000, Name: "Glacio RES" },
      DamageResistanceElement2: { Value: 1000, Name: "Fusion RES" },
      DamageResistanceElement3: { Value: 1000, Name: "Electro RES" },
      DamageResistanceElement4: { Value: 1000, Name: "Aero RES" },
      DamageResistanceElement5: { Value: 1000, Name: "Spectro RES" },
      DamageResistanceElement6: { Value: 1000, Name: "Havoc RES" },
    },
    ...overrides,
  };
}

describe("getEnemyTypeFromRarity", () => {
  it("maps API rarity labels to the project's type values", () => {
    expect(getEnemyTypeFromRarity("Standard Class")).toBe("Standard");
    expect(getEnemyTypeFromRarity("Elite Class")).toBe("Elite");
    expect(getEnemyTypeFromRarity("Overlord Class")).toBe("Overlord");
    expect(getEnemyTypeFromRarity("Calamity Class")).toBe("Calamity");
  });

  it("throws on an unrecognized rarity", () => {
    expect(() => getEnemyTypeFromRarity("Mythic Class")).toThrow();
  });
});

describe("buildResistFromProperties", () => {
  it("converts API resist values (basis points) to the project's percent scale", () => {
    const resist = buildResistFromProperties(makeDetail({}).Properties);
    expect(resist).toEqual({
      Aero: 10,
      Electro: 10,
      Fusion: 10,
      Glacio: 40,
      Havoc: 10,
      Physical: 10,
      Spectro: 10,
    });
  });

  it("defaults missing resist properties to 0", () => {
    const resist = buildResistFromProperties({});
    expect(resist.Physical).toBe(0);
    expect(resist.Glacio).toBe(0);
  });
});

describe("hasUsableResistData", () => {
  it("is true when all seven resist properties are numeric", () => {
    expect(hasUsableResistData(makeDetail({}).Properties)).toBe(true);
  });

  it("is false when Properties has no resist data at all", () => {
    expect(hasUsableResistData({})).toBe(false);
  });
});

describe("shouldSkipApiMonster", () => {
  it("skips unreleased 'Stay tuned' placeholder monsters", () => {
    expect(shouldSkipApiMonster("Stay tuned")).toBe(true);
    expect(shouldSkipApiMonster("  stay TUNED  ")).toBe(true);
    expect(shouldSkipApiMonster("Hecate")).toBe(false);
  });

  it("skips raw untranslated localization keys", () => {
    expect(shouldSkipApiMonster("MonsterInfo_340000111_Name")).toBe(true);
    expect(shouldSkipApiMonster("Bell-Borne Geochelone")).toBe(false);
  });
});

describe("resolveEnemyImageUrl", () => {
  it("rewrites the API's .png extension to .webp (the .png path 404s on Encore's CDN)", () => {
    expect(
      resolveEnemyImageUrl(
        "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconMonsterHead/T_IconMonsterHead_992_UI.png",
      ),
    ).toBe(
      "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconMonsterHead/T_IconMonsterHead_992_UI.webp",
    );
  });

  it("leaves an already-.webp URL unchanged", () => {
    expect(resolveEnemyImageUrl("https://example.com/icon.webp")).toBe(
      "https://example.com/icon.webp",
    );
  });
});

describe("parseEnemiesFile", () => {
  it("collects existing keys and name counts, skipping commented-out entries", () => {
    const parsed = parseEnemiesFile(sampleEnemiesFile);
    expect(parsed.existingKeys).toEqual(new Set(["hecate", "crownless"]));
    expect(parsed.existingNameCounts.get("hecate")).toBe(1);
    expect(parsed.existingNameCounts.get("stay tuned")).toBeUndefined();
  });
});

describe("assignUniqueEnemyKey", () => {
  it("appends a numeric suffix on collision", () => {
    const used = new Set(["hecate"]);
    expect(assignUniqueEnemyKey("Hecate", used)).toBe("hecate2");
    expect(used.has("hecate2")).toBe(true);
    expect(assignUniqueEnemyKey("Hecate", used)).toBe("hecate3");
  });

  it("uses the base camelCase key when there's no collision", () => {
    expect(assignUniqueEnemyKey("Bell-Borne Geochelone", new Set())).toBe(
      "bellBorneGeochelone",
    );
  });
});

describe("selectNewEnemies", () => {
  it("skips a monster whose name already has a matching existing entry", () => {
    const parsed = parseEnemiesFile(sampleEnemiesFile);
    const monsters = [makeMonster({ Name: "Hecate", Id: 1 })];
    expect(selectNewEnemies(monsters, parsed)).toHaveLength(0);
  });

  it("includes a second monster with a duplicate name beyond the existing count", () => {
    const parsed = parseEnemiesFile(sampleEnemiesFile);
    const monsters = [
      makeMonster({ Name: "Hecate", Id: 1 }),
      makeMonster({ Name: "Hecate", Id: 2 }),
    ];
    const result = selectNewEnemies(monsters, parsed);
    expect(result).toHaveLength(1);
    expect(result[0]!.key).toBe("hecate2");
    expect(result[0]!.monster.Id).toBe(2);
  });

  it("excludes 'Stay tuned' placeholder monsters", () => {
    const parsed = parseEnemiesFile(sampleEnemiesFile);
    const monsters = [makeMonster({ Name: "Stay tuned", Id: 99 })];
    expect(selectNewEnemies(monsters, parsed)).toHaveLength(0);
  });

  it("treats everything as new when given empty existing state (overwrite mode)", () => {
    const monsters = [
      makeMonster({ Name: "Hecate", Id: 1 }),
      makeMonster({ Name: "Crownless", Id: 2 }),
    ];
    const result = selectNewEnemies(monsters, {
      existingKeys: new Set(),
      existingNameCounts: new Map(),
    });
    expect(result).toHaveLength(2);
  });
});

describe("buildEnemyEntryBlock / insertEnemyBlocks", () => {
  it("formats a block matching the project's existing entry style and inserts it before the closing brace", () => {
    const monster = makeMonster({ Name: "Bell-Borne Geochelone", Rarity: "Calamity Class" });
    const detail = makeDetail({ Icon: "https://example.com/bell-borne.png" });
    const block = buildEnemyEntryBlock(monster, "bellBorneGeochelone", detail);

    expect(block).toBe(
      [
        `  bellBorneGeochelone: {`,
        `    imageUrl: "https://example.com/bell-borne.webp",`,
        `    name: "Bell-Borne Geochelone",`,
        `    type: "Calamity",`,
        `    resist: {`,
        `      Aero: 10,`,
        `      Electro: 10,`,
        `      Fusion: 10,`,
        `      Glacio: 40,`,
        `      Havoc: 10,`,
        `      Physical: 10,`,
        `      Spectro: 10,`,
        `    },`,
        `  },`,
      ].join("\n"),
    );

    const parsed = parseEnemiesFile(sampleEnemiesFile);
    const updated = insertEnemyBlocks(sampleEnemiesFile, parsed.insertAt, [block]);
    expect(updated).toContain("bellBorneGeochelone");
    expect(updated.indexOf("bellBorneGeochelone")).toBeLessThan(updated.indexOf("export default enemies"));
    expect(updated).toContain("crownless");
    expect(updated).toContain("// stayTuned");
  });
});

describe("buildOverwrittenEnemiesFile", () => {
  it("replaces the entire enemies object body while preserving surrounding code", () => {
    const block = [
      `  bellBorneGeochelone: {`,
      `    imageUrl: "https://example.com/bell-borne.webp",`,
      `    name: "Bell-Borne Geochelone",`,
      `    type: "Calamity",`,
      `    resist: {`,
      `      Aero: 10,`,
      `    },`,
      `  },`,
    ].join("\n");

    const updated = buildOverwrittenEnemiesFile(sampleEnemiesFile, [block]);

    expect(updated).toContain("export interface Enemy");
    expect(updated).toContain("export default enemies");
    expect(updated).toContain("bellBorneGeochelone");
    expect(updated).not.toContain("hecate:");
    expect(updated).not.toContain("crownless:");
  });
});
