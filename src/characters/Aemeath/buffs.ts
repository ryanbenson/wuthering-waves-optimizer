export const buffs = [
  {
    key: `SeraphicDuetTuneRupture`,
    name: `Seraphic Duet - Tune Rupture Mode`,
    details: `<div> In <span class="Highlight">Resonance Mode - Tune Rupture</span>, casting Resonance Skill <span class="Highlight">Seraphic Duet</span> additionally deals 5 instances of <span class="Highlight">Tune Rupture DMG</span>, with each instance dealt to a random target within range. The target's <span class="Highlight">Off-Tune Level</span> does not affect these instances of <span class="Highlight">Tune Rupture DMG</span>. When <span class="Highlight">Seraphic Duet</span> deals damage, remove the target's <span class="Highlight">Rupturous Trail</span> and increase the DMG Multiplier of Tune Rupture based on the number of stacks removed, each stack increasing the DMG Multiplier by 4% for 2.5s.</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [ "TuneRuptureResponseStarburstDMG", "SeraphicDuetBonusDMGPerInstance"],
        modifierValue: 0.04,
      },
    ],
    minStacks: 0,
    maxStacks: 30,
    alwaysEnabled: false,
  },
  {
    key: `SeraphicDuetFusionBurst`,
    name: `Seraphic Duet - Fusion Burst`,
    details: `<div>In <span class="Highlight">Resonance Mode - Fusion Burst</span>, when Resonance Skill <span class="Highlight">Seraphic Duet</span> hits the target, if they are inflicted with <span class="Highlight">Fusion Trail</span>, remove the <span class="Highlight">Fusion Trail</span> stacks, and trigger the <span class="Highlight">Fusion Burst</span> on the target based on its max stack limit without removing its stacks. Each stack of <span class="Highlight">Fusion Trail</span> removed increases the DMG Multiplier of <span class="Highlight">Fusion Burst</span> on the main target by 10%.</div>`,
    hasStacks: true,
    modifiers: [
      // TODO: Implement when we add Fusion Burst
    ],
    minStacks: 0,
    maxStacks: 30,
    alwaysEnabled: false,
  },
  {
    key: `StardustResonance`,
    name: `Stardust Resonance`,
    details: `<div>- In <span class="Highlight">Resonance Mode - Fusion Burst</span>, the DMG Multiplier of <span class="Highlight">Fusion Burst</span> triggered by Resonance Skill <span class="Highlight">Seraphic Duet</span> on the main target is additionally increased by 200%. The DMG Multiplier increase effect is stackable with that provided by <span class="Highlight">Fusion Trail</span>.</div>`,
    hasStacks: true,
    modifiers: [
      // TODO: Implement when we add Fusion Burst
    ],
    minStacks: 0,
    maxStacks: 30,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillBeforeAllSounds`,
    name: `Inherent Skill: Before All Sounds`,
    details: `<div>In <span class="Highlight">Instant Response</span>, <span class="Highlight">Heavy Attack - Aemeath</span> and <span class="Highlight">Heavy Attack - Mech</span> gain 200% DMG Amplification.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGDeepen",
        modifySpecificTalents: [
          "HeavyAttackAemeathChargedIDMG",
          "HeavyAttackAemeathChargedIIDMG",
          "HeavyAttackMechChargedIDMG",
          "HeavyAttackMechChargedIIDMG",
        ],
        modifierValue: 2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillBetweentheStarsTuneRupture`,
    name: `Inherent Skill: Between the Stars - Tune Rupture`,
    details: `<div>In <span class="Highlight">Resonance Mode - Tune Rupture</span>, when Resonators in the team inflict  <span class="Highlight">Tune Rupture - Shifting</span> or deal  <span class="Highlight">Tune Rupture DMG</span>, Aemeath's Crit. DMG increases by 20%, up to 3 times. Each Resonator can only trigger this effect once.
With 3 stacks, Resonance Liberation  <span class="Highlight">Heavenfall Edict: Finale</span> DMG is Amplified by 25%.
Resonators joining the team or switching Resonance Mode resets this effect.</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 3,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillBetweentheStarsFusionBurst`,
    name: `Inherent Skill: Between the Stars - Fusion Burst`,
    details: `<div>In <span class="Highlight">Resonance Mode - Fusion Burst</span>, when Resonators in the team inflict <span class="Highlight">Fusion Burst</span>, Aemeath's Crit. DMG increases by 30%, up to 2 times. Each Resonator can only trigger this effect once.
With 2 stacks, Resonance Liberation <span class="Highlight">Heavenfall Edict: Finale</span> DMG is Amplified by 25%.
Resonators joining the team or switching Resonance Mode resets this effect.</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 2,
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
