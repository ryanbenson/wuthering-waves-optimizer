import { describe, it, expect } from "vitest";
import { normalizeCustomBuffs } from "../../src/calculator/customBuffs";

describe("normalizeCustomBuffs", () => {
  it("divides percent-type keys by 100 to match the fraction convention used elsewhere", () => {
    expect(normalizeCustomBuffs({ ATK: 5, CritRate: 12.5 })).toEqual({
      ATK: 0.05,
      CritRate: 0.125,
    });
  });

  it("leaves _FLAT keys untouched", () => {
    expect(normalizeCustomBuffs({ ATK_FLAT: 500, HP_FLAT: 1000, DEF_FLAT: 50 })).toEqual({
      ATK_FLAT: 500,
      HP_FLAT: 1000,
      DEF_FLAT: 50,
    });
  });

  it("coerces non-finite values to 0", () => {
    expect(normalizeCustomBuffs({ ATK: Number.NaN, ATK_FLAT: undefined as unknown as number })).toEqual({
      ATK: 0,
      ATK_FLAT: 0,
    });
  });

  it("returns an empty object for null/undefined input", () => {
    expect(normalizeCustomBuffs(null)).toEqual({});
    expect(normalizeCustomBuffs(undefined)).toEqual({});
  });
});
