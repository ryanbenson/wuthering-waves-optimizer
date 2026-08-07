import { describe, it, expect } from "vitest";
import {
  resolveTeamBuffInstance,
  aggregateTeamBuffStats,
  type TeamBuffDef,
} from "../../src/buffs/teamBuffs";

describe("resolveTeamBuffInstance", () => {
  it("returns empty data when disabled", () => {
    const def: TeamBuffDef = { key: "SomeBuff", modifiers: [{ modifier: "ATK", modifierValue: 0.1 }] };
    const result = resolveTeamBuffInstance(def, { isEnabled: false }, "Jinhsi", {}, {});
    expect(result.data).toEqual({});
  });

  it("resolves a flat modifier when enabled", () => {
    const def: TeamBuffDef = { key: "SomeBuff", modifiers: [{ modifier: "ATK", modifierValue: 0.1 }] };
    const result = resolveTeamBuffInstance(def, { isEnabled: true }, "Jinhsi", {}, {});
    expect(result.data).toEqual({ ATK: 0.1 });
  });

  it("resolves by refinement when hasRefinements is set", () => {
    const def: TeamBuffDef = {
      key: "WeaponBuff",
      hasRefinements: true,
      modifiers: [{ modifier: "ATK", modifierByRefinement: { "1": 0.1, "5": 0.3 } }],
    };
    const result = resolveTeamBuffInstance(
      def,
      { isEnabled: true, refinement: "5" },
      "Jinhsi",
      {},
      {},
    );
    expect(result.data.ATK).toBeCloseTo(0.3);
  });

  it("defaults to refinement 1 when none is stored", () => {
    const def: TeamBuffDef = {
      key: "WeaponBuff",
      hasRefinements: true,
      modifiers: [{ modifier: "ATK", modifierByRefinement: { "1": 0.1, "5": 0.3 } }],
    };
    const result = resolveTeamBuffInstance(def, { isEnabled: true }, "Jinhsi", {}, {});
    expect(result.data.ATK).toBeCloseTo(0.1);
  });

  it("applies the inputBase stepped formula", () => {
    const def: TeamBuffDef = {
      key: "EnergyRegenScaling",
      inputBase: true,
      modifierBasedOn: "Energy Regen",
      modifiers: [
        { modifier: "ATK", modifierValue: 0.05, modifierStep: 0.2, maximumValue: 0.5, minStatValue: 1.0 },
      ],
    };
    // currentAmount is stored as a percentage-like raw number (e.g. 220 => 220%)
    const result = resolveTeamBuffInstance(
      def,
      { isEnabled: true, baseAttrValue: 220 },
      "Jinhsi",
      {},
      {},
    );
    // base = 1.0 (minStatValue for Energy Regen); additionalAmount = (220-1)/100 = 2.19
    // steps = floor(2.19 / 0.2) = 10; buffValue = 10 * 0.05 = 0.5, capped at maximumValue 0.5
    expect(result.data.ATK).toBeCloseTo(0.5);
  });

  it("clamps the inputBase formula result to zero when negative", () => {
    const def: TeamBuffDef = {
      key: "EnergyRegenScaling",
      inputBase: true,
      modifierBasedOn: "Energy Regen",
      modifiers: [
        { modifier: "ATK", modifierValue: 0.05, modifierStep: 0.2, maximumValue: 0.5, minStatValue: 1.0 },
      ],
    };
    const result = resolveTeamBuffInstance(
      def,
      { isEnabled: true, baseAttrValue: 0 },
      "Jinhsi",
      {},
      {},
    );
    expect(result.data.ATK).toBe(0);
  });

  it("skips modifiers whose key includes AdditionalBase", () => {
    const def: TeamBuffDef = {
      key: "SomeBuff",
      modifiers: [{ modifier: "AdditionalBaseATK", modifierValue: 0.1 }],
    };
    const result = resolveTeamBuffInstance(def, { isEnabled: true }, "Jinhsi", {}, {});
    expect(result.data).toEqual({});
  });

  it("skips modifiers restricted to other characters", () => {
    const def: TeamBuffDef = {
      key: "SomeBuff",
      modifiers: [{ modifier: "ATK", modifierValue: 0.1, specificCharacters: ["Calcharo"] }],
    };
    const result = resolveTeamBuffInstance(def, { isEnabled: true }, "Jinhsi", {}, {});
    expect(result.data).toEqual({});
  });

  it("multiplies by stacks for a stacked buff", () => {
    const def: TeamBuffDef = {
      key: "StackedBuff",
      hasStacks: true,
      modifiers: [{ modifier: "CritDMG", modifierValue: 0.05 }],
    };
    const result = resolveTeamBuffInstance(
      def,
      { isEnabled: true, stacks: 4 },
      "Jinhsi",
      {},
      {},
    );
    expect(result.data.CritDMG).toBeCloseTo(0.2);
  });

  it("hardcodes PactofNeonlightLeap's ATK bonus", () => {
    const def: TeamBuffDef = { key: "PactofNeonlightLeap", modifiers: [] };
    const result = resolveTeamBuffInstance(def, { isEnabled: true }, "Jinhsi", {}, {});
    expect(result.data).toEqual({ ATK: 0.15 });
  });

  it("computes InherentSkillEtchedColorsOffTuneBuildupRate's tune-break boost from stacks", () => {
    const def: TeamBuffDef = { key: "InherentSkillEtchedColorsOffTuneBuildupRate", modifiers: [] };
    const result = resolveTeamBuffInstance(
      def,
      { isEnabled: true, stacks: 150 },
      "Jinhsi",
      {},
      {},
    );
    // (150 - 100) * 0.008 = 0.4
    expect(result.data.tuneBreakBoost).toBeCloseTo(0.4);
  });

  it("no-ops InherentSkillEtchedColorsOffTuneBuildupRate below the 100 threshold", () => {
    const def: TeamBuffDef = { key: "InherentSkillEtchedColorsOffTuneBuildupRate", modifiers: [] };
    const result = resolveTeamBuffInstance(
      def,
      { isEnabled: true, stacks: 50 },
      "Jinhsi",
      {},
      {},
    );
    expect(result.data).toEqual({});
  });

  it("mutually excludes InherentSkillApplauseofVictory when the conflicting buff is enabled", () => {
    const def: TeamBuffDef = {
      key: "InherentSkillApplauseofVictory",
      modifiers: [{ modifier: "ATK", modifierValue: 0.1 }],
    };
    const result = resolveTeamBuffInstance(
      def,
      { isEnabled: true },
      "Jinhsi",
      {},
      { SequenceNode3WolflameHowlsinHerWake: { isEnabled: true } },
    );
    expect(result.data).toEqual({});
  });

  it("treats alwaysEnabled buffs as enabled regardless of stored config", () => {
    const def: TeamBuffDef = {
      key: "AlwaysOnBuff",
      alwaysEnabled: true,
      modifiers: [{ modifier: "ATK", modifierValue: 0.1 }],
    };
    const result = resolveTeamBuffInstance(def, undefined, "Jinhsi", {}, {});
    expect(result.data).toEqual({ ATK: 0.1 });
  });

  it("resolves Talent-modifier buffs only against the passed-in talentData (always {} on the live page)", () => {
    const def: TeamBuffDef = {
      key: "TalentBuff",
      modifiers: [
        {
          modifier: "Talent",
          modifierValueTalentRef: "skill",
          modifierTalentKey: "skillBonus",
          modifierValue: { "1": 0.1, "10": 0.5 },
        },
      ],
    };
    // Live CalculatorPartyBuffs.vue always passes {} for talentData, so the
    // "skill" lookup always misses and falls back to level "10".
    const result = resolveTeamBuffInstance(def, { isEnabled: true }, "Jinhsi", {}, {});
    expect(result.data.skillBonus).toBe(0.5);
  });
});

describe("aggregateTeamBuffStats", () => {
  it("sums numeric stats across buffs", () => {
    const result = aggregateTeamBuffStats([
      { key: "A", data: { ATK: 0.1 } },
      { key: "B", data: { ATK: 0.05, CritRate: 0.1 } },
    ]);
    expect(result.ATK).toBeCloseTo(0.15);
    expect(result.CritRate).toBeCloseTo(0.1);
  });

  it("overwrites (does not sum) EnableAttack", () => {
    const result = aggregateTeamBuffStats([
      { key: "A", data: { EnableAttack: ["skillOne"] } },
      { key: "B", data: { EnableAttack: ["skillTwo"] } },
    ]);
    expect(result.EnableAttack).toEqual(["skillTwo"]);
  });

  it("merges modifySpecificTalents into specificTalentBuffs", () => {
    const result = aggregateTeamBuffStats([
      {
        key: "A",
        data: {
          modifySpecificTalents: [
            {
              modifySpecificTalents: ["skillDMGBonus"],
              modifier: "DMGBonus",
              modifierValueCalculated: 0.2,
            },
          ],
        },
      },
    ]);
    expect(result.specificTalentBuffs).toEqual({ "skillDMGBonus:DMGBonus": 0.2 });
  });
});
