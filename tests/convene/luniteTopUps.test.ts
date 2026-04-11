import { describe, expect, it } from "vitest";
import {
  LUNITE_TOPUP_TIERS,
  luniteFromTopUpLine,
  usdFromTopUpLine,
} from "../../src/convene/luniteTopUps";

describe("luniteFromTopUpLine", () => {
  const tier99 = LUNITE_TOPUP_TIERS[5]!;

  it("1× $99.99 with initial bonus", () => {
    expect(luniteFromTopUpLine(tier99, 1, true)).toBe(12960);
  });

  it("2× $99.99 without bonus", () => {
    expect(luniteFromTopUpLine(tier99, 2, false)).toBe(8080 * 2);
  });

  it("1× bonus + remainder normal in one row (e.g. 3× with bonus on first only)", () => {
    expect(luniteFromTopUpLine(tier99, 3, true)).toBe(12960 + 8080 * 2);
  });

  it("$49.99 normal total matches table", () => {
    const t = LUNITE_TOPUP_TIERS[4]!;
    expect(t.totalNormal).toBe(3880);
    expect(luniteFromTopUpLine(t, 1, false)).toBe(3880);
  });
});

describe("usdFromTopUpLine", () => {
  it("sums price × qty", () => {
    const t = LUNITE_TOPUP_TIERS[2]!;
    expect(usdFromTopUpLine(t, 2)).toBeCloseTo(29.98, 4);
  });
});
