export const buffs = [
  {
    key: `MyMoment`,
    name: `"My" Moment`,
    details: `Brant gains additional ATK based on his Energy Regen: For every 1% of his Energy Regen over 150%, Brant gains additional 20 points of ATK, up to 2600.`,
    hasStacks: false,
    modifiers: [
      {
        // supports ER that has a decimal (e.g. 250.2), and the .2 gives you a little ATK
        modifier: "ATK_FLAT:AdditionalBase",
        modifierValue: 2.0,
        maximumValue: 2600,
        modifierStep: 0.1,
        modifierBasedOn: "EnergyRegen",
        modifierTargetAttr: "ATK_FLAT",
        minStatValue: 1.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
    replacesBuff: "TheatricalMoment",
  },
  {
    key: `TheatricalMoment`,
    name: `Theatrical Moment`,
    details: `Brant gains additional ATK based on his Energy Regen: For every 1% of his Energy Regen over 150%, Brant gains additional 12 points of ATK, up to 1560.`,
    hasStacks: false,
    modifiers: [
      {
        // supports ER that has a decimal (e.g. 250.2), and the .2 gives you a little ATK
        // the 2 won't affect the calcs, it's to avoid collision with the first buff
        modifier: "ATK_FLAT2:AdditionalBase",
        modifierValue: 1.2,
        maximumValue: 1560,
        modifierStep: 0.1,
        modifierBasedOn: "EnergyRegen",
        modifierTargetAttr: "ATK_FLAT",
        minStatValue: 1.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
    replacedBy: "MyMoment",
  },
  {
    key: "InherentSkillVoyagersBlaze",
    name: "Inherent Skill: Voyager's Blaze",
    details: `Healing provided by <span class="Highlight">Waves of Acclaims</span> is increased by 20%.`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["WavesofAcclaimsHealing"],
        modifierValue: 0.2,
      },
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
