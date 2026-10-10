import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  resolveEchoByNameAndCost,
  setScannerGameData,
} from "@wutheringtools/scanner-core";
import { buildScannerData, buildScannerDataFile, SCANNER_DATA_VERSION } from "../../src/scanner/scannerData";
import { mainEchoesData } from "../../src/echoes/index";
import { allCharactersList } from "../../src/characters/characters";

const sha256 = (text: string) => createHash("sha256").update(text).digest("hex");

describe("scanner-data.json", () => {
  it("includes every echo with what the scanner needs", () => {
    const data = buildScannerData();
    expect(Object.keys(data.echoes).sort()).toEqual(Object.keys(mainEchoesData).sort());
    const sample = data.echoes.AbyssalGladius;
    expect(sample).toEqual({
      key: "AbyssalGladius",
      name: mainEchoesData.AbyssalGladius.name,
      class: mainEchoesData.AbyssalGladius.class,
      sets: mainEchoesData.AbyssalGladius.sets,
      icon: mainEchoesData.AbyssalGladius.image,
    });
    // Only the scanner fields are published, not descriptions or buff modifiers.
    expect(Object.keys(sample).sort()).toEqual(["class", "icon", "key", "name", "sets"]);
  });

  it("gives every echo a picture URL (Wavescan bundles small copies)", () => {
    const data = buildScannerData();
    const missing = Object.values(data.echoes).filter((echo) => !echo.icon?.startsWith("https://"));
    expect(missing.map((echo) => echo.key)).toEqual([]);
  });

  it("includes characters, weapons with rarity, and echo sets with icons", () => {
    const data = buildScannerData();
    expect(data.characters).toHaveLength(allCharactersList.length);
    expect(data.weapons.length).toBeGreaterThan(50);
    expect(data.weapons.every((w) => w.rarity >= 1 && w.rarity <= 5)).toBe(true);
    expect(new Set(data.weapons.map((w) => w.type))).toEqual(
      new Set(["Sword", "Broadblade", "Rectifier", "Pistol", "Gauntlet"]),
    );
    expect(Object.keys(data.echoSets).length).toBeGreaterThan(20);
    expect(Object.values(data.echoSets).every((s) => s.name.length > 0)).toBe(true);
  });

  it("works as scanner-core game data (what Wavescan does with it)", () => {
    setScannerGameData(buildScannerData());
    const result = resolveEchoByNameAndCost("Sabercat Prowlor", "ATK 100");
    expect(result.echo).toBe("SabercatProwler");
  });

  it("is deterministic and its hash matches its content", () => {
    const a = buildScannerDataFile(sha256);
    const b = buildScannerDataFile(sha256);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a.format).toBe("WutheringToolsScannerData");
    expect(a.version).toBe(SCANNER_DATA_VERSION);
    expect(a.hash).toBe(sha256(JSON.stringify(a.data)));
    expect(a.hash).toMatch(/^[0-9a-f]{64}$/);
  });
});
