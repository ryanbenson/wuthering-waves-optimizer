export const buffs = [
  {
    key: "InherentSkillCondensation",
    name: "Inherent Skill: Condensation",
    details: `<div class="skilldescription">Damage dealt by Sanhua's Resonance Skill increased by 20% for 8s after casting her Intro Skill.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["EternalFrostSkillDMG"],
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillAvalanche",
    name: "Inherent Skill: Avalanche",
    details: `<div class="skilldescription">Damage dealt by Sanhua's Forte Circuit <span class="Highlight">Ice Burst</span> is increased by 20% for 8s after casting <span class="Highlight">Basic Attack 5</span>.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: [
          "GlacierBurstDMG",
          "IcePrismBurstDMG",
          "IceThornBurstDMG",
        ],
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusGlacio1",
    name: "Stat Bonus: Glacio DMG Bonus+",
    details: `<div class="skilldescription">Glacio DMG Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Glacio",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusGlacio2",
    name: "Stat Bonus: Glacio DMG Bonus+",
    details: `<div class="skilldescription">Glacio DMG Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Glacio",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusGlacio3",
    name: "Stat Bonus: Glacio DMG Bonus+",
    details: `<div class="skilldescription">Glacio DMG Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Glacio",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusGlacio4",
    name: "Stat Bonus: Glacio DMG Bonus+",
    details: `<div class="skilldescription">Glacio DMG Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Glacio",
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
