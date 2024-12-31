export const buffs = [
  {
    key: "Deconstruction",
    name: "Deconstruction",
    details: `<div class="skilldescription">Carlotta ignores 18% of the target's defense when dealing damage to a target affected by <span class="Highlight">Deconstruction</span>.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEFIgnore",
        modifierValue: 0.18,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "FinalBow",
    name: "Final Bow",
    details: `<span class="Title">Final Bow</span><br>When Substance is full, enter the <span class="Highlight">Final Bow</span> state.<br>Increase the DMG Multiplier of Resonance Liberation <span class="Highlight">Era of New Wave </span>, Resonance Liberation <span class="Highlight">Death Knell</span>, and Resonance Liberation <span class="Highlight">Fatal Finale</span> by 80%. This effect ends when Carlotta is switched off the field during <span class="Highlight">Twilight Tango</span> or when <span class="Highlight">Twilight Tango</span> ends.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "EraofNewWaveDMG",
          "DeathKnellDMG",
          "FatalFinaleDMG",
        ],
        modifierValue: 0.8,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillFlawlessPurity",
    name: "Inherent Skill: Flawless Purity",
    details: `<div class="skilldescription">After casting Resonance Skill <span class="Highlight">Chromatic Splendor</span>, Carlotta can perform <span class="Highlight">Mid-air Attacks</span> while being immune to any DMG or interruptions before the Mid-air Attack deals DMG.<br>When Carlotta is on the team, the Resonator on the field's Flight STA cost is reduced by 20%.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillArsGratiaArtis",
    name: "Inherent Skill: Ars Gratia Artis",
    details: `<div class="skilldescription">Intro Skill <span class="Highlight">Wintertime Aria</span>, Resonance Skill <span class="Highlight">Chromatic Splendor</span>, Resonance Liberation <span class="Highlight">Death Knell</span>, and Heavy Attack <span class="Highlight">Imminent Oblivion</span> can inflict <span class="Highlight">Deconstruction</span>.</div>`,
    hasStacks: false,
    modifiers: [],
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
