export const resonanceChains = [
  {
    key: "SequenceNode2NightsGiftandRefusalHealing",
    name: "Sequence Node 2: Night's Gift and Refusal",
    details: `<span class="skilldescription">When the <span class="Highlight">Flare Star Butterfly</span> hits a target, the Shorekeeper heals herself by 2% of her Max HP.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode2NightsGiftandRefusal"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2NightsGiftandRefusalDmgBonus",
    name: "Sequence Node 2: Night's Gift and Refusal",
    details: `<span class="skilldescription">When the <span class="Highlight">Dim Star Butterfly</span> hits a target, all team members' DMG increases by 3%. This effect stacks up to 5 times, each stack lasts 30s.</span>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "DMGBonus",
        modifierValue: 0.03,
      },
    ],
    minStacks: 0,
    maxStacks: 5,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4OverflowingQuietude",
    name: "Sequence Node 4: Overflowing Quietude",
    details: `<span class="skilldescription">When casting Outro Skill <span class="Highlight">Binary Butterfly</span>, all nearby team members' DMG is amplified by 10%. This effect lasts for 30s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGDeepen",
        modifierValue: 0.1,
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
    details: `<span class="skilldescription">When casting Chain Intro Skill <span class="Highlight">Discernment</span>, the Shorekeeper's Crit. DMG is increased by 200%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifySpecificTalents: ["DiscernmentDMG"],
        modifierValue: 2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
