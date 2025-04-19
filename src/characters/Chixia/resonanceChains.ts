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
    key: "SequenceNode2LeapingSparkles",
    name: "Sequence Node 2: Leaping Sparkles",
    details: `<span class="skilldescription">During Resonance Liberation <span class="Highlight">Blazing Flames</span>, for every 1 target defeated, Chixia recovers 5 Resonance Energy, up to 20 each time.</span>`,
    hasStacks: false,
    modifiers: [],
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
    key: "SequenceNode4HerosUltimateMove",
    name: "Sequence Node 4: Hero’s Ultimate Move",
    details: `<span class="skilldescription">Resonance Liberation <span class="Highlight">Blazing Flames</span> grants 60 "Thermobaric Bullets" and immediately resets the Cooldown of Resonance Skill <span class="Highlight">Whizzing Fight Spirit</span>.</span>`,
    hasStacks: false,
    modifiers: [],
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
