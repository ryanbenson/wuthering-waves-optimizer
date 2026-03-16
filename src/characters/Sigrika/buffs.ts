export const buffs = [
  {
    key: `BlessingOfRunesEnergy`,
    name: `Blessing Of Runes`,
    details: `For every 1% of Sigrika's Energy Regen over 125%, Sigrika gains 2% Echo Skill DMG Bonus for up to 50%.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EchoDMGBonus:AdditionalBase",
        modifierValue: .02,
        maximumValue: .5,
        modifierStep: 1,
        modifierBasedOn: "EnergyRegen",
        modifierTargetAttr: "EchoDMGBonus",
        minStatValue: 1.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SchemataofRunes`,
    name: `Schemata of Runes`,
    details: `When consuming Runes, if Sigrika holds at least 30 points of Soliskin Vitality, consume 30 points to increase the DMG Multipliers of the current Runic Outburst, Runic Chain Whip, and Runic Soliskin by 50%`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["RunicOutburstDMG", "RunicChainWhipDMG", "RunicSoliskinDMG"],
        modifierValue: .5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SoliskinVitality`,
    name: `Soliskin Vitality`,
    details: `Every 10 points of Soliskin Vitality consumed grants the current Runic Outburst, Runic Chain Whip, and Runic Soliskin 15% DMG Amplification.`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "DMGDeepen",
        modifySpecificTalents: ["RunicOutburstDMG", "RunicChainWhipDMG", "RunicSoliskinDMG"],
        modifierValue: .15,
      },
    ],
    minStacks: 0,
    maxStacks: 60,
    alwaysEnabled: false,
    appliesOnEveryStep: 10,
  },
  {
    key: `InnateGift`,
    name: `Innate Gift?`,
    details: `Sigrika can hold up to 2 stacks of Innate Gift?. Each stack grants Runic Outburst, Runic Chain Whip, Runic Soliskin and Forte Circuit - Learn My True Name 30% DMG Amplification.
This effect ends after Sigrika casts Forte Circuit - Learn My True Name or is switched off the field.`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "DMGDeepen",
        modifySpecificTalents: [
          "RunicOutburstDMG",
          "RunicChainWhipDMG",
          "RunicSoliskinDMG",
          "ForteCircuitLearnMyTrueNameDMG",
        ],
        modifierValue: .3,
      },
    ],
    minStacks: 0,
    maxStacks: 2,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillTrueNamesInvoked`,
    name: `Inherent Skill: True Names Invoked`,
    details: `test`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillTrueNamesAligned`,
    name: `Inherent Skill: True Names Aligned`,
    details: `test`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "Aero",
        modifierValue: 0.03,
      },
      {
        modifier: "EchoDMGBonus",
        modifierValue: 0.03,
      },
    ],
    minStacks: 0,
    maxStacks: 6,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritRate1",
    name: "Stat Bonus: Crit. Rate+",
    details: `<div class="skilldescription">Crit. Rate increased by 1.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.012,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritRate2",
    name: "Stat Bonus: Crit. Rate+",
    details: `<div class="skilldescription">Crit. Rate increased by 1.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.012,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritRate3",
    name: "Stat Bonus: Crit. Rate+",
    details: `<div class="skilldescription">Crit. Rate increased by 2.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.028,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritRate4",
    name: "Stat Bonus: Crit. Rate+",
    details: `<div class="skilldescription">Crit. Rate increased by 2.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.028,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusATK1",
    name: "Stat Bonus: ATK+",
    details: `<div class="skilldescription">ATK increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusATK2",
    name: "Stat Bonus: ATK+",
    details: `<div class="skilldescription">ATK increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusATK3",
    name: "Stat Bonus: ATK+",
    details: `<div class="skilldescription">ATK increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusATK4",
    name: "Stat Bonus: ATK+",
    details: `<div class="skilldescription">ATK increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
