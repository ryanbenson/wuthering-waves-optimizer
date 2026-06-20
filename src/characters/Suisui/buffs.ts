export const buffs = [
  {
    name: `Careless Landscape`,
    key: `CarelessLandscape`,
    details: `<span style="color:#f7ca2f"><strong>Careless Landscape</strong></span> grants all nearby Resonators in the team the following enhancements:
- Inflicting a target with <span style="color:#f7ca2f"><strong>Spectro Frazzle</strong></span>, <span style="color:#f7ca2f"><strong>Fusion Burst</strong></span>, <span style="color:#f7ca2f"><strong>Glacio Chafe</strong></span>, and <span style="color:#f7ca2f"><strong>Aero Erosion</strong></span> increases the max stack limit of Negative Status the target can receive by 3 for 15s. This effect does not stack.
- Inflicting a target with <span style="color:#f7ca2f"><strong>Electro Flare</strong></span> increases the max stack limits of <span style="color:#f7ca2f"><strong>Electro Flare</strong></span> and <span style="color:#f7ca2f"><strong>Electro Rage</strong></span> the target can receive by 3 for 15s. This effect does not stack.
- Inflicting a target with <span style="color:#f7ca2f"><strong>Havoc Bane</strong></span> allows the Resonator's Havoc DMG to ignore the target's DEF and Havoc RES by 15% and 15% respectively for 15s. This effect does not stack.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEFIgnore:Havoc",
        modifierValue: 0.15,
      },
      {
        modifier: "ResistShred:Havoc",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    name: `Outro Skill: Rippling Waters`,
    key: `OutroSkillRipplingWaters`,
    details: `Resonators in the team gain 25% All DMG Amplification for 30s.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGDeepen",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillSkyOverWater`,
    name: `Inherent Skill: Sky Over Water`,
    details: `<div>Consuming <span style="color:#ffd12f;" class="font-bold">Enrichment</span> grants the Resonator 10 stacks of <span style="color:#ffd12f;" class="font-bold">Spring’s Birth</span>, up to 10 stacks. When the Resonator with <span style="color:#ffd12f;" class="font-bold">Spring’s Birth</span> is on the field and not at full HP, restore their HP by 62 + 0.34% of Suisui's Max HP at the cost of 1 stack of <span style="color:#ffd12f;" class="font-bold">Spring’s Birth</span> every 2s.<br><size=10></span><br><br><span style="color:#ffd12f;" class="font-bold">Resonance Skill - Awakening Spring</span> and <span style="color:#ffd12f;" class="font-bold">Intro Skill - Tinkling Jade</span> additionally restore 20 and 13 Concerto Energy and Resonance Energy respectively on hit, while also increasing their respective Crit. Rate and Glacio DMG dealt by 80% and 240%. This effect can be triggered once every 25s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["InherentSkillSkyOverWater"],
      },
      {
        modifier: "CritRate",
        modifySpecificTalents: ["AwakeningSpringDMG", "TinklingJadeDMG"],
        modifierValue: 0.8,
      },
      {
        modifier: "CritDMG",
        modifySpecificTalents: ["AwakeningSpringDMG", "TinklingJadeDMG"],
        modifierValue: 2.4,
      },
    ],
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
