export const resonanceChains = [
  {
    key: "SequenceNode1SilentGlowsinADimlitDream",
    name: "Sequence Node 1: Silent Glows in a Dimlit Dream",
    details: `<div>Crit. DMG is increased by 30%.<br><br>When performing Resonance Skill <span style="color:#f7ca2f"><strong>Phantom Bubble - Stagecraft Form</strong></span>, or Resonance Skill <span style="color:#f7ca2f"><strong>Banish - Breakdown Form</strong></span>, <span style="color:#f7ca2f"><strong>Basic Attack - Breakdown Form Stage 3</strong></span>, <span style="color:#f7ca2f"><strong>Basic Attack - Breakdown Form Stage 4</strong></span>, <span style="color:#f7ca2f"><strong>Mid-air Attack - Breakdown Form Stage 3</strong></span>, and <span style="color:#f7ca2f"><strong>Mid-air Attack - Breakdown Form Stage 4</strong></span>,  Denia becomes immune to interruption.<br><br>When Denia enters combat in <span style="color:#f7ca2f"><strong>Stagecraft Form</strong></span>, she obtains the <span style="color:#f7ca2f"><strong><span class="Highlight">Entropy Shift: Stagecraft Form</span></strong></span> effect for 30s.<br>When Denia enters combat in <span style="color:#f7ca2f"><strong>Breakdown Form</strong></span>, she obtains the <span style="color:#f7ca2f"><strong><span class="Highlight">Entropy Shift: Breakdown Form</span></strong></span> effect for 12s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "BasicAttackForeclaimedSelfStage1DMG",
          "BasicAttackForeclaimedSelfStage2DMG",
          "BasicAttackForeclaimedSelfStage3DMG",
          "BasicAttackForeclaimedSelfStage4DMG",
          "BasicAttackForeclaimedSelfStage5DMG",
          "MidairAttackStage3ScytheResctionDMG",
          "HeavyAttackForeclaimedSelfDMG",
          "MidAirAttackForeclaimedSelfStage1DMG",
          "MidAirAttackForeclaimedSelfStage2DMG",
          "MidAirPlungingAttackForeclaimedSelfDMG",
          "DodgeCounterForeclaimedSelfDMG",
        ],
        modifierValue: 1.2,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2TossedintheTidesofReality",
    name: "Sequence Node 2: Tossed in the Tides of Reality",
    details: `<div>When Denia is in <span style="color:#f7ca2f"><strong>Resonance Mode - Fusion Burst</strong></span>, after a Resonator in the team inflicts <span style="color:#f7ca2f"><strong><span class="Highlight">Fusion Burst</span></strong></span> on the target, they gain 50% Fusion DMG Bonus for 15s. After <span style="color:#f7ca2f"><strong><span class="Highlight">Fusion Burst</span></strong></span> is triggered on enemies near the active Resonator in the team, Denia gains 1 stack of <span style="color:#f7ca2f"><strong>Degenerate Voidmatter</strong></span> for 15s, up to 10 stacks. Each stack of <span style="color:#f7ca2f"><strong>Degenerate Voidmatter</strong></span> causes Denia to ignore 1% of the target's Fusion RES.<br>This effect ends when Denia switches modes.<br><br>When Denia is in <span style="color:#f7ca2f"><strong>Resonance Mode - Tune Strain</strong></span>, her <span style="color:#f7ca2f"><strong>Forte Circuit</strong></span> effect is enhanced: After a Resonator in the team inflicts <span style="color:#f7ca2f"><strong><span class="Highlight">Tune Strain - Shifting</span></strong></span> on the target, their Tune Break Boost is increased by 20 for 15s, and the target's <span style="color:#f7ca2f"><strong>Off-Tune Level</strong></span> is increased by 100% of the max. This effect can only be triggered once per 300s on the same target.<br>This effect ends when Denia switches forms.<br><br>The DMG Multiplier of Resonance Skill <span style="color:#f7ca2f"><strong>Banish - Breakdown Form</strong></span> is increased by 40%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "BasicAttackIaiDMG",
        ],
        modifierValue: 1.25,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3ThroughDarkandWindtheErlkingFollows",
    name: "Sequence Node 3: Through Dark and Wind, the Erlking Follows",
    details: `<div>The DMG Multiplier of Resonance Liberation <span style="color:#f7ca2f"><strong>Final Act - Breakdown Form</strong></span> is increased by 80%.<br><br>Denia now holds up to 5 <span style="color:#f7ca2f"><strong><span class="Highlight">Dark Cores</span></strong></span>. While in <span style="color:#f7ca2f"><strong><span class="Highlight">Entropy Shift</span></strong></span>,  the shortest interval at which she can obtain <span style="color:#f7ca2f"><strong><span class="Highlight">Dark Core</span></strong></span> is reduced to 6s.<br>The <span style="color:#f7ca2f"><strong><span class="Highlight">Entropy Shift: Stagecraft Form</span></strong></span> effect is enhanced and now grants 4 points of <span style="color:#f7ca2f"><strong><span class="Highlight">Void Particle</span></strong></span> per second.<br>The <span style="color:#f7ca2f"><strong><span class="Highlight">Entropy Shift: Breakdown Form</span></strong></span> effect is enhanced: Casting Resonance Liberation <span style="color:#f7ca2f"><strong>Final Act - Breakdown Form</strong></span> additionally restores 30 points of Concerto Energy.<br><br>Denia's Inherent Skill <span style="color:#f7ca2f"><strong>Vestiges of Falsehood</strong></span> is enhanced:<br>Upon entering combat, <span style="color:#f7ca2f"><strong><span class="Highlight">Dark Core</span></strong></span> and <span style="color:#f7ca2f"><strong><span class="Highlight">Void Particle</span></strong></span> are restored to the max. This effect can be triggered once every 12s. <br><br>When the number of <span style="color:#f7ca2f"><strong><span class="Highlight">Dark Cores</span></strong></span> reaches the limit, casting <span style="color:#f7ca2f"><strong>Basic Attack - Stagecraft Form Stage 4</strong></span> or Resonance Skill <span style="color:#f7ca2f"><strong>Phantom Bubble - Stagecraft Form</strong></span> consumes all <span style="color:#f7ca2f"><strong><span class="Highlight">Dark Cores</span></strong></span> and increases the DMG Multiplier of this skill by 1200%. The DMG dealt is considered <span style="color:#f7ca2f"><strong>Resonance Liberation DMG</strong></span>.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "HeavyAttackFrostSplinterPresentSelfDMG",
          "HeavyAttackBitterfrostForeclaimedSelfDMG",
        ],
        modifierValue: 1.6,
      },
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "GlacioBiteDMG",
        ],
        modifierValue: 4.88,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4FromtheFarBeyondtoFarBeyond",
    name: "Sequence Node 4: From the Far Beyond, to the Far Beyond",
    details: `<div>The attack interval of <span style="color:#f7ca2f"><strong>Erosion Field</strong></span> is reduced to 3s.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5IfLiesPatchUpaHeart",
    name: "Sequence Node 5: If Lies Patch Up a Heart",
    details: `<div>The DMG of Resonance Liberation <span style="color:#f7ca2f"><strong>Final Act - Stagecraft Form</strong></span> is increased by 100%.
</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "ResonanceSkillPresentSelfDMG",
          "FrostblightJadeCleaveDMG",
          "FrostblightPetalfallDMG",
        ],
        modifierValue: 0.8,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6MayYouFindYourSunintheSilence",
    name: "Sequence Node 6: May You Find Your Sun in the Silence",
    details: `<div>While in <span style="color:#f7ca2f"><strong><span class="Highlight">Entropy Shift</span></strong></span> states, gain 60% ATK increase and 60% Fusion DMG Bonus.<br><br>While Denia is in <span style="color:#f7ca2f"><strong>Resonance Mode - Fusion Burst</strong></span>,  after <span style="color:#f7ca2f"><strong>Erosion Field</strong></span> deals damage, trigger <span style="color:#f7ca2f"><strong><span class="Highlight">Fusion Burst</span></strong></span> on the target based on its max limit. The <span style="color:#f7ca2f"><strong><span class="Highlight">Fusion Burst</span></strong></span> DMG triggered gains a 200% DMG Multiplier increase against the main target and does not remove the <span style="color:#f7ca2f"><strong><span class="Highlight">Fusion Burst</span></strong></span> stacks on the targets hit. The effect can be triggered on the same target up to 1 time. When the target is damaged by Resonance Liberation <span style="color:#f7ca2f"><strong>Final Act: Breakdown Form</strong></span>, the effect's trigger count is reset. The trigger count can be reset for the same target once every 2s.<br><br>While Denia is in <span style="color:#f7ca2f"><strong>Resonance Mode - Tune Strain</strong></span>, when Resonators in the team deal <span style="color:#f7ca2f"><strong>Tune Break DMG</strong></span> to <span style="color:#f7ca2f"><strong>Mistuned</strong></span> enemies in <span style="color:#f7ca2f"><strong><span class="Highlight">Tune Strain - Shifting</span></strong></span>, they additionally inflict 1 stack of <span style="color:#f7ca2f"><strong><span class="Highlight">Tune Strain - Interfered</span></strong></span> on the target. This effect can only be triggered on the same target once every 3s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifySpecificTalents: [
          "ForeclaimingInwardVisionDMG",
          "ForeclaimingBladeLiberationBaseDMG",
        ],
        modifierValue: 5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
