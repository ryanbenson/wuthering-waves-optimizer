import { describe, it, expect } from "vitest";
import {
  computeAdditionalBaseBuffs,
  mergeAdditionalBaseData,
} from "../../src/calculator/stats";

// Regression + new-behavior coverage for the HP-scaling extension to the
// AdditionalBase modifier system (added for Jingran's kit), which previously
// only supported EnergyRegen/CritRate-based scaling.

describe("computeAdditionalBaseBuffs - HP-based scaling", () => {
  const buffsCharInfo = [
    {
      key: "FlatAtkFromHp",
      hasStacks: false,
      modifiers: [
        {
          modifier: "ATK_FLAT:AdditionalBase",
          modifierBasedOn: "HP",
          minStatValue: 0,
          modifierStep: 1000,
          modifierValue: 36,
          maximumValue: 1800,
          modifierTargetAttr: "ATK_FLAT",
        },
      ],
      minStacks: 0,
      maxStacks: 0,
    },
  ];

  it("scales linearly per 1000 HP over the threshold", () => {
    const data = computeAdditionalBaseBuffs(
      { FlatAtkFromHp: { isEnabled: true } },
      buffsCharInfo,
      {},
      "Jingran",
      0,
      0,
      null,
      32000,
    );
    expect(data.ATK_FLAT).toBeCloseTo(32 * 36);
  });

  it("caps the total at maximumValue once HP scaling would exceed it", () => {
    const data = computeAdditionalBaseBuffs(
      { FlatAtkFromHp: { isEnabled: true } },
      buffsCharInfo,
      {},
      "Jingran",
      0,
      0,
      null,
      100000,
    );
    expect(data.ATK_FLAT).toBe(1800);
  });

  it("respects minStatValue as the HP threshold before scaling starts", () => {
    const buffsCharInfoWithThreshold = [
      {
        key: "ThresholdBuff",
        hasStacks: false,
        modifiers: [
          {
            modifier: "DMGBonus:AdditionalBase",
            modifierBasedOn: "HP",
            minStatValue: 25000,
            modifierStep: 1000,
            modifierValue: 0.01,
            maximumValue: 1,
            modifierTargetAttr: "DMGBonus",
          },
        ],
        minStacks: 0,
        maxStacks: 0,
      },
    ];
    const belowThreshold = computeAdditionalBaseBuffs(
      { ThresholdBuff: { isEnabled: true } },
      buffsCharInfoWithThreshold,
      {},
      "Jingran",
      0,
      0,
      null,
      20000,
    );
    expect(belowThreshold.DMGBonus ?? 0).toBe(0);

    const aboveThreshold = computeAdditionalBaseBuffs(
      { ThresholdBuff: { isEnabled: true } },
      buffsCharInfoWithThreshold,
      {},
      "Jingran",
      0,
      0,
      null,
      30000,
    );
    expect(aboveThreshold.DMGBonus).toBeCloseTo(5 * 0.01);
  });

  it("generically passes through target attrs beyond the hardcoded list (e.g. elemental Fusion)", () => {
    const buffsCharInfoFusion = [
      {
        key: "FusionFromHp",
        hasStacks: false,
        modifiers: [
          {
            modifier: "Fusion:AdditionalBase",
            modifierBasedOn: "HP",
            minStatValue: 0,
            modifierStep: 1000,
            modifierValue: 0.015,
            maximumValue: 0.75,
            modifierTargetAttr: "Fusion",
          },
        ],
        minStacks: 0,
        maxStacks: 0,
      },
    ];
    const data = computeAdditionalBaseBuffs(
      { FusionFromHp: { isEnabled: true } },
      buffsCharInfoFusion,
      {},
      "Jingran",
      0,
      0,
      null,
      40000,
    );
    expect(data.Fusion).toBeCloseTo(40 * 0.015);
  });

  it("caps steps via maxSteps independent of the resolved per-step value (forte-table lookup)", () => {
    const buffsCharInfoForte = [
      {
        key: "FireOfLife",
        hasStacks: false,
        modifiers: [
          {
            modifier: "talentModifierMultiplyAdd:AdditionalBase",
            modifierBasedOn: "HP",
            minStatValue: 25000,
            modifierStep: 1000,
            maxSteps: 25,
            modifierValue: { "1": 0.1064, "10": 0.211 },
            modifierValueTalentRef: "forte",
            maximumValue: 5.275,
            modifierTargetAttr: "talentModifierMultiplyAdd",
            modifySpecificTalents: ["HeavyAttackSoulRaidDMG"],
          },
        ],
        minStacks: 0,
        maxStacks: 0,
      },
    ];
    // HP way past the 50000 (25000 threshold + 25 steps * 1000) cap
    const data = computeAdditionalBaseBuffs(
      { FireOfLife: { isEnabled: true } },
      buffsCharInfoForte,
      {},
      "Jingran",
      0,
      0,
      null,
      200000,
      { forte: "10" },
    );
    // steps clamped to 25 regardless of how far HP exceeds the cap
    // written under specificTalentBuffs, like every other modifySpecificTalents
    // target attr, so both self-buff and resonance-chain callers read it
    // consistently (attacks.ts sums both selfBuffs root and
    // selfBuffs.specificTalentBuffs for talentModifierMultiplyAdd, since older
    // Talent-modifier-based buffs like Jinhsi's Incandescence still write root)
    expect(
      data.specificTalentBuffs["HeavyAttackSoulRaidDMG:talentModifierMultiplyAdd"],
    ).toBeCloseTo(25 * 0.211);
  });

  it("looks up a lower forte level correctly instead of always assuming max level", () => {
    const buffsCharInfoForte = [
      {
        key: "FireOfLife",
        hasStacks: false,
        modifiers: [
          {
            modifier: "talentModifierMultiplyAdd:AdditionalBase",
            modifierBasedOn: "HP",
            minStatValue: 25000,
            modifierStep: 1000,
            maxSteps: 25,
            modifierValue: { "1": 0.1064, "10": 0.211 },
            modifierValueTalentRef: "forte",
            maximumValue: 5.275,
            modifierTargetAttr: "talentModifierMultiplyAdd",
            modifySpecificTalents: ["HeavyAttackSoulRaidDMG"],
          },
        ],
        minStacks: 0,
        maxStacks: 0,
      },
    ];
    const data = computeAdditionalBaseBuffs(
      { FireOfLife: { isEnabled: true } },
      buffsCharInfoForte,
      {},
      "Jingran",
      0,
      0,
      null,
      35000, // 10 steps
      { forte: "1" },
    );
    expect(
      data.specificTalentBuffs["HeavyAttackSoulRaidDMG:talentModifierMultiplyAdd"],
    ).toBeCloseTo(10 * 0.1064);
  });

  it("Jingran: scales Fire of Life's forte-table value by 1.46 when SequenceNode2 is enabled", () => {
    const buffsCharInfoForte = [
      {
        key: "FireOfLife",
        hasStacks: false,
        modifiers: [
          {
            modifier: "talentModifierMultiplyAdd:AdditionalBase",
            modifierBasedOn: "HP",
            minStatValue: 25000,
            modifierStep: 1000,
            maxSteps: 25,
            modifierValue: { "10": 0.211 },
            modifierValueTalentRef: "forte",
            maximumValue: 5.275,
            modifierTargetAttr: "talentModifierMultiplyAdd",
            modifySpecificTalents: ["HeavyAttackSoulRaidDMG"],
          },
        ],
        minStacks: 0,
        maxStacks: 0,
      },
    ];
    const withoutRc2 = computeAdditionalBaseBuffs(
      { FireOfLife: { isEnabled: true } },
      buffsCharInfoForte,
      {},
      "Jingran",
      0,
      0,
      null,
      35000, // 10 steps
      { forte: "10" },
    );
    expect(
      withoutRc2.specificTalentBuffs[
        "HeavyAttackSoulRaidDMG:talentModifierMultiplyAdd"
      ],
    ).toBeCloseTo(10 * 0.211);

    const withRc2 = computeAdditionalBaseBuffs(
      { FireOfLife: { isEnabled: true } },
      buffsCharInfoForte,
      {
        SequenceNode2ASolitaryLanternAcrossLandsShadeTrodden: {
          isEnabled: true,
        },
      },
      "Jingran",
      0,
      0,
      null,
      35000,
      { forte: "10" },
    );
    expect(
      withRc2.specificTalentBuffs[
        "HeavyAttackSoulRaidDMG:talentModifierMultiplyAdd"
      ],
    ).toBeCloseTo(10 * 0.211 * 1.46);
  });

  it("Jingran: skips the base Yang Changes, Yin Unites buff when SequenceNode3 is enabled (replaced, not stacked, by the chain's own Yin-Yang Everflow modifier in resonanceChains.ts)", () => {
    const buffsCharInfoYangYin = [
      {
        key: "YangChangesYinUnites",
        hasStacks: false,
        modifiers: [
          {
            modifier: "ATK_FLAT:AdditionalBase",
            modifierBasedOn: "HP",
            minStatValue: 0,
            modifierStep: 1000,
            modifierValue: 36,
            maximumValue: 1800,
            modifierTargetAttr: "ATK_FLAT",
          },
        ],
        minStacks: 0,
        maxStacks: 0,
      },
    ];

    const withoutRc3 = computeAdditionalBaseBuffs(
      { YangChangesYinUnites: { isEnabled: true } },
      buffsCharInfoYangYin,
      {},
      "Jingran",
      0,
      0,
      null,
      32000,
    );
    expect(withoutRc3.ATK_FLAT).toBeCloseTo(32 * 36);

    const withRc3 = computeAdditionalBaseBuffs(
      { YangChangesYinUnites: { isEnabled: true } },
      buffsCharInfoYangYin,
      {
        SequenceNode3WorldSCourseShiftsEachToTheirRightfulPaths: {
          isEnabled: true,
        },
      },
      "Jingran",
      0,
      0,
      null,
      32000,
    );
    expect(withRc3.ATK_FLAT ?? 0).toBe(0);
  });

  it("Jingran: does not scale other characters' or other buffs' AdditionalBase modifiers", () => {
    const buffsCharInfoOther = [
      {
        key: "SomeOtherBuff",
        hasStacks: false,
        modifiers: [
          {
            modifier: "talentModifierMultiplyAdd:AdditionalBase",
            modifierBasedOn: "HP",
            minStatValue: 25000,
            modifierStep: 1000,
            maxSteps: 25,
            modifierValue: { "10": 0.211 },
            modifierValueTalentRef: "forte",
            maximumValue: 5.275,
            modifierTargetAttr: "talentModifierMultiplyAdd",
            modifySpecificTalents: ["HeavyAttackSoulRaidDMG"],
          },
        ],
        minStacks: 0,
        maxStacks: 0,
      },
    ];
    const data = computeAdditionalBaseBuffs(
      { SomeOtherBuff: { isEnabled: true } },
      buffsCharInfoOther,
      {
        SequenceNode2ASolitaryLanternAcrossLandsShadeTrodden: {
          isEnabled: true,
        },
      },
      "Jingran",
      0,
      0,
      null,
      35000,
      { forte: "10" },
    );
    expect(
      data.specificTalentBuffs["HeavyAttackSoulRaidDMG:talentModifierMultiplyAdd"],
    ).toBeCloseTo(10 * 0.211);
  });

  it("caps each stack independently before multiplying by stack count", () => {
    const buffsCharInfoStacked = [
      {
        key: "FortuneInDisguise",
        hasStacks: true,
        modifiers: [
          {
            modifier: "Fusion:AdditionalBase",
            modifierBasedOn: "HP",
            minStatValue: 0,
            modifierStep: 1000,
            modifierValue: 0.0005,
            perStackMaximumValue: 0.025,
            maximumValue: 1.25,
            modifierTargetAttr: "Fusion",
          },
        ],
        minStacks: 0,
        maxStacks: 50,
      },
    ];
    // HP=80000 -> uncapped per-stack value would be 80 * 0.0005 = 0.04,
    // above the 0.025 per-stack cap, so it should clamp to 0.025 per stack
    // *before* multiplying by the 10 stacks (0.25), not clamp the total
    // (which a naive "cap the sum" implementation would leave at 0.4 or
    // clamp incorrectly against a value calibrated for 50 stacks)
    const data = computeAdditionalBaseBuffs(
      { FortuneInDisguise: { isEnabled: true, stacks: 10 } },
      buffsCharInfoStacked,
      {},
      "Jingran",
      0,
      0,
      null,
      80000,
    );
    expect(data.Fusion).toBeCloseTo(10 * 0.025);
  });

  it("does not cap a stacked buff when HP stays under the per-stack cap", () => {
    const buffsCharInfoStacked = [
      {
        key: "FortuneInDisguise",
        hasStacks: true,
        modifiers: [
          {
            modifier: "Fusion:AdditionalBase",
            modifierBasedOn: "HP",
            minStatValue: 0,
            modifierStep: 1000,
            modifierValue: 0.0005,
            perStackMaximumValue: 0.025,
            maximumValue: 1.25,
            modifierTargetAttr: "Fusion",
          },
        ],
        minStacks: 0,
        maxStacks: 50,
      },
    ];
    // HP=30000 -> per-stack value = 30 * 0.0005 = 0.015, under the cap
    const data = computeAdditionalBaseBuffs(
      { FortuneInDisguise: { isEnabled: true, stacks: 10 } },
      buffsCharInfoStacked,
      {},
      "Jingran",
      0,
      0,
      null,
      30000,
    );
    expect(data.Fusion).toBeCloseTo(10 * 0.015);
  });
});

describe("mergeAdditionalBaseData", () => {
  it("still sums the original hardcoded stat keys correctly", () => {
    const merged = mergeAdditionalBaseData(
      { CritRate: 0.1, CritDMG: 0.2, ATK: 0.05, ATK_FLAT: 100 },
      { CritRate: 0.05, CritDMG: 0, ATK: 0, ATK_FLAT: 50 },
    );
    expect(merged.CritRate).toBeCloseTo(0.15);
    expect(merged.CritDMG).toBeCloseTo(0.2);
    expect(merged.ATK).toBeCloseTo(0.05);
    expect(merged.ATK_FLAT).toBe(150);
  });

  it("generically sums arbitrary new keys not in the original hardcoded list", () => {
    const merged = mergeAdditionalBaseData(
      { Fusion: 0.1, HealingBonus: 0.2 },
      { Fusion: 0.05 },
    );
    expect(merged.Fusion).toBeCloseTo(0.15);
    expect(merged.HealingBonus).toBeCloseTo(0.2);
  });

  it("merges specificTalentBuffs by key instead of summing", () => {
    const merged = mergeAdditionalBaseData(
      { specificTalentBuffs: { "A:CritRate": 0.1 } },
      { specificTalentBuffs: { "B:CritRate": 0.2 } },
    );
    expect(merged.specificTalentBuffs).toEqual({
      "A:CritRate": 0.1,
      "B:CritRate": 0.2,
    });
  });

  it("handles missing/empty inputs without throwing", () => {
    expect(mergeAdditionalBaseData()).toEqual({ specificTalentBuffs: {} });
  });
});
