export const resonanceChains = [
  {
    key: "SequenceNode1DaystobePaintedLikeaCanvas",
    name: "Sequence Node 1: Days to be Painted Like a Canvas",
    details: `<div>The DMG Multiplier of <span class="Highlight"><strong>Basic Attack - Polychrome Leap</strong></span> is increased by 120%.<br>The duration of <span class="Highlight"><strong>Spray Paint</strong></span> is increased by 100%. Targets within the range of <span class="Highlight"><strong>Spray Paint</strong></span> are pulled in towards the center every 6s.<br>Lynae is now immune to interruptions during <span class="Highlight"><strong>Basic Attack - Polychrome Leap</strong></span> and <span class="Highlight"><strong>Basic Attack - Visual Impact</strong></span>.<br>During <span class="Highlight"><strong>Optical Sampling Stage</strong></span>, after staying out of combat for 2s, restore 120 points of <span class="Highlight"><strong>Overflow</strong></span>.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "BasicAttackPolychromeLeap1",
          "BasicAttackPolychromeLeap2",
          "BasicAttackPolychromeLeap3",
        ],
        modifierValue: 1.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2IntoLightsVanishingPoint",
    name: "Sequence Node 2: Into Lights' Vanishing Point",
    details: `<span class="skilldescription">Gain 25% All-DMG Amplification.<br>
Outro Skill gains the following effect:<br>
Casting Outro Skill grants the incoming Resonator 25% All-DMG Amplification for 14s or until the Resonator is switched out.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGDeepen",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3ForOneBrilliantMoment",
    name: "Sequence Node 3: For One Brilliant Moment",
    details: `<div>The DMG Multiplier of <span class="Highlight"><strong>Basc Attack - Visual Impact</strong></span> and <span class="Highlight"><strong>Basic Attack - Iridescent Splash</strong></span> is increased by 90%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "BasicAttackVisualImpactDMG",
          "BasicAttackIridescentSplashDMG",
        ],
        modifierValue: 0.9,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3ForOneBrilliantMomentAdditiveColor",
    name: "Sequence Node 3: For One Brilliant Moment (Additive Color)",
    details: `<div>With <span class="Highlight"><strong>Lumiflow</strong></span> ≥ 120 points. Lynae gains 1 stack of <span class="Highlight"><strong>Premixed Hue</strong></span> every 1s, up to 25 stacks. Each stack of <span class="Highlight"><strong>Premixed Hue</strong></span> increases the Spectro DMG dealt through <span class="Highlight"><strong>Additive Color</strong></span> by 55%. No <span class="Highlight"><strong>Premixed Hue</strong></span> is gained while casting <span class="Highlight"><strong>Additive Color</strong></span>. When <span class="Highlight"><strong>Additive Color</strong></span> ends, remove all stacks of <span class="Highlight"><strong>Premixed Hue</strong></span>. Lynae loses a stack of <span class="Highlight"><strong>Premixed Hue</strong></span> every 0.5s once <span class="Highlight"><strong>Lumiflow</strong></span> is below 120 points.<br>While Lynae is out of combat, Premixed Hue regenerates twice as fast and depletes half as fast.</div>`,
    hasStacks: true,
    modifiers: [
      {
        // Note: buff says spectro buff, but we're setting it to generic dmg bonus, same thing
        modifySpecificTalents: ["AdditiveColorDMG"],
        modifierValue: 0.55,
      },
    ],
    minStacks: 0,
    maxStacks: 25,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4ShadowsofaWindRacer",
    name: "Sequence Node 4: Shadows of a Wind Racer",
    details: `<span class="skilldescription">ATK is increased by 20%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5VisionsofaFutureUnbound",
    name: "Sequence Node 5: Visions of a Future Unbound",
    details: `<span class="skilldescription">The DMG Multiplier of <span class="Highlight">Resonance Liberation - Prismatic Overblast</span> is increased by 70%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["PrismaticOverblastDMG"],
        modifierValue: 0.7,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6PaintedinMyTrueColor",
    name: "Sequence Node 6: Painted in My True Color",
    details: `<div>Each time <span class="Highlight"><strong>Kaleidoscopic Parade - Graffiti Blast</strong></span> or <span class="Highlight"><strong>Kaleidoscopic Parade - Mid-air Heavy Attack</strong></span> is cast, Lynae gains 1 stack of <span class="Highlight"><strong>Color of Soul</strong></span>, up to 3 stacks. Each stack of <span class="Highlight"><strong>Color of Soul</strong></span> increases the DMG the target takes from <span class="Highlight"><strong>Basic Attack - Iridescent Splash</strong></span> and <span class="Highlight"><strong>Basic Attack - Visual Impact</strong></span> by 30%. After casting <span class="Highlight"><strong>Basic Attack - Iridescent Splash</strong></span> or <span class="Highlight"><strong>Basic Attack - Visual Impact</strong></span>, all stacks of <span class="Highlight"><strong>Color of Soul</strong></span> are removed.<br>Casting <span class="Highlight"><strong>Basic Attack - Polychrome Leap</strong></span> resets the charges of <span class="Highlight"><strong>Kaleidoscopic Parade - Mid-air Heavy Attack</strong></span>.<br>Lynae is immune to interruptions, and DMG taken is reduced by 30% during <span class="Highlight"><strong>Kaleidoscopic Parade - Mid-air Heavy Attack</strong></span>.<br>Lynae now stays in <span class="Highlight"><strong>Kaleidoscopic Parade</strong></span> after casting <span class="Highlight"><strong>Outro Skill - Let's Hit the Road!</strong></span>.<br>The <span class="Highlight"><strong>Lumiflow</strong></span> upper limit is increased from 120 to 360. At the max limit, Lynae's roller skating speed further increases.<br>If Intro Skill is cast during <span class="Highlight"><strong>Lumiflow</strong></span>.</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "specialMultiplier",
        modifySpecificTalents: [
          "BasicAttackIridescentSplashDMG",
          "BasicAttackVisualImpactDMG",
        ],
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 3,
    alwaysEnabled: false,
  },
];
