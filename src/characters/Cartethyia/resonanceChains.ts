export const resonanceChains = [
  {
    key: "SequenceNode1CrownDestinedbyFate",
    name: "Sequence Node 1: Crown Destined by Fate",
    details: `...Each time when Fleurdelys's Resolve hits 30/60/90/120, her Crit. DMG is increased by 25% for 15s. `,
    hasStacks: true,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 4,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2BladeBrokenbyTempest",
    name: "Sequence Node 2: Blade Broken by Tempest",
    details: `...The DMG Multipliers of Cartethyia's Basic Attack, Heavy Attack, Dodge Counter, and Intro Skill are increased by 50% and the DMG Multiplier of her Mid-air Attack is increased by 200%....`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "Stage1DMG",
          "Stage2DMG",
          "Stage3DMG",
          "Stage4DMG",
          "DodgeCounterDMG",
          "HeavyAttackDMG",
          "SwordtoMarkTidesTraceDMG",
        ],
        modifierValue: 0.5,
      },
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "MidairAttackDMG",
          "MidairAttack1SwordShadowRecalledDMG",
          "MidairAttack2SwordShadowsRecalledDMG",
          "MidairAttack3SwordShadowsRecalledDMG",
        ],
        modifierValue: 2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3PrisonerHangedintheTower",
    name: "Sequence Node 3: Prisoner Hanged in the Tower",
    details: `...The DMG Multiplier of Resonance Skill - Blade of Howling Squall is increased by 100%.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["BladeofHowlingSquallDMG"],
        modifierValue: 1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4SacrificeMadeforSalvation",
    name: "Sequence Node 4: Sacrifice Made for Salvation",
    details: `When Resonators in the team inflict Havoc Bane, Fusion Burst, Spectro Frazzle, Electro Flare, Glacio Chafe and Aero Erosion, all Resonators in the team gain 20% DMG Bonus for all Attributes for 20s.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.2,
      },
      {
        modifier: "Glacio",
        modifierValue: 0.2,
      },
      {
        modifier: "Electro",
        modifierValue: 0.2,
      },
      {
        modifier: "Aero",
        modifierValue: 0.2,
      },
      {
        modifier: "Havoc",
        modifierValue: 0.2,
      },
      {
        modifier: "Spectro",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5HopeReshapedinStorms",
    name: "Sequence Node 5: Hope Reshaped in Storms",
    details: `... instead gain a Shield equal to 20% of Cartethyia's Max HP for 10s`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["Sequence5HopeReshapedinStormsShield"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6FreedomFoundinStormsWake",
    name: "Sequence Node 6: Freedom Found in Storm's Wake",
    details: `...The targets take 40% more DMG from Fleurdelys.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGBonus",
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
