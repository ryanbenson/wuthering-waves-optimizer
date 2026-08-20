import { describe, it, expect, beforeEach } from "vitest";
import {
  applyMigrationTransforms,
  BASELINE_DATA_VERSION,
  CURRENT_DATA_VERSION,
  DATA_VERSION_KEY,
  getStoredDataVersion,
  parseMetaDataVersion,
  runMigrations,
} from "./index";

describe("data migrations", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("is a no-op for new users (no localStorage writes)", () => {
    runMigrations();
    expect(localStorage.getItem(DATA_VERSION_KEY)).toBeNull();
    expect(localStorage.length).toBe(0);
  });

  it("is a no-op for empty Pinia store shells", () => {
    localStorage.setItem(
      "character",
      JSON.stringify({
        characters: {},
        activeCharacter: "",
        favoriteCharacters: [],
      }),
    );
    localStorage.setItem(
      "inventory",
      JSON.stringify({
        echoes: [],
        equipped: {},
        echoPresets: [],
        equippedPresets: {},
      }),
    );
    localStorage.setItem("teamRotations", JSON.stringify({ teams: [] }));

    runMigrations();

    expect(localStorage.getItem(DATA_VERSION_KEY)).toBeNull();
  });

  it("treats a non-empty teamRotations store as real user data", () => {
    localStorage.setItem(
      "teamRotations",
      JSON.stringify({
        teams: [{ id: "team-1", name: "Team 1", characterIds: [], actions: [] }],
      }),
    );

    runMigrations();

    expect(localStorage.getItem(DATA_VERSION_KEY)).toBe(
      String(CURRENT_DATA_VERSION),
    );
  });

  it("skips entirely under Cypress", () => {
    const win = window as Window & { Cypress?: unknown };
    win.Cypress = {};
    try {
      localStorage.setItem(
        "character",
        JSON.stringify({
          characters: {
            Danjin: { echoes: { 0: { echoSet: "SunSinkingEclipse" } } },
          },
        }),
      );

      runMigrations();

      expect(localStorage.getItem("character")).toContain("SunSinkingEclipse");
      expect(localStorage.getItem(DATA_VERSION_KEY)).toBeNull();
    } finally {
      delete win.Cypress;
    }
  });

  it("treats existing data without a version key as baseline (v2)", () => {
    localStorage.setItem(
      "character",
      JSON.stringify({ characters: { Danjin: {} }, activeCharacter: "Danjin" }),
    );
    expect(getStoredDataVersion()).toBe(BASELINE_DATA_VERSION);
  });

  it("renames SunSinkingEclipse fields in character and inventory on v3", () => {
    localStorage.setItem(
      "character",
      JSON.stringify({
        characters: {
          Danjin: {
            echoes: { 0: { echoSet: "SunSinkingEclipse" } },
            echoSetBonus: {
              setBonusOne: "Sun-sinking Eclipse 2 Set",
              setBonusTwo: "Sun-sinking Eclipse 5 Set",
            },
            echoSetPassives: {
              SunSinkingEclipse2SetHavoc: { isEnabled: true },
            },
            optimizer: {
              echoSets: ["SunSinkingEclipse"],
              echoSetPassives: {
                SunSinkingEclipse5SetHavoc: { isEnabled: true, stacks: 4 },
              },
            },
          },
        },
      }),
    );
    localStorage.setItem(
      "inventory",
      JSON.stringify({
        echoes: [{ echoSet: "SunSinkingEclipse" }],
      }),
    );

    runMigrations();

    expect(getStoredDataVersion()).toBe(CURRENT_DATA_VERSION);
    const character = JSON.parse(localStorage.getItem("character") ?? "{}");
    const danjin = character.characters.Danjin;
    expect(danjin.echoes["0"].echoSet).toBe("HavocEclipse");
    expect(danjin.echoSetBonus.setBonusOne).toBe("Havoc Eclipse 2 Set");
    expect(danjin.echoSetBonus.setBonusTwo).toBe("Havoc Eclipse 5 Set");
    expect(danjin.echoSetPassives.HavocEclipse2SetHavoc).toEqual({
      isEnabled: true,
    });
    expect(danjin.echoSetPassives.SunSinkingEclipse2SetHavoc).toBeUndefined();
    expect(danjin.optimizer.echoSets).toEqual(["HavocEclipse"]);
    expect(danjin.optimizer.echoSetPassives.HavocEclipse5SetHavoc).toEqual({
      isEnabled: true,
      stacks: 4,
    });
    expect(JSON.parse(localStorage.getItem("inventory") ?? "{}").echoes[0].echoSet).toBe(
      "HavocEclipse",
    );
    expect(localStorage.getItem(DATA_VERSION_KEY)).toBe(String(CURRENT_DATA_VERSION));
  });

  it("adds order to rotations on v4", () => {
    localStorage.setItem(DATA_VERSION_KEY, "3");
    localStorage.setItem(
      "character",
      JSON.stringify({
        characters: {
          Danjin: {
            rotations: [
              { id: "a", name: "First", actions: [] },
              { id: "b", name: "Second", actions: [], order: 5 },
              { id: "c", name: "Third", actions: [], order: 1 },
            ],
          },
        },
      }),
    );

    runMigrations();

    expect(getStoredDataVersion()).toBe(CURRENT_DATA_VERSION);
    const character = JSON.parse(localStorage.getItem("character") ?? "{}");
    expect(character.characters.Danjin.rotations).toEqual([
      { id: "a", name: "First", actions: [], order: 0 },
      { id: "c", name: "Third", actions: [], order: 1 },
      { id: "b", name: "Second", actions: [], order: 2 },
    ]);
    expect(localStorage.getItem(DATA_VERSION_KEY)).toBe(String(CURRENT_DATA_VERSION));
  });

  it("migrates mainEcho.isEnabled into mainEcho.buffs on v7", () => {
    localStorage.setItem(DATA_VERSION_KEY, "4");
    localStorage.setItem(
      "character",
      JSON.stringify({
        characters: {
          Carlotta: {
            mainEcho: {
              echo: "SentryConstruct",
              rank: 5,
              isEnabled: true,
            },
            optimizer: {
              mainEchoBuffs: {
                SentryConstruct: { isEnabled: true },
                LampylumenMyriad: { isEnabled: true, stacks: 2 },
              },
            },
          },
        },
      }),
    );

    runMigrations();

    expect(getStoredDataVersion()).toBe(CURRENT_DATA_VERSION);
    const character = JSON.parse(localStorage.getItem("character") ?? "{}");
    const carlotta = character.characters.Carlotta;
    expect(carlotta.mainEcho.isEnabled).toBeUndefined();
    expect(carlotta.mainEcho.buffs).toEqual({
      SentryConstruct: { isEnabled: true },
    });
    expect(carlotta.optimizer.mainEchoBuffs.SentryConstruct).toEqual({
      buffs: {
        SentryConstruct: { isEnabled: true },
      },
    });
    expect(carlotta.optimizer.mainEchoBuffs.LampylumenMyriad).toEqual({
      buffs: {
        LampylumenMyriad: { isEnabled: true, stacks: 2 },
      },
    });
  });

  it("is a no-op when already at current version", () => {
    localStorage.setItem(DATA_VERSION_KEY, String(CURRENT_DATA_VERSION));
    localStorage.setItem(
      "character",
      JSON.stringify({
        characters: {
          Danjin: { echoes: { 0: { echoSet: "SunSinkingEclipse" } } },
        },
      }),
    );

    runMigrations();

    expect(localStorage.getItem("character")).toContain("SunSinkingEclipse");
  });

  it("leaves unrelated data untouched when old names are absent", () => {
    const input = JSON.stringify({
      echoSet: "CrownofValor",
      echoSetBonus: { setBonusOne: "Crown of Valor 3 Set" },
    });
    expect(applyMigrationTransforms(input, 2)).toBe(input);
  });

  it("applyMigrationTransforms renames keys, passives, and display labels", () => {
    const input = JSON.stringify({
      characters: {
        Danjin: {
          echoes: { 0: { echoSet: "SunSinkingEclipse" } },
          echoSetPassives: { SunSinkingEclipse2SetHavoc: true },
          echoSetBonus: {
            setBonusOne: "Sun-sinking Eclipse 2 Set",
            setBonusTwo: "Sun-sinking Eclipse 5 Set",
          },
        },
      },
    });
    // toMatchObject, not toEqual: from v2, every later migration (including
    // v8's builds[] seeding) also applies — this test only asserts on the
    // rename fields v3's migration is responsible for.
    expect(JSON.parse(applyMigrationTransforms(input, 2))).toMatchObject({
      characters: {
        Danjin: {
          echoes: { 0: { echoSet: "HavocEclipse" } },
          echoSetPassives: { HavocEclipse2SetHavoc: true },
          echoSetBonus: {
            setBonusOne: "Havoc Eclipse 2 Set",
            setBonusTwo: "Havoc Eclipse 5 Set",
          },
        },
      },
    });
  });

  it("applyMigrationTransforms migrates mainEcho buffs from v4", () => {
    const input = JSON.stringify({
      characters: {
        Carlotta: {
          mainEcho: {
            echo: "SentryConstruct",
            rank: 5,
            isEnabled: true,
          },
        },
      },
    });
    // toMatchObject, not toEqual: from v4, every later migration (including
    // v8's builds[] seeding) also applies — this test only asserts on the
    // mainEcho-specific fields v7's migration is responsible for.
    expect(JSON.parse(applyMigrationTransforms(input, 4))).toMatchObject({
      characters: {
        Carlotta: {
          mainEcho: {
            echo: "SentryConstruct",
            rank: 5,
            buffs: {
              SentryConstruct: { isEnabled: true },
            },
          },
        },
      },
    });
  });

  it("parseMetaDataVersion reads meta.version", () => {
    expect(parseMetaDataVersion({ version: "2" })).toBe(2);
    expect(parseMetaDataVersion({ version: "3" })).toBe(3);
    expect(parseMetaDataVersion({ version: "4" })).toBe(4);
    expect(parseMetaDataVersion({ version: "5" })).toBe(5);
    expect(parseMetaDataVersion(undefined)).toBe(1);
  });

  it("converts character rotation exclude-buffs checkboxes into advancedConfig on v6", () => {
    localStorage.setItem(DATA_VERSION_KEY, "5");
    localStorage.setItem(
      "character",
      JSON.stringify({
        characters: {
          Danjin: {
            weaponPassives: { SomePassive: { isEnabled: true } },
            teamBuffs: { buffs: { SomeTeamBuff: { isEnabled: true } } },
            rotations: [
              {
                id: "r1",
                name: "Rotation",
                actions: [
                  {
                    id: "a1",
                    key: "Foo",
                    type: "basic",
                    excludeSelfBuffs: false,
                    excludeTeamBuffs: true,
                    excludeWeaponBuffs: true,
                  },
                  {
                    id: "a2",
                    key: "Bar",
                    type: "basic",
                    excludeSelfBuffs: false,
                    excludeTeamBuffs: false,
                    excludeWeaponBuffs: false,
                  },
                  { id: "a3", key: "Baz", type: "basic" },
                ],
              },
            ],
          },
        },
      }),
    );

    runMigrations();

    expect(getStoredDataVersion()).toBe(CURRENT_DATA_VERSION);
    const character = JSON.parse(localStorage.getItem("character") ?? "{}");
    const actions = character.characters.Danjin.rotations[0].actions;

    // Only the actually-configured weapon passive / team buff keys are
    // forced off — nothing invented for keys the character never touched.
    expect(actions[0]).toEqual({
      id: "a1",
      key: "Foo",
      type: "basic",
      advancedConfig: {
        weaponPassives: { SomePassive: { isEnabled: false } },
        teamBuffs: { SomeTeamBuff: { isEnabled: false } },
      },
    });
    expect(actions[0].excludeSelfBuffs).toBeUndefined();
    expect(actions[0].excludeTeamBuffs).toBeUndefined();
    expect(actions[0].excludeWeaponBuffs).toBeUndefined();

    // Both flags false: the exclude fields are stripped but no advancedConfig
    // is added — byte-for-byte the fast (no-override) path.
    expect(actions[1]).toEqual({ id: "a2", key: "Bar", type: "basic" });

    // No exclude fields present at all: left completely untouched.
    expect(actions[2]).toEqual({ id: "a3", key: "Baz", type: "basic" });
  });

  it("seeds a Default build for each character on v8", () => {
    localStorage.setItem(DATA_VERSION_KEY, "7");
    localStorage.setItem(
      "character",
      JSON.stringify({
        characters: {
          Danjin: { characterLevel: "90", talents: { basic: 10 }, weapon: "SwordOfVoid" },
          Carlotta: { weapon: "Undying Flame" },
        },
      }),
    );

    runMigrations();

    expect(getStoredDataVersion()).toBe(CURRENT_DATA_VERSION);
    const character = JSON.parse(localStorage.getItem("character") ?? "{}");

    const danjin = character.characters.Danjin;
    expect(danjin.builds).toHaveLength(1);
    expect(danjin.builds[0].name).toBe("Default");
    expect(danjin.builds[0].weapon).toBe("SwordOfVoid");
    expect(danjin.builds[0]).not.toHaveProperty("characterLevel");
    expect(danjin.builds[0]).not.toHaveProperty("talents");
    expect(danjin.activeBuildId).toBe(danjin.builds[0].id);
    // characterLevel/talents stay on the top-level record, untouched.
    expect(danjin.characterLevel).toBe("90");
    expect(danjin.talents).toEqual({ basic: 10 });

    const carlotta = character.characters.Carlotta;
    expect(carlotta.builds).toHaveLength(1);
    expect(carlotta.builds[0].weapon).toBe("Undying Flame");
    expect(carlotta.activeBuildId).toBe(carlotta.builds[0].id);
    // each character gets a distinct build id
    expect(carlotta.builds[0].id).not.toBe(danjin.builds[0].id);
  });

  it("is idempotent when a character already has builds on v8", () => {
    localStorage.setItem(DATA_VERSION_KEY, "7");
    const existingBuild = { id: "existing-id", name: "My Build", weapon: "SwordOfVoid" };
    localStorage.setItem(
      "character",
      JSON.stringify({
        characters: {
          Danjin: { builds: [existingBuild], activeBuildId: "existing-id" },
        },
      }),
    );

    runMigrations();

    const character = JSON.parse(localStorage.getItem("character") ?? "{}");
    expect(character.characters.Danjin.builds).toEqual([existingBuild]);
    expect(character.characters.Danjin.activeBuildId).toBe("existing-id");
  });

  it("applyMigrationTransforms seeds builds[] from an older backup", () => {
    const input = JSON.stringify({
      characters: {
        Danjin: { weapon: "SwordOfVoid" },
      },
    });

    const result = JSON.parse(applyMigrationTransforms(input, 7));

    expect(result.characters.Danjin.builds).toHaveLength(1);
    expect(result.characters.Danjin.builds[0]).toMatchObject({
      name: "Default",
      weapon: "SwordOfVoid",
    });
    expect(result.characters.Danjin.activeBuildId).toBe(result.characters.Danjin.builds[0].id);
  });

  it("applyMigrationTransforms backfills rotation order from v3", () => {
    const input = JSON.stringify({
      characters: {
        Danjin: {
          rotations: [
            { id: "a", name: "First", actions: [] },
            { id: "b", name: "Second", actions: [] },
          ],
        },
      },
    });
    // toMatchObject, not toEqual: from v3, every later migration (including
    // v8's builds[] seeding) also applies — this test only asserts on the
    // rotation-order field v4's migration is responsible for.
    expect(JSON.parse(applyMigrationTransforms(input, 3))).toMatchObject({
      characters: {
        Danjin: {
          rotations: [
            { id: "a", name: "First", actions: [], order: 0 },
            { id: "b", name: "Second", actions: [], order: 1 },
          ],
        },
      },
    });
  });
});
