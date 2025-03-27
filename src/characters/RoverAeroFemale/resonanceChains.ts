export const resonanceChains = [
  {
    key: "SequenceNode1StormSubsidesintheVoid",
    name: "Sequence Node 1: Storm Subsides in the Void",
    details: `<span class="skilldescription">Casting Mid-air Attack <span class="Highlight">Cloudburst Dance</span> enhances Rover's resistance to interruption for 3s.</span>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2GlimmersFadeintotheDark",
    name: "Sequence Node 2: Glimmers Fade into the Dark",
    details: `<span class="skilldescription">Casting Resonance Skill <span class="Highlight">Unbound Flow</span> continuously restores HP for the Resonator on the field by 20% of Rover's ATK every 3s for 30s. When the Resonator on the field has an HP lower than 35%, immediately restore 10% of their lost HP. This restoration effect can be triggered once every 10s and will not be affected by any Healing Bonus.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode2GlimmersFadeintotheDarkHeal1"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3IllusionsCollapseinaGrip",
    name: "Sequence Node 3: Illusions Collapse in a Grip",
    details: `Aero DMG Bonus is increased by 15%.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Aero",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4BoundariesShatterinanInstant",
    name: "Sequence Node 4: Boundaries Shatter in an Instant",
    details: `<span class="skilldescription">Casting Mid-air Attack <span class="Highlight">Cloudburst Dance</span> increases Resonance Skill DMG Bonus by 15% for 5s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResonanceSkillDMGBonus",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "Sequence Node 5: Life and Death Intertwine",
    name: "Sequence Node 5: Life and Death Intertwine",
    details: `<span class="skilldescription">The DMG Multiplier of Resonance Liberation <span class="Highlight">Omega Storm</span> is increased by 20%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["OmegaStormDMG"],
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6AllCrumbleintheWind",
    name: "Sequence Node 6: All Crumble in the Wind",
    details: `<span class="skilldescription">The DMG Multiplier of Resonance Skill <span class="Highlight">Unbound Flow</span> is increased by 30%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["UnboundFlowStage1DMG", "UnboundFlowStage2DMG"],
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
