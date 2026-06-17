export const buffs = [
  {
    key: `InherentSkillSkyOverWater`,
    name: `Inherent Skill: Sky Over Water`,
    details: `<div>Consuming <span style="color:#ffd12f;" class="font-bold">Enrichment</span> grants the Resonator 10 stacks of <span style="color:#ffd12f;" class="font-bold">Spring’s Birth</span>, up to 10 stacks. When the Resonator with <span style="color:#ffd12f;" class="font-bold">Spring’s Birth</span> is on the field and not at full HP, restore their HP by 62 + 0.0034% of Suisui's Max HP at the cost of 1 stack of <span style="color:#ffd12f;" class="font-bold">Spring’s Birth</span> every 2s.<br><size=10></span><br><br><span style="color:#ffd12f;" class="font-bold">Resonance Skill - Awakening Spring</span> and <span style="color:#ffd12f;" class="font-bold">Intro Skill - Tinkling Jade</span> additionally restore 20 and 13 Concerto Energy and Resonance Energy respectively on hit, while also increasing their respective Crit. Rate and Glacio DMG dealt by 50% and 240%. This effect can be triggered once every 25s.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillShiftingGold`,
    name: `Inherent Skill: Shifting Gold`,
    details: `<div>When a Resonator other than Suisui takes a fatal blow, they will not be knocked out but will instead regain 50% of Suisui's current HP, while Suisui herself loses the same amount of HP. Suisui's HP will not go below 1 from this effect. This effect can be triggered once every 10 minutes.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `StatBonusHealingBonus1`,
    name: `Stat Bonus: Healing Bonus+`,
    details: `<div class="skilldescription">Healing Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `StatBonusHealingBonus2`,
    name: `Stat Bonus: Healing Bonus+`,
    details: `<div class="skilldescription">Healing Bonus increased by 1.80%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifierValue: 0.018,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `StatBonusHealingBonus3`,
    name: `Stat Bonus: Healing Bonus+`,
    details: `<div class="skilldescription">Healing Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `StatBonusHealingBonus4`,
    name: `Stat Bonus: Healing Bonus+`,
    details: `<div class="skilldescription">Healing Bonus increased by 4.20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifierValue: 0.042,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `StatBonusHP1`,
    name: `Stat Bonus: HP+`,
    details: `<div class="skilldescription">HP increased by 1.80%.</div>`,
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
    key: `StatBonusHP2`,
    name: `Stat Bonus: HP+`,
    details: `<div class="skilldescription">HP increased by 1.80%.</div>`,
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
    key: `StatBonusHP3`,
    name: `Stat Bonus: HP+`,
    details: `<div class="skilldescription">HP increased by 4.20%.</div>`,
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
    key: `StatBonusHP4`,
    name: `Stat Bonus: HP+`,
    details: `<div class="skilldescription">HP increased by 4.20%.</div>`,
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
  }
];
