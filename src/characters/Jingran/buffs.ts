export const buffs = [
  {
    key: `InherentSkillHarkTheDust`,
    name: `Inherent Skill: Hark the Dust`,
    details: `<div>Casting <span style="color:#ffd12f;" class="font-bold">Intro Skill - Question the Tombs</span>, <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Encroaching Yin</span> and <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Scorching Yang</span> grants<span style="color:#ffd12f;" class="font-bold">Earth Charm</span>.<br></span><br><br><span class="Title">Earth Charm</span><br>For 15, if Jingran is the active Resonator in the team, gain an unstackable Shield equal to 1.6% Max HP+700 that lasts for 5s every 0.5s when dealing damage. This Shield will not be passed on to the incoming Resonator.<br>While Jingran is in the <span style="color:#ffd12f;" class="font-bold">Yinghuo</span> state, if he is the active Resonator in the team, he gains a unstackable Shield equal to 0.8% Max HP+350, for 5s. This effect can be triggered once every 0.5s. This Shield will not be passed on to the incoming Resonator.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillTraceTheVestige`,
    name: `Inherent Skill: Trace the Vestige`,
    details: `<div>Upon engaging in combat, if Jingran's <span style="color:#ffd12f;" class="font-bold">Ghost Shroud</span> is below 25 points, restore it to 25 points. This effect can be triggered once every 4s.<br>When nearby Resonators in the team other than Jingran gains a Shield, Jingran gains 2 points of <span style="color:#ffd12f;" class="font-bold">Ghost Shroud</span>. This effect can be triggered once every 0.5s.<br></span><br><br><span class="Title">Fixation</span></span><br><br>Upon engaging in combat, Jingran gains <span style="color:#ffd12f;" class="font-bold">Fixation</span>. This effect can be triggered once every 4s.<br>Casting <span style="color:#ffd12f;" class="font-bold">Outro Skill - Rising Fortune and Ebbing Sha</span> grants <span style="color:#ffd12f;" class="font-bold">Fixation</span>.<br>When nearby Resonators in the team other than Jingran gains a Shield, Jingran gains 15 points of <span style="color:#ffd12f;" class="font-bold">Ghost Shroud</span>, removing <span style="color:#ffd12f;" class="font-bold">Fixation</span>.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `StatBonusCritRate1`,
    name: `Stat Bonus: Crit. Rate+`,
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
    key: `StatBonusCritRate2`,
    name: `Stat Bonus: Crit. Rate+`,
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
    key: `StatBonusCritRate3`,
    name: `Stat Bonus: Crit. Rate+`,
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
    key: `StatBonusCritRate4`,
    name: `Stat Bonus: Crit. Rate+`,
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
    key: `StatBonusHP1`,
    name: `Stat Bonus: HP+`,
    details: `<div class="skilldescription">HP increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HP",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `StatBonusHP2`,
    name: `Stat Bonus: HP+`,
    details: `<div class="skilldescription">HP increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HP",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `StatBonusHP3`,
    name: `Stat Bonus: HP+`,
    details: `<div class="skilldescription">HP increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HP",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `StatBonusHP4`,
    name: `Stat Bonus: HP+`,
    details: `<div class="skilldescription">HP increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HP",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  }
];
