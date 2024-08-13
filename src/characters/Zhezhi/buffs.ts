export const buffs = [
  {
    key: "CreationsZenith",
    name: "Creation's Zenith",
    details: `<div class="skilldescription">Blink to the location of the Phantasmic Imprint and remove it, then summon a crane spirit to attack the target, dealing greater <span class="Ice">Glacio DMG</span>, considered as Basic Attack DMG, and additionally increasing the Basic Attack DMG Multiplier by 18% for 27s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "NormalAttackStage1DMG",
          "NormalAttackStage2DMG",
          "NormalAttackStage3DMG",
          "NormalAttackMidAirAttackDMG",
          "NormalAttackDodgeCounterDMG",
          "StrokeOfGeniusDMG",
          "CreationsZenithDMG",
          "InklitSpiritDMG",
          "SequenceNode5CompositionsClue",
          "SequenceNode6InfiniteLegacy",
        ],
        modifierValue: 0.18,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillCalligraphersTouch",
    name: "Inherent Skill: Calligrapher's Touch",
    details: `<div class="skilldescription">When casting Resonance Skill <span class="Highlight"><strong>Stroke of Genius</strong></span> or Resonance Skill <span class="Highlight"><strong>Creation's Zenith</strong></span>, ATK is increased by 6% for 27s. This can be stacked up to 3 time(s)./div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.06,
      },
    ],
    minStacks: 0,
    maxStacks: 3,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritRate1",
    name: "Stat Bonus: Crit. Rate+",
    details: `<div class="skilldescription">Crit. Rate increased by 1.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.012,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritRate2",
    name: "Stat Bonus: Crit. Rate+",
    details: `<div class="skilldescription">Crit. Rate increased by 1.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.012,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritRate3",
    name: "Stat Bonus: Crit. Rate+",
    details: `<div class="skilldescription">Crit. Rate increased by 2.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.028,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritRate4",
    name: "Stat Bonus: Crit. Rate+",
    details: `<div class="skilldescription">Crit. Rate increased by 2.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.028,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusATK1",
    name: "Stat Bonus: ATK+",
    details: `<div class="skilldescription">ATK increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusATK2",
    name: "Stat Bonus: ATK+",
    details: `<div class="skilldescription">ATK increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusATK3",
    name: "Stat Bonus: ATK+",
    details: `<div class="skilldescription">ATK increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusATK4",
    name: "Stat Bonus: ATK+",
    details: `<div class="skilldescription">ATK increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
