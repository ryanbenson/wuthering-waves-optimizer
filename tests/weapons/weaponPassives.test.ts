import { describe, it, expect } from "vitest";
import {
  resolveWeaponPassiveInstance,
  aggregateWeaponPassiveStats,
  computeWeaponPassiveStats,
} from "../../src/weapons/weaponPassives";

describe("resolveWeaponPassiveInstance", () => {
  it("returns zero value when disabled", () => {
    const result = resolveWeaponPassiveInstance(
      { key: "TestPassive", modifier: "ATK", modifierByRefinement: { "1": 0.1 } },
      { isEnabled: false },
      "1",
    );
    expect(result.value).toBe(0);
  });

  it("resolves a flat (non-stacking) passive by refinement", () => {
    const result = resolveWeaponPassiveInstance(
      { key: "TestPassive", modifier: "ATK", modifierByRefinement: { "1": 0.1, "2": 0.15 } },
      { isEnabled: true },
      "2",
    );
    expect(result.value).toBe(0.15);
    expect(result.stacks).toBe(0);
  });

  it("multiplies value by stacks for a stacked passive", () => {
    const result = resolveWeaponPassiveInstance(
      {
        key: "StackedPassive",
        modifier: "CritRate",
        hasStacks: true,
        modifierByRefinement: { "1": 0.05 },
      },
      { isEnabled: true, stacks: 3 },
      "1",
    );
    expect(result.valueBeforeStacks).toBe(0.05);
    expect(result.stacks).toBe(3);
    expect(result.value).toBeCloseTo(0.15);
  });

  it("returns zero when a stacked passive has zero stacks", () => {
    const result = resolveWeaponPassiveInstance(
      { key: "StackedPassive", modifier: "CritRate", hasStacks: true, modifierByRefinement: { "1": 0.05 } },
      { isEnabled: true, stacks: 0 },
      "1",
    );
    expect(result.value).toBe(0);
  });

  it("treats alwaysEnabled passives as enabled regardless of stored config", () => {
    const result = resolveWeaponPassiveInstance(
      { key: "AlwaysOn", modifier: "DEF", alwaysEnabled: true, modifierByRefinement: { "1": 0.2 } },
      undefined,
      "1",
    );
    expect(result.value).toBe(0.2);
  });
});

describe("aggregateWeaponPassiveStats", () => {
  it("sums resolved passives by stat", () => {
    const result = aggregateWeaponPassiveStats("SomeWeapon", [
      { key: "A", stat: "ATK", value: 0.1, stacks: 0, valueBeforeStacks: 0 },
      { key: "B", stat: "ATK", value: 0.05, stacks: 0, valueBeforeStacks: 0 },
      { key: "C", stat: "CritRate", value: 0.1, stacks: 0, valueBeforeStacks: 0 },
    ]);
    expect(result.ATK).toBeCloseTo(0.15);
    expect(result.CritRate).toBeCloseTo(0.1);
  });

  it("collects modifySpecificTalents into specificTalentBuffs", () => {
    const result = aggregateWeaponPassiveStats("SomeWeapon", [
      {
        key: "TalentBuff",
        stat: "modifySpecificTalents",
        value: [
          {
            modifySpecificTalents: ["skillDMGBonus"],
            modifier: "DMGBonus",
            modifierValueCalculated: 0.2,
          },
        ],
        stacks: 0,
        valueBeforeStacks: 0,
      },
    ]);
    expect(result.specificTalentBuffs).toEqual({ "skillDMGBonus:DMGBonus": 0.2 });
  });

  it("applies the Stringmaster special case", () => {
    const result = aggregateWeaponPassiveStats("Stringmaster", [
      { key: "StringmasterAllElementAttributeBonus", stat: "Glacio", value: 0.1, stacks: 0, valueBeforeStacks: 0 },
      { key: "StringmasterATK1", stat: "ATK", value: 0.3, stacks: 3, valueBeforeStacks: 0.1 },
      { key: "StringmasterATK2", stat: "ATK", value: 0.05, stacks: 0, valueBeforeStacks: 0 },
    ]);
    // (0.1 valueBeforeStacks + 0.05 secondPassiveValue) * 3 stacks
    expect(result.ATK).toBeCloseTo(0.45);
    expect(result.Glacio).toBe(0.1);
  });

  it("returns empty Stringmaster buffs when the first passive is missing", () => {
    const result = aggregateWeaponPassiveStats("Stringmaster", [
      { key: "StringmasterAllElementAttributeBonus", stat: "Glacio", value: 0.1, stacks: 0, valueBeforeStacks: 0 },
    ]);
    expect(result).toEqual({ Glacio: 0.1 });
  });
});

describe("computeWeaponPassiveStats", () => {
  it("resolves and aggregates in one call", () => {
    const result = computeWeaponPassiveStats(
      "SomeWeapon",
      [
        { key: "A", modifier: "ATK", modifierByRefinement: { "1": 0.1 } },
        { key: "B", modifier: "ATK", hasStacks: true, modifierByRefinement: { "1": 0.02 } },
      ],
      { A: { isEnabled: true }, B: { isEnabled: true, stacks: 2 } },
      "1",
    );
    expect(result.ATK).toBeCloseTo(0.14);
  });
});
