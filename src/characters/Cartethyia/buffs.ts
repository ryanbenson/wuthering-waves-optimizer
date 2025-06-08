export const buffs = [
  {
    key: `Manifest`,
    name: `Manifest`,
    details: `During <span class="Highlight">Manifest, Fleurdelys</span> gains 60% Aero DMG Bonus.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Aero",
        modifierValue: 0.6,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `MandateofDivinity`,
    name: `Mandate of Divinity`,
    details: `When <span class="Highlight">Fleurdelys</span> has <span class="Highlight">Mandate of Divinity</span> in <span class="Highlight">Manifest</span>:<br>
<span class="Wind">Aero Erosion</span> DMG is Amplified by 50% and the damage interval is decreased by 50% for enemies within a certain distance from <span class="Highlight">Fleurdelys</span>.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGDeepen:AeroErosion",
        modifySpecificTalents: ["AeroErosion"],
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `BladeofHowlingSquallAeroErosionStacks`,
    name: `Blade of Howling Squall: Aero Erosion Stack`,
    details: `Upon hitting the target, remove all stacks of <span class="Wind">Aero Erosion</span> on the target. Each stack removed Amplifies the DMG taken by the targets by 20%, up to 5 stacks.`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "DMGDeepen",
        modifySpecificTalents: ["BladeofHowlingSquallDMG"],
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 5,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillAHeartsTruestWishes`,
    name: `Inherent Skill: A Heart's Truest Wishes`,
    details: ``,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillWindsIndelibleImprintFirstStacks`,
    name: `Inherent Skill: Wind's Indelible Imprint: First Stacks`,
    details: `Targets with 1 to 3 stacks of Aero Erosion take 30% more DMG from Cartethyia and Fleurdelys.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGBonus",
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillWindsIndelibleImprintAdditionalStacks`,
    name: `Inherent Skill: Wind's Indelible Imprint: Additional Stacks`,
    details: `Targets with more than 3 stacks of Aero Erosion additionally take 10% more DMG from Cartethyia and Fleurdelys for each stack of Aero Erosion they have, up to 3 stacks.`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "DMGBonus",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 3,
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
    key: "StatBonusHP1",
    name: "Stat Bonus: HP+",
    details: `<div class="skilldescription">HP increased by 1.8%.</div>`,
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
    details: `<div class="skilldescription">HP increased by 1.8%.</div>`,
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
    details: `<div class="skilldescription">HP increased by 4.2%.</div>`,
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
    details: `<div class="skilldescription">HP increased by 4.2%.</div>`,
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
