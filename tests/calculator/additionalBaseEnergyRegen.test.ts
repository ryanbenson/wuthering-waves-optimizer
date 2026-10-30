import { describe, it, expect } from "vitest";
import { computeAdditionalBaseBuffs, countStatSteps } from "../../src/calculator/stats";

describe("countStatSteps", () => {
  it("counts whole steps", () => {
    expect(countStatSteps(2.5, 1)).toBe(2);
    expect(countStatSteps(0, 1)).toBe(0);
  });

  it("doesn't lose a step to float error at an exact boundary", () => {
    // 2.3 * 100 - 100 is 129.99999999999997 in floats
    expect(countStatSteps(2.3 * 100 - 1 * 100, 1)).toBe(130);
    // 0.7 / 0.007 is 99.99999999999999 in floats
    expect(countStatSteps(0.7, 0.007)).toBe(100);
  });
});

describe("computeAdditionalBaseBuffs - Energy Regen scaling", () => {
  // Lily's Heavy Attack crit: +0.5% Crit. Rate per 1% Energy Regen over 100%, up to 80%
  const buffsCharInfo = [
    {
      key: "EnergyRegenCrit",
      hasStacks: false,
      modifiers: [
        {
          modifier: "CritRate:AdditionalBase",
          modifierValue: 0.005,
          maximumValue: 0.8,
          modifierStep: 1,
          modifierBasedOn: "EnergyRegen",
          modifierTargetAttr: "CritRate",
          minStatValue: 1,
        },
      ],
    },
  ];

  it("counts every 1% over the threshold, including at float-unfriendly values", () => {
    const data = computeAdditionalBaseBuffs(
      { EnergyRegenCrit: { isEnabled: true } },
      buffsCharInfo,
      {},
      "Lily",
      2.3,
    );
    expect(data.CritRate).toBeCloseTo(130 * 0.005);
  });

  it("caps each stack before multiplying when perStackMaximumValue is set", () => {
    // Lily's Dream Aroma on herself: +0.1% ATK per 1% Energy Regen over 190%, up to 7% per stack
    const data = computeAdditionalBaseBuffs(
      { DreamAroma: { isEnabled: true, stacks: 4 } },
      [
        {
          key: "DreamAroma",
          hasStacks: true,
          modifiers: [
            {
              modifier: "ATK:AdditionalBase",
              modifierValue: 0.001,
              modifierStep: 1,
              modifierBasedOn: "EnergyRegen",
              modifierTargetAttr: "ATK",
              minStatValue: 1.9,
              perStackMaximumValue: 0.07,
              maximumValue: 0.28,
            },
          ],
        },
      ],
      {},
      "Lily",
      3,
    );
    expect(data.ATK).toBeCloseTo(0.28);
  });
});
