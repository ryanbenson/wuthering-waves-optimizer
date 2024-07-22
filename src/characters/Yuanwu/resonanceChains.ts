export const resonanceChains = [
  {
    key: "SequenceNode3UpholderofIntegrity",
    name: "Sequence Node 3: Upholder of Integrity",
    details: `<span class="skilldescription">When the Coordinated Attacks of Resonance Skill's <span class="Highlight">Thunder Wedge</span> hits a target, the damage is additionally increased by 20% of Yuanwu's DEF.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Talent",
        modifierTalentKey: "ThunderWedgeCoordinatedAttackDMG",
        modifierValue: {
          "1": 0.2,
          "2": 0.2,
          "3": 0.2,
          "4": 0.2,
          "5": 0.2,
          "6": 0.2,
          "7": 0.2,
          "8": 0.2,
          "9": 0.2,
          "10": 0.2,
        },
        modifierValueTalentRef: "skill",
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5NeighborhoodProtector",
    name: "Sequence Node 5: Neighborhood Protector",
    details: `<span class="skilldescription">When Resonance Skill <span class="Highlight">Thunder Wedge</span> is on the field, Yuanwu's Resonance Liberation DMG Bonus is increased by 50%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResonanceLiberationDMGBonus",
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6DefenderofAllRealms",
    name: "Sequence Node 6: Defender of All Realms",
    details: `<span class="skilldescription">All team members nearby within the range of Resonance Skill <span class="Highlight">Thunder Wedge</span> will gain a 32% DEF increase, lasting 3s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEF",
        modifierValue: 0.32,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
