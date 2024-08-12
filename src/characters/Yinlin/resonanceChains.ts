export const resonanceChains = [
  {
    key: "SequenceNode1MoralitysCrossroads",
    name: "Sequence Node 1: Morality's Crossroads",
    details: `<span class="skilldescription">Resonance Skill <span class="Highlight">Magnetic Roar</span> and <span class="Highlight">Lightning Execution</span> deal 70% more damage.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: [
          "MagneticRoarDamage",
          "LightningExecutionDamage",
        ],
        modifierValue: 0.7,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3UnyieldingVerdict",
    name: "Sequence Node 3: Unyielding Verdict",
    details: `<span class="skilldescription">Forte Circuit <span class="Highlight">Judgment Strike</span>'s DMG multiplier is increased by 55%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["JudgmentStrikeDMG"],
        modifierValue: 0.55,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4SteadfastConviction",
    name: "Sequence Node 4: Steadfast Conviction",
    details: `<span class="skilldescription">When Forte Circuit <span class="Highlight">Judgment Strike</span> hits a target, the ATK of all team members is increased by 20% for 12s.</span>`,
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
    key: "SequenceNode5ResoundingWill",
    name: "Sequence Node 5: Resounding Will",
    details: `<span class="skilldescription">Resonance Liberation <span class="Highlight">Thundering Wrath</span> deals 100% extra damage to targets with Forte Circuit's <span class="Highlight">Sinner's Mark</span> or <span class="Highlight">Punishment Mark</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["ThunderingWrath"],
        modifierValue: 1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6PursuitofJustice",
    name: "Sequence Node 6: Pursuit of Justice",
    details: `<span class="skilldescription">In the first 30s after casting Resonance Liberation <span class="Highlight">Thundering Wrath</span>, when Yinlin's <span class="Highlight">Basic Attack</span> hits a target, <span class="Highlight">Furious Thunder</span> will be triggered, dealing <span class="Thunder">Electro DMG</span> equal to 419.59% of Yinlin's ATK. Every <span class="Highlight">Basic Attack</span> hit can trigger <span class="Highlight">Furious Thunder</span> 1 time, up to 4 times. This is considered Resonance Skill DMG.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode6PursuitofJustice"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
