import { describe, it, expect, beforeEach } from "vitest";
import {
  applyMigrationTransforms,
  CURRENT_STORAGE_VERSION,
  getStoredStorageVersion,
  runMigrations,
  STORAGE_VERSION_KEY,
} from "./index";

describe("storage migrations", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("treats missing version as 0", () => {
    expect(getStoredStorageVersion()).toBe(0);
  });

  it("renames SunSinkingEclipse in character and inventory on v1", () => {
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

    expect(getStoredStorageVersion()).toBe(CURRENT_STORAGE_VERSION);
    const character = localStorage.getItem("character") ?? "";
    expect(character).toContain("HavocEclipse");
    expect(character).not.toContain("SunSinkingEclipse");
    expect(character).toContain("Havoc Eclipse 2 Set");
    expect(character).toContain("Havoc Eclipse 5 Set");
    expect(character).not.toContain("Sun-sinking Eclipse");
    expect(localStorage.getItem("inventory")).toContain("HavocEclipse");
    expect(localStorage.getItem(STORAGE_VERSION_KEY)).toBe("1");
  });

  it("is a no-op when already at current version", () => {
    localStorage.setItem(STORAGE_VERSION_KEY, String(CURRENT_STORAGE_VERSION));
    localStorage.setItem(
      "character",
      JSON.stringify({
        characters: {
          Danjin: { echoes: { 0: { echoSet: "SunSinkingEclipse" } } },
        },
      }),
    );

    runMigrations();

    // Intentionally left alone — version gate skipped the rename
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
    expect(applyMigrationTransforms(input)).toBe(
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
});
