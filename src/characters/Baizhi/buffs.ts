export const buffs = [
  {
    key: "Inherent Skill: Harmonic Range",
    name: "Inherent Skill: Harmonic Range",
    details: `<div class="skilldescription">When Baizhi casts Resonance Skill <span class="Highlight">Emergency Plan</span>, You'tan generates a field of <span class="Highlight">Euphonia</span> that lasts for 15s.<br> <br><span class="Title">Euphonia</span><br>ATK of the Resonators who picks up Euphonia is increased by 15% for 20s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillStimulusFeedback",
    name: "Inherent Skill: Stimulus Feedback Healing",
    details: `<div class="skilldescription">Baizhi's <span class="Highlight">Heavy Attack</span> on hit heals the character with the lowest HP on a nearby team by 0.25% of her Max HP.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: [
          "InherentSkillStimulusFeedback",
        ],
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
    key: "StatBonusHP1",
    name: "Stat Bonus: HP+",
    details: `<div class="skilldescription">HP increased by 1.8%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HP",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHP2",
    name: "Stat Bonus: HP+",
    details: `<div class="skilldescription">HP increased by 1.8%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HP",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHP3",
    name: "Stat Bonus: HP+",
    details: `<div class="skilldescription">HP increased by 4.2%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HP",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHP4",
    name: "Stat Bonus: HP+",
    details: `<div class="skilldescription">HP increased by 4.2%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HP",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
