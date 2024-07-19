export const buffs = [
  {
    key: "InherentSkillHarmonicControl",
    name: "Inherent Skill: Harmonic Control",
    details:
      `<div class="skilldescription">After casting Resonance Skill <span class="Highlight">Passionate Variation</span>, the damage of Resonance Skill <span class="Highlight">Fury Fugue</span> is increased by 25% for 8s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["FuryFugueDamage"],
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillRhythmicVibrato",
    name: "Inherent Skill: Rhythmic Vibrato",
    details: `<div class="skilldescription">During Resonance Liberation <span class="Highlight">Burning Rhapsody</span>, each hit of Resonance Liberation <span class="Highlight">Marcato</span> will increase the DMG of the next Resonance Liberation <span class="Highlight">Marcato</span> by 1.5%, which can be triggered once every 0.35s, stacking up to 50 times.<br>The effect will be reset after Resonance Liberation <span class="Highlight">Burning Rhapsody</span> ends.</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifySpecificTalents: ["MarcatoDamage", "SequenceNodeFuneraryQuartet"],
        modifierValue: 0.015,
      },
    ],
    minStacks: 0,
    maxStacks: 50,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusFusionDMGBonus1",
    name: "Stat Bonus: Fusion DMG Bonus+",
    details: `<div class="skilldescription">Fusion DMG Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusFusionDMGBonus2",
    name: "Stat Bonus: Fusion DMG Bonus+",
    details: `<div class="skilldescription">Fusion DMG Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusFusionDMGBonus3",
    name: "Stat Bonus: Fusion DMG Bonus+",
    details: `<div class="skilldescription">Fusion DMG Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusFusionDMGBonus4",
    name: "Stat Bonus: Fusion DMG Bonus+",
    details: `<div class="skilldescription">Fusion DMG Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.042,
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
