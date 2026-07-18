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

    runMigrations();

    expect(localStorage.getItem(DATA_VERSION_KEY)).toBeNull();
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
    expect(localStorage.getItem(DATA_VERSION_KEY)).toBe("3");
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
    expect(parseMetaDataVersion(undefined)).toBe(1);
  });
});
