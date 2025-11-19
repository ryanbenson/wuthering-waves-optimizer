export const resonanceChains = [
  {
    key: "SequenceNode1WanderingThroughtheDesolateCorridors",
    name: "Sequence Node 1: Wandering Through the Desolate Corridors",
    details: `<div>Chisa is immune to interruption during <span class="Highlight"><strong>Sawring - Blitz</strong></span>,  <span class="Highlight"><strong>Sawring - Eradication</strong></span>, and <span class="Highlight"><strong>Chainsaw Mode - Dodge Counter</strong></span><br><br>Inflicting <span class="Highlight"><strong>Unseen Snare</strong></span> grants the following additional effects:<br>- Chisa's ATK is increased by 30% for 15s.<br>- Deal fixed 61803 points of <span class="Dark"><strong>Havoc DMG</strong></span>. The target's HP can be reduced to 61.80% at most and each target can take this damage only once. This instance of damage is considered Basic Attack DMG that does not bear any effect from damage bonuses.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.3,
      },
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode1WanderingThroughtheDesolateCorridors"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2IntotheWebofEndlessBonds",
    name: "Sequence Node 2: Into the Web of Endless Bonds",
    details: `<span class="skilldescription">Ignore 10% of the target's Havoc RES when dealing damage.<br>
Nearby Resonators in the team with <span class="Highlight">Thread of Bane</span> gain 50% All-Attribute DMG Bonus.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResistShred:Havoc",
        modifierValue: 0.1,
      },
      {
        modifier: "AllElementAttributeBonus",
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3Across the Confusion of the Long Night",
    name: "Sequence Node 3: O Blade, I, Who Save No More",
    details: `<div>The DMG Multipliers of <span class="Highlight"><strong>Sawring - Blitz</strong></span>, <span class="Highlight"><strong>Chainsaw Mode - Dodge Counter</strong></span> and <span class="Highlight"><strong>Sawring - Eradication</strong></span> are increased by 120%. This effect is mutually stackable with that of <span class="Highlight"><strong>Woven Myriad - Convergence</strong></span>.<br>The bonus DMG Multiplier for <span class="Highlight"><strong>Sawring - Eradication</strong></span> granted by <span class="Highlight"><strong>Sawring- Blitz</strong></span> and <span class="Highlight"><strong>Chainsaw Mode - Dodge Counter</strong></span> when <span class="Highlight"><strong>Ring of Chainsaw</strong></span> is consumed is increased by 120%. This effect is mutually stackable with that of <span class="Highlight"><strong>Woven Myriad - Convergence</strong></span>.<br>The Vibration Strength Reduction Rate of <span class="Highlight"><strong>Sawring - Blitz</strong></span>, <span class="Highlight"><strong>Chainsaw Mode - Dodge Counter</strong></span> and <span class="Highlight"><strong>Sawring - Eradication</strong></span> is increased by 50%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "SawringBlitzStage1DMG",
          "SawringBlitzStage2DMG",
          "SawringBlitzStage2HoldDMG",
          "SawringBlitzStage2DiscordanceDMG",
          "SawringBlitzStage3DMG",
          "SawringBlitzStage3HoldDMG",
          "SawringBlitzStage3FalltoneDMG",
          "SawringEradicationDMG",
          "ChainsawModeDodgeCounterDMG",
          "ChainsawModeDodgeCounterHoldDMG",
        ],
        modifierValue: 1.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4SeveringtheEndlessCycleofTragicFate",
    name: "Sequence Node 4: Severing the Endless Cycle of Tragic Fate",
    details: `<span class="skilldescription">The effect of <span class="Highlight">Unseen Snare</span> becomes:<br>
When targets marked by <span class="Highlight">Unseen Snare</span> take direct damage from Resonators, Chisa inflicts 1 stack of <span class="Highlight">Havoc Bane</span> on them. This effect is triggered up to once every 1s.</span>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5ThousandsofLightstoGuidetheWayHome",
    name: "Sequence Node 5: Thousands of Lights to Guide the Way Home",
    details: `<span class="skilldescription">Resonance Liberation Moment of <span class="Hightlight">Nihility</span> gains 100% DMG Bonus.<br>
<span class="Highlight">Lifethread - Glide</span> costs 50% less <span class="Highlight">Lifethread - Jetstream</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["MomentofNihilityDMG"],
        modifierValue: 1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6ThusHopeisRekindledwiththeRisingDawn",
    name: "Sequence Node 6: Thus, Hope is Rekindled with the Rising Dawn",
    details: `<div">When Chisa takes a fatal blow during <span class="Hightlight"><strong>Sawring - Blitz</strong></span>, <span  class="Hightlight"><strong>Sawring - Eradication</strong></span>, and <span class="Hightlight"><strong>Chainsaw Mode - Dodge Counter</strong></span>, she will remain standing with at least 1 HP.<br><br><span class="Hightlight"><strong>Unseen Snare</strong></span> becomes <span class="Hightlight"><strong>Unseen Snare - Finality</strong></span>, which has the following effects:<br>- <span class="Hightlight"><strong>Unseen Snare - Finality</strong></span> has all the effects of <span class="Hightlight"><strong>Unseen Snare</strong></span>.<br>- Targets affected by <span class="Hightlight""><strong>Unseen Snare - Finality</strong></span> takes 30% Amplified DMG from Negative Statuses.<br>- Targets affected by <span class="Hightlight"><strong>Unseen Snare - Finality</strong></span> takes 40% increased DMG from Chisa.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "specialMultiplier",
        modifierValue: 0.4,
      },
      {
        modifier: "DMGDeepen:SpectroFrazzle",
        modifierValue: 0.3,
      },
      {
        modifier: "DMGDeepen:AeroErosion",
        modifierValue: 0.3,
      },
      {
        modifier: "DMGDeepen:ElectroFlare",
        modifierValue: 0.3,
      },
      {
        modifier: "DMGDeepen:FusionBurst",
        modifierValue: 0.3,
      },
      {
        modifier: "DMGDeepen:GlacioChafe",
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
