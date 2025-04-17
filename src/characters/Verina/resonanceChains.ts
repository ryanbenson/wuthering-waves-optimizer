export const resonanceChains = [
  {
    key: "SequenceNode1MomentofEmergence",
    name: "Sequence Node 1: Moment of Emergence",
    details: `<span class="skilldescription">Outro Skill <span class="Highlight">Blossom</span> grants the next character a continuous Healing effect, recovering HP by 20% of Verina's ATK every 5s for 30s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode1MomentofEmergence"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2SproutingReflections",
    name: "Sequence Node 2: Sprouting Reflections",
    details: `<span class="skilldescription">Resonance Skill <span class="Highlight">Botany Experiment</span> additionally grants 1 [Photosynthetic Energy] and 10 Concerto Energy.</span>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3TheChoicetoFlourish",
    name: "Sequence Node 3: The Choice to Flourish",
    details: `<span class="skilldescription">Healing of Resonance Liberation's <span class="Highlight">Photosynthesis Mark</span> is increased by 12%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        // modifier: "HealingBonus",
        modifySpecificTalents: [
          "ArborealFlourishCoordinatedAttackHealing",
          "SequenceNode6JoyousHarvestDMG",
          "SequenceNode6JoyousHarvestHealing",
        ],
        modifierValue: 0.12,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4BlossomingEmbrace",
    name: "Sequence Node 4: Blossoming Embrace",
    details: `<span class="skilldescription">Heavy Attack <span class="Highlight">Starflower Blooms</span>, Mid-Air Attack <span class="Highlight">Starflower Blooms</span>, Resonance Liberation <span class="Highlight">Arboreal Flourish</span> and Outro Skill <span class="Highlight">Blossom</span> increases the Spectro DMG Bonus of all team members by 15% for 24s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Spectro",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5MiraculousBlooms",
    name: "Sequence Node 5: Miraculous Blooms",
    details: `<span class="skilldescription">When Verina heals a team member with HP less than 50%, her Healing is increased by 20%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6JoyousHarvest",
    name: "Sequence Node 6: Joyous Harvest",
    details: `<span class="skilldescription">Heavy Attack <span class="Highlight">Starflower Blooms</span> and Mid-Air Attack <span class="Highlight">Starflower Blooms</span> deal 20% more damage. They will trigger Coordinated Attack 1 time and heal all characters nearby. The DMG of this Coordinated Attack and the Healing are equal to those of the Resonance Liberation's <span class="Highlight">Photosynthesis Mark</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: [
          "HeavyAttackStarflowerBloomsDMG",
          "MidAirAttackStarflowerBloomsStage1DMG",
          "MidAirAttackStarflowerBloomsStage2DMG",
          "MidAirAttackStarflowerBloomsStage3DMG",
        ],
        modifierValue: 0.2,
      },
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode6JoyousHarvest"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
