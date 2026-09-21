import { describe, it, expect } from "vitest";
import {
  getEffectiveMaxStacks,
  getRealisticMaxStacks,
} from "../../src/characters/effectiveBuffStacks";

describe("getRealisticMaxStacks", () => {
  it("falls back to the effective hard cap when no realistic cap is configured", () => {
    expect(getRealisticMaxStacks(150, undefined)).toBe(150);
  });

  it("uses the configured realistic cap when it is lower than the hard cap", () => {
    expect(getRealisticMaxStacks(150, 40)).toBe(40);
  });

  it("clamps a misconfigured realistic cap so it can never exceed the hard cap", () => {
    expect(getRealisticMaxStacks(40, 150)).toBe(40);
  });

  it("respects a realistic cap of 0", () => {
    expect(getRealisticMaxStacks(150, 0)).toBe(0);
  });
});

describe("getEffectiveMaxStacks", () => {
  it("returns the raw maxStacks when no character/buff override applies", () => {
    expect(getEffectiveMaxStacks("Sanhua", "Silversnow", 2, undefined)).toBe(2);
  });

  it("defaults to 1 when maxStacks is undefined", () => {
    expect(getEffectiveMaxStacks("Sanhua", "Silversnow", undefined, undefined)).toBe(1);
  });

  it("raises the cap for a resonance-chain-gated override", () => {
    expect(
      getEffectiveMaxStacks("Augusta", "CrownofWills", 1, {
        SequenceNode6EngravedinRadiantLight: { isEnabled: true },
      }),
    ).toBe(4);
  });
});

describe("getEffectiveMaxStacks — Unison Boon team buffs", () => {
  it("adds +1 per enabled teammate buff for any Unison Boon character", () => {
    const team = {
      InherentSkillGleaningSimpleJoysUnison: { isEnabled: true },
      SequenceNode6TheMoonOwesItsLightToTheLiving: { isEnabled: true },
    };
    expect(getEffectiveMaxStacks("Suoming", "UnisonBoon", 2, {}, undefined, team)).toBe(4);
    expect(
      getEffectiveMaxStacks("Suoming", "UnisonBoon", 2, {}, undefined, {
        InherentSkillGleaningSimpleJoysUnison: { isEnabled: true },
      }),
    ).toBe(3);
  });

  it("ignores disabled team buffs and other buff keys", () => {
    expect(
      getEffectiveMaxStacks("Suoming", "UnisonBoon", 2, {}, undefined, {
        InherentSkillGleaningSimpleJoysUnison: { isEnabled: false },
      }),
    ).toBe(2);
    expect(
      getEffectiveMaxStacks("Sanhua", "Silversnow", 2, {}, undefined, {
        InherentSkillGleaningSimpleJoysUnison: { isEnabled: true },
      }),
    ).toBe(2);
  });
});
