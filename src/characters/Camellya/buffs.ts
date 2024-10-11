export const buffs = [
  {
    key: "InherentSkillBreedingGround",
    name: "Inherent Skill: Breeding Ground",
    details: `<div class="skilldescription"><span class="Dark">Havoc</span> damage increases by 15%</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Havoc",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillInvasion",
    name: "Inherent Skill: Invasion",
    details: `<div class="skilldescription">Basic attack damage increases by 15%, <span class="Highlight">Normal Attack</span> & <span class="Highlight">Normal Attack Vine Dance</span> resistance to interruption increases.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "BasicAttackDMGBonus",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "BudStateMultiplier",
    name: "Bud State",
    details: `<div class="skilldescription"><span class="Highlight">Basic Attack</span>, <span class="Highlight">Plunging Attack</span>, <span class="Highlight">Normal Attack Vine Dance</span>, <span class="Highlight">Normal Attack Whirling Dance</span>, <span class="Highlight">Dodge Counter</span>, <span class="Highlight">Dodge Counter Atonement</span>, <span class="Highlight">Resonance Skill Red Camellia Bloom</span>, <span class="Highlight">Resonance Skill Dark Pistil Seeker</span> damage multiplier increases by 50%;</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "VineDanceStage1DMG",
          "VineDanceStage2DMG",
          "VineDanceStage3DMG",
          "VineDanceStage4DMG",
          "WhirlingDanceDMG",
          "AshenBlossomVineDanceDMG",
          "AtonementDMG",
          "FullBloomDMG",
          "DarkPistilSeekerDMG",
        ],
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "BudStateDayflowerMultiplier",
    name: "Bud State Dayflower",
    details: `<div class="skilldescription">When casting <span class="Highlight">Resonance Skill Dayflower</span>, removes all <span class="Highlight">Red Camellia·Bud</span>, every stack of <span class="Highlight">Red Camellia·Bud</span> additionally increases the damage multiplier by 5%, up to 50%;</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["DayflowerDMG"],
        modifierValue: 0.05,
      },
    ],
    minStacks: 0,
    maxStacks: 10,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritDMG1",
    name: "Stat Bonus: Crit. DMG+",
    details: `<div class="skilldescription">Crit. DMG increased by 2.40%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.024,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritDMG2",
    name: "Stat Bonus: Crit. DMG+",
    details: `<div class="skilldescription">Crit. DMG increased by 2.40%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.024,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritDMG3",
    name: "Stat Bonus: Crit. DMG+",
    details: `<div class="skilldescription">Crit. DMG increased by 5.60%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.056,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritDMG4",
    name: "Stat Bonus: Crit. DMG+",
    details: `<div class="skilldescription">Crit. DMG increased by 5.60%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.056,
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
