export const resonanceChains = [
  {
    key: "SequenceNode1TheDrearyGreyFloodsintotheShipsCabin",
    name: "Sequence Node 1: The Dreary Grey Floods into the Ship's Cabin",
    details: `<span class="skilldescription">When casting the <span class="Highlight">Resonance Skill</span> High-Difficulty Design, additionally restores <span class="Highlight">100</span> points of <span class="Highlight">【Imagination】</span> and <span class="Highlight">10</span> points of <span class="Highlight">Concerto Value</span>.</span>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2TheSeafireStoneFlickerswithFaintLight",
    name: "Sequence Node 2: The Seafire Stone Flickers with Faint Light",
    details: `<span class="skilldescription">When casting <span class="Highlight">Basic Attack</span> Fantasy into Reality, all characters in the team receive a <span class="Highlight">10%</span> increase in <span class="Dark">Havoc</span> damage. This effect can stack up to <span class="Highlight">3</span> times, lasting <span class="Highlight">30</span> seconds.</span>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "Havoc",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 3,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2TheSeafireStoneFlickerswithFaintLightMax",
    name: "Sequence Node 2: The Seafire Stone Flickers with Faint Light",
    details: `<span class="skilldescription">When fully stacked, the <span class="Dark">Havoc</span> damage increase for the team is further raised by <span class="Highlight">10%</span>, lasting <span class="Highlight">30</span> seconds.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Havoc",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3ObserveCarefullyMeasurewithHand",
    name: "Sequence Node 3: Observe Carefully, Measure with Hand",
    details: `<span class="skilldescription">When casting the <span class="Highlight">Intro Skill</span> Perlo, Come Help, Roccia's <span class="Highlight">Crit Rate</span> increases by <span class="Highlight">10%</span>, and <span class="Highlight">Crit DMG</span> increases by <span class="Highlight">30%</span>, lasting <span class="Highlight">15</span> seconds.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.1,
      },
      {
        modifier: "CritDMG",
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4CountlessRareTreasuresGatheredintheBox",
    name: "Sequence Node 4: Countless “Rare Treasures” Gathered in the Box",
    details: `<span class="skilldescription"When casting the <span class="Highlight">Resonance Skill</span> High-Difficulty Design, the <span class="Highlight">damage multiplier</span> of <span class="Highlight">Basic Attack</span> Fantasy into Reality is increased by <span class="Highlight">60%</span>, lasting <span class="Highlight">12</span> seconds.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["HighDifficultyDesignDMG"],
        modifierValue: 0.6,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5RebuildthePromisedLandOnStage",
    name: "Sequence Node 5: Rebuild the Promised Land, On Stage",
    details: `<span class="skilldescription">The <span class="Highlight">Resonance Liberation</span> Improv Comedy, Opening <span class="Highlight">damage multiplier</span> is increased by <span class="Highlight">20%</span>, and <span class="Highlight">Heavy Attack damage multiplier</span> is increased by <span class="Highlight">80%</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["ImprovComedyOpeningDMG"],
        modifierValue: 0.2,
      },
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["HeavyAttackDMG"],
        modifierValue: 0.8,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6FlyonGoldenWings",
    name: "Sequence Node 6: Fly, on Golden Wings",
    details: `<span class="skilldescription">When casting the <span class="Highlight">Resonance Liberation</span> Improv Comedy, Opening, the following effects are gained:<br>
For <span class="Highlight">12</span> seconds, <span class="Highlight">Basic Attack</span> Fantasy into Reality ignores <span class="Highlight">60%</span> of the target's <span class="Highlight">defense</span> when attacking.
For <span class="Highlight">12</span> seconds, after the 3rd hit of Basic Attack Fantasy into Reality lands, <span class="Highlight">Basic Attack</span> Construct Reality can be consecutively performed, dealing <span class="Highlight">100%</span> of the 3rd hit's damage. This damage is considered <span class="Highlight">Resonance Skill</span> damage.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEFIgnore",
        modifySpecificTalents: [
          "LeapFantasyFirstHit",
          "LeapFantasySecondHit",
          "LeapFantasyThirdHit",
          "SequenceNode6FlyonGoldenWingsRealityDMG",
        ],
        modifierValue: 0.6,
      },
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode6FlyonGoldenWingsRealityDMG"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
