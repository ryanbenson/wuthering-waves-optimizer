import { describe, it, expect } from "vitest";
import { getSetBonusThreshold } from "../../src/echoes/sets";

describe("getSetBonusThreshold", () => {
  it("returns 1 for a 1pc-only exclusive set (Lucy's Shadow of Shattered Dreams)", () => {
    expect(getSetBonusThreshold("ShadowofShatteredDreams")).toBe(1);
  });

  it("returns 3 for a 3pc-only set", () => {
    expect(getSetBonusThreshold("CrownofValor")).toBe(3);
  });

  it("returns 2 for an ordinary 2pc/5pc set", () => {
    expect(getSetBonusThreshold("CelestialLight")).toBe(2);
    expect(getSetBonusThreshold("EternalRadiance")).toBe(2);
  });

  it("defaults to 2 for an unrecognized key", () => {
    expect(getSetBonusThreshold("NotARealSet")).toBe(2);
  });
});
