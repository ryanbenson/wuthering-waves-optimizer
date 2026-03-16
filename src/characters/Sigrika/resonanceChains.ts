export const resonanceChains = [
  {
    key: "SequenceNode1TheGleamMeantforRadiance",
    name: "Sequence Node 1: The Gleam Meant for Radiance",
    details: `<div>The DMG Multipliers of Basic Attack - Elucidated, Dodge Counter - Decipher, Resonance Skill - BIG BOOMY BOOM!, and Resonance Skill - Soliskin to the Aid are increased by 70%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "BasicAttackElucidatedDMG",
          "DodgeCounterDecipherDMG",
          "BigBoomyBoomDMG",
          "SoliskintotheAidDMG",
        ],
        modifierValue: 0.7,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2TheBitternessSteepedinHope",
    name: "Sequence Node 2: The Bitterness Steeped in Hope",
    details: `<div>The DMG Multiplier of Forte Circuit - Learn My True Name is increased by 120%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "ForteCircuitLearnMyTrueNameDMG",
        ],
        modifierValue: 1.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3IFleeYetISeek",
    name: "Sequence Node 3: I Flee, Yet I Seek",
    details: `<div>Innate Gift? now stacks up to 4 times</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4ILoseYetIGain",
    name: "Sequence Node 4: I Lose, Yet I Gain",
    details: `<span class="skilldescription">When Resonators in the team cast Echo Skill, Resonators in the team gain an 20% ATK increase for 20s.</span>`,
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
    key: "SequenceNode5UntilSubmergedbytheDark",
    name: "Sequence Node 5: Until Submerged by the Dark",
    details: `<div>The DMG Multiplier of Resonance Liberation Where Trust Leads Me! is increased by 30%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["WhereTrustLeadsMeDMG"],
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6TrueNamesResurfacedRisinginLight",
    name: "Sequence Node 6: True Names Resurfaced, Rising in Light",
    details: `<div>Targets take 30% more DMG from Sigrika.
Innate Gift? gains following effects:
- Each stack grants Runic Outburst, Runic Chain Whip, Runic Soliskin, and Forte Circuit - Learn My True Name 15% DMG Amplification, up to 60%.
- Each stack causes Runic Outburst, Runic Chain Whip, Runic Soliskin, and Forte Circuit - Learn My True Name to ignore 7.5% of the target's DEF when dealing damage, up to 30%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "specialMultiplier",
        modifierValue: .3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
