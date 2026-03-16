export const resonanceChains = [
  {
    key: "SequenceNode1WhentheAlarmClockRings",
    name: "Sequence Node 1: When the Alarm Clock Rings",
    details: `<span class="skilldescription">Casting <span class="Highlight">Targeted Action</span> or <span class="Highlight">Forcible Riposte</span> gives 50% Spectro DMG Bonus for 14s.<br>Immune to interruptions while casting Resonance Skill <span class="Highlight">Heavy Slash - Nightfall</span>.</span>`,
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
    details: `<span class="skilldescription">Crit. Rate is increased by 20%.<br>The DMG Multiplier of <span class="Highlight">Targeted Action</span> and <span class="Highlight">Forcible Riposte</span> is increased by 80%.</span>`,
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
    details: `<span class="skilldescription">When in <span class="Highlight">Inferno Mode</span>, every 1 Blaze consumed increases the DMG Multiplier of Resonance Liberation <span class="Highlight">The Last Stand</span> by 8%, maxed at 1200%.</span>`,
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
    details: `<span class="skilldescription">When Intro Skill <span class="Highlight">Immediate Execution</span> is cast, ATK of all Resonators in the team is increased by 20% for 30s.</span>`,
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
    details: `<span class="skilldescription">The DMG Multiplier of Resonance Liberation <span class="Highlight">Rekindle</span> is increased by 120%.</span>`,
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
    details: `<span class="skilldescription">The DMG Multipliers of <span class="Highlight">Heavy Slash - Daybreak</span>, <span class="Highlight">Heavy Slash- Dawning</span>, <span class="Highlight">Heavy Slash - Nightfall</span>, and <span class="Highlight">Heavy Slash - Lightsmash</span> are increased by 40%.<br>Gain following effects when in <span class="Highlight">Inferno Mode</span>: <br>- When Blaze is lower than 70, restore 70 Blazes immediately. This effect is triggered once in <span class="Highlight">Inferno Mode</span>.<br>- Within 8s after entering <span class="Highlight">Inferno Mode</span>, Zani will remain standing with at least 1 HP if hit by a fatal blow.</span>`,
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
