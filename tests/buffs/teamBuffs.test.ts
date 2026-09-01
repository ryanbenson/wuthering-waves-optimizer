import { describe, it, expect } from "vitest";
import {
  resolveTeamBuffInstance,
  aggregateTeamBuffStats,
  getSequenceNodeRequirement,
  categorizeBuffModifier,
  getModifierLabel,
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

describe("getSequenceNodeRequirement", () => {
  it("extracts the sequence node number from the standard naming convention", () => {
    expect(getSequenceNodeRequirement("Sequence Node 6: Daybreak Radiance")).toBe("Requires S6");
    expect(getSequenceNodeRequirement("Sequence Node 4: Dark Alliance")).toBe("Requires S4");
  });

  it("returns null for buff names that aren't sequence-node-gated", () => {
    expect(getSequenceNodeRequirement("Outro: Silversnow")).toBeNull();
    expect(getSequenceNodeRequirement("Euphonia")).toBeNull();
  });
});

describe("categorizeBuffModifier", () => {
  it("categorizes the core single-key stats", () => {
    expect(categorizeBuffModifier("ATK")).toBe("atk");
    expect(categorizeBuffModifier("CritRate")).toBe("critRate");
    expect(categorizeBuffModifier("CritDMG")).toBe("critDMG");
    expect(categorizeBuffModifier("EnergyRegen")).toBe("energyRegen");
  });

  it("categorizes damage-increasing/defense-shredding keys as 'damage'", () => {
    expect(categorizeBuffModifier("DMGBonus")).toBe("damage");
    expect(categorizeBuffModifier("DMGDeepen:Heavy")).toBe("damage");
    expect(categorizeBuffModifier("Fusion")).toBe("damage");
    expect(categorizeBuffModifier("EchoDMGBonus")).toBe("damage");
    expect(categorizeBuffModifier("AllElementAttributeBonus")).toBe("damage");
    expect(categorizeBuffModifier("ResistShred:Aero")).toBe("damage");
    expect(categorizeBuffModifier("DEFIgnore:Havoc")).toBe("damage");
    expect(categorizeBuffModifier("DefReduction")).toBe("damage");
  });

  it("safely skips keys it can't confidently place rather than guessing", () => {
    expect(categorizeBuffModifier("EnableAttack")).toBeNull();
    expect(categorizeBuffModifier("specialMultiplier")).toBeNull();
    expect(categorizeBuffModifier("tuneBreakBoost")).toBeNull();
    expect(categorizeBuffModifier("CritDMG:Echo")).toBeNull();
    expect(categorizeBuffModifier("ATK_FLAT")).toBeNull();
  });
});

describe("getModifierLabel", () => {
  it("labels the core single-key stats", () => {
    expect(getModifierLabel("ATK")).toBe("ATK");
    expect(getModifierLabel("CritRate")).toBe("Crit Rate");
    expect(getModifierLabel("CritDMG")).toBe("Crit DMG");
    expect(getModifierLabel("EnergyRegen")).toBe("Energy Regen");
  });

  it("labels elemental and attack-type DMG keys", () => {
    expect(getModifierLabel("Fusion")).toBe("Fusion DMG Bonus");
    expect(getModifierLabel("DMGDeepen:Heavy")).toBe("Heavy Attack DMG Deepen");
    expect(getModifierLabel("DMGDeepen:SpectroFrazzle")).toBe("Spectro DMG Deepen");
    expect(getModifierLabel("EchoDMGBonus")).toBe("Echo Skill DMG Bonus");
  });

  it("falls back to the raw key for anything it doesn't recognize", () => {
    expect(getModifierLabel("SomeBrandNewModifier")).toBe("SomeBrandNewModifier");
  });
});
