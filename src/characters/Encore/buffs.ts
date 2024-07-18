export const buffs = [
  {
    key: "InherentSkillAngryCosmos",
    name: "Inherent Skill: Angry Cosmos",
    details: `<div class="skilldescription">During the Resonance Liberation <span class="Highlight">Cosmos Rave</span>, when Encore's HP is above 70%, DMG dealt is increased by 10%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: [
          "CosmosFrolickingStage1DMG",
          "CosmosFrolickingStage2DMG",
          "CosmosFrolickingStage3DMG",
          "CosmosFrolickingStage4DMG",
          "CosmosHeavyAttackDMG",
          "CosmosRampageDamage",
          "CosmosDodgeCounterDMG",
        ],
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillWooliesCheerDance",
    name: "Inherent Skill: Woolies Cheer Dance",
    details: `<div class="skilldescription">When Resonance Skill <span class="Highlight">Flaming Woolies</span> or Resonance Skill <span class="Highlight">Cosmos - Rampage</span> is cast, Encore's Fusion DMG Bonus is increased by 10% for 10s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusFusionDMGBonus1",
    name: "Stat Bonus: Fusion DMG Bonus+",
    details: `<div class="skilldescription">Fusion DMG Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusFusionDMGBonus2",
    name: "Stat Bonus: Fusion DMG Bonus+",
    details: `<div class="skilldescription">Fusion DMG Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusFusionDMGBonus3",
    name: "Stat Bonus: Fusion DMG Bonus+",
    details: `<div class="skilldescription">Fusion DMG Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusFusionDMGBonus4",
    name: "Stat Bonus: Fusion DMG Bonus+",
    details: `<div class="skilldescription">Fusion DMG Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.042,
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
