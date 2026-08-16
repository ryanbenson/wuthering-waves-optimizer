import { describe, it, expect } from "vitest";
import { sortWeaponsWithSignatureFirst } from "../../src/weapons/weaponSort";

describe("sortWeaponsWithSignatureFirst", () => {
  const weapons = [
    { key: "AzureOath", name: "Azure Oath" },
    { key: "BlazingBrilliance", name: "Blazing Brilliance" },
    { key: "DefiersThorn", name: "Defier's Thorn" },
  ];

  it("moves the signature weapon to the front", () => {
    const result = sortWeaponsWithSignatureFirst(weapons, "DefiersThorn");
    expect(result.map((w) => w.key)).toEqual([
      "DefiersThorn",
      "AzureOath",
      "BlazingBrilliance",
    ]);
  });

  it("preserves relative order of the rest", () => {
    const result = sortWeaponsWithSignatureFirst(weapons, "BlazingBrilliance");
    expect(result.map((w) => w.key)).toEqual([
      "BlazingBrilliance",
      "AzureOath",
      "DefiersThorn",
    ]);
  });

  it("returns the original list unchanged when no signature weapon is given", () => {
    const result = sortWeaponsWithSignatureFirst(weapons, undefined);
    expect(result).toBe(weapons);
  });

  it("returns the original list unchanged when the signature weapon isn't in the list", () => {
    const result = sortWeaponsWithSignatureFirst(weapons, "NotInList");
    expect(result.map((w) => w.key)).toEqual([
      "AzureOath",
      "BlazingBrilliance",
      "DefiersThorn",
    ]);
  });

  it("is a no-op when the signature weapon is already first", () => {
    const result = sortWeaponsWithSignatureFirst(weapons, "AzureOath");
    expect(result).toBe(weapons);
  });

  it("does not mutate the input array", () => {
    const original = [...weapons];
    sortWeaponsWithSignatureFirst(weapons, "DefiersThorn");
    expect(weapons).toEqual(original);
  });
});
