export const resonanceChains = [
  {
    key: "SequenceNode3JawDroppingFeatsLoudandWide",
    name: "Sequence Node 3: Jaw-Dropping Feats, Loud and Wide",
    details: `<span class="skilldescription">During Resonance Liberation <span class="Highlight">Lion's Vigor</span>, Lingyang's Basic Attack DMG Bonus is increased by 20%, and Resonance Skill DMG Bonus increased by 10%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "BasicAttackDMGBonus",
        modifierValue: 0.2,
      },
      {
        modifier: "ResonanceSkillDMGBonus",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4ImmortalsBowinReverenceFlawed",
    name: "Sequence Node 4: Immortals Bow, in Reverence Flawed",
    details: `<span class="skilldescription">Outro Skill <span class="Highlight">Frosty Marks</span> increases the Glacio DMG Bonus of all team members by 20% for 30s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Glacio",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5SevenStarsShineSteppeduponHigh",
    name: "Sequence Node 5: Seven Stars Shine, Stepped upon High",
    details: `<span class="skilldescription">Resonance Liberation <span class="Highlight">Strive: Lion's Vigor</span> additionally deals <span class="Ice">Glacio DMG</span> equal to 200% of Lingyang's ATK.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: "SequenceNode5SevenStarsShineSteppeduponHigh",
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6DemonsTrembleDivinePowerNigh",
    name: "Sequence Node 6: Demons Tremble, Divine Power Nigh",
    details: `<span class="skilldescription">In the Forte Circuit <span class="Highlight">Striding Lion</span> state, during the first 3s after every Resonance Skill <span class="Highlight">Mountain Roamer</span>, the Basic Attack DMG Bonus for Lingyang's next Basic Attack is increased by 100%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "BasicAttackDMGBonus",
        modifierValue: 1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
