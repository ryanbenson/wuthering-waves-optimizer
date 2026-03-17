export const resonanceChains = [
  {
    key: "SequenceNode1TheGleamMeantforRadiance",
    name: "Sequence Node 1: The Gleam Meant for Radiance",
    details: `<div>The DMG Multipliers of <span class="Highlight">Basic Attack - Elucidated</span>, <span class="Highlight">Dodge Counter - Decipher</span>, <span class="Highlight">Resonance Skill - BIG BOOMY BOOM!</span>, and <span class="Highlight">Resonance Skill - Soliskin to the Aid</span> are increased by 70%.<br>Sigrika becomes immune to interruptions while casting <span class="Highlight">Basic Attack - Elucidated</span>, <span class="Highlight">Resonance Skill - BIG BOOMY BOOM!</span>, and <span class="Highlight">Resonance Skill - Soliskin to the Aid</span>.<br><span class="Highlight">Encapsulated</span> now stacks up to 3 times. After casting Outro Skill <span class="Highlight">In This Very Moment</span>, Sigrika obtains 1 additional stacks.</div>`,
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
    details: `<div>The DMG Multiplier of <span class="Highlight">Forte Circuit - Learn My True Name</span> is increased by 120%.<br>
When not in combat for over 4s, Sigrika gains <span class="Highlight">Divergent</span>. This effect is active for up to 1 time every 4s.</div>`,
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
    details: `<div><span class="Highlight">Innate Gift?</span> now stacks up to 4 times and is no longer removed after Sigrika casts <span class="Highlight">Forte Circuit - Learn My True Name</span> or is switched off the field.<br>
All <span class="Highlight">Innate Gift?</span> stacks are removed every 30s that Sigrika stays out of combat.</div>`,
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
    details: `<div>The DMG Multiplier of Resonance Liberation <span class="Highlight">Where Trust Leads Me!</span> is increased by 30%.</div>`,
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
    details: `<div>Targets take 30% more DMG from Sigrika.<br>
<span class="Highlight">Innate Gift?</span> gains following effects:<br>
- Each stack grants <span class="Highlight">Runic Outburst</span>, <span class="Highlight">Runic Chain Whip</span>, <span class="Highlight">Runic Soliskin</span>, and <span class="Highlight">Forte Circuit - Learn My True Name</span> 15% DMG Amplification, up to 60%.<br>
- Each stack causes <span class="Highlight">Runic Outburst</span>, <span class="Highlight">Runic Chain Whip</span>, <span class="Highlight">Runic Soliskin</span>, and <span class="Highlight">Forte Circuit - Learn My True Name</span> to ignore 7.5% of the target's DEF when dealing damage, up to 30%.</div>`,
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
