export const buffs = [
  {
    key: `SeraphicDuetTuneRupture`,
    name: `Seraphic Duet - Tune Rupture Mode`,
    details: `<div>- In Resonance Mode - Tune Rupture, casting Resonance Skill Seraphic Duet additionally deals 5 instances of Tune Rupture DMG, each time on a random target within the range. The target's Off-Tune Level does not affect these instances of Tune Rupture DMG. When Seraphic Duet deals damage, remove the target's Rupturous Trail and increases the DMG Multiplier of Tune Rupture based on the number of stacks removed, each stack increasing the DMG Multiplier by 4% for 2.5s.</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["TuneBreakDMG", "TuneRuptureResponseStarburstDMG", "SeraphicDuetBonusDMGPerInstance"],
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
    details: `<div>- In Resonance Mode - Fusion Burst, when Resonance Skill Seraphic Duet hits the target, if they are inflicted with Fusion Trail, remove the Fusion Trail stacks, and trigger the Fusion Burst on the target based on its max stack limit without removing its stacks. Each stack of Fusion Trail removed increases the DMG Multiplier of Fusion Burst on the main target by 10%.</div>`,
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
    details: `<div>- In Resonance Mode - Fusion Burst, the DMG Multiplier of Fusion Burst triggered by Resonance Skill Seraphic Duet on the main target is additionally increased by 200%. The DMG Multiplier increase effect is stackable with that provided by Fusion Trail.</div>`,
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
    details: `<div>In Instant Response, Heavy Attack - Aemeath and Heavy Attack - Mech gain 200% DMG Amplification.</div>`,
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
    details: `<div>In Resonance Mode - Tune Rupture, when Resonators in the team inflict Tune Rupture - Shifting or deal Tune Rupture DMG, Aemeath's Crit. DMG increases by 20%, up to 3 times. Each Resonator can only trigger this effect once.
With 3 stacks, Resonance Liberation Heavenfall Edict: Finale DMG is Amplified by 25%.
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
    name: `Inherent Skill: Between the Stars - FusionBurst`,
    details: `<div>In Resonance Mode - Fusion Burst, when Resonators in the team inflict Fusion Burst, Aemeath's Crit. DMG increases by 30%, up to 2 times. Each Resonator can only trigger this effect once.
With 2 stacks, Resonance Liberation Heavenfall Edict: Finale DMG is Amplified by 25%.
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
