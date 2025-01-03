export const buffs = [
  {
    key: "GateofQuandary",
    name: "Gate of Quandary",
    details: `<div class="skilldescription">Generate a "Gate of Quandary" in front, dealing <span class="Wind">Aero DMG</span>. When bullets pass through the "Gate of Quandary", ATK is increased by 10%. "Gate of Quandary" lasts for 10s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillPerfectPerformance",
    name: "Inherent Skill: Perfect Performance",
    details: `<div class="skilldescription">Aalto's <span class="Highlight">Heavy Attack</span> will always critically hit, triggered once every 30s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifySpecificTalents: [
          "HalfTruthsAimedShotDMG",
          "HalfTruthsChargedAimedShotDMG",
        ],
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusAeroDMGBonus1",
    name: "Stat Bonus: Aero DMG Bonus+",
    details: `<div class="skilldescription">Aero DMG Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Aero",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusAeroDMGBonus2",
    name: "Stat Bonus: Aero DMG Bonus+",
    details: `<div class="skilldescription">Aero DMG Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Aero",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusAeroDMGBonus3",
    name: "Stat Bonus: Aero DMG Bonus+",
    details: `<div class="skilldescription">Aero DMG Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Aero",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusAeroDMGBonus4",
    name: "Stat Bonus: Aero DMG Bonus+",
    details: `<div class="skilldescription">Aero DMG Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Aero",
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
