export const resonanceChains = [
  {
    key: "SequenceNode1AbyssalAscension",
    name: "Sequence Node 1: Abyssal Ascension",
    details: `<span class="skilldescription">When Jinhsi casts Basic Attack <span class="Highlight">"Incarnation: Basic Attack"</span> or Resonance Skill <span class="Highlight">"Crescent Divinity"</span>, gain one stack of <span class="Highlight">Herald of Revival</span>, which stacks up to 4 times and last for 6s. When casting Resonance Skill <span class="Highlight">"Illuminous Epiphany"</span>, Jinhsi consumes all stacks of <span class="Highlight">Herald of Revival</span>. Each stack increases the DMG of Resonance Skill <span class="Highlight">"Illuminous Epiphany"</span> by 20%.</span>`,
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
    key: "SequenceNode3CelestialIncarnate",
    name: "Sequence Node 3: Celestial Incarnate",
    details: `<span class="skilldescription">Jinhsi gains one stack of <span class="Highlight">Immortal's Descendancy</span> after casting Intro Skill <span class="Highlight">Loong's Halo</span>. Each stack of <span class="Highlight">Immortal's Descendancy</span> increases Jinhsi's ATK by 25%, stacking up to 2 time(s) and lasting for 20s</span>.`,
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
    details: `<span class="skilldescription">When casting Resonance Liberation <span class="Highlight">Purge of Light</span> or Resonance Skill <span class="Highlight">Illuminous Epiphany</span>, all nearby Characters in the team gain DMG Bonus for all attributes by 20% for 20s.</span>`,
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
    details: `<span class="skilldescription">The DMG Multiplier of Resonance Liberation <span class="Highlight">Purge of Evil</span> is increased by 120%.</span>`,
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
    name: "Sequence Node 6: Comes Spring when Chill Exhausts",
    details: `<span class="skilldescription">DMG Multiplier percentage for Resonance Skill <span class="Highlight">Illuminous Epiphany</span> is increased by 45%. The multiplier increase brought by Incandescence is additionally increased by 45%.</span>`,
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
