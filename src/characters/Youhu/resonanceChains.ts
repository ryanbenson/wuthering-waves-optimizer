export const resonanceChains = [
  {
    key: "SequenceNode3RestlessSleep",
    name: "Sequence Node 3: Restless Sleep",
    details: `<span class="skilldescription">Youhu's ATK is increased by 20%.</span>`,
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
    key: "SequenceNode5DreamlandMeander",
    name: "Sequence Node 5: Dreamland Meander",
    details: `<span class="skilldescription">When Intro Skill <span class="Highlight">Scroll of Wonders</span> is cast, Youhu's Crit. Rate is increased by 15% for 14s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6SlumberEvermore",
    name: "Sequence Node 6: Slumber Evermore",
    details: `<span class="skilldescription">When casting Resonance Skill <span class="Highlight">Antique Appraisal</span>, gain 1 stack(s) of <span class="Highlight">Sky Blue</span>, stackable up to 4 times, lasting for 7s. Each stack increases Youhu's Crit. DMG by 15%.</span>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 4,
    alwaysEnabled: false,
  },
];
