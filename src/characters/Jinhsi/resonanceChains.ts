export const resonanceChains = [
  {
    key: "SequenceNode1AbyssalAscension",
    name: "Sequence Node 1: Abyssal Ascension",
    details: `<span class="skilldescription">When casting Basic Attack <span class="Highlight">"Incarnation - Basic Attack"</span> or Resonance Skill <span class="Highlight">Crescent Divinity</span>, Jinhsi gains one stack of <span class="Highlight">Herald of Revival</span>, stacking up to 4 times and lasting for 6s. When casting Resonance Skill <span class="Highlight">Illuminous Epiphany</span>, Jinhsi consumes all stacks of <span class="Highlight">Herald of Revival</span>. Each stack increases the damage of Resonance Skill <span class="Highlight">Illuminous Epiphany</span> by 20%.</span>`,
    hasStacks: true,
    modifiers: [
      {
        modifySpecificTalents: ["SolarFlareDMG", "StarGlamourDMG"],
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 4,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2ChronofrostRepose",
    name: "Sequence Node 2: Chronofrost Repose",
    details: `<span class="skilldescription">Jinhsi restores 50 Incandescence while staying out of combat for more than 4s. This effect can only be triggered 1 time(s) every 4s.</span>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3CelestialIncarnate",
    name: "Sequence Node 3: Celestial Incarnate",
    details: `<span class="skilldescription">Jinhsi gains one stack of <span class="Highlight">Immortal's Descendancy</span> after casting Intro Skill <span class="Highlight">Loong's Halo</span>. Each stack of <span class="Highlight">Immortal's Descendancy</span> increases Jinhsi's ATK by 25%, stacking up to 2 time(s) and lasting for 20s.</span>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 2,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4BenevolentGrace",
    name: "Sequence Node 4: Benevolent Grace",
    details: `<span class="skilldescription">When Jinhsi casts Resonance Liberation <span class="Highlight">Purge of Light</span> or Resonance Skill <span class="Highlight">Illuminous Epiphany</span>, all nearby Resonators on the team gain 20% Attribute DMG Bonus for 20s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "AllElementAttributeBonus",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5FrostfireIllumination",
    name: "Sequence Node 5: Frostfire Illumination",
    details: `<span class="skilldescription">The DMG Multiplier of Resonance Liberation <span class="Highlight">Purge of Light</span> is increased by 120%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["PurgeOfLight"],
        modifierValue: 1.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6ComesSpringwhenChillExhausts1",
    name: "Sequence Node 6: Thawing Triumph",
    details: `<span class="skilldescription">The DMG Multiplier of Resonance Skill <span class="Highlight">Illuminous Epiphany</span> is increased by 45% and the additional DMG Multiplier gained by consuming Incandescence is increased by 45%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["SolarFlareDMG", "StarGlamourDMG"],
        modifierValue: 0.45,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
