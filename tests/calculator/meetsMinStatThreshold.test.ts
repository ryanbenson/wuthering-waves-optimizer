import { describe, it, expect } from "vitest";
import { meetsMinStatThreshold } from "../../src/calculator/meetsMinStatThreshold";

describe("meetsMinStatThreshold", () => {
  it("compares flat totals without dividing by 100", () => {
    expect(meetsMinStatThreshold(2500, 2500, "totalAtk")).toBe(true);
    expect(meetsMinStatThreshold(2499, 2500, "totalAtk")).toBe(false);
    expect(meetsMinStatThreshold(15000, 15000, "totalHp")).toBe(true);
    expect(meetsMinStatThreshold(14999, 15000, "totalHp")).toBe(false);
    expect(meetsMinStatThreshold(1200, 1200, "totalDef")).toBe(true);
    expect(meetsMinStatThreshold(1199, 1200, "totalDef")).toBe(false);
  });

  it("divides Crit Rate / Crit DMG / Energy Regen by 100", () => {
    expect(meetsMinStatThreshold(0.5, 50, "totalCritRate")).toBe(true);
    expect(meetsMinStatThreshold(0.49, 50, "totalCritRate")).toBe(false);
    expect(meetsMinStatThreshold(2.5, 250, "totalCritDMG")).toBe(true);
    expect(meetsMinStatThreshold(1.2, 120, "energyRegen")).toBe(true);
    expect(meetsMinStatThreshold(1.19, 120, "energyRegen")).toBe(false);
  });

  it("compares DMG bonuses as percentage points", () => {
    expect(
      meetsMinStatThreshold(40, 40, "basicAttackDMGBonus"),
    ).toBe(true);
    expect(
      meetsMinStatThreshold(0.4, 40, "basicAttackDMGBonus"),
    ).toBe(false);
    expect(
      meetsMinStatThreshold(39.9, 40, "heavyAttackDMGBonus"),
    ).toBe(false);
  });

  it("rejects missing or non-finite values", () => {
    expect(meetsMinStatThreshold(undefined, 2500, "totalAtk")).toBe(false);
    expect(meetsMinStatThreshold(null, 2500, "totalAtk")).toBe(false);
    expect(meetsMinStatThreshold(2500, "nope", "totalAtk")).toBe(false);
  });
});
