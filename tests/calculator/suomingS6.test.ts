import { describe, it, expect } from "vitest";
import { computeSelfBuffs } from "../../src/calculator/stats";
import { buffs as suomingBuffs } from "../../src/characters/suoming/buffs";
import { getEffectiveMaxStacks } from "../../src/characters/effectiveBuffStacks";

// Suoming's Sequence Node 6: Nine Shadows at Her Side increases the effect of
// each Unison Boon stack by 50% (up to 4 stacks instead of 2), and further
// increases Crit. DMG by 80% while Seal Master is active.
describe("Suoming Sequence Node 6: Nine Shadows at Her Side", () => {
  it("increases Unison Boon's Total DMG per stack by 50% when S6 is enabled", () => {
    const stacks = 2;
    const withoutS6 = computeSelfBuffs(
      { UnisonBoon: { isEnabled: true, stacks } },
      suomingBuffs,
      {},
      {},
      "Suoming",
      null,
      {},
    );
    const withS6 = computeSelfBuffs(
      { UnisonBoon: { isEnabled: true, stacks } },
      suomingBuffs,
      { SequenceNode6NineShadowsAtHerSide: { isEnabled: true } },
      {},
      "Suoming",
      null,
      {},
    );

    expect(withoutS6.TotalDamage).toBeCloseTo(0.03 * stacks);
    expect(withS6.TotalDamage).toBeCloseTo(0.03 * stacks * 1.5);
  });

  it("raises Unison Boon's max stacks from 2 to 4 when S6 is enabled", () => {
    expect(getEffectiveMaxStacks("Suoming", "UnisonBoon", 2, {})).toBe(2);
    expect(
      getEffectiveMaxStacks("Suoming", "UnisonBoon", 2, {
        SequenceNode6NineShadowsAtHerSide: { isEnabled: true },
      }),
    ).toBe(4);
  });

  it("adds an additional 80% Crit. DMG while Seal Master is active and S6 is enabled", () => {
    const withoutS6 = computeSelfBuffs(
      { InherentSkillSunkenSealForgedLock: { isEnabled: true } },
      suomingBuffs,
      {},
      {},
      "Suoming",
      null,
      {},
    );
    const withS6 = computeSelfBuffs(
      { InherentSkillSunkenSealForgedLock: { isEnabled: true } },
      suomingBuffs,
      { SequenceNode6NineShadowsAtHerSide: { isEnabled: true } },
      {},
      "Suoming",
      null,
      {},
    );

    expect(withoutS6.CritDMG).toBeCloseTo(0.8);
    expect(withS6.CritDMG).toBeCloseTo(1.6);
  });
});
