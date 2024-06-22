export const resonanceChains = [
  {
    key: "SequenceNode2Versatility",
    name: "Sequence Node 2: Versatility",
    details: `<span class="skilldescription">After casting Intro Skill <span class="Highlight">Tactical Strike</span>, Jiyan gains 30 "Resolve" and his ATK is increased by 28% for 15s. This can be triggered once every 15s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.28,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3Spectation",
    name: "Sequence Node 3: Spectation",
    details: `<span class="skilldescription">When casting Resonance Skill <span class="Highlight">Windqueller</span>, Resonance Liberation <span class="Highlight">Emerald Storm: Prelude</span>, Resonance Skill <span class="Highlight">Emerald Storm: Finale</span> or Intro Skill <span class="Highlight">Tactical Strike</span>, Jiyan's Crit. Rate is increased by 16% and Crit. DMG is increased by 32% for 8s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.16,
      },
      {
        modifier: "CritDMG",
        modifierValue: 0.32,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4Prudence",
    name: "Sequence Node 4: Prudence",
    details: `<span class="skilldescription">When casting Resonance Liberation <span class="Highlight">Emerald Storm: Prelude</span> or Resonance Liberation <span class="Highlight">Emerald Storm: Finale</span>, the Heavy Attack DMG Bonus of all team members is increased by 25% for 30s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HeavyAttackDMGBonus",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5Resolution",
    name: "Sequence Node 5: Resolution",
    details: `<span class="skilldescription">The DMG multiplier of Outro Skill <span class="Highlight">Discipline</span> is increased by 120%.
    <br><br><em>Note: Outro skills are coming soon.</em></span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["Outro"],
        modifierValue: 1.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5Resolution",
    name: "Sequence Node 5: Resolution",
    details: `<span class="skilldescription">When Jiyan's attacks hit a target, his ATK is increased by 3% for 8s, stacking up to 15 times; this effect is immediately maxed after he casts Intro Skill <span class="Highlight">Tactical Strike</span>.</span>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.03,
      },
    ],
    minStacks: 0,
    maxStacks: 15,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6Fortitude",
    name: "Sequence Node 6: Fortitude",
    details: `<span class="skilldescription">Every time <span class="Highlight">Heavy Attack</span>, Intro Skill <span class="Highlight">Tactical Strike</span> or Resonance Skill <span class="Highlight">Windqueller</span> is used, Jiyan gains 1 stack(s) of "Momentum", stacking up to 2 times.
    <br>Resonance Liberation <span class="Highlight">Emerald Storm: Finale</span> will consume all "Momentum", and each stack consumed increases the DMG multiplier of Resonance Liberation <span class="Highlight">Emerald Storm: Finale</span> by 120%.</span>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["EmeraldStormFinaleDamage"],
        modifierValue: 1.2,
      },
    ],
    minStacks: 0,
    maxStacks: 2,
    alwaysEnabled: false,
  },
];
