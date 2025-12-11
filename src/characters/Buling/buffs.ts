export const buffs = [
  {
    key: `ExorcismSpell`,
    name: `Exorcism Spell`,
    details: `<span>All nearby Resonators in the team have their DMG Amplified by 15% for 30s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGDeepen",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `ThunderSpellYinandYang`,
    name: `Thunder Spell - Yin and Yang`,
    details: `<div><span class="Highlight">Thunder Spell - Yin and Yang</span> grants 10% <span class="Highlight">Resonance Skill</span> DMG Bonus to all active Resonators in the team.</div>`,
    hasStacks: false,
    modifiers: [
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
    key: `ThunderSpellHeavenEarthMind`,
    name: `Thunder Spell - Heaven, Earth, Mind`,
    details: `<div><span class="Highlight">Thunder Spell - Heaven, Earth, Mind</span> grants 25% <span class="Highlight">Resonance Skill</span> DMG Bonus to all active Resonators in the team.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResonanceSkillDMGBonus",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHealingBonus1",
    name: "Stat Bonus: Healing Bonus+",
    details: `<div class="skilldescription">Healing Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHealingBonus2",
    name: "Stat Bonus: Healing Bonus+",
    details: `<div class="skilldescription">Healing Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHealingBonus3",
    name: "Stat Bonus: Healing Bonus+",
    details: `<div class="skilldescription">Healing Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHealingBonus4",
    name: "Stat Bonus: Healing Bonus+",
    details: `<div class="skilldescription">Healing Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
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
