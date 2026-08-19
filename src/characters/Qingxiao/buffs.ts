export const buffs = [
  {
    key: `BasicAttackEphemeralTranscendence`,
    name: `Basic Attack: Ephemeral Transcendence`,
    details: `<div>Press repeatedly or hold Normal Attack to unleash up to 4 consecutive strikes, dealing <span style="color:#ffd12f;" class="font-bold">Aero DMG</span>.
Before <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Heaven's Reckoning: Ephemeral Transcendence</span> is unlocked, this skill gains a 100% DMG Multiplier increase.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "BasicAttackEphemeralTranscendenceStage1DMG",
          "BasicAttackEphemeralTranscendenceStage2DMG",
          "BasicAttackEphemeralTranscendenceStage3DMG",
          "BasicAttackEphemeralTranscendenceStage4DMG",
        ],
        modifierValue: 1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `DodgeCounterEphemeralTranscendence`,
    name: `Dodge Counter - Ephemeral Transcendence`,
    details: `<div>Pressing <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> within a certain time after a successful <span style="color:#ffd12f;" class="font-bold">Dodge</span> will strike the target, dealing <span style="color:#ffd12f;" class="font-bold">Aero DMG</span>.
Before <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Heaven's Reckoning: Ephemeral Transcendence</span> is unlocked, this skill gains a 100% DMG Multiplier increase.
Can be cast while in mid-air.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "DodgeCounterEphemeralTranscendenceDMG",
        ],
        modifierValue: 1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `Mindlock`,
    name: `Mindlock`,
    details: `<div>Mindlock has a maximum of 15 stacks.
When Resonators in the team inflict <span style="color:#ffd12f;" class="font-bold">Tune Strain - Interfered</span>, apply 1 stack of <span style="color:#ffd12f;" class="font-bold">Mindlock</span> to the target.
For each stack of <span style="color:#ffd12f;" class="font-bold">Mindlock</span> on the target, DMG taken by the target from the following Qingxiao skills is Amplified by 2%. This effect increases by 5% per stack for the first 7 stacks.
- <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stringblade</span>, <span style="color:#ffd12f;" class="font-bold">Basic Attack - Ephemeral Transcendence</span>, <span style="color:#ffd12f;" class="font-bold">Dodge Counter - Ephemeral Transcendence</span>, <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Heaven's Reckoning: Ephemeral Transcendence</span>, <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Billows Beneath Heaven</span>.</div>`,
    hasStacks: true,
    modifiers: [],
    minStacks: 0,
    maxStacks: 15,
    alwaysEnabled: false,
  },
  {
    key: `HeavensClarity`,
    name: `Heavens Clarity`,
    details: `<div>Upon entering combat or casting <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Billows Beneath Heaven</span>, gain <span style="color:#ffd12f;" class="font-bold">Heavens Clarity</span>.
- When casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stringblade</span>, apply 2 stacks of <span style="color:#ffd12f;" class="font-bold">Mindlock</span> to nearby targets. The DMG Multiplier of the next <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Heaven's Reckoning: Ephemeral Transcendence</span> is increased by 100%. Switching to another Resonator ends DMG Multiplier increase effect.
Casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Heaven's Reckoning: Ephemeral Transcendence</span> removes <span style="color:#ffd12f;" class="font-bold">Heavens Clarity</span>.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "HeavenSReckoningEphemeralTranscendenceDMG",
        ],
        modifierValue: 1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillSeaOfThoughtWorldOfDust`,
    name: `Inherent Skill: Sea of Thought, World of Dust`,
    details: `<div>Upon entering combat, gain 1 stacks of <span style="color:#ffd12f;" class="font-bold">Gathered Mind</span>.</span><br><br>After damage dealt directly by Resonators in the team defeats a target inflicted with the <span style="color:#ffd12f;" class="font-bold">Mindlock</span> effect:<br>If Qingxiao does not have the <span style="color:#ffd12f;" class="font-bold">Gathered Mind</span> effect, gain <span style="color:#ffd12f;" class="font-bold">Gathered Mind</span> with stacks equal to the target's <span style="color:#ffd12f;" class="font-bold">Mindlock</span> stacks.<br>If Qingxiao already has <span style="color:#ffd12f;" class="font-bold">Gathered Mind</span> and the target's <span style="color:#ffd12f;" class="font-bold">Mindlock</span> stacks are no fewer than Qingxiao's <span style="color:#ffd12f;" class="font-bold">Gathered Mind</span> stacks, update Qingxiao's <span style="color:#ffd12f;" class="font-bold">Gathered Mind</span> stacks to match the target's <span style="color:#ffd12f;" class="font-bold">Mindlock</span> stacks.</span><br><br><span class="Title"><span style="color:#ffd12f;" class="font-bold">Gathered Mind</span></span></span><br><br>After Resonators in the team deal damage to a target, inflict <span style="color:#ffd12f;" class="font-bold">Mindlock</span> equal to Qingxiao's <span style="color:#ffd12f;" class="font-bold">Gathered Mind</span> stacks. This effect can only trigger 1 times on the same target.<br>When Resonators in the team cast <span style="color:#ffd12f;" class="font-bold">Tune Break</span>, if the target has <span style="color:#ffd12f;" class="font-bold">Tune Strain - Shifting</span>, additionally inflict 1 stacks of <span style="color:#ffd12f;" class="font-bold">Tune Strain - Interfered</span> on the target. This effect can only trigger 1 times on the same target.<br>When Qingxiao is knocked out, she can no longer gain <span style="color:#ffd12f;" class="font-bold">Gathered Mind</span>, and any existing <span style="color:#ffd12f;" class="font-bold">Gathered Mind</span> effect becomes inactive.<br><span style="color:#ffd12f;" class="font-bold">Gathered Mind</span> stacks up to 15 times and lasts for 30s.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillToKnowToBanish`,
    name: `Inherent Skill: To Know, To Banish`,
    details: `<div>Qingxiao's following skills deal 2% more DMG per stack of <span style="color:#ffd12f;" class="font-bold">Mindlock</span> on the target, with an additional 5% per stack for the first 7 stacks.<br>- <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stringblade</span>, <span style="color:#ffd12f;" class="font-bold">Basic Attack - Ephemeral Transcendence</span>, <span style="color:#ffd12f;" class="font-bold">Dodge Counter - Ephemeral Transcendence</span>, <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Heaven's Reckoning: Ephemeral Transcendence</span>, <span style="color:#ffd12f;" class="font-bold">Resonance Liberation - Billows Beneath Heaven</span>.</span><br><br>Each time after a Resonator in the team inflicts <span style="color:#ffd12f;" class="font-bold">Tune Strain - Interfered</span> on an Overlord Class or Calamity Class target, additionally inflict 1 stacks of <span style="color:#ffd12f;" class="font-bold">Mindlock</span> on the target.</div>`,
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
