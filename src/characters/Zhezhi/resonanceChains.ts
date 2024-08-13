export const resonanceChains = [
  {
    key: "SequenceNode1Brushwork'Finish",
    name: "Sequence Node 1: Brushwork's Finish",
    details: `<span class="skilldescription">When casting Resonance Skill <span class="Highlight"><strong>Creation's Zenith</strong></span>, Resonance Energy is restored by 15 and Crit. Rate is increased by 10% for 27s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3ReflectionsGrace",
    name: "Sequence Node 3: Reflection's Grace",
    details: `<span class="skilldescription">When Resonance Skill <span class="Highlight"><strong>Manifestation</strong></span>, Resonance Skill <span class="Highlight"><strong>Stroke of Genius</strong></span>, or Resonance Skill <span class="Highlight"><strong>Creation's Zenith</strong></span> is cast, ATK increases by 15%, stacking up to 3 time(s) for 27s.</span>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 3,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4HuesSpectrum",
    name: "Sequence Node 4: Hue's Spectrum",
    details: `<span class="skilldescription">When Resonance Liberation <span class="Highlight"><strong>Living Canvas</strong></span> is cast, ATK of Resonators on the team increases by 20% for 30s.</span>`,
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
    key: "SequenceNode5CompositionsClue",
    name: "Sequence Node 5: Composition's Clue",
    details: `<span class="skilldescription">For every 3 <span class="Highlight"><strong>Inklit Spirits</strong></span> summoned by Resonance Liberation <span class="Highlight"><strong>Living Canvas</strong></span>, 1 extra <span class="Highlight"><strong>Inklit Spirit</strong></span> is summoned to perform a Coordinated Attack, dealing DMG equal to 140% of Inklit Spirit's DMG, considered as Basic Attack DMG. This damage dealt will not further summon Inklit Spirit.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode5CompositionsClue"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6InfiniteLegacy",
    name: "Sequence Node 6: Infinite Legacy",
    details: `<span class="skilldescription">When Resonance Skill <span class="Highlight"><strong>Stroke of Genius</strong></span> or Resonance Skill <span class="Highlight"><strong>Creation's Zenith</strong></span> is cast, an extra <span class="Highlight"><strong>Ivory Herald</strong></span> will be summoned to deal DMG equal to 120% of Resonance Skill <span class="Highlight"><strong>Stroke of Genius</strong></span>'s DMG, considered as Basic Attack DMG.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode6InfiniteLegacy"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
