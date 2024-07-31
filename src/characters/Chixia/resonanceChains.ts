export const resonanceChains = [
  {
    key: "SequenceNode1No1HeroPlayFan",
    name: "Sequence Node 1: No.1 Hero Play Fan",
    details: `<span class="skilldescription">Resonance Skill <span class="Highlight">Boom Boom</span> hits will always be Critical Hits.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifySpecificTalents: ["BoomBoomDamage"],
        modifierValue: 1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3EternalFlames",
    name: "Sequence Node 3: Eternal Flames",
    details: `<span class="skilldescription">Resonance Liberation <span class="Highlight">Blazing Flames</span> deals 40% more damage to targets whose HP is below 50%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["BlazingFlamesSkillDMG"],
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5TriumphantExplosions",
    name: "Sequence Node 5: Triumphant Explosions",
    details: `<span class="skilldescription">When the Inherent Skill <span class="Highlight">Numbingly Spicy!</span> reaches max stacks, ATK is additionally increased by 30%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6EasterEggPerformance",
    name: "Sequence Node 6: Easter Egg Performance",
    details: `<span class="skilldescription">Resonance Skill <span class="Highlight">Boom Boom</span> increases the Basic Attack DMG Bonus of all team members by 25% for 15s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "BasicAttackDMGBonus",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
