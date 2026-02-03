export const resonanceChains = [
  {
    key: "SequenceNode1GildedGlimmeroftheFirstDawn",
    name: "Sequence Node 1: Gilded Glimmer of the First Dawn",
    details: `<div>In Instant Response, Heavy Attack - Aemeath and Heavy Attack - Mech gain 300% Crit. DMG increase and continuously pull in nearby target while charging.

When Aemeath remains in the a state that meets all of the following conditions over 4s, she enters Instant Response: Brilliance:
- Out of combat
- Not performing Heavy Attack - Aemeath, Heavy Attack - Mech, and Resonance Liberation Heavenfall Edict: Finale.
Instant Response: Brilliance inherits all effects of Instant Response and remains active even out of the duration of Heavenfall Edict: Unbound.
When not in Heavenfall Edict: Unbound, casting Heavy Attack - Aemeath Charged II or Heavy Attack - Mech Charged II grants 100 points of 【Synchronization Rate】.

In Resonance Mode - Tune Rupture or Resonance Mode - Fusion Burst, when Aemeath defeats a target affected by Rupturous Trail/Fusion Trail, she enters Sealed Trail - Tune Rupture/Sealed Trail - Fusion Burst for 10s.
When Aemeath defeats a target affected by Sealed Trail - Tune Rupture or Sealed Trail - Fusion Burst, record the highest stack count of Rupturous Trail/Fusion Trail among the targets defeated.
Her next skill that directly damages the target immediately inflicts the targets with the recorded stacks of Rupturous Trail/Fusion Trail, up to the current max limit of Rupturous Trail/Fusion Trail. This removes the Sealed Trail - Tune Rupture/Sealed Trail - Fusion Burst on the target and the target cannot be inflicted with Sealed Trail - Tune Rupture or Sealed Trail - Fusion Burst for 1s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifySpecificTalents: [
          "HeavyAttackAemeathChargedIDMG",
          "HeavyAttackAemeathChargedIIDMG",
          "HeavyAttackMechChargedIDMG",
          "HeavyAttackMechChargedIIDMG",
        ],
        modifierValue: 3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2DownyNotesofSnowfluff",
    name: "Sequence Node 2: Downy Notes of Snowfluff",
    details: `<div>The DMG Multiplier of Resonance Skill Seraphic Duet: Overture is increased by 100%.
The DMG Multiplier of Resonance Skill Seraphic Duet: Encore is increased by 100%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["SeraphicDuetOvertureDMG", "SeraphicDuetEncoreDMG"],
        modifierValue: 1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2DownyNotesofSnowfluffTuneRupture",
    name: "Sequence Node 2: Downy Notes of Snowfluff - Tune Rupture",
    details: `<div>While in Resonance Mode - Tune Rupture, when Tune Rupture DMG triggered by Resonance Skill Seraphic Duet hits the same target, the DMG Multiplier of Tune Rupture DMG trigger by Resonance Skill Seraphic Duet is increased by 20% for 1s, stacking up to 5 times.</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["TuneBreakDMG", "TuneRuptureResponseStarburstDMG", "SeraphicDuetBonusDMGPerInstance"],
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 5,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2DownyNotesofSnowfluffFusionBurst",
    name: "Sequence Node 2: Downy Notes of Snowfluff - Fusion Burst",
    details: `<div>While in Resonance Mode - Fusion Burst, gain the following effects:
- In the Stardust Resonance state, the DMG Multiplier of Fusion Burst triggered by Resonance Skill Seraphic Duet is further increased to 400% against the main target of the Fusion Burst.
- When Fusion Trail is removed, the DMG Multiplier of Fusion Burst triggered by Resonance Skill Seraphic Duet is further increased to 15% against the main target of the Fusion Burst per Fusion Trail stack.
- In combat state, when a target near the active Resonator in the team is defeated, immediately trigger the Fusion Burst based on the current stack limit of Fusion Burst on the target.</div>`,
    hasStacks: true,
    modifiers: [
      // TODO: Implement when fusion burst is implemented
    ],
    minStacks: 0,
    maxStacks: 10,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3FervorSightlyBurnsBrightasNew",
    name: "Sequence Node 3: Fervor Sightly Burns Bright as New",
    details: `<div>Resonance Liberation Heavenfall Edict: Finale's DMG Multiplier is increased by 100%.
Resonance Liberation Heavenfall Edict: Overdrive's DMG Multiplier is increased by 40%.

In Instant Response, Aemeath now inflicts Tune Rupture - Shifting or Fusion Burst while casting Heavy Attack - Aemeath Charged II or Heavy Attack - Mech Charged II, based on her current Resonance Mode.

Inherent Skill Between the Stars is replaced with the following effects:

- In Resonance Mode - Tune Rupture, when Resonators in the team inflict Tune Rupture - Shifting or deal Tune Rupture DMG, Aemeath's Crit. DMG is increased by 60%, and Resonance Liberation Heavenfall Edict: Finale DMG is now Amplified by 25%.
Resonators joining the team or switching Resonance Mode resets this effect.

- In Resonance Mode - Fusion Burst, when Resonators in the team inflict Fusion Burst, Aemeath's Crit. DMG is increased by 60%, and Resonance Liberation Heavenfall Edict: Finale DMG is now Amplified by 25%.
Resonators joining the team or switching Resonance Mode resets this effect.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["HeavenfallEdictOverdriveDMG"],
        modifierValue: 0.4,
      },
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["HeavenfallEdictFinaleDMG"],
        modifierValue: 1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4EtherealWaltzonBinaryTides",
    name: "Sequence Node 4: Ethereal Waltz on Binary Tides",
    details: `<span class="skilldescription">When casting Intro Skill Songs Across the Universe, Intro Skill Debut of Meteoric Radiance, Resonance Skill Sync Strike and Resonance Skill Seraphic Duet, Resonators in the team gain 20% All-Attribute DMG Bonus for 30s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "AllElementAttributeBonus",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5VoyagetotheAstralShore",
    name: "Sequence Node 5: Voyage to the Astral Shore",
    details: `<div>When Aemeath's defeats a target directly with her skills, Starflux is reset to 100%.

When taking fatal damage, Aemeath is knocked out and turns into 2D Digital Ghost for 5s.
In the 2D Digital Ghost state, Aemeath grants Resonators in the team a Shield equal to 360% of her ATK for 5. As she exits from the 2D Digital Ghost state, she revives and recovers 100% of her Max HP and 30 points of Resonance Energy. This effect can be triggered once every 10m.
When Aemeath revives, she exits the 2D Digital Ghost state and removes the shield provided.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode5VoyagetotheAstralShore"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6AZephyrKissedJourneytoYou",
    name: "Sequence Node 6: A Zephyr-Kissed Journey to You",
    details: `<div>Targets takes 40% more Resonance Liberation DMG from Aemeath.
    
    The stacks of Rupturous Trail and Fusion Trail inflicted on the target through Forte Circuit To Sculpt the Silence is doubled.

In Resonance Mode - Tune Rupture or Resonance Mode - Fusion Burst and out of combat, the max stack limit of Rupturous Trail or Fusion Trail on the targets near the active Resonator in the team is increased to 60. When Aemeath casts Resonance Skill Seraphic Duet, she inflicts 10 stacks of Rupturous Trail or Fusion Trail on the targets within the range, lasting for 30s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "specialMultiplier",
        modifySpecificTalents: [
          "HeavyAttackAemeathChargedIDMG",
          "HeavyAttackAemeathChargedIIDMG",
          "HeavyAttackMechChargedIDMG",
          "HeavyAttackMechChargedIIDMG",
          "SeraphicDuetEncoreDMG",
          "SeraphicDuetOvertureDMG",
          "HeavenfallEdictOverdriveDMG",
          "HeavenfallEdictFinaleDMG",
        ],
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6AZephyrKissedJourneytoYouTuneRupture",
    name: "Sequence Node 6: A Zephyr-Kissed Journey to You - Tune Rupture",
    details: `<div>When in Resonance Mode - Tune Rupture, Aemeath's Tune Rupture DMG can critically hit, with a fixed Crit. Rate of 80%, and fixed Crit. DMG of 275%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifySpecificTalents: ["TuneBreakDMG", "TuneRuptureResponseStarburstDMG", "SeraphicDuetBonusDMGPerInstance"],
        modifierValue: 0.8,
      },
      {
        modifier: "CritDMG",
        modifySpecificTalents: ["TuneBreakDMG", "TuneRuptureResponseStarburstDMG", "SeraphicDuetBonusDMGPerInstance"],
        modifierValue: 1.75, // you get 275% from the buff, but it's SET to 275%, but we have 100% base to help with the normal calc, so making it BUFF 175 to make it total 275%
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6AZephyrKissedJourneytoYouFusionBurst",
    name: "Sequence Node 6: A Zephyr-Kissed Journey to You - Fusion Burst",
    details: `<div>When in Resonance Mode - Fusion Burst and in combat state, Fusion Burst DMG triggered on targets near the active Resonator in the team can critically hit, with a fixed Crit. Rate of 80%, and fixed Crit. DMG of 275%.</div>`,
    hasStacks: false,
    modifiers: [
      // TODO: Implement when we add fusion burst
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
