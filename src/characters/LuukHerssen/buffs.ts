export const buffs = [
  {
    key: `AureateJudge`,
    name: `Aureate Judge`,
    details: `<div>With full <span class="Highlight" class="font-bold">Ichor Flow</span>, enter the <span class="Highlight" class="font-bold">Aureate Judge</span> state. In this state, Luuk Herssen gains the following effects:<br>- <span class="Highlight" class="font-bold">Ichor Flow</span> does not restore. The DMG Multipliers of all forms of Resonance Skill <span class="Highlight" class="font-bold">Aureole of Execution</span> increase by 110%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["AureoleofExecutionRingDMG", "AureoleofExecutionBreachDMG", "AureoleofExecutionGlareDMG"],
        modifierValue: 1.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `AureateJudgeGavelofEarthshaker`,
    name: `Aureate Judge - Gavel of Earthshaker`,
    details: `<div>Casting <span class="Highlight" class="font-bold">Aureole of Execution: Glare</span> increases the DMG Multiplier of the next <span class="Highlight" class="font-bold">Mid-air Attack - Gavel of Earthshaker</span> and <span class="Highlight" class="font-bold">Ichor Deposit</span> DMG by 110%.<br>- 100 points of <span class="Highlight" class="font-bold">Ichor Flow</span> is consumed each time Resonance Skill <span class="Highlight" class="font-bold">Aureole of Execution</span> is cast.<br>- <span class="Highlight" class="font-bold">Aureate Judge</span> ends when <span class="Highlight" class="font-bold">Ichor Flow</span> depletes.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["GavelofEarthshakerDMG"],
        modifierValue: 1.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `EndnotesontheEndgame`,
    name: `Endnotes on the Endgame`,
    details: `<div>Increase the DMG Multiplier of Resonance Liberation <span class="Highlight">Rewritten in Winter's Margins</span> by 25%, stacking up to 3 times. Casting <span class="Highlight">Rewritten in Winter's Margins</span> or switching to another Resonator removes all stacks.</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["RewritteninWintersMargins"],
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 3,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillPulsesUndertheSnow`,
    name: `Inherent Skill: Pulses Under the Snow`,
    details: `<div>When Resonators in the team directly damage and defeat targets, if the targets are affected by Tune Strain - Interfered:<br>
- If Luuk Herssen has no Perpetuating Daytime, gain stacks of Perpetuating Daytime equal to the stacks of Tune Strain - Interfered.<br>
- If Luuk Herssen already has Perpetuating Daytime, and the target's stacks of Tune Strain - Interfered exceed the current stacks of Perpetuating Daytime, increase Perpetuating Daytime's stacks to match the target's Tune Strain - Interfered stacks.<br><br><span class="Title">Perpetuating Daytime</span><br>
- When Resonators in the team casts Tune Break, if the target is affected by Tune Strain - Shifting, Luuk Herssen loses all stacks of Perpetuating Daytime, then apply equal stacks of Tune Strain - Interfered on the target, up to the target's current Tune Strain - Interfered stack cap. Cooldown: 1s.<br>
Luuk Herssen loses all stacks of Perpetuating Daytime and will not be able to obtain any new stacks when knocked out.<br>
- Perpetuating Daytime stacks up to 2 times.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillUncausedDiagnosis`,
    name: `Inherent Skill: Uncaused Diagnosis`,
    details: `<div>When Luuk Herssen's skills directly damage targets affected by Tune Strain - Interfered, every 10 points of Tune Break Boost he has Amplifies this instance of damage by 5%, up to 30%.</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "DMGDeepen",
        modifierValue: 0.05,
      },
    ],
    minStacks: 0,
    maxStacks: 6,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillUncausedDiagnosisATK`,
    name: `Inherent Skill: Uncaused Diagnosis`,
    details: `<div>After any nearby Resonator in the team inflicts Tune Strain - Shifting on the enemies or deals Tune Break DMG, Luuk Herssen's ATK increases by 25% for 20s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
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
