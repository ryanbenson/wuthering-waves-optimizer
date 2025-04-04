export const resonanceChains = [
  {
    key: "SequenceNode1SapphireSkiesSoaringSparrows",
    name: "Sequence Node 1: Sapphire Skies, Soaring Sparrows",
    details: `<span class="skilldescription">Intro Skill <span class="Highlight">Cerulean Song</span> increases Yangyang's Aero DMG Bonus by an additional 15% for 8s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Aero",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2NestingTwigsinBeaksTheyHarrow",
    name: "Sequence Node 2: Nesting Twigs, in Beaks They Harrow",
    details: `<span class="skilldescription"><span class="Highlight">Heavy Attack</span> recovers an additional 10 Resonance Energy for Yangyang when it hits a target, which can be triggered 1 time every 20s.</span>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3NatureSingsinSymphony",
    name: "Sequence Node 3: Nature Sings in Symphony",
    details: `<span class="skilldescription">Resonance Skill DMG Bonus is increased by 40%. The Wind Field's pulling effect on surrounding targets is enhanced, and the pulling range is expanded by 33%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResonanceSkillDMGBonus",
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4CloseYourEyesandListenin",
    name: "Sequence Node 4: Close Your Eyes and Listen in",
    details: `<span class="skilldescription">Mid-air Attack <span class="Highlight">Feather Release</span>'s damage is increased by 95%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["FeatherReleaseDamage"],
        modifierValue: 0.95,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5WindsWhisperinHarmony",
    name: "Sequence Node 5: Winds Whisper in Harmony",
    details: `<span class="skilldescription">Resonance Liberation <span class="Highlight">Wind Spirals</span>'s damage is increased by 85%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["WindSpiralsSkillDMG"],
        modifierValue: 0.85,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6ATributetoLifesSweetHymn",
    name: "Sequence Node 6: A Tribute to Life's Sweet Hymn",
    details: `<span class="skilldescription">After casting Mid-Air Attack <span class="Highlight">Feather Release</span>, the ATK of all team members is increased by 20% for 20s.</span>`,
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
];
