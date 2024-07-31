export const buffs = [
  {
    key: "InherentSkillScorching agazine",
    name: "Inherent Skill: Scorching Magazine",
    details: `<div class="skilldescription">Max "Thermobaric Bullets" is increased by 10 rounds. The damage of Resonance Skill <span class="Highlight">Boom Boom</span> is increased by 50%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["BoomBoomDamage"],
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillNumbinglySpicy",
    name: "Inherent Skill: Numbingly Spicy!",
    details: `<div class="skilldescription">Each "Thermobaric Bullets" that hits a target during Resonance Skill <span class="Highlight">DAKA DAKA!</span> increases ATK by 1% for 10s, stacking up to 30 times.</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.01,
      },
    ],
    minStacks: 0,
    maxStacks: 30,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusFusion1",
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
    key: "StatBonusFusion2",
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
    key: "StatBonusFusion3",
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
    key: "StatBonusFusion4",
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
