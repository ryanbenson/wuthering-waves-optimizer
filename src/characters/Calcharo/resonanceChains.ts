export const resonanceChains = [
  {
    key: "SequenceNode1CovertNegotiation",
    name: "Sequence Node 1: Covert Negotiation",
    details: `<span class="skilldescription">When Resonance Skill <span class="Highlight">Extermination Order</span> hits a target, it additionally recovers 10 Resonance Energy. This can be triggered once every 20s.</span>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2ZeroSumGame",
    name: "Sequence Node 2: Zero-Sum Game",
    details: `<span class="skilldescription">After Calcharo casts Intro Skill <span class="Highlight">Wanted Criminal</span> or Intro Skill <span class="Highlight">"Necessary Means"</span>, his Resonance Skill DMG Bonus is increased by 30% for 15s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResonanceSkillDMGBonus",
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3IronFistDiplomacy",
    name: "Sequence Node 3: Iron Fist Diplomacy",
    details: `<span class="skilldescription">During the Resonance Liberation <span class="Highlight">Deathblade Gear</span> state, Calcharo's Electro DMG Bonus is increased by 25%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Electro",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4DarkAlliance",
    name: "Sequence Node 4: Dark Alliance",
    details: `<span class="skilldescription">After casting Outro Skill <span class="Highlight">Shadowy Raid</span>, Electro DMG Bonus of all team members is increased by 20% for 30s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Electro",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5UnconventionalCompact",
    name: "Sequence Node 5: Unconventional Compact",
    details: `<span class="skilldescription">Intro Skill <span class="Highlight">Wanted Criminal</span> and Intro Skill <span class="Highlight">"Necessary Means:</span> deal 50% more damage.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "IntroSkillDMGBonus",
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6TheUltimatum",
    name: "Sequence Node 6: The Ultimatum",
    details: `<span class="skilldescription">When casting Resonance Liberation <span class="Highlight">"Death Messenger"</span>, Calcharo will summon 2 <span class="Highlight">Phantoms</span> to perform Coordinated Attacks. Each <span class="Highlight">Phantom</span> deals <span class="Thunder">Electro DMG</span> equal to 100.00% of Calcharo's ATK, which is considered Resonance Liberation DMG.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode6TheUltimatum"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
