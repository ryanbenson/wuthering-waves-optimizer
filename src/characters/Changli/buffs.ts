export const buffs = [
  {
    key: "FieryFeather",
    name: "Fiery Feather",
    details:
      '<div class="skilldescription">When Changli releases Heavy Attack <span class="Highlight">Flaming Sacrifice</span> within 10s, her ATK is increased by 25%, after which <span class="Highlight">Fiery Feather</span> ends.</div>',
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillSecretStrategist",
    name: "Inherent Skill: Secret Strategist",
    details: `<div class="skilldescription">When Changli releases Basic Attack: <span class="Highlight">True Sight - Conquest</span> or Basic Attack: <span class="Highlight">True Sight - Charge</span>, for each stack of [Enflamement], Changli's Fusion DMG is increased by 5%.</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.05,
      },
    ],
    minStacks: 0,
    maxStacks: 4,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillSweepingForce",
    name: "Inherent Skill: Sweeping Force",
    details: `<div class="skilldescription">When Changli releases Heavy Attack <span class="Highlight">Flaming Sacrifice</span> or Resonance Liberation <span class="Highlight">Radiance of Fealty</span>, Changli's Fusion DMG Bonus is increased by 20%, and Changli ignores 15% of the target's DEF when dealing damage.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.2,
      },
      {
        modifier: "DEFIgnore",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
