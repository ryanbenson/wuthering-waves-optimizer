export const buffs = [
  {
    key: `RulersRealm`,
    name: `Ruler's Realm`,
    details: `<div class="skilldescription">When Resonators in the team cast <span class="Highlight">Intro Skill</span> within <span class="Highlight">Ruler's Realm</span>, they gain a shield equal to 650 + 5% of Augusta's Max HP for 10s. This effect is unstackable. This Shield will not be passed on to the incoming Resonator.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["RulersRealm"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `CrownofWills`,
    name: `Crown of Wills`,
    details: `<div class="skilldescription">Each stack grants 15% Electro DMG Bonus, up to 1 stack. When <span class="Highlight">Resonance Liberation - Sublime is the Sun: Everbright Protector</span> ends, all stacks of Crown of Wills are removed.</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "Electro",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 1,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillGlorysFavor`,
    name: `Inherent Skill: Glory's Favor`,
    details: `<div class="skilldescription">When Augusta deals damage, she gains a shield equal to 350 + 2.5% of her Max HP for 5s, triggered once every 0.5s. This effect is unstackable. This Shield will not be passed on to the incoming Resonator.</span>.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["InherentSkillGlorysFavor"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillBlazingValor`,
    name: `Inherent Skill: Blazing Valor`,
    details: `<div class="skilldescription">When Augusta is out of combat for over 4s, she gains the following effects that can be triggered once every 4s:<br>
- If Majesty is less than 1 stack, restore 1 stack.<br>
- Fully restore Crown of Wills.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
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
