export const buffs = [
  {
    key: "InherentSkillLionsPride",
    name: "Inherent Skill: Lion's Pride",
    details: `<div class="skilldescription">DMG of the Intro Skill <span class="Highlight">Lion Awakens</span> is increased by 50%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["LionAwakensDMG"],
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillDiligentPractice",
    name: "Inherent Skill: Diligent Practice",
    details: `<div class="skilldescription">Under the Forte Circuit <span class="Highlight">Striding Lion</span> state, within 3s after each <span class="Highlight">Basic Attack</span>, the next Forte Circuit <span class="Highlight">Mountain Roamer</span> will deal an additional <span class="Ice">Glacio DMG</span>, equal to 150% of <span class="Highlight">Mountain Roamer</span> DMG, considered as Resonance Skill DMG.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["InherentSkillDiligentPractice"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "LionsVigor",
    name: "Lion's Vigor",
    details: `<div class="skilldescription">Lingyang's <span class="Ice">Glacio DMG</span> Bonus is increased by 50%, which lasts for 14 seconds.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Glacio",
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusGlacio1",
    name: "Stat Bonus: Glacio DMG Bonus+",
    details: `<div class="skilldescription">Glacio DMG Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Glacio",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusGlacio2",
    name: "Stat Bonus: Glacio DMG Bonus+",
    details: `<div class="skilldescription">Glacio DMG Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Glacio",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusGlacio3",
    name: "Stat Bonus: Glacio DMG Bonus+",
    details: `<div class="skilldescription">Glacio DMG Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Glacio",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusGlacio4",
    name: "Stat Bonus: Glacio DMG Bonus+",
    details: `<div class="skilldescription">Glacio DMG Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Glacio",
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
