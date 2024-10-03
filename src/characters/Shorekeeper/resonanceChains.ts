export const resonanceChains = [
  {
    key: "SequenceNode2NightsGiftandRefusal",
    name: "Sequence Node 2: Night's Gift and Refusal",
    details: `<span class="skilldescription">The <span class="Highlight">Outer Stellarealm</span> now increases the ATK of all team members by 40%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4OverflowingQuietude",
    name: "Sequence Node 4: Overflowing Quietude",
    details: `<span class="skilldescription">Gain 70% additional Healing Bonus when casting Resonance Skill <span class="Highlight">Chaos Theory</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifySpecificTalents: ["ChaosTheoryHealing"],
        modifierValue: 0.7,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6TotheNewWorldThusProved",
    name: "Sequence Node 6: To the New World",
    details: `<span class="skilldescription">When casting Intro Skill <span class="Highlight">Thus Proved</span>, Chain Intro Skill <span class="Highlight">Discernment</span> Multiplier is increased by 42%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["DiscernmentDMG"],
        modifierValue: 0.42,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6TotheNewWorldCritDMG",
    name: "Sequence Node 6: To the New World",
    details: `<span class="skilldescription">When casting Chain Intro Skill <span class="Highlight">Discernment</span>, the Shorekeeper's Crit. DMG is increased by 500%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifySpecificTalents: ["DiscernmentDMG"],
        modifierValue: 5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
