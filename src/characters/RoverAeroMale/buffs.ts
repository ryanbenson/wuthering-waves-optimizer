export const buffs = [
  {
    key: `InherentSkillSandintheStorm`,
    name: `Inherent Skill: Sand in the Storm`,
    details: `<div class="skilldescription">Casting Intro Skill <span class="Highlight">Relentless Squall</span> increases ATK by 20% for 10s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillBoundlessWinds`,
    name: `Inherent Skill: Boundless Winds`,
    details: `<div class="skilldescription">Increase Healing from Resonance Liberation <span class="Highlight">Omega Storm</span> by 20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifySpecificTalents: ["OmegaStormHealing"],
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHealingBonus1",
    name: "Stat Bonus: Healing Bonus+",
    details: `<div class="skilldescription">Healing Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHealingBonus2",
    name: "Stat Bonus: Healing Bonus+",
    details: `<div class="skilldescription">Healing Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHealingBonus3",
    name: "Stat Bonus: Healing Bonus+",
    details: `<div class="skilldescription">Healing Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHealingBonus4",
    name: "Stat Bonus: Healing Bonus+",
    details: `<div class="skilldescription">Healing Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
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
