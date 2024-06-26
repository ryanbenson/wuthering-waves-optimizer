export const buffs = [
  {
    key: "IncineratingWill",
    name: "Incinerating Will",
    details: `
      <div class="skilldescription">
        Danjin's damage dealt to targets marked with
        <span class="Highlight">Incinerating Will</span> is increased by 20%.
      </div>
    `,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGBonus",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillCrimsonLight",
    name: "Inherent Skill: Crimson Light",
    details: `
      <div class="skilldescription">
        Damage of resonance skill <span class="Highlight">Crimson Erosion</span> triggered by
        <span class="Highlight">Dodge Counter: Ruby Shades</span> is increased by 20%. The HP cost
        and stacks of "Ruby Blossom" are recovered and doubled.
      </div>
    `,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["DCCrimsonErosion2"],
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillOverflow",
    name: "Inherent Skill: Overflow",
    details: `
      <div class="skilldescription">
        After casting the Resonance Skill <span class="Highlight">Sanguine Pulse</span>,
        Danjin's Heavy Attack damage is increased by 30% for 5s.
      </div>
    `,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HeavyAttackDMGBonus",
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHavoc1",
    name: "Stat Bonus: Havoc DMG Bonus+",
    details: `
      <div class="skilldescription">
        Havoc DMG Bonus increased by 1.80%
      </div>
    `,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Havoc",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHavoc2",
    name: "Stat Bonus: Havoc DMG Bonus+",
    details: `
      <div class="skilldescription">
        Havoc DMG Bonus increased by 1.80%
      </div>
    `,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Havoc",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHavoc3",
    name: "Stat Bonus: Havoc DMG Bonus+",
    details: `
      <div class="skilldescription">
        Havoc DMG Bonus increased by 4.20%
      </div>
    `,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Havoc",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHavoc4",
    name: "Stat Bonus: Havoc DMG Bonus+",
    details: `
      <div class="skilldescription">
        Havoc DMG Bonus increased by 4.20%
      </div>
    `,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Havoc",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusATK1",
    name: "Stat Bonus: ATK+",
    details: `<div class="skilldescription">ATK increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusATK2",
    name: "Stat Bonus: ATK+",
    details: `<div class="skilldescription">ATK increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusATK3",
    name: "Stat Bonus: ATK+",
    details: `<div class="skilldescription">ATK increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusATK4",
    name: "Stat Bonus: ATK+",
    details: `<div class="skilldescription">ATK increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
