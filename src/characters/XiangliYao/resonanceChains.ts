export const resonanceChains = [
  {
    key: "SequenceNode1ProdigyofProteges",
    name: "Sequence Node 1: Prodigy of Protégés",
    details: `<span class="skilldescription">Resonance Skill <span class="Hightlight">Law of Reigns</span> additionally launches 6 Convolution Matrices at enemies, each dealing Resonance Liberation DMG equal to 8% of the skill's DMG Multiplier.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode1ProdigyofProteges"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2TracesofPredecessors",
    name: "Sequence Node 2: Traces of Predecessors",
    details: `<span class="skilldescription">Casting Resonance Skill or Resonance Liberation <span class="Highlight">Cogitation Model</span> increases Crit. DMG by 30% for 8s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3RuinsofAncient",
    name: "Sequence Node 3: Ruins of Ancient",
    details: `<span class="skilldescription">Casting Resonance Liberation <span class="Highlight"><strong>Cogitation Model</strong></span> increases the DMG of the following Resonance Skill moves by 63% for 24s:<br><span class="Highlight"><strong>Decipher</strong></span>, <span class="Highlight"><strong>Deduction</strong></span>, <span class="Highlight"><strong>Divergence</strong></span>, and <span class="Highlight"><strong>Law of Reigns</strong></span>.<br>This effect can be triggered up to 5 times.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: [
          "DecipherDMG",
          "DeductionSkillDMG",
          "DivergenceDMG",
          "LawofReignsDMG",
          "SequenceNode1ProdigyofProteges",
        ],
        modifierValue: 0.63,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4VesselofRebirth",
    name: "Sequence Node 4: Vessel of Rebirth",
    details: `<span class="skilldescription">Casting Resonance Liberation <span class="Highlight"><strong>Cogitation Model</strong></span> grants a 25% DMG Bonus to all team members' Resonance Liberation for 30s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResonanceLiberationDMGBonus",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5EndofStars",
    name: "Sequence Node 5: End of Stars",
    details: `<span class="skilldescription"> The DMG Multiplier of Outro Skill <span class="Highlight"><strong>Chain Rule</strong></span> is increased by 222%. The DMG Multiplier of Resonance Liberation <span class="Highlight"><strong>Cogitation Model</strong></span> is increased by 100%. </span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "CogitationModelDMG",
          "PivotImpaleStage1DMG",
          "PivotImpaleStage2DMG",
          "PivotImpaleStage3DMG",
          "DivergenceDMG",
          "DodgeAttackUnfathomedDMG",
        ],
        modifierValue: 1,
      },
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["OutroSkillDMG"],
        modifierValue: 2.22,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6SolaceoftheOrdinary",
    name: "Sequence Node 6: Solace of the Ordinary",
    details: `<span class="skilldescription"> The Hypercubes obtained from Resonance Liberation <span class="Highlight"><strong>Cogitation Model</strong></span> are enhanced, increasing the DMG Multiplier of Resonance Skill <span class="Highlight"><strong>Law of Reigns</strong></span> by 76%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "LawofReignsDMG",
          "SequenceNode1ProdigyofProteges",
        ],
        modifierValue: 0.76,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
