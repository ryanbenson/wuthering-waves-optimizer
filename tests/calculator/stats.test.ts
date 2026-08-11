import { describe, it, expect } from "vitest";
import { addBuffs, addEchoBuffs, getInitStats } from "../../src/calculator/stats";

describe("addBuffs", () => {
  it("sums numeric sources normally", () => {
    const stats = getInitStats();
    const baseEnergyRegen = stats.energyRegen;
    addBuffs({ ATK_FLAT: 50, EnergyRegen: 0.2, DMGDeepen: 0.1 }, stats);
    expect(stats.attackFlat).toBe(50);
    expect(stats.energyRegen).toBeCloseTo(baseEnergyRegen + 0.2);
    expect(stats.totalDeepenEffect).toBe(0.1);
  });

  it("does not let a stray numeric string corrupt the accumulated total via string concatenation", () => {
    const stats = getInitStats();
    // simulates a custom buff field that was persisted as a string
    // (e.g. from a v-model without the .number modifier) before other
    // numeric sources are also summed into the same target field
    addBuffs({ ATK_FLAT: 100 }, stats);
    addBuffs({ ATK_FLAT: "50" as unknown as number }, stats);
    addBuffs({ ATK_FLAT: 25 }, stats);
    // buggy behavior would produce the string "10025" -> "1002525" style
    // concatenation instead of 100 + 50 + 25 = 175
    expect(stats.attackFlat).toBe(175);
    expect(typeof stats.attackFlat).toBe("number");
  });

  it("does not let a stray string corrupt fields that lack a *100/* multiplier", () => {
    const stats = getInitStats();
    const baseEnergyRegen = stats.energyRegen;
    addBuffs({ EnergyRegen: 0.1 }, stats);
    addBuffs({ EnergyRegen: "0.2" as unknown as number }, stats);
    expect(stats.energyRegen).toBeCloseTo(baseEnergyRegen + 0.3);
    expect(typeof stats.energyRegen).toBe("number");
  });

  it("treats a non-numeric string as 0 instead of NaN/garbage", () => {
    const stats = getInitStats();
    addBuffs({ ATK_FLAT: "" as unknown as number }, stats);
    expect(stats.attackFlat).toBe(0);
    expect(Number.isNaN(stats.attackFlat)).toBe(false);
  });
});

describe("addEchoBuffs", () => {
  it("does not let a stray numeric string corrupt the accumulated total", () => {
    const stats = getInitStats();
    addEchoBuffs({ Electro: 5 }, stats);
    addEchoBuffs({ Electro: "3" as unknown as number }, stats);
    expect(stats.electro).toBe(8);
    expect(typeof stats.electro).toBe("number");
  });
});
