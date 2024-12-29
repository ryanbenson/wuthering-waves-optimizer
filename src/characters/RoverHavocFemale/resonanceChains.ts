export const resonanceChains = [
  {
    key: "SequenceNode1CrypticInsight",
    name: "Sequence Node 1: Cryptic Insight",
    details: `<span class="skilldescription">Resonance Skill DMG Bonus is increased by 30%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResonanceSkillDMGBonus",
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4AnnihilatedSilence",
    name: "Sequence Node 4: Annihilated Silence",
    details: `<span class="skilldescription">Heavy Attack <span class="Highlight">Devastation</span> and Resonance Liberation <span class="Highlight">Deadening Abyss</span> reduces enemy Havoc RES by 10% for 20s on hit.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResistShred:Havoc",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5AeonSymphony",
    name: "Sequence Node 5: Aeon Symphony",
    details: `<span class="skilldescription">In the <span class="Highlight">Dark Surge</span> state, <span class="Highlight">Basic Attack 5</span> deals an additional <span class="Dark">Havoc damage</span> equal to 50% of <span class="Highlight">Basic Attack 5</span> damage.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode5AeonSymphony"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6EbbingUndercurrent",
    name: "Sequence Node 6: Ebbing Undercurrent",
    details: `<span class="skilldescription">In the <span class="Highlight">Dark Surge</span> state, Rover's Crit. Rate is increased by 25%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifySpecificTalents: [
          "DevastationDamage",
          "UmbraBasicAttack1DMG",
          "UmbraBasicAttack2DMG",
          "UmbraBasicAttack3DMG",
          "UmbraBasicAttack4DMG",
          "UmbraBasicAttack5DMG",
          "UmbraHeavyAttackDMG",
          "UmbraThwackbladeDamage",
          "UmbraPlungingAttackDMG",
          "UmbraDodgeCounterDMG",
          "UmbraLifetakerDamage",
          "SequenceNode5AeonSymphony",
          "DeadeningAbyssSkillDMG",
        ],
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
