export const resonanceChains = [
  {
    key: "SequenceNode1",
    name: "Sequence Node 1: Crimson Heart of Justice",
    details: `
      <span class="skilldescription">
        When Danjin attacks a target with Resonance Skill's
        <span class="Highlight">Incinerating Will</span>, her ATK is increased
        by 5% for 6s, stacking up to 6 times. Danjin loses 1 stacks of this effect
        each time she takes damage.
      </span>
    `,
    hasStacks: true,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.05,
      },
    ],
    minStacks: 0,
    maxStacks: 6,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2",
    name: "Sequence Node 2: Dusted Mirror",
    details: `
      <span class="skilldescription">
        When Danjin attacks a target with Resonance Skill's
        <span class="Highlight">Incinerating Will</span>, her damage dealt is
        increased by 20%.
      </span>
    `,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGBonus",
        modifierValue: 0.20,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3",
    name: "Sequence Node 3: Fleeting Blossom",
    details: `
      <span class="skilldescription">
        Resonance Liberation DMG Bonus is increased by 30%.
      </span>
    `,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResonanceLiberationDMGBonus",
        modifierValue: 0.30,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4",
    name: "Sequence Node 4: Solitary Carnation",
    details: `
      <span class="skilldescription">
        When Danjin has more than 60 "Ruby Blossom", her Crit. Rate is increased
        by 15%. This effect lasts until the end of
        <span class="Highlight">Heavy Attack: Scatterbloom</span> even after all
        "Ruby Blossom" is consumed when casting
        <span class="Highlight">Heavy Attack: Chaoscleave</span>.
      </span>
    `,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode51",
    name: "Sequence Node 5: Reigning Blade",
    details: `
      <span class="skilldescription">
        Danjin's Havoc DMG Bonus is increased by 15%
      </span>
    `,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Havoc",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode52",
    name: "Sequence Node 5: Reigning Blade",
    details: `
      <span class="skilldescription">
        Danjin's Havoc DMG Bonus is further increased by another 15% when
        her HP is lower than 60%.
      </span>
    `,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Havoc",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6",
    name: "Sequence Node 6: Bloodied Jade",
    details: `
      <span class="skilldescription">Heavy Attack <span class="Highlight">Chaoscleave</span> increases the ATK of all team members by 20% for 20s.</span>
    `,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.20,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
