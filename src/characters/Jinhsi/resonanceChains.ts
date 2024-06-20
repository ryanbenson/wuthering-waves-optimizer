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
    details: `<span class="skilldescription">Gain 25% Incandescence and a stack of <span class="Highlight">Immortal's Descendancy</span> after casting Intro Skill <span class="Highlight">Loong's Halo</span>. Every stack of <span class="Highlight">Immortal's Descendancy</span> increases ATK by 25%, for up to 2 stacks, lasting for 20s.</span>`,
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
        modifier: "AllAttributeBonus",
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
        modifier: "ResonanceLiberationDMGBonus",
        modifierValue: 1.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6ComesSpringwhenChillExhausts1",
    name: "Sequence Node 6: Comes Spring when Chill Exhausts: Skill Multiplier",
    details: `<span class="skilldescription">DMG Multiplier percentage for Resonance Skill <span class="Highlight">Illuminous Epiphany</span> is increased by 45%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["SolarFlareDMG", "StarGlamourDMG"],
        modifierValue: 0.45,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6ComesSpringwhenChillExhausts2",
    name: "Sequence Node 6: Comes Spring when Chill Exhausts: Incandescence Buff",
    details: `<span class="skilldescription">The multiplier increase brought by Incandescence is additionally increased by 71%.<br><br>Note: Re-enter your Incandescence stacks. <em>This will be fixed later.</em></span>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "Talent",
        modifierTalentKey: "StarGlamourDMG",
        modifierValue: {
          "1": 0.71,
          "2": 0.71,
          "3": 0.71,
          "4": 0.71,
          "5": 0.71,
          "6": 0.71,
          "7": 0.71,
          "8": 0.71,
          "9": 0.71,
          "10": 0.71,
        },
        modifierValueTalentRef: "forte",
      },
    ],
    minStacks: 0,
    maxStacks: 50,
    alwaysEnabled: false,
  },
];
