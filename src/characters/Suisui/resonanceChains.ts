export const resonanceChains = [
  {
    key: `SequenceNode1MountainsWashedIntoPaintings`,
    name: `Sequence Node 1: Mountains Washed Into Paintings`,
    details: `<div>The ATK bonus effect gained by consuming at least 600 points of <span style="color:#ffd12f;" class="font-bold">Floral Epistle</span> while casting <span style="color:#ffd12f;" class="font-bold">Outro Skill - Rippling Waters</span> can now also be triggered by inflicting <span style="color:#ffd12f;" class="font-bold">Negative Status</span> or dealing <span style="color:#ffd12f;" class="font-bold">Negative Status DMG</span>.<br>The duration of <span style="color:#ffd12f;" class="font-bold">Ceaseless Landscape</span> is extended to 30s, and the duration of <span style="color:#ffd12f;" class="font-bold">Reflecting Shadows</span> obtained through the third <span style="color:#ffd12f;" class="font-bold">Plume Step</span> is extended by 100%.<br><span style="color:#ffd12f;" class="font-bold">Basic Attack - Drizzle Stance</span>, <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Drizzle Stance</span>, and <span style="color:#ffd12f;" class="font-bold">Enhanced Plunging Attack- Enhanced State</span> are immune to interruption.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode2CloudsPourLikeMoltenGold`,
    name: `Sequence Node 2: Clouds Pour Like Molten Gold`,
    details: `<div>All nearby Resonators in the team within the <span style="color:#ffd12f;" class="font-bold">Ceaseless Landscape</span> have their Crit. DMG increased by 50% for 30s when the perform the following actions:<br>- Inflicting the target with <span style="color:#ffd12f;" class="font-bold">Spectro Frazzle</span>, <span style="color:#ffd12f;" class="font-bold">Fusion Burst</span>, <span style="color:#ffd12f;" class="font-bold">Glacio Chafe</span>, <span style="color:#ffd12f;" class="font-bold">Aero Erosion</span>, and <span style="color:#ffd12f;" class="font-bold">Electro Flare</span>, or deal the corresponding Negative Status DMG.<br>- Consuming <span style="color:#ffd12f;" class="font-bold">Havoc Bane</span> stacks on the target by landing a skill.<br>When the active Resonator is not in the <span style="color:#ffd12f;" class="font-bold">Ceaseless Landscape</span>, this Crit. DMG bonus effect is disabled.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.5,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode3SparseCurtainsInviteEveningGlow`,
    name: `Sequence Node 3: Sparse Curtains Invite Evening Glow`,
    details: `<div>Press <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> shortly after casting <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Drizzle Stance</span> to cast <span style="color:#ffd12f;" class="font-bold">Basic Attack - Drizzle Stance Stage 4</span>.<br><size=10></span><br><br>Casting <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Drizzle Stance</span> grants <span style="color:#ffd12f;" class="font-bold">Kingfisher</span>. Switching to another Resonator ends this effect. Casting <span style="color:#ffd12f;" class="font-bold">Basic Attack - Drizzle Stance Stage 4</span> consumes <span style="color:#ffd12f;" class="font-bold">Kingfisher</span> to restore 20 points of Concerto Energy and 350 points of <span style="color:#ffd12f;" class="font-bold">Floral Epistle</span>. <span style="color:#ffd12f;" class="font-bold">Kingfisher</span> can be consumed up to once every 25s.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode4AutumnMountainsInChoirSing`,
    name: `Sequence Node 4: Autumn Mountains in Choir Sing`,
    details: `<div>Healing provided by <span style="color:#ffd12f;" class="font-bold">Enrichment</span> and  <span style="color:#ffd12f;" class="font-bold">Spring's Birth</span> are increased by 50%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifySpecificTalents: [
          "EnrichmentHealing", "SkyOverWaterHealing",
          "Spring'sBirthHealing",
        ],
        modifierValue: 0.5,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode5ILongToRideTheEasternWind`,
    name: `Sequence Node 5: I Long To Ride The Eastern Wind`,
    details: `<div>The DMG Multipliers of <span style="color:#ffd12f;" class="font-bold">Basic Attack - Drizzle Stance</span> and <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Drizzle Stance</span> are increased by 100%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "BasicAttackCleansingRainStage1DMG",
          "BasicAttackCleansingRainStage2DMG",
          "BasicAttackCleansingRainStage3DMG",
          "BasicAttackCleansingRainStage4DMG",
          "HeavyAttackCleansingRainDMG",
        ],
        modifierValue: 1,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode6StayingTrueToThisSplendidRealm`,
    name: `Sequence Node 6: Staying True To This Splendid Realm`,
    details: `<div>The Crit. DMG of <span style="color:#ffd12f;" class="font-bold">Intro Skill - Tinkling Jade</span> and <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Awakening Spring</span> are increased by 500%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifySpecificTalents: [
          "TinklingJadeDMG",
          "AwakeningSpringDMG",
        ],
        modifierValue: 5,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  }
];
