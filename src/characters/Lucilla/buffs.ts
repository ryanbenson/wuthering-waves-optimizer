export const buffs = [
  {
    key: `InherentSkillSlowMotion`,
    name: `Inherent Skill: Slow Motion`,
    details: `<div>When <span style="color:#f7ca2f"><strong>Focus Ring</strong></span> is deployed, Lucilla slows targets within her shot.<br>While casting <span style="color:#f7ca2f"><strong>Resonance Skill - Spotlight</strong></span>, Lucilla grants the following enhancements based on her <span style="color:#f7ca2f"><strong>Resonance Mode</strong></span>:<br>- When in <span style="color:#f7ca2f"><strong>Resonance Mode - Glacio Chafe</strong></span>, Glacio RES of targets within a certain range around the active Resonator is reduced by 8% for 30s. If an enemy falls to <span style="color:#f7ca2f"><strong><a href="#WwLink850010" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="850010">Glacio Chafe</a></strong></span> DMG during this time, it counts as caused by the nearest active Resonator.<br>- When in <span style="color:#f7ca2f"><strong>Resonance Mode - Echo</strong></span>, Resonators in the team gain 25% Echo Skill DMG Bonus for 30s.<br>These enhancements end when Lucilla switches the Resonance Mode.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillRemembrance`,
    name: `Inherent Skill: Remembrance`,
    details: `<div><span style="color:#f7ca2f"><strong><a href="#WwLink110903" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="110903">Film Roll</a></strong></span> can now be stacked up to 10 stacks, and <span style="color:#f7ca2f"><strong><a href="#WwLink110904" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="110904">Zoom</a></strong></span> up to 4 stacks.<br>Each time Lucilla consumes <span style="color:#f7ca2f"><strong><a href="#WwLink110902" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="110902">Photo</a></strong></span> when in <span style="color:#f7ca2f"><strong>Resonance Mode - Glacio Chafe</strong></span>/<span style="color:#f7ca2f"><strong>Resonance Mode - Echo</strong></span>, she gains 2 stacks of <span style="color:#f7ca2f"><strong><a href="#WwLink110903" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="110903">Film Roll</a></strong></span>/1 stack of <span style="color:#f7ca2f"><strong><a href="#WwLink110904" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="110904">Zoom</a></strong></span>.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Spectro",
        modifierValue: 0.25,
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
