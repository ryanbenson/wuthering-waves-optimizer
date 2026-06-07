export const buffs = [
  {
    key: `SwitchGearsHuntress`,
    name: `Switch Gears! - Huntress`,
    details: `<div>Upon casting <span style="color:#f7ca2f"><strong>Resonance Skill</strong></span> or <span style="color:#f7ca2f"><strong>Intro Skill</strong></span>, Rebecca can freely switch between the <span style="color:#f7ca2f"><strong>Huntress</strong></span> and <span style="color:#f7ca2f"><strong>Guts</strong></span> modes.
- The <span style="color:#f7ca2f"><strong>Huntress</strong></span> mode increases Rebecca's Crit. DMG by 30%.
By default, Rebecca starts in the Huntress mode.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SwitchGearsGuts`,
    name: `Switch Gears! - Guts`,
    details: `<div>Upon casting <span style="color:#f7ca2f"><strong>Resonance Skill</strong></span> or <span style="color:#f7ca2f"><strong>Intro Skill</strong></span>, Rebecca can freely switch between the <span style="color:#f7ca2f"><strong>Huntress</strong></span> and <span style="color:#f7ca2f"><strong>Guts</strong></span> modes.
- The <span style="color:#f7ca2f"><strong>Guts</strong></span> mode allows Rebecca to ignore 15% of the target's DEF.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEFIgnore",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `PreemChoomLucy`,
    name: `Preem Choom`,
    details: `<div>Lucy can enhance the turret, increasing its DMG Multiplier by 250%, but its on-field duration will be lowered to 4s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["PreemChoomDMG"],
        modifierValue: 2.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillTagYoureIt`,
    name: `Inherent Skill: Tag, You're It!`,
    details: `<div>ATK is increased by 10% for 12s when <span style="color:#f7ca2f"><strong><a href="#WwLink130804" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="130804">A Girl Gets What She Wants!</a></strong></span> is triggered, or when <span style="color:#f7ca2f"><strong>Heavy Attack - Rat-tat-tat!: Huntress</strong></span> or <span style="color:#f7ca2f"><strong>Heavy Attack - Bang-bang-bang!: Guts</strong></span> is cast, stacking up to 2 times. <br>When a Resonator in the team inflicts <span style="color:#f7ca2f"><strong><a href="#WwLink151101" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151101">Hack - Shifting</a></strong></span>, their Tune Break Boost is increased by 30 for 30s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillTagYoureItTuneBreakBoost`,
    name: `Inherent Skill: Tag, You're It! - Tune Break Boost`,
    details: `<div>When a Resonator in the team inflicts <span style="color:#f7ca2f"><strong><a href="#WwLink151101" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151101">Hack - Shifting</a></strong></span>, their Tune Break Boost is increased by 30 for 30s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "tuneBreakBoost",
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillLeftanOpening`,
    name: `Inherent Skill: Left an Opening!`,
    details: `<div><span style="color:#f7ca2f"><strong>Heavy Attack - Rat-tat-tat!: Huntress</strong></span> and <span style="color:#f7ca2f"><strong>Heavy Attack - Bang-bang-bang!: Guts</strong></span> gain increased Resistance to Interruption.<br>When Rebecca casts <span style="color:#f7ca2f"><strong>Resonance Liberation - Party 'til Dawn!</strong></span>, the ATK of all nearby Resonators in the team is increased by 20% for 30s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.2,
      },
    ],
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
