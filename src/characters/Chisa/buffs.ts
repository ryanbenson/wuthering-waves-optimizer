export const buffs = [
  {
    key: `RingofChainsaw`,
    name: `Ring of Chainsaw`,
    details: `<div>Every 1 point of <span class="Highlight"><strong>Ring of Chainsaw</strong></span> consumed by <span class="Highlight"><strong>Sawring - Blitz</strong></span> and <span class="Highlight"><strong>Chainsaw Mode - Dodge Counter</strong></span> increases the DMG Multiplier of the next <span class="Highlight"><strong>Sawring - Eradication</strong></span>. Up to 100 points will be counted toward this effect.</ddiv>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "Talent",
        modifierTalentKey: "SawringEradicationDMG",
        modifierValue: {
          "1": 0.013,
          "2": 0.0142,
          "3": 0.0152,
          "4": 0.0167,
          "5": 0.0178,
          "6": 0.0189,
          "7": 0.0207,
          "8": 0.0224,
          "9": 0.0240,
          "10": 0.0259,
        },
        modifierValueTalentRef: "forte",
      },
    ],
    minStacks: 0,
    maxStacks: 100,
    alwaysEnabled: false,
  },
  {
    key: `WovenMyriadConvergence`,
    name: `Woven Myriad - Convergence`,
    details: `<span class="Title"><strong>Woven Myriad - Convergence</strong></span><br>The DMG Multipliers of <span class="Highlight"><strong>Sawring - Blitz</strong></span>, <span class="Highlight"><strong>Chainsaw Mode - Dodge Counter</strong></span>, and <span class="Highlight"><strong>Sawring - Eradication</strong></span> are increased by 120%.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "SawringBlitzStage1DMG",
          "SawringBlitzStage2DMG",
          "SawringBlitzStage2HoldDMG",
          "SawringBlitzStage2DiscordanceDMG",
          "SawringBlitzStage3DMG",
          "SawringBlitzStage3HoldDMG",
          "SawringBlitzStage3FalltoneDMG",
        ],
        modifierValue: 1.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `WovenMyriadConvergenceRingofChainsawConsumed`,
    name: `Woven Myriad - Convergence - Ring of Chainsaw Consumed`,
    details: `<span class="Title"><strong>Woven Myriad - Convergence</strong></span><br>The bonus DMG Multiplier for <span class="Highlight"><strong>Sawring - Eradication</strong></span> granted by <span class="Highlight"><strong>Sawring- Blitz</strong></span> and <span class="Highlight"><strong>Chainsaw Mode - Dodge Counter</strong></span> when <span class="Highlight"><strong>Ring of Chainsaw</strong></span> is consumed additionally increases by 120%.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "SawringEradicationDMG",
          "ChainsawModeDodgeCounterDMG",
          "ChainsawModeDodgeCounterHoldDMG",
        ],
        modifierValue: 1.2,
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
