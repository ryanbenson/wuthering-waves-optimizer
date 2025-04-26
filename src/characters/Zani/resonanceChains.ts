export const resonanceChains = [
  {
    key: "SequenceNode1WhentheAlarmClockRings",
    name: "Sequence Node 1: When the Alarm Clock Rings",
    details: ``,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Spectro",
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2StaleBreadWithEnergyDrink",
    name: "Sequence Node 2: Stale Bread With Energy Drink",
    details: ``,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.2,
      },
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["TargetedActionDMG", "ForcibleRiposteDMG"],
        modifierValue: 0.8,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3EachDayANewCommute",
    name: "Sequence Node 3: Each Day A New Commute",
    details: ``,
    hasStacks: true,
    modifiers: [
      {
        modifier: "talentModifierMultiplyAdd",
        modifySpecificTalents: ["TheLastStandDMG"],
        modifierValue: 0.08,
      },
    ],
    minStacks: 0,
    maxStacks: 150,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4MoreEfficiencyLessDrama",
    name: "Sequence Node 4: More Efficiency, Less Drama",
    details: ``,
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
    key: "SequenceNode5DeliveredInFullOnTime",
    name: "Sequence Node 5: Delivered In Full On Time",
    details: ``,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["RekindleDMG"],
        modifierValue: 1.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6FirstThingsFirstClockOut",
    name: "Sequence Node 6: First Things First? Clock Out!",
    details: ``,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "HeavySlashDaybreakDMG",
          "HeavySlashDawningDMG",
          "HeavySlashNightfallDMG",
          "HeavySlashLightsmashDMG",
        ],
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
