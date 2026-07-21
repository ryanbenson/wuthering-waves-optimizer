export const buffs = [
  {
    name: `Careless Landscape`,
    key: `CarelessLandscape`,
    details: `<div>Casting the skill deploys <span style="color:#ffd12f;" class="font-bold">Ceaseless Landscape</span> that lasts for 30s. When <span style="color:#ffd12f;" class="font-bold">Ceaseless Landscape</span> is active, Suisui enters the <span style="color:#ffd12f;" class="font-bold">Roaming Transcendent</span> state when casting <span style="color:#ffd12f;" class="font-bold">Outro Skill - Rippling Waters</span>.<br><span style="color:#ffd12f;" class="font-bold">Ceaseless Landscape</span> grants all nearby Resonators in the team the following enhancements:<br>- Inflicting a target with <span style="color:#ffd12f;" class="font-bold">Spectro Frazzle</span>, <span style="color:#ffd12f;" class="font-bold">Fusion Burst</span>, <span style="color:#ffd12f;" class="font-bold">Glacio Chafe</span>, and <span style="color:#ffd12f;" class="font-bold">Aero Erosion</span>, or dealing the corresponding Negative Status DMG increases the max stack limit of <span style="color:#ffd12f;" class="font-bold">Negative Status</span> the target can receive by 3 for 15s. This effect does not stack.<br>- Inflicting a target with <span style="color:#ffd12f;" class="font-bold">Electro Flare</span> or dealing the corresponding Negative Status DMG increases the max stack limits of <span style="color:#ffd12f;" class="font-bold">Electro Flare</span> and <span style="color:#ffd12f;" class="font-bold">Electro Rage</span> the target can receive by 3 for 15s. This effect does not stack.<br>- Consuming <span style="color:#ffd12f;" class="font-bold">Havoc Bane</span> stacks on the target after landing a skill allows the Resonator's Havoc DMG to ignore the target's DEF by 6% and Havoc RES by 12% for 30s. This effect does not stack.<br>Can be cast in mid-air close to the ground.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEFIgnore:Havoc",
        modifierValue: 0.06,
      },
      {
        modifier: "ResistShred:Havoc",
        modifierValue: 0.12,
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
    details: `<div>Consuming <span style="color:#ffd12f;" class="font-bold">Enrichment</span> grants the Resonator 10 stacks of <span style="color:#ffd12f;" class="font-bold">Spring's Birth</span>, up to 10 stacks. When the Resonator with <span style="color:#ffd12f;" class="font-bold">Spring's Birth</span> is not at full HP, restore their HP by 62 + 0.34% of Suisui's Max HP at the cost of 1 stack of <span style="color:#ffd12f;" class="font-bold">Spring's Birth</span> every 2s.<br><size=10></span><br>When <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Awakening Spring</span> and <span style="color:#ffd12f;" class="font-bold">Intro Skill - Tinkling Jade</span> hit a target, they additionally restore 18 points of Concerto Energy and 13 points of Resonance Energy, and increase the attack's Crit. Rate by 80% and Glacio DMG by 240%. This effect can be triggered up to once every 25s.</div>`,
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
        modifier: "Glacio",
        modifySpecificTalents: ["AwakeningSpringDMG", "TinklingJadeDMG"],
        modifierValue: 2.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillGlimmeringGold`,
    name: `Inherent Skill: Glimmering Gold`,
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
