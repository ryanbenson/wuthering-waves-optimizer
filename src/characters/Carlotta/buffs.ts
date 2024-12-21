export const buffs = [
  {
    key: "Dissociation",
    name: "Dissociation",
    details: `<div class="skilldescription">Carlotta ignores 18% of the target's defense when dealing damage to a target affected by <span class="Highlight">Dissociation</span>.</div>`,
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
    key: "GrandUnveiling",
    name: "Grand Unveiling",
    details: `<div class="skilldescription"Increase the <span class="Highlight">DMG Multiplier</span> of Resonance Liberation <span class="Highlight">New Wave Era</span>, Resonance Liberation <span class="Highlight">Death's Omen</span>, Resonance Liberation <span class="Highlight">Death's End</span> by 80%. Switching to other Resonators ends this effect.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "NewWaveEraDMG",
          "DeathOmenDMG",
          "DeathsEndDMG",
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
    details: `<div class="skilldescription">After casting the Resonance Skill Brilliant Will, performing an Aerial Attack within a certain time grants immunity to damage and being hit before the attack deals damage.<br>
When Carlotta is in the team, Stamina consumption for airborne maneuvers by active characters is reduced by 20%.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "InherentSkillArtAboveAll",
    name: "Inherent Skill: Art Above All",
    details: `<div class="skilldescription">The Intro Skill Winter's Sigh, Resonance Skill Brilliant Will, Resonance Liberation Death Omen, and Heavy Attack End of the Road can inflict the Dissociation effect on hit targets.</div>`,
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
