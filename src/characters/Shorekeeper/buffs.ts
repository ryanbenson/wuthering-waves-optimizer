export const buffs = [
  {
    key: "SophisticatedStellarealm",
    name: "Sophisticated Stellarealm",
    details: `<div class="skilldescription">When nearby team members use <span class="Highlight">Intro Skill</span> within <span class="Highlight">Elementary Stellarealm</span>, it evolves into <span class="Highlight">Sophisticated Stellarealm</span>. In <span class="Highlight">Sophisticated Stellarealm</span>, for every 20% increase in the Shorekeeper's Energy Regen, all nearby team members in the domain gain a 1% increase in Crit. Rate, up to a maximum of 10%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate:AdditionalBase",
        modifierValue: 0.01,
        maximumValue: 0.1,
        modifierBasedOn: "EnergyRegen",
        modifierTargetAttr: "CritRate",
        modifierStep: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "ReleasedStellarealm",
    name: "Released Stellarealm",
    details: `<div class="skilldescription">When nearby team members use <span class="Highlight">Intro Skill</span> within <span class="Highlight">Sophisticated Stellarealm</span>, it evolves into <span class="Highlight">Released Stellarealm</span>. In <span class="Highlight">Released Stellarealm</span>, for every 10% increase in the Shorekeeper's Energy Regen, all nearby team members in the domain gain a 1% increase in ATK%, up to a maximum of 20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK:AdditionalBase",
        modifierValue: 0.01,
        maximumValue: 0.2,
        modifierBasedOn: "EnergyRegen",
        modifierTargetAttr: "ATK",
        modifierStep: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "OutroSkillBinaryButterfly",
    name: "Outro Skill: Binary Butterfly",
    details: `<div class="skilldescription">When the <span class="Highlight">Dim Star Butterfly</span> is present, all nearby team members' DMG is amplified by 15%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGDeepen",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillSelfGravitation",
    name: "Inherent Skill: Self Gravitation",
    details: `<div class="skilldescription">When the Shorekeeper is in the team or when <span class="Highlight">Stellarealm</span> is active, or if the team is within the Black Shores area, the Shorekeeper's Energy Regen increases by 10%. If Rover is in the same team, their Energy Regen also increases by 10%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnergyRegen",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHealingBonus1",
    name: "Stat Bonus: Healing Bonus+",
    details: `<div class="skilldescription">Healing Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHealingBonus2",
    name: "Stat Bonus: Healing Bonus+",
    details: `<div class="skilldescription">Healing Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHealingBonus3",
    name: "Stat Bonus: Healing Bonus+",
    details: `<div class="skilldescription">Healing Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHealingBonus4",
    name: "Stat Bonus: Healing Bonus+",
    details: `<div class="skilldescription">Healing Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHP1",
    name: "Stat Bonus: HP+",
    details: `<div class="skilldescription">HP increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HP",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHP2",
    name: "Stat Bonus: HP+",
    details: `<div class="skilldescription">HP increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HP",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHP3",
    name: "Stat Bonus: HP+",
    details: `<div class="skilldescription">HP increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HP",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusHP4",
    name: "Stat Bonus: HP+",
    details: `<div class="skilldescription">HP increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HP",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
