export const resonanceChains = [
  {
    key: "SequenceNode2MistweaversDebut",
    name: "Sequence Node 2: Mistweaver's Debut",
    details: `<span class="skilldescription">"Mist Avatar" inherits 100% more HP from Aalto. When Aalto attacks targets taunted by the "Mist Avatar(s)", his ATK is increased by 15%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3HazeyTransition",
    name: "Sequence Node 3: Hazey Transition",
    details: `<span class="skilldescription">When Aalto's <span class="Highlight">Basic Attack</span> or <span class="Highlight">Mid-air Attack</span> passes through the Mist, 2 more bullets will be generated, dealing 50% of the DMG of <span class="Highlight">Basic Attack</span> or <span class="Highlight">Mid-air Attack</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: [
          "SequenceNode3HazeyTransitionHalfTruthsStage1DMG",
          "SequenceNode3HazeyTransitionHalfTruthsStage2DMG",
          "SequenceNode3HazeyTransitionHalfTruthsStage3DMG",
          "SequenceNode3HazeyTransitionHalfTruthsStage4DMG",
          "SequenceNode3HazeyTransitionHalfTruthsStage5DMG",
          "SequenceNode3HazeyTransitionHalfTruthsMidAirAttackDMG",
        ],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4BlakeBloomforFinale",
    name: "Sequence Node 4: Blake Bloom for Finale",
    details: `<span class="skilldescription">The damage of Resonance Skill <span class="Highlight">Mist Bullets</span> is increased by 30%; Aalto receives 30% less damage in his Forte Circuit <span class="Highlight">Mistcloak Dash</span> state.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["MistBulletDamage"],
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5ApplauseoftheLost",
    name: "Sequence Node 5: Applause of the Lost",
    details: `<span class="skilldescription">In the Forte Circuit <span class="Highlight">Mistcloak Dash</span> state, Aalto's Aero DMG Bonus is increased by 25% for 6s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Aero",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6BrokersSecrets",
    name: "Sequence Node 6: Broker's Secrets",
    details: `<span class="skilldescription">Resonance Liberation <span class="Highlight">Flower in the Mist</span> now additionally increases Crit. Rate by 8%. When Aalto's Heavy Attack passes through the "Gate of Quandary", the damage dealt is additionally increased by 50%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.08,
      },
      {
        modifySpecificTalents: ["HalfTruthsAimedShotDMG", "HalfTruthsChargedAimedShotDMG"],
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
