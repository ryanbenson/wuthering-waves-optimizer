export const resonanceChains = [
  {
    key: "SequenceNode2SilentStrengthCR",
    name: "Sequence Node 2: Silent Strength - Crit Rate",
    details: `<span class="skilldescription">The Crit. Rate and Crit. DMG of Resonance Liberation <span class="Highlight">Unmovable</span> is increased by 20% and 20%, respectively.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.2,
      },
      {
        modifier: "CritDMG",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4HeavyliftingDuty",
    name: "Sequence Node 4: Heavylifting Duty",
    details: `<span class="skilldescription">When Taoqi successfully triggers Heavy Attack <span class="Highlight">Strategic Parry</span>, she restores 25% HP and increases her DEF by 50% for 5s. This can be triggered once every 15s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEF",
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5BenevolentGuardian",
    name: "Sequence Node 5: Benevolent Guardian",
    details: `<span class="skilldescription">The damage of Forte Circuit <span class="Highlight">Power Shift</span> is increased by 50%. When Forte Circuit <span class="Highlight">Power Shift</span> hits a target, restore 20 Resonance Energy.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: [
          "TimedCountersPart1DMG",
          "TimedCountersPart2DMG",
          "TimedCountersPart3DMG",
        ],
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6DefenderofPeace",
    name: "Sequence Node 6: Defender of Peace",
    details: `<span class="skilldescription">The damage of Taoqi's Basic Attack and Heavy Attack is increased by 40% while the Shield granted by Resonance Skill <span class="Highlight">Rocksteady Shield</span> holds.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "BasicAttackDMGBonus",
        modifierValue: 0.4,
      },
      {
        modifier: "HeavyAttackDMGBonus",
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
