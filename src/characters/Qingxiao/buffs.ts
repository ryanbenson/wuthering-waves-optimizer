export const buffs = [
  {
    key: `InherentSkillSeaOfThoughtWorldOfDust`,
    name: `Inherent Skill: Sea of Thought, World of Dust`,
    details: `<div>When damage dealt directly by Resonators in the team defeats a target with the <span style="color:#ffd12f;" class="font-bold">Mindlock</span> effect:<br>If Qingxiao does not have the <span style="color:#ffd12f;" class="font-bold">Mind Coalescence</span> effect, she gains <span style="color:#ffd12f;" class="font-bold">Mind Coalescence</span> with stacks equal to the target's <span style="color:#ffd12f;" class="font-bold">Mindlock</span> stacks.<br>If Qingxiao already has the <span style="color:#ffd12f;" class="font-bold">Mind Coalescence</span> effect and the target's <span style="color:#ffd12f;" class="font-bold">Mindlock</span> stacks exceed Qingxiao's <span style="color:#ffd12f;" class="font-bold">Mind Coalescence</span> stacks, Qingxiao's <span style="color:#ffd12f;" class="font-bold">Mind Coalescence</span> stacks become equal to the target's <span style="color:#ffd12f;" class="font-bold">Mindlock</span> stacks.<br><size=10></span><br><br><span class="Title"><span style="color:#ffd12f;" class="font-bold">Mind Coalescence</span></span></span><br><br>When Resonators in the team deal <span style="color:#ffd12f;" class="font-bold">Tune Break DMG</span> to a <span style="color:#ffd12f;" class="font-bold">Mistuned</span> target with <span style="color:#ffd12f;" class="font-bold">Tune Strain - Shifting</span>, additionally applies <span style="color:#ffd12f;" class="font-bold">Mindlock</span> equal to Qingxiao's <span style="color:#ffd12f;" class="font-bold">Mind Coalescence</span> stacks, plus 1 stack(s) of <span style="color:#ffd12f;" class="font-bold">Tune Strain - Interfered</span>. This effect can only trigger 1 time(s) on the same target.<br><span style="color:#ffd12f;" class="font-bold">Mind Coalescence</span> lasts for 15s.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillToKnowToBanish`,
    name: `Inherent Skill: To Know, To Banish`,
    details: `<div>The following Qingxiao skills deal increased DMG to targets with <span style="color:#ffd12f;" class="font-bold">Mindlock</span>: increased by 2% per stack, with an additional 5% per stack for the first 7 stacks.<br>- <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stringblade</span>, <span style="color:#ffd12f;" class="font-bold">Basic Attack - Ephemeral Transcendence</span>, <span style="color:#ffd12f;" class="font-bold">Dodge Counter - Ephemeral Transcendence</span>, <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Heaven's Reckoning: Ephemeral Transcendence</span>, <span style="color:#ffd12f;" class="font-bold">Resonance Liberation - Billows Beneath Heaven</span>.<br><size=10></span><br><br>When Resonators in the team apply <span style="color:#ffd12f;" class="font-bold">Tune Strain - Interfered</span> to an Overlord Class or Calamity Class target, additionally applies 1 stack(s) of <span style="color:#ffd12f;" class="font-bold">Mindlock</span> to the target.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `StatBonusCritDMG1`,
    name: `Stat Bonus: Crit. DMG+`,
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
    key: `StatBonusCritDMG2`,
    name: `Stat Bonus: Crit. DMG+`,
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
    key: `StatBonusCritDMG3`,
    name: `Stat Bonus: Crit. DMG+`,
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
    key: `StatBonusCritDMG4`,
    name: `Stat Bonus: Crit. DMG+`,
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
    key: `StatBonusATK1`,
    name: `Stat Bonus: ATK+`,
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
    key: `StatBonusATK2`,
    name: `Stat Bonus: ATK+`,
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
    key: `StatBonusATK3`,
    name: `Stat Bonus: ATK+`,
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
    key: `StatBonusATK4`,
    name: `Stat Bonus: ATK+`,
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
  }
];
