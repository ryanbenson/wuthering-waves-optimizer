import { describe, it, expect } from "vitest";
import { readdirSync } from "node:fs";
import path from "node:path";
import { characterSubstatPriorities, getCuratedSubstatWeights } from "../../src/characters/substatPriorities";
import { subStats } from "../../src/echoes/stats";

const charactersDir = path.resolve(import.meta.dirname, "../../src/characters");

describe("characterSubstatPriorities", () => {
  it("only ever weights real substat keys (e.g. never 'HealingBonus', an echo main-stat-only value)", () => {
    for (const [characterId, weights] of Object.entries(characterSubstatPriorities)) {
      for (const stat of Object.keys(weights)) {
        expect(subStats, `${characterId}'s weight profile references invalid substat "${stat}"`).toContain(stat);
      }
    }
  });

  it("only has entries for characters that actually have a src/characters/<Key> folder", () => {
    const realFolders = new Set(
      readdirSync(charactersDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name),
    );
    for (const characterId of Object.keys(characterSubstatPriorities)) {
      expect(realFolders, `"${characterId}" has no matching src/characters/ folder`).toContain(characterId);
    }
  });

  it("returns undefined for a character with no curated entry", () => {
    expect(getCuratedSubstatWeights("NotACuratedCharacter")).toBeUndefined();
  });

  it("returns the curated profile for a known character", () => {
    expect(getCuratedSubstatWeights("Camellya")).toBe(characterSubstatPriorities.Camellya);
  });
});
