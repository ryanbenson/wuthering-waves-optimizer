export const resonanceChains = [
  {
    key: "SequenceNode1GildedGlimmeroftheFirstDawn",
    name: "Sequence Node 1: Gilded Glimmer of the First Dawn",
    details: `<div>In <span class="Highlight"><strong>Instant Response</strong></span>, <span class="Highlight"><strong>Heavy Attack - Aemeath</strong></span> and <span class="Highlight"><strong>Heavy Attack - Mech</strong></span> gain 300% Crit. DMG increase and continuously pull in nearby target while charging.<br><br>When Aemeath remains in the a state that meets all of the following conditions over 4s, she enters <span class="Highlight"><strong>Instant Response: Brilliance</strong></span>:<br>- Out of combat<br>- Not performing <span class="Highlight"><strong>Heavy Attack - Aemeath</strong></span>, <span class="Highlight"><strong>Heavy Attack - Mech</strong></span>, and Resonance Liberation <span class="Highlight"><strong>Heavenfall Edict: Finale</strong></span>.<br><span class="Highlight"><strong>Instant Response: Brilliance</strong></span> inherits all effects of <span class="Highlight"><strong>Instant Response</strong></span> and remains active even out of the duration of <span class="Highlight"><strong>Heavenfall Edict: Unbound</strong></span>. <br>When not in <span class="Highlight"><strong>Heavenfall Edict: Unbound</strong></span>, casting <span class="Highlight"><strong>Heavy Attack - Aemeath Charged II</strong></span> or <span class="Highlight"><strong>Heavy Attack - Mech Charged II</strong></span> grants 100 points of <span class="Highlight"><strong>Synchronization Rate</strong></span>.<br><br>In <span class="Highlight"><strong>Resonance Mode - Tune Rupture</strong></span> or <span class="Highlight"><strong>Resonance Mode - Fusion Burst</strong></span>, when Aemeath defeats a target affected by <span class="Highlight"><strong>Rupturous Trail</strong></span>/<span class="Highlight"><strong>Fusion Trail</strong></span>, she enters <span class="Highlight"><strong>Sealed Trail - Tune Rupture</strong></span>/<span class="Highlight"><strong>Sealed Trail - Fusion Burst</strong></span> for 10s.<br>When Aemeath defeats a target affected by <span class="Highlight"><strong>Sealed Trail - Tune Rupture</strong></span> or <span class="Highlight"><strong>Sealed Trail - Fusion Burst</strong></span>, record the highest stack count of <span class="Highlight"><strong>Rupturous Trail</strong></span>/<span class="Highlight"><strong>Fusion Trail</strong></span> among the targets defeated.<br>Her next skill that directly damages the target immediately inflicts the targets with the recorded stacks of <span class="Highlight"><strong>Rupturous Trail</strong></span>/<span class="Highlight"><strong>Fusion Trail</strong></span>, up to the current max limit of <span class="Highlight"><strong>Rupturous Trail</strong></span>/<span class="Highlight"><strong>Fusion Trail</strong></span>. This removes the <span class="Highlight"><strong>Sealed Trail - Tune Rupture</strong></span>/<span class="Highlight"><strong>Sealed Trail - Fusion Burst</strong></span> on the target and the target cannot be inflicted with <span class="Highlight"><strong>Sealed Trail - Tune Rupture</strong></span> or <span class="Highlight"><strong>Sealed Trail - Fusion Burst</strong></span> for 1s.</div>`,
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
    details: `<div>The DMG Multiplier of Resonance Skill <span class="Highlight">Seraphic Duet: Overture</span> is increased by 100%.
The DMG Multiplier of Resonance Skill <span class="Highlight">Seraphic Duet: Encore</span> is increased by 100%.</div>`,
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
    details: `<div>While in <span class="Highlight">Resonance Mode - Tune Rupture</span>, when <span class="Highlight">Tune Rupture DMG</span> triggered by Resonance Skill <span class="Highlight">Seraphic Duet</span> hits the same target, the DMG Multiplier of <span class="Highlight">Tune Rupture DMG</span> trigger by Resonance Skill <span class="Highlight">Seraphic Duet</span> is increased by 20% for 1s, stacking up to 5 times.</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "specialMultiplier",
        modifySpecificTalents: [ "SeraphicDuetBonusDMGPerInstance"],
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
    details: `<div>While in <span class="Highlight">Resonance Mode - Fusion Burst</span>, gain the following effects:
- In the <span class="Highlight">Stardust Resonance</span> state, the DMG Multiplier of <span class="Highlight">Fusion Burst</span> triggered by Resonance Skill <span class="Highlight">Seraphic Duet</span> is further increased to 400% against the main target of the <span class="Highlight">Fusion Burst</span>.
- When <span class="Highlight">Fusion Trail</span> is removed, the DMG Multiplier of <span class="Highlight">Fusion Burst</span> triggered by Resonance Skill <span class="Highlight">Seraphic Duet</span> is further increased to 15% against the main target of the <span class="Highlight">Fusion Burst</span> per <span class="Highlight">Fusion Trail</span> stack.
- In combat state, when a target near the active Resonator in the team is defeated, immediately trigger the <span class="Highlight">Fusion Burst</span> based on the current stack limit of <span class="Highlight">Fusion Burst</span> on the target.</div>`,
    hasStacks: false,
    modifiers: [
      // TODO: Implement when fusion burst is implemented
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3FervorSightlyBurnsBrightasNew",
    name: "Sequence Node 3: Fervor Sightly Burns Bright as New",
    details: `"<div>Resonance Liberation <span class="Highlight"><strong>Heavenfall Edict: Finale</strong></span>'s DMG Multiplier is increased by 100%.<br>Resonance Liberation <span class="Highlight"><strong>Heavenfall Edict: Overdrive</strong></span>'s DMG Multiplier is increased by 40%.<br><br>In <span class="Highlight"><strong>Instant Response</strong></span>, Aemeath now inflicts <span class="Highlight"><strong>Tune Rupture - Shifting</strong></span> or <span class="Highlight"><strong>Fusion Burst</strong></span> while casting <span class="Highlight"><strong>Heavy Attack - Aemeath Charged II</strong></span> or <span class="Highlight"><strong>Heavy Attack - Mech Charged II</strong></span>, based on her current Resonance Mode.<br><br>Inherent Skill <span class="Highlight"><strong>Between the Stars</strong></span> is replaced with the following effects:<br><br>- In <span class="Highlight"><strong>Resonance Mode - Tune Rupture</strong></span>, when Resonators in the team inflict <span class="Highlight"><strong>Tune Rupture - Shifting</strong></span> or deal <span class="Highlight"><strong>Tune Rupture DMG</strong></span>, Aemeath's Crit. DMG is increased by 60%, and Resonance Liberation <span class="Highlight"><strong>Heavenfall Edict: Finale</strong></span> DMG is now Amplified by 25%.<br>Resonators joining the team or switching Resonance Mode resets this effect.<br><br>- In <span class="Highlight"><strong>Resonance Mode - Fusion Burst</strong></span>, when Resonators in the team inflict <span class="Highlight"><strong>Fusion Burst</strong></span>, Aemeath's Crit. DMG is increased by 60%, and Resonance Liberation <span class="Highlight"><strong>Heavenfall Edict: Finale</strong></span> DMG is now Amplified by 25%.<br>Resonators joining the team or switching Resonance Mode resets this effect.</div>"
`,
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
    details: `<div>When casting Intro Skill <span class="Highlight"><strong>Songs Across the Universe</strong></span>, Intro Skill <span class="Highlight"><strong>Debut of Meteoric Radiance</strong></span>, Resonance Skill <span class="Highlight"><strong>Sync Strike</strong></span> and Resonance Skill <span class="Highlight"><strong>Seraphic Duet</strong></span>, Resonators in the team gain 20% All-Attribute DMG Bonus for 30s.</div>`,
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
    details: `<div>When Aemeath's defeats a target directly with her skills, <span class="Highlight"><strong>Starflux</strong></span> is reset to 100%.<br><br>When taking fatal damage, Aemeath is knocked out and turns into <span class="Highlight"><strong>2D Digital Ghost</strong></span> for 5s.<br>In the <span class="Highlight"><strong>2D Digital Ghost</strong></span> state, Aemeath grants Resonators in the team a Shield equal to 360% of her ATK for 5. As she exits from the <span class="Highlight"><strong>2D Digital Ghost</strong></span> state, she revives and recovers 100% of her Max HP and 30 points of Resonance Energy. This effect can be triggered once every 10m.<br>When Aemeath revives, she exits the <span class="Highlight"><strong>2D Digital Ghost</strong></span> state and removes the shield provided.</div>`,
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
    details: `<div>Targets takes 40% more Resonance Liberation DMG from Aemeath.<br><br>The stacks of <span class="Highlight">Rupturous Trail</span> and <span class="Highlight">Fusion Trail</span> inflicted on the target through Forte Circuit <span class="Highlight">To Sculpt the Silence</span> is doubled.

In <span class="Highlight">Resonance Mode - Tune Rupture</span> or <span class="Highlight">Resonance Mode - Fusion</span> Burst and out of combat, the max stack limit of <span class="Highlight">Rupturous Trail</span> or <span class="Highlight">Fusion Trail</span> on the targets near the active Resonator in the team is increased to 60. When Aemeath casts Resonance Skill <span class="Highlight">Seraphic Duet</span>, she inflicts 10 stacks of <span class="Highlight">Rupturous Trail</span> or <span class="Highlight">Fusion Trail</span> on the targets within the range, lasting for 30s.</div>`,
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
    details: `<div>When in <span class="Highlight">Resonance Mode - Tune Rupture</span>, Aemeath's <span class="Highlight">Tune Rupture DMG</span> can critically hit, with a fixed Crit. Rate of 80%, and fixed Crit. DMG of 275%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifySpecificTalents: [ "TuneRuptureResponseStarburstDMG", "SeraphicDuetBonusDMGPerInstance"],
        modifierValue: 0.8,
      },
      {
        modifier: "CritDMG",
        modifySpecificTalents: [ "TuneRuptureResponseStarburstDMG", "SeraphicDuetBonusDMGPerInstance"],
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
    details: `<div>When in <span class="Highlight">Resonance Mode - Fusion Burst</span> and in combat state, <span class="Highlight">Fusion Burst DMG</span> triggered on targets near the active Resonator in the team can critically hit, with a fixed Crit. Rate of 80%, and fixed Crit. DMG of 275%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifySpecificTalents: ["ElementalEffectFusionBurst"],
        modifierValue: 0.8,
      },
      {
        modifier: "CritDMG",
        modifySpecificTalents: ["ElementalEffectFusionBurst"],
        modifierValue: 1.75, // you get 275% from the buff, but it's SET to 275%, but we have 100% base to help with the normal calc, so making it BUFF 175 to make it total 275%
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
