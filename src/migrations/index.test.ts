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
    expect(JSON.parse(applyMigrationTransforms(input, 2))).toEqual({
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

  it("parseMetaDataVersion reads meta.version", () => {
    expect(parseMetaDataVersion({ version: "2" })).toBe(2);
    expect(parseMetaDataVersion({ version: "3" })).toBe(3);
    expect(parseMetaDataVersion({ version: "4" })).toBe(4);
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
    expect(JSON.parse(applyMigrationTransforms(input, 3))).toEqual({
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
