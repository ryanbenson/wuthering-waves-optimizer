export const buffs = [
  {
    key: `SoloConcert`,
    name: `Solo Concert`,
    details: `When Ciaccona or Ensemble Sylph performs Solo Concert, they give 24% Aero DMG Bonus to all nearby Resonators in the team. This effect is not stackable.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Aero",
        modifierValue: 0.24,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillInterludeTune`,
    name: `Inherent Skill: Interlude Tune`,
    details: `<div class="skilldescription">Casting Resonance Liberation <span class="Highlight">Singer's Triple Cadenza</span> grants Ciaccona a Shield equal to 100% of her Max HP for 4s. Switching out Ciaccona removes the Shield.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["InherentSkillInterludeTune"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillWindsofRinascita`,
    name: `Inherent Skill: Winds of Rinascita`,
    details: `<div class="skilldescription">Increase <span class="Highlight">Heavy Attack - Quadruple Downbeat</span>'s DMG by 30%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["QuadrupleDownbeatDMG"],
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
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
