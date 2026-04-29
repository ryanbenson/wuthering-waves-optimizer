export const resonanceChains = [
  {
    key: "SequenceNode1Springless",
    name: "Sequence Node 1: Springless",
    details: `<div>The DMG Multipliers of <span style="color:#f7ca2f"><strong>Basic Attack - Foreclaimed Self</strong></span>, <span style="color:#f7ca2f"><strong>Heavy Attack - Foreclaimed Self</strong></span>, <span style="color:#f7ca2f"><strong>Mid-air Attack - Foreclaimed Self</strong></span>, <span style="color:#f7ca2f"><strong>Mid-air Plunging Attack - Foreclaimed Self</strong></span>, <span style="color:#f7ca2f"><strong>Dodge Counter - Foreclaimed Self</strong></span> are increased by 120%.<br><br><span style="color:#f7ca2f"><strong>Basic Attack - Foreclaimed Self Stage 3</strong></span> now has an increased range and pulls enemies within range toward the center. Hiyuki is immune to interruptions while casting  <span style="color:#f7ca2f"><strong>Basic Attack - Foreclaimed Self Stage 4 &amp; 5</strong></span>.<br><br>Casting <span style="color:#f7ca2f"><strong>Foreclaiming: Inward Vision</strong></span> enhances the next <span style="color:#f7ca2f"><strong>Basic Attack - Foreclaimed Self Stage 1 &amp; 2</strong></span>, which now inflict 1 stack of <span style="color:#f7ca2f"><strong><a href="#WwLink850010" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="850010">Glacio Chafe</a></strong></span> on hit.</div>`,
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
        ],
        modifierValue: 1.5,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2ToBurnColdinSilence",
    name: "Sequence Node 2: To Burn Cold in Silence",
    details: `<div><span style="color:#f7ca2f"><strong>Basic Attack - Iai</strong></span>'s DMG Multiplier is increased by 125%.<br><br>Inherent Skill <span style="color:#f7ca2f"><strong>Ephemeral Realm</strong></span>'s effect becomes the following one:<br>Once Hiyuki leaves the combat state or recovers from being knocked out, after staying out of combat for 4s, restore 3 points of <span style="color:#f7ca2f"><strong><a href="#WwLink110805" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="110805">Snowforged Blade</a></strong></span>.<br><br>Once Hiyuki leaves the combat state or recovers from being knocked out, after staying out of combat for 4s, the following effects are triggered once:<br>- Restore 3 points points of <span style="color:#f7ca2f"><strong><a href="#WwLink110803" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="110803">Frostharden Iai</a></strong></span>.<br>- Reset the Cooldown of 2 charges of <span style="color:#f7ca2f"><strong>Frostblight: Jade Cleave</strong></span>.<br>- Restore an additional 50 points of <span style="color:#f7ca2f"><strong><a href="#WwLink110802" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="110802">Frostheart</a></strong></span> for the next 2 casts of <span style="color:#f7ca2f"><strong>Frostblight: Jade Cleave</strong></span> or <span style="color:#f7ca2f"><strong>Frostblight: Petalfall</strong></span>.</div>`,
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
    key: "SequenceNode3NoSelfNoBound",
    name: "Sequence Node 3: No Self, No Bound",
    details: `<div>Inherent Skill <span style="color:#f7ca2f"><strong>Fine Snow</strong></span> gains the following effect:<br>Every 2s after a Resonator joins the team or Hiyuki is revived, Hiyuki gains 1 stack of <span style="color:#f7ca2f"><strong>Snow Rust</strong></span>. Hiyuki can obtain up to 1 stack of <span style="color:#f7ca2f"><strong>Snow Rust</strong></span> in this way.<br><br>The DMG Multipliers of <span style="color:#f7ca2f"><strong>Heavy Attack - Frost Splinter: Present Self</strong></span> and <span style="color:#f7ca2f"><strong>Heavy Attack - Bitterfrost: Foreclaimed Self</strong></span> are increased by 160%.<br><br>At 2 stacks of <span style="color:#f7ca2f"><strong>Snow Rust</strong></span>, while Hiyuki is the active Resonator in the team, the DMG Multiplier of the additionally applied Glacio Bite DMG each time she inflicts <span style="color:#f7ca2f"><strong><a href="#WwLink850010" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="850010">Glacio Chafe</a></strong></span> is increased by 488%.</div>`,
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
    key: "SequenceNode4LikeReedsonTides",
    name: "Sequence Node 4: Like Reeds on Tides",
    details: `<div>Casting <span style="color:#f7ca2f"><strong>Resonance Skill: Present Self</strong></span>, <span style="color:#f7ca2f"><strong>Frostblight: Jade Cleave</strong></span>, or <span style="color:#f7ca2f"><strong>Frostblight: Petalfall</strong></span> increases the damage dealt by all nearby Resonators in the team by 20% for 30s.<br><br>Restore 18% of Max HP while casting <span style="color:#f7ca2f"><strong>Frostblight: Jade Cleave</strong></span> or <span style="color:#f7ca2f"><strong>Frostblight: Petalfall</strong></span>.</div>`,
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
    key: "SequenceNode5VesselofThousandWishes",
    name: "Sequence Node 5: Vessel of Thousand Wishes",
    details: `<div>The DMG Multipliers of <span style="color:#f7ca2f"><strong>Resonance Skill - Present Self</strong></span>, <span style="color:#f7ca2f"><strong>Frostblight: Jade Cleave</strong></span>, and <span style="color:#f7ca2f"><strong>Frostblight: Petalfall</strong></span> are increased by 80%.</div>`,
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
    key: "SequenceNode6IntoaNightWithoutEnd",
    name: "Sequence Node 6: Into a Night Without End",
    details: `<div>The Crit. DMG of <span style="color:#f7ca2f"><strong>Foreclaiming: Inward Vision</strong></span> and <span style="color:#f7ca2f"><strong>Foreclaiming: Blade Liberation</strong></span> are increased by 500%.<br><br>At 2 stacks of <span style="color:#f7ca2f"><strong>Snow Rust</strong></span>, the effect "While Hiyuki is the active Resonator in the team, each time she applies <span style="color:#f7ca2f"><strong><a href="#WwLink850010" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="850010">Glacio Chafe</a></strong></span>, she additionally deals an instance of Glacio Bite DMG with a fixed DMG Multiplier" changes to "While Hiyuki is the active Resonator in the team, each time a Resonator in the team applies <span style="color:#f7ca2f"><strong><a href="#WwLink850010" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="850010">Glacio Chafe</a></strong></span>, she additionally deals an instance of Glacio Bite DMG with a fixed DMG Multiplier."<br>At 2 stacks of <span style="color:#f7ca2f"><strong>Snow Rust</strong></span>, Hiyuki's Crit. DMG is increased by 40%.<br>At 3 stacks of <span style="color:#f7ca2f"><strong>Snow Rust</strong></span>, the total <span style="color:#f7ca2f"><strong><a href="#WwLink110809" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="110809">Glacio Bite</a> DMG</strong></span> taken by targets within a certain range of the active Resonator in the team is increased by 25%.</div>`,
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
