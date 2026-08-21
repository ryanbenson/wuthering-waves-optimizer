import { describe, it, expect } from "vitest";
import { normalizeCustomBuffs } from "../../src/calculator/customBuffs";

describe("normalizeCustomBuffs", () => {
  it("divides percent-based fields by 100", () => {
    expect(normalizeCustomBuffs({ ATK: 10, DamageAmplify: 25 })).toEqual({
      ATK: 0.1,
      DamageAmplify: 0.25,
    });
  });

  it("leaves flat stat fields (ATK_FLAT/HP_FLAT/DEF_FLAT) unscaled", () => {
    expect(normalizeCustomBuffs({ ATK_FLAT: 500, HP_FLAT: 1000, DEF_FLAT: 200 })).toEqual({
      ATK_FLAT: 500,
      HP_FLAT: 1000,
      DEF_FLAT: 200,
    });
  });

  it("drops zero/non-finite values and defaults on missing input", () => {
    expect(normalizeCustomBuffs({ ATK: 0, CritRate: NaN })).toEqual({});
    expect(normalizeCustomBuffs(undefined)).toEqual({});
    expect(normalizeCustomBuffs(null)).toEqual({});
  });

  it("coerces string values the same way store data historically could contain", () => {
    expect(normalizeCustomBuffs({ ATK: "10" as unknown as number })).toEqual({ ATK: 0.1 });
  });
});
