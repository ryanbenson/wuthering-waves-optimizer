import { describe, it, expect } from "vitest";
import {
  resolveEchoSetPassiveInstance,
  aggregateEchoSetPassiveStats,
} from "../../src/echoes/echoSetPassives";

describe("resolveEchoSetPassiveInstance", () => {
  it("returns empty stats when disabled", () => {
    const result = resolveEchoSetPassiveInstance(
      "TestPassive",
      [{ modifier: "ATK", modifierValue: 0.1 }],
      { isEnabled: false },
      false,
      false,
      {},
    );
    expect(result.stats).toEqual({});
  });

  it("resolves a flat modifier when enabled", () => {
    const result = resolveEchoSetPassiveInstance(
      "TestPassive",
      [{ modifier: "ATK", modifierValue: 0.1 }],
      { isEnabled: true },
      false,
      false,
      {},
    );
    expect(result.stats).toEqual({ ATK: 0.1 });
  });

  it("skips modifiers whose key includes AdditionalBase", () => {
    const result = resolveEchoSetPassiveInstance(
      "TestPassive",
      [{ modifier: "AdditionalBaseATK", modifierValue: 0.1 }],
      { isEnabled: true },
      false,
      false,
      {},
    );
    expect(result.stats).toEqual({});
  });

  it("multiplies by stacks when hasStacks", () => {
    const result = resolveEchoSetPassiveInstance(
      "StackedPassive",
      [{ modifier: "CritDMG", modifierValue: 0.05 }],
      { isEnabled: true, stacks: 4 },
      true,
      false,
      {},
    );
    expect(result.stats.CritDMG).toBeCloseTo(0.2);
  });

  it("treats alwaysEnabled passives as enabled regardless of stored config", () => {
    const result = resolveEchoSetPassiveInstance(
      "AlwaysOn",
      [{ modifier: "DEF", modifierValue: 0.15 }],
      undefined,
      false,
      true,
      {},
    );
    expect(result.stats).toEqual({ DEF: 0.15 });
  });

  it("resolves Talent-modifier buffs against the given talentData", () => {
    const result = resolveEchoSetPassiveInstance(
      "TalentPassive",
      [
        {
          modifier: "Talent",
          modifierValueTalentRef: "skill",
          modifierTalentKey: "skillBonus",
          modifierValue: { "1": 0.1, "10": 0.5 },
        },
      ],
      { isEnabled: true },
      false,
      false,
      { skill: "10" },
    );
    expect(result.stats.skillBonus).toBe(0.5);
  });
});

describe("aggregateEchoSetPassiveStats", () => {
  it("sums numeric stats across passives", () => {
    const result = aggregateEchoSetPassiveStats([
      { key: "A", stats: { ATK: 0.1 } },
      { key: "B", stats: { ATK: 0.05, CritRate: 0.1 } },
    ]);
    expect(result.ATK).toBeCloseTo(0.15);
    expect(result.CritRate).toBeCloseTo(0.1);
  });

  it("overwrites (does not sum) EnableAttack", () => {
    const result = aggregateEchoSetPassiveStats([
      { key: "A", stats: { EnableAttack: ["skillOne"] } },
      { key: "B", stats: { EnableAttack: ["skillTwo"] } },
    ]);
    expect(result.EnableAttack).toEqual(["skillTwo"]);
  });
});
