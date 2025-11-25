export const buffs = [
  {
    key: `BlessingoftheWanLight`,
    name: `Blessing of the Wan Light`,
    details: `<div class="skilldescription">Gaining a Shield inside the <span class="Highlight">Full Moon Domain</span> domain grants 1 stack of <span class="Highlight">Blessing of the Wan Light</span>. This effect can be triggered once every 0.5s.<br><br>The receiving Resonator gains 4% all DMG Amplification for 10s, stacking up to 10 times. Gaining new stacks resets the duration. This effect ends early if the receiving Resonator is switched off the field.</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "DMGDeepen",
        modifierValue: 0.04,
      },
    ],
    minStacks: 0,
    maxStacks: 10,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillWaxingAscent`,
    name: `Inherent Skill: Waxing Ascent`,
    details: `<div class="skilldescription">Every time Iuno casts Basic Attack, Heavy Attack, Dodge Counter, Resonance Skill, Resonance Liberation, or Intro Skill, she gains 1 Shield equal to 32% of her ATK for 15s. This Shield will not be passed on to the incoming Resonator.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["InherentSkillWaxingAscent"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillDerivation`,
    name: `Inherent Skill: Derivation`,
    details: `<div>When Iuno casts Intro Skill or Resonance Liberation, she immediately gains 5 stacks of <span class="ingame-Highlight"><a onclick="showTermExplan(141002)" class="ingame-term-desc">Blessing of the Wan Light</a></span>.</div>`,
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
