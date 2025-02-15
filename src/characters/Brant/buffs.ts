export const buffs = [
  {
    key: `MyMoment`,
    name: `"My" Moment`,
    details: `Brant gains additional ATK based on his Energy Regen: For every 1% of his Energy Regen over 150%, Brant gains additional 20 points of ATK, up to 2600.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK_FLAT:AdditionalBase",
        modifierValue: 20,
        maximumValue: 2600,
        modifierStep: .01,
        modifierBasedOn: "EnergyRegen",
        modifierTargetAttr: "ATK_FLAT",
        minStatValue: 1.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `TheatricalMoment`,
    name: `Theatrical Moment`,
    details: `Brant gains additional ATK based on his Energy Regen: For every 1% of his Energy Regen over 150%, Brant gains additional 12 points of ATK, up to 1560.`,
    hasStacks: false,
    modifiers: [
      {
        // the 2 won't affect the calcs, it's to avoid collision with the first buff
        modifier: "ATK_FLAT2:AdditionalBase",
        modifierValue: 12,
        maximumValue: 1560,
        modifierStep: .01,
        modifierBasedOn: "EnergyRegen",
        modifierTargetAttr: "ATK_FLAT",
        minStatValue: 1.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillVoyagersBlaze",
    name: "Inherent Skill: Voyager's Blaze",
    details: `Healing provided by <span class="Highlight">Waves of Acclaims</span> is increased by 20%.`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: [
          "WavesofAcclaimsHealing",
        ],
        modifierValue: 0.2,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillTrialbyFireandTide",
    name: "Inherent Skill: Trial by Fire and Tide",
    details: `Brant's resistance to interruption is increased during <span class="Highlight">Mid-air Attacks</span> and gains 15% <span class="Fire">Fusion DMG Bonus</span>.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritRate1",
    name: "Stat Bonus: Crit. Rate+",
    details: `<div class="skilldescription">Crit. Rate increased by 1.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.012,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritRate2",
    name: "Stat Bonus: Crit. Rate+",
    details: `<div class="skilldescription">Crit. Rate increased by 1.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.012,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritRate3",
    name: "Stat Bonus: Crit. Rate+",
    details: `<div class="skilldescription">Crit. Rate increased by 2.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.028,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusCritRate4",
    name: "Stat Bonus: Crit. Rate+",
    details: `<div class="skilldescription">Crit. Rate increased by 2.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.028,
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
