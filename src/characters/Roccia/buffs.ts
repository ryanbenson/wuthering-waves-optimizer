export const buffs = [
  {
    key: "FantasyIntoReality",
    name: "Fantasy Into Reality",
    details: `<div class="skilldescription">When Roccia's <span class="Highlight">Crit Rate</span> is above <span class="Highlight">50%</span>, for every additional <span class="Highlight">0.1%</span> critical rate, the 3rd attack of the Basic Attack Fantasy into reality will increase the <span class="Highlight">ATK</span> of all characters in the team by <span class="Highlight">1</span> point, lasting for 30 seconds. This can be increased up to <span class="Highlight">200</span> points.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK_FLAT:AdditionalBase",
        modifierValue: 1,
        maximumValue: 200,
        modifierStep: 0.1,
        modifierBasedOn: "CritRate",
        modifierTargetAttr: "ATK_FLAT",
        minStatValue: 50,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InheritSkillImmersivePerformance",
    name: "Inherit Skill: Immersive Performance",
    details: `<div class="skilldescription">When casting a <span class="Highlight">Resonance Skill</span> or <span class="Highlight">Heavy Attack</span>, Roccia's <span class="Highlight">ATK</span> is increased by <span class="Highlight">20%</span>, lasting for <span class="Highlight">12</span> seconds.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.12,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillEndlessGravityPreciousBox",
    name: "Inherent Skill: Endless Gravity: Precious Box",
    details: `<div class="skilldescription">After casting an <span class="Highlight">Outro Skill</span>, the next character to appear will have their exploration tool replaced by the Precious Box.<br>
<span class="Title">【Precious Box】</span><br>
Using Mystery Box as the center, it pulls surrounding targets and deals <span class="Dark">Havoc</span> damage equal to 20% of the attacking characters' Attack * 5. This damage is considered Exploration Tool damage.<br>
Precious Box lasts for 14 seconds. If switched to another character, the Precious Box will disappear prematurely.</div>`,
    hasStacks: false,
    modifiers: [],
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
