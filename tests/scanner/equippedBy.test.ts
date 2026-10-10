import { describe, it, expect } from "vitest";
import {
  findEquippedByName,
  isPlayerCharacterKey,
  matchEquippedBy,
  PLAYER_CHARACTER_KEY,
} from "@wutheringtools/scanner-core/equippedBy";

// Same shape as scanner-data.json's `characters`, including Rover's per-element,
// per-gender entries (with the irregular Electro keys the data has today).
const characters = [
  { key: "Yangyang", name: "Yangyang" },
  { key: "YangyangXuanling", name: "Yangyang: Xuanling" },
  { key: "Lupa", name: "Lupa" },
  { key: "Camellya", name: "Camellya" },
  { key: "Cantarella", name: "Cantarella" },
  { key: "LuukHerssen", name: "Luuk Herssen" },
  { key: "RoverHavocFemale", name: "Rover Havoc" },
  { key: "RoverHavocMale", name: "Rover Havoc" },
  { key: "Roverelectrofemale", name: "RoverElectroFemale" },
];

describe("findEquippedByName", () => {
  it("reads the name after 'Equipped by'", () => {
    // Spearback +5, 2026-10-09 diagnostics report (Windows OCR of the panel).
    expect(findEquippedByName(["and the last deals 36.92% Physical", "DMG.", "Equipped by Yangyang"])).toBe(
      "Yangyang",
    );
  });

  it("tolerates a cropped or misread 'Equipped' and a missing space", () => {
    expect(findEquippedByName(["quipped by Clover"])).toBe("Clover");
    expect(findEquippedByName(["Equlpped by Luuk Herssen"])).toBe("Luuk Herssen");
    expect(findEquippedByName(["Equippedby Camellya"])).toBe("Camellya");
  });

  it("is null without the line, or when no name follows", () => {
    expect(findEquippedByName(["Summon a Spearback to perform 5", "attacks deal 21.53% Physical DMG,"])).toBeNull();
    expect(findEquippedByName(["Healing increased by 10%"])).toBeNull();
    expect(findEquippedByName(["Equipped by", "Equipped by 12"])).toBeNull();
    expect(findEquippedByName([])).toBeNull();
  });
});

describe("matchEquippedBy", () => {
  const match = (line: string, playerName: string | null = "Clover") =>
    matchEquippedBy([line], characters, playerName);

  it("matches a character, also with OCR junk after the name", () => {
    expect(match("Equipped by Camellya")).toMatchObject({ kind: "character", key: "Camellya" });
    expect(match("Equipped by Cantarella wt BS")).toMatchObject({ kind: "character", key: "Cantarella" });
    expect(match("Equipped by Luuk Herssen")).toMatchObject({ kind: "character", key: "LuukHerssen" });
  });

  it("tells Yangyang and Yangyang: Xuanling apart", () => {
    expect(match("Equipped by Yangyang")).toMatchObject({ kind: "character", key: "Yangyang" });
    expect(match("Equipped by Yangyang: Xuanling")).toMatchObject({ kind: "character", key: "YangyangXuanling" });
  });

  it("recognises the main character by the player's name, not as Rover", () => {
    expect(match("Equipped by Clover")).toMatchObject({ kind: "player" });
    expect(match("Equipped by Cl0ver")).toMatchObject({ kind: "player" });
    expect(match("Equipped by Airia", "Airia")).toMatchObject({ kind: "player" });
    expect(PLAYER_CHARACTER_KEY).toBe("Rover");
  });

  it("never matches a Rover entry by name (the game shows the player's name)", () => {
    expect(match("Equipped by Rover Havoc")).toEqual({ kind: "unknown", name: "Rover Havoc" });
    expect(isPlayerCharacterKey("Roverelectrofemale")).toBe(true);
    expect(isPlayerCharacterKey("Lupa")).toBe(false);
  });

  it("is unknown when the player's name isn't known", () => {
    expect(match("Equipped by Clover", null)).toEqual({ kind: "unknown", name: "Clover" });
  });

  it("is unknown when the player's name is also a character's name", () => {
    expect(match("Equipped by Lupa", "Lupa")).toEqual({ kind: "unknown", name: "Lupa" });
  });

  it("is unknown when the name doesn't match anyone", () => {
    expect(match("Equipped by Xqzzv")).toEqual({ kind: "unknown", name: "Xqzzv" });
  });

  it("is none when the echo isn't equipped", () => {
    expect(matchEquippedBy(["DMG."], characters, "Clover")).toEqual({ kind: "none" });
  });
});
