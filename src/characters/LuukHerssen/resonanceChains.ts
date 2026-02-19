export const resonanceChains = [
  {
    key: "SequenceNode1GoldKindledinAsh",
    name: "Sequence Node 1: Gold Kindled in Ash",
    details: `<div>Luuk Herssen gains 150% <span class="Highlight">Mid-air Attack</span> DMG Bonus.<br>
The max stack limit of <span class="Highlight">Dawnlit Keep</span> is increased by 1.<br>
When in the <span class="Highlight">Aureate Judge</span> state, casting Resonance Skill Aureole of Execution grants 1 stacks of Dawnlit Keep.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: [
          "MidairDodgeCounterDMG",
          "MidairAttackStage1DMG",
          "MidairAttackStage2ScytheDissectionDMG",
          "MidairAttackStage3ScytheDissectionDMG",
          "MidairAttackStage2ScytheResctionDMG",
          "MidairAttackStage3ScytheResctionDMG",
          "MidairAttackStage4DMG",
          "GavelofEarthshakerDMG",
          "RewritteninWintersMargins",
          "AureoleofExecutionRingDMG",
          "AureoleofExecutionBreachDMG",
          "AureoleofExecutionGlareDMG",
          "GoldenRefluxDMG",
        ],
        modifierValue: 1.5,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2AvalancheRoaringinEyes",
    name: "Sequence Node 2: Avalanche Roaring in Eyes",
    details: `<div>The DMG Multiplier of Resonance Liberation <span class="Highlight">Rewritten in Winter's Margins</span> is increased by 60%. This DMG Multiplier increase effect is stackable with that of Endnotes on the Endgame.<br>
Inherent Skill <span class="Highlight">Uncaused Diagnosis</span> is enhanced:<br>
When Luuk Herssen deals damage to targets inflicted with Tune Strain - Interfered, every 10 points of Tune Break Boost he has now Amplify this instance of damage by 10%. This effect now increases the DMG Amplification up to 60% instead of 30%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["RewritteninWintersMargins"],
        modifierValue: 0.6,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3SpineTemperedbyGoldenRain",
    name: "Sequence Node 3: Spine Tempered by Golden Rain",
    details: `<div>The DMG Multipliers of all forms of Resonance Skill <span class="Highlight">Aureole of Execution</span> are increased by 136% in the Aureate Judge state. Casting <span class="Highlight">Aureole of Execution: Glare</span> increases the DMG Multipliers of the next <span class="Highlight">Mid-Attack - Gavel of Earthshaker</span> and <span class="Highlight">Ichor Deposit</span> by 136%.<br>
Inherent Skill Pulses Under the Snow is enhanced:<br>
Perpetuating Daytime now stacks up to 4 times.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "AureoleofExecutionRingDMG",
          "AureoleofExecutionBreachDMG",
          "AureoleofExecutionGlareDMG",
        ],
        modifierValue: 1.36,
      },
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "GavelofEarthshakerDMG",
          "IchorDepositDMG",
        ],
        modifierValue: 1.36,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4PulseThrummingUnderRime",
    name: "Sequence Node 4: Pulse Thrumming Under Rime",
    details: `<div>After a Resonator in the team deals Tune Break DMG, all Resonators in the team deal 20% more DMG for 20s. This effect is unstackable.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGBonus",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5ThroughtheStillnessofSnowstorm",
    name: "Sequence Node 5: Through the Stillness of Snowstorm",
    details: `<div>Intro Skill <span class="Highlight">Before Injection of Dawn</span> and Outro Skill <span class="Highlight">Bow to the Last Light</span> gain 80% DMG Bonus.<br>
Resonance Skill <span class="Highlight">Golden Reflux</span> has its DMG Multiplier increased by 50% and Cooldown reduced by 2s, and gains 1 more charge.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: [
          "BeforeInjectionofDawnDMG",
          "BowtotheLastLightDMG",
        ],
        modifierValue: 0.8,
      },
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "GoldenRefluxDMG",
        ],
        modifierValue: 0.5,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6DawnUnfurlingoverFrostlands",
    name: "Sequence Node 6: Dawn Unfurling over Frostlands",
    details: `<div>When nearby Resonators in the team deal Tune Break DMG, all forms of Resonance Skill <span class="Highlight">Aureole of Execution</span>, <span class="Highlight">Ichor Deposit</span>, and <span class="Highlight">Mid-air Attack - Gavel of Earthshaker</span> deal 30% more DMG to the target for 25s.<br>
Each stack of <span class="Highlight">Endnotes on the Endgame</span> additionally grants Resonance Liberation <span class="Highlight">Rewritten in Winter's Margins</span> 40% DMG Bonus, up to 120%.<br>
When Luuk Herssen deals damage to targets inflicted with <span class="Highlight">Tune Strain - Interfered</span>, the stack count of <span class="Highlight">Tune Strain - Interfered</span> on the target is increased by 2. This effect ignores the max stack limit.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "specialMultiplier",
        modifySpecificTalents: [
          "AureoleofExecutionRingDMG",
          "AureoleofExecutionBreachDMG",
          "AureoleofExecutionGlareDMG",
          "GavelofEarthshakerDMG",
          "IchorDepositDMG",
        ],
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
