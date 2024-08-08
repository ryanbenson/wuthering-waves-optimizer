export const resonanceChains = [
  {
    key: "SequenceNode1ProdigyofProteges",
    name: "Sequence Node 1: Prodigy of Protégés",
    details: `<span class="skilldescription">When casting the resonance skill Law of Reigns, it will cause 6 additional damages, each damage is 8% of the resonance skill Law of Reigns.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: "SequenceNode1ProdigyofProteges",
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2TracesofPredecessors",
    name: "Sequence Node 2: Traces of Predecessors",
    details: `<span class="skilldescription">When casting Resonance Skill <span class="Highlight">Deduction</span> or Resonance Liberation <span class="Highlight">Cogitation Model</span>, increase Crit. Rate by 30%, lasting for 8 seconds.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
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
    details: `<span class="skilldescription">After casting Resonance Liberation <span class="Highlight">Cogitation Model</span>, the subsequent 5 casts of Resonance Skills gain 63% DMG Bonus.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResonanceSkillDMGBonus",
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
    details: `<span class="skilldescription">After casting Resonance Liberation <span class="Highlight">Cogitation Model</span>, all team members' Resonance Liberation gains 25% DMG Bonus for 30s.</span>`,
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
    details: `<span class="skilldescription">Outro Skill gains an additional DMG Multiplier of 170%. Resonance Liberation's DMG Multiplier is increased by 120%.</span>`,
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
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6ScentsofMortalLife",
    name: "Sequence Node 6: Scents of Mortal Life",
    details: `<span class="skilldescription">Enhance the Hypercubes obtained from Resonance Liberation <span class="Highlight">Cogitation Model</span>, increasing the DMG Multiplier of Resonance Skill <span class="Highlight">Law of Reigns</span> by 76%.</span>`,
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
