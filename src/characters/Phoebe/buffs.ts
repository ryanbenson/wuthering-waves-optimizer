export const buffs = [
  {
    key: "Absolution",
    name: "Absolution",
    details: `- <span class="Highlight">Absolution</span> Enhancement: Increase DMG Multiplier by 255% for Dawn of Enlightenment<br>
    - <span class="Highlight">Absolution</span> Enhancement: Increase DMG Multiplier by 255% for Attentive Heart<br>
    - <span class="Highlight">Absolution</span> Enhancement: Reduce the cost of Divine Voice by 15. When the targets hit have <span class="Highlight">Spectro Frazzle</span>, the skill Heavy Attack: Starflash gains 256% DMG Amplification.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["DawnofEnlightenmentDMG", "AttentiveHeartDMG"],
        modifierValue: 2.55,
      },
      {
        modifier: "DMGDeepen",
        modifySpecificTalents: ["HeavyAttackStarflashDMG"],
        modifierValue: 2.56,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "Confession",
    name: "Confession",
    details: `- <span class="Highlight">Confession</span> Enhancement: Grant <span class="Highlight">Silent Prayer</span> to the Resonator on the field, reducing the Spectro RES of nearby targets by 10% and granting 100% <span class="Highlight">Spectro Frazzle</span> DMG Amplification. When <span class="Highlight">Spectro Frazzle</span> inflicts DMG, extend <span class="Highlight">Spectro Frazzle's</span> damage interval by 50%. This effect lasts 30s or until Phoebe switches to <span class="Highlight">Absolution</span> status.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGDeepen:SpectroFrazzle",
        modifierValue: 1,
      },
      {
        modifier: "ResistShred:Spectro",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillPresence",
    name: "Inherent Skill: Presence",
    details: `Mid-air Heavy Attack can be cast 1 more time.`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillRevelation",
    name: "Inherent Skill: Revelation",
    details: `<div class="skilldescription">When in the <span class="Highlight">Absolution</span> status and <span class="Highlight">Confession</span> status, Spectro DMG Bonus is increased by 12%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Spectro",
        modifierValue: 0.12,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritDMG1",
    name: "Stat Bonus: Crit. DMG+",
    details: `<div class="skilldescription">Crit. DMG increased by 2.40%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.024,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritDMG2",
    name: "Stat Bonus: Crit. DMG+",
    details: `<div class="skilldescription">Crit. DMG increased by 2.40%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.024,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritDMG3",
    name: "Stat Bonus: Crit. DMG+",
    details: `<div class="skilldescription">Crit. DMG increased by 5.60%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.056,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritDMG4",
    name: "Stat Bonus: Crit. DMG+",
    details: `<div class="skilldescription">Crit. DMG increased by 5.60%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.056,
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
