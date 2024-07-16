export const resonanceChains = [
  {
    key: "SequenceNode2Anatomy",
    name: "Sequence Node 2: Anatomy",
    details: `<span class="skilldescription">When casting Resonance Skill <span class="Highlight">Stroke of Maestro</span>, restore 15 Resonance Energy and increase CRIT Rate by 10% for 25s.</span>`,
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
    key: "SequenceNode3Resemblence",
    name: "Sequence Node 3: Resemblence",
    details: `<span class="skilldescription">When casting Resonance Skill <span class="Highlight">Depiction</span>, Forte Circuit <span class="Highlight">Stroke of Genius</span>, or Forte Circuit <span class="Highlight">Stroke of Maestro</span>, ATK increases by 15%, stacking up to 3 times and lasting for 25s.</span>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 3,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4Hue",
    name: "Sequence Node 4: Hue",
    details: `<span class="skilldescription">When casting Resonance Liberation <span class="Highlight">Spiritful Animation</span>, the ATK of Resonators on the team increases by 20% for 30s.</span>`,
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
    key: "SequenceNode5ProperStructuring",
    name: "Sequence Node 5: Proper Structuring",
    details: `<span class="skilldescription">For every 3 <span class="Highlight">Inklit Spirits</span> summoned by Resonance Liberation <span class="Highlight">Spiritful Animation</span>, 1 extra <span class="Highlight">Inklit Fairy</span> is summoned to perform a Coordinated Attack, dealing 140% of Inklit Spirit's DMG, considered as Basic Attack DMG.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: "SequenceNode5ProperStructuring",
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6ImitationandInheritance",
    name: "Sequence Node 6: Imitation and Inheritance",
    details: `<span class="skilldescription">When casting Resonance Skill <span class="Highlight">Stroke of Genius</span> or Resonance Skill <span class="Highlight">Stroke of Maestro</span>, an extra <span class="Highlight">Fairy Sketch</span> will be summoned to deal 160% of Stroke of Genius' DMG, considered as Basic Attack DMG.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: "SequenceNode6ImitationandInheritance",
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
