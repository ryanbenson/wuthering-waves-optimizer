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

  it("treats missing version as baseline (v2 export era)", () => {
    expect(getStoredDataVersion()).toBe(BASELINE_DATA_VERSION);
  });

  it("folds interim storageVersion=1 into data version 3", () => {
    localStorage.setItem("storageVersion", "1");
    expect(getStoredDataVersion()).toBe(3);
    expect(localStorage.getItem("storageVersion")).toBeNull();
    expect(localStorage.getItem(DATA_VERSION_KEY)).toBe("3");
  });

  it("renames SunSinkingEclipse in character and inventory on v3", () => {
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
    const character = localStorage.getItem("character") ?? "";
    expect(character).toContain("HavocEclipse");
    expect(character).not.toContain("SunSinkingEclipse");
    expect(character).toContain("Havoc Eclipse 2 Set");
    expect(character).toContain("Havoc Eclipse 5 Set");
    expect(character).not.toContain("Sun-sinking Eclipse");
    expect(localStorage.getItem("inventory")).toContain("HavocEclipse");
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

  it("applyMigrationTransforms renames keys, passives, and display labels", () => {
    const input = JSON.stringify({
      echoSet: "SunSinkingEclipse",
      passives: { SunSinkingEclipse2SetHavoc: true },
      echoSetBonus: {
        setBonusOne: "Sun-sinking Eclipse 2 Set",
        setBonusTwo: "Sun-sinking Eclipse 5 Set",
      },
    });
    expect(applyMigrationTransforms(input, 2)).toBe(
      JSON.stringify({
        echoSet: "HavocEclipse",
        passives: { HavocEclipse2SetHavoc: true },
        echoSetBonus: {
          setBonusOne: "Havoc Eclipse 2 Set",
          setBonusTwo: "Havoc Eclipse 5 Set",
        },
      }),
    );
  });

  it("parseMetaDataVersion reads meta.version and interim storageVersion", () => {
    expect(parseMetaDataVersion({ version: "2" })).toBe(2);
    expect(parseMetaDataVersion({ version: "3" })).toBe(3);
    expect(parseMetaDataVersion({ version: "2", storageVersion: 1 })).toBe(3);
    expect(parseMetaDataVersion(undefined)).toBe(1);
  });
});
