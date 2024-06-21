export const resonanceChains = [
  {
    key: "SequenceNode1HiddenThoughts",
    name: "Sequence Node 1: Hidden Thoughts",
    details: `<span class="skilldescription">Resonance Skill <span class="Highlight">Tripartite Flames</span> and Heavy Attack <span class="Highlight">Flaming Vow</span> increases Changli's DMG dealt by 10% and resistance to interruption.</span>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "AllAttributeBonus",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 2,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2PursuitofDesires",
    name: "Sequence Node 2: Pursuit of Desires",
    details: `<span class="skilldescription">[Enflamement] increases Changli's Crit Rate by 30%, lasting for 8s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3LearnedSecrets",
    name: "Sequence Node 3: Learned Secrets",
    details: `<span class="skilldescription">Resonance Liberation <span class="Highlight">Radiance of Fealty</span> DMG is increased by 80%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResonanceLiberationDMGBonus",
        modifierValue: 0.8,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4PolishedWords",
    name: "Sequence Node 4: Polished Words",
    details: `<span class="skilldescription">Intro Skill increases the ATK of all team members by 20%, lasting for 30s.</span>`,
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
    key: "SequenceNode5SacrificedGains1",
    name: "Sequence Node 5: Sacrificed Gains: Flaming Vow Buff",
    details: `<span class="skilldescription">Heavy Attack <span class="Highlight">Flaming Vow</span>'s multiplier is increased by 50%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["FlamingVowDMG"],
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5SacrificedGains2",
    name: "Sequence Node 5: Sacrificed Gains: Flaming Vow Buff",
    details: `<span class="skilldescription"> When Heavy Attack Flaming Vow is released, it receives a 50% DMG Bonus.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["FlamingVowDMG"],
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6RealizedPlans",
    name: "Sequence Node 6: Realized Plans",
    details: `<span class="skilldescription">Resonance Skill <span class="Highlight">Tripartite Flames</span>, Heavy Attack <span class="Highlight">Flaming Vow</span>, and Resonance Liberation <span class="Highlight">Radiance of Fealty</span> ignore an additional 40% of the target's DEF when dealing damage.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DefIgnore",
        modifySpecificTalents: [
          "TrueSightCaptureDMG",
          "TrueSightConquestDMG",
          "TrueSightChargeDMG",
          "FlamingVowDMG",
          "RadianceofFealty",
        ],
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
