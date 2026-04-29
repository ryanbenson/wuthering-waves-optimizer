export const buffs = [
  {
    key: `InherentSkillFineSnow`,
    name: `Inherent Skil: Fine Snow`,
    details: `<div>When a Resonator in the team applies <span style="color:#f7ca2f"><strong><a href="#WwLink850010" data-ww-link-id="850010">Glacio Chafe</a></strong></span> or <span style="color:#f7ca2f"><strong><a href="#WwLink850012" data-ww-link-id="850012">Havoc Bane</a></strong></span>, Hiyuki gains 1 stack of <span style="color:#f7ca2f"><strong>Snow Rust</strong></span>. <span style="color:#f7ca2f"><strong>Snow Rust</strong></span> stacks up to 3 times. Each Resonator can trigger this effect only once in this way.<br>Based on Hiyuki's current stacks of <span style="color:#f7ca2f"><strong>Snow Rust</strong></span>, the following bonuses are unlocked:<br>1 stack of <span style="color:#f7ca2f"><strong>Snow Rust</strong></span>: When Hiyuki is the active Resonator in the team, <span style="color:#f7ca2f"><strong><a href="#WwLink110809" data-ww-link-id="110809">Glacio Bite</a> DMG</strong></span> is Amplified by 30% against targets within a certain range. Hiyuki's Crit. DMG is increased by 40%.<br>2 stacks of <span style="color:#f7ca2f"><strong>Snow Rust</strong></span>: When Hiyuki is the active Resonator in the team, each time she applies <span style="color:#f7ca2f"><strong><a href="#WwLink850010" data-ww-link-id="850010">Glacio Chafe</a></strong></span>, she additionally deals 102% <span style="color:#f7ca2f"><strong><a href="#WwLink110809" data-ww-link-id="110809">Glacio Bite</a> DMG</strong></span> once.<br>3 stacks of <span style="color:#f7ca2f"><strong>Snow Rust</strong></span>: When Hiyuki is the active Resonator in the team,<span style="color:#f7ca2f"><strong><a href="#WwLink110809" data-ww-link-id="110809">Glacio Bite</a> DMG</strong></span> is additionally Amplified by 30% against targets within a certain range.<br>This effect resets when new Resonators are added to the team.</div>`,
    hasStacks: true,
    modifiers: [],
    minStacks: 0,
    maxStacks: 3,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillEphemeralRealm`,
    name: `Inherent Skill: Ephemeral Realm`,
    details: `<div>Once Hiyuki leaves the combat state or recovers after being knocked out, when she stays out of combat for 4s with has fewer than 1 point of <span style="color:#f7ca2f"><strong><a href="#WwLink110805" data-ww-link-id="110805">Snowforged Blade</a></strong></span>, restore 1 point.</div>`,
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
