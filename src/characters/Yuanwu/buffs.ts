export const buffs = [
  {
    key: "InherentSkillThunderous Determination",
    name: "Inherent Skill: Thunderous Determination",
    details: `<div class="skilldescription">The DMG multiplier of Resonance Skill <span class="Highlight">Thunder Uprising</span> is increased by 40%, and its reduction efficiency of enemy Vibration Strength is enhanced.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["ThunderUprisingDMG"],
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusElectroDMGBonus1",
    name: "Stat Bonus: Electro DMG Bonus+",
    details: `<div class="skilldescription">Electro DMG Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Electro",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusElectroDMGBonus2",
    name: "Stat Bonus: Electro DMG Bonus+",
    details: `<div class="skilldescription">Electro DMG Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Electro",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusElectroDMGBonus3",
    name: "Stat Bonus: Electro DMG Bonus+",
    details: `<div class="skilldescription">Electro DMG Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Electro",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusElectroDMGBonus4",
    name: "Stat Bonus: Electro DMG Bonus+",
    details: `<div class="skilldescription">Electro DMG Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Electro",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusDEF1",
    name: "Stat Bonus: DEF+",
    details: `<div class="skilldescription">DEF increased by 2.28%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEF",
        modifierValue: 0.028,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusDEF2",
    name: "Stat Bonus: DEF+",
    details: `<div class="skilldescription">DEF increased by 2.28%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEF",
        modifierValue: 0.028,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusDEF3",
    name: "Stat Bonus: DEF+",
    details: `<div class="skilldescription">DEF increased by 5.32%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEF",
        modifierValue: 0.0532,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusDEF4",
    name: "Stat Bonus: DEF+",
    details: `<div class="skilldescription">DEF increased by 5.32%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEF",
        modifierValue: 0.0532,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
