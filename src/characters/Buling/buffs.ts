export const buffs = [
  {
    key: `BamboosShade`,
    name: `Bamboo's Shade`,
    details: `<span class="ingame-Title">Bamboo's Shade</span></span><br>When Qiuyuan reaches 400 points of <te href="141101">Swordster's Soliloquy</te>, he gains the <span class="ingame-Highlight">Bamboo's Shade</span> effect, granting all nearby active Resonators in the team 30% Echo Skill DMG Bonus for 30s.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EchoDMGBonus",
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SunderingStrike`,
    name: `Sundering Strike`,
    details: `For every 1% of Qiuyuan's Crit. Rate over 50%, this skill increases the Crit. DMG of all nearby active Resonators in the team by 2% for 30s, up to 30%.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG:AdditionalBase",
        modifierValue: 0.0002,
        maximumValue: 0.3,
        modifierStep: 0.01,
        modifierBasedOn: "CritRate",
        modifierTargetAttr: "CritDMG",
        minStatValue: 50,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillQuietudeWithin`,
    name: `Inherent Skill: Quietude Within`,
    details: `<div>Qiuyuan obtains <span class="ingame-Highlight">Quietude Within</span> for 10s upon entering the <a onclick="showTermExplan(141102,event)" class="ingame-term-desc">Inksplash of Mind</a> state. This effect can be triggered once every 22s.<br>Heavy Attack <span class="ingame-Highlight">Thus Spoke the Blade: To Teach</span>, <span class="ingame-Highlight">Thus Spoke the Blade: To Save</span>, and <span class="ingame-Highlight">Thus Spoke the Blade: To Sacrifice</span> deal 50% more DMG. <span class="ingame-Highlight">Thus Spoke the Blade: To Sacrifice</span> additionally restores 30 points of Concerto Energy on hit.<br>- This effect ends early when Qiuyuan is switched off the field.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "specialMultiplier",
        modifySpecificTalents: [
          "ThusSpoketheBladeToTeachDMG",
          "ThusSpoketheBladeToSaveDMG",
          "ThusSpoketheBladeToSacrificeDMG",
        ],
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillDrinkAwayWoesAgeOld`,
    name: `Inherent Skill: Drink Away Woes Age-Old`,
    details: `<div>When casting Echo Skill, Qiuyuan's bamboo flask absorbs the overflowing energy and brews it into <span class="ingame-Highlight">Flowing Panacea</span>.<br>The next time <a onclick="showTermExplan(141101,event)" class="ingame-term-desc">Swordster's Soliloquy</a> is obtained, the <span class="ingame-Highlight">Flowing Panacea</span> is consumed to gain 10% ATK increase for 20s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.1,
      },
    ],
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
