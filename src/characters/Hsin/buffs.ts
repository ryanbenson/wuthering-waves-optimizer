export const buffs = [
  {
    key: `InherentSkillTidesOfSuccessionUnison`,
    name: `Inherent Skill: Tides of Succession`,
    stance: "Unison",
    details: `<div>While in <span style="color:#ffd12f;" class="font-bold">Resonance Mode - Unison</span>, when Hsin casts <span style="color:#ffd12f;" class="font-bold">Intro Skill - Answering Form: Manifold Unison</span> or <span style="color:#ffd12f;" class="font-bold">Intro Skill - Illumining Form: Manifold Unison</span>, She gains 40% Electro DMG Bonus for 8s. Switching to another Resonator ends this effect.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Electro",
        modifierValue: 0.4,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillTidesOfSuccessionElectroFlare`,
    name: `Inherent Skill: Tides of Succession`,
    stance: "Electro Flare",
    details: `<div>While in <span style="color:#ffd12f;" class="font-bold">Resonance Mode - Electro Flare</span>, after Resonators in the team inflict <span style="color:#ffd12f;" class="font-bold">Electro Flare</span>, Hsin gains 25% Electro DMG Bonus, stacking up to 2 times. Each Resonator can trigger this effect only once.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Electro",
        modifierValue: 0.25,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillTidesOfSuccessionElectroFlareERover`,
    name: `Inherent Skill: Tides of Succession`,
    stance: "Electro Flare",
    details: `<div>While in <span style="color:#ffd12f;" class="font-bold">Resonance Mode - Electro Flare</span>, after Resonators in the team inflict <span style="color:#ffd12f;" class="font-bold">Electro Flare</span>. In addition, if Rover: Electro is in the same team, when Rover: Electro casts <span style="color:#ffd12f;" class="font-bold">Intro Skill - Thunderous Fury</span>, both Hsin and Rover: Electro gain 20% Electro DMG Bonus for 7s.<br>This effect resets when a Resonator is added to the team or when Hsin switches Resonance Mode.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Electro",
        modifierValue: 0.2,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillGleaningSimpleJoysUnison`,
    name: `Inherent Skill: Gleaning Simple Joys`,
    stance: "Unison",
    details: `<div>While in <span style="color:#ffd12f;" class="font-bold">Resonance Mode - Unison</span>, the maximum stacks of the <span style="color:#ffd12f;" class="font-bold">Unison Boon</span> effect on Resonators in the team are increased by 1. When a Resonator in the team triggers <span style="color:#ffd12f;" class="font-bold">Unison Response</span>, all Resonators in the team gain 1 stacks of <span style="color:#ffd12f;" class="font-bold">Unison Boon</span> for 30s. This effect can only grant up to 1 stacks of <span style="color:#ffd12f;" class="font-bold">Unison Boon</span>.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillGleaningSimpleJoysElectroFlare`,
    name: `Inherent Skill: Gleaning Simple Joys`,
    stance: "Electro Flare",
    details: `<div>While in <span style="color:#ffd12f;" class="font-bold">Resonance Mode - Electro Flare</span> and Hsin is not in the <span style="color:#ffd12f;" class="font-bold">Heart Manifest</span> state, Hsin gains 1 stack of <span style="color:#ffd12f;" class="font-bold">Thunderglow</span> after Resonators in the team other than Hsin inflict <span style="color:#ffd12f;" class="font-bold">Electro Flare</span>, stacking up to 10 times.<br>While Hsin is in the <span style="color:#ffd12f;" class="font-bold">Heart Manifest</span> state, when targets within a certain range around the active Resonator have 0 stacks of <span style="color:#ffd12f;" class="font-bold">Electro Flare</span>, inflict 1 stack of <span style="color:#ffd12f;" class="font-bold">Electro Flare</span> on the targets. If <span style="color:#ffd12f;" class="font-bold">Thunderglow</span> on Hsin reaches the stack limit, Hsin also inflicts <span style="color:#ffd12f;" class="font-bold">Fleeting Thunder</span> on the targets:<br>- When Hsin inflicts <span style="color:#ffd12f;" class="font-bold">Fleeting Thunder</span> on the target, she also inflicts <span style="color:#ffd12f;" class="font-bold">Electro Flare</span> on the target to the stack limit, up to 16 stacks of <span style="color:#ffd12f;" class="font-bold">Electro Flare</span>.<br>- When <span style="color:#ffd12f;" class="font-bold">Fleeting Thunder</span> is active, if the maximum stacks of <span style="color:#ffd12f;" class="font-bold">Electro Flare</span> on the target are increased, Hsin will inflict <span style="color:#ffd12f;" class="font-bold">Electro Flare</span> on the target to the stack limit again, up to 16 stacks of <span style="color:#ffd12f;" class="font-bold">Electro Flare</span>.<br>- When <span style="color:#ffd12f;" class="font-bold">Fleeting Thunder</span> is active, the <span style="color:#ffd12f;" class="font-bold">Electro Flare</span> stacks on the target will not be reduced when automatically triggered.<br>- <span style="color:#ffd12f;" class="font-bold">Fleeting Thunder</span> will be removed when the target leaves the designated range around Hsin.<br>Exiting the <span style="color:#ffd12f;" class="font-bold">Heart Manifest</span> state or switching Resonance Mode removes the effects mentioned above.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `ResonanceModeElectroFlareHeartOfThunderInstantDMG`,
    name: `Resonance Mode - Electro Flare: Heart of Thunder (Instant)`,
    stance: "Electro Flare",
    details: `<div>While in <span style="color:#ffd12f;" class="font-bold">Resonance Mode - Electro Flare</span>, when <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Illumining Form</span> hits a target, if Hsin has at least 5 stacks of <span style="color:#ffd12f;" class="font-bold">Heart of Thunder</span>, consume 5 stacks to trigger 1 instance of <span style="color:#ffd12f;" class="font-bold">Electro Flare</span> DMG, with its DMG Multiplier equal to 200% times the <span style="color:#ffd12f;" class="font-bold">Electro Flare</span> DMG Multiplier corresponding to the target's current <span style="color:#ffd12f;" class="font-bold">Electro Flare</span> stacks.<br>Uses the target's current Electro Flare stacks from the Enemy panel by default; add this attack to a rotation action to override with a specific "Stacks" value instead.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["ResonanceModeElectroFlareHeartOfThunderInstantDMG"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `ResonanceModeElectroFlareHeartOfThunderDelayedDMG`,
    name: `Resonance Mode - Electro Flare: Heart of Thunder (Delayed)`,
    stance: "Electro Flare",
    details: `<div>Some time after casting <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Illumining Form</span> while in <span style="color:#ffd12f;" class="font-bold">Resonance Mode - Electro Flare</span>, Hsin consumes all remaining stacks of <span style="color:#ffd12f;" class="font-bold">Heart of Thunder</span> at once to trigger 1 instance of <span style="color:#ffd12f;" class="font-bold">Electro Flare</span> DMG, with its DMG Multiplier equal to 40% times the number of <span style="color:#ffd12f;" class="font-bold">Heart of Thunder</span> stacks consumed this time, times the <span style="color:#ffd12f;" class="font-bold">Electro Flare</span> DMG Multiplier corresponding to the target's current <span style="color:#ffd12f;" class="font-bold">Electro Flare</span> stacks.</div>`,
    hasStacks: true,
    // EnableAttack + heartOfThunderStacks are handled unconditionally in
    // computeSelfBuffs (stats.ts) so this attack stays enabled even at 0
    // stacks, instead of the generic hasStacks stacks<=0 skip.
    modifiers: [],
    minStacks: 0,
    maxStacks: 100,
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
  },
  {
    key: `UnisonBoon`,
    name: `Unison Boon`,
    details: `<div>Each stack of <span style="color:#ffd12f;" class="font-bold">Unison Boon</span> increases the total DMG Hsin deals by 3%, stacking up to 2 times.</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "TotalDamage",
        modifierValue: 0.03,
      },
    ],
    minStacks: 0,
    maxStacks: 2,
    alwaysEnabled: false,
  }
];
