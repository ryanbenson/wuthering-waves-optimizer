export const buffs = [
  {
    key: `BlessingOfRunesEnergy`,
    name: `Blessing Of Runes`,
    details: `For every 1% of Sigrika's Energy Regen over 125%, Sigrika gains 2% Echo Skill DMG Bonus for up to 50%.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EchoDMGBonus:AdditionalBase",
        modifierValue: .02,
        maximumValue: .5,
        modifierStep: 1,
        modifierBasedOn: "EnergyRegen",
        modifierTargetAttr: "EchoDMGBonus",
        minStatValue: 1.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SchemataofRunes`,
    name: `Schemata of Runes`,
    details: `When consuming Runes, if Sigrika holds at least 30 points of Soliskin Vitality, consume 30 points to increase the DMG Multipliers of the current Runic Outburst, Runic Chain Whip, and Runic Soliskin by 50%`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["RunicOutburstDMG", "RunicChainWhipDMG", "RunicSoliskinDMG"],
        modifierValue: .5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SoliskinVitality`,
    name: `Soliskin Vitality`,
    details: `Every 10 points of Soliskin Vitality consumed grants the current Runic Outburst, Runic Chain Whip, and Runic Soliskin 15% DMG Amplification.`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "DMGDeepen",
        modifySpecificTalents: ["RunicOutburstDMG", "RunicChainWhipDMG", "RunicSoliskinDMG"],
        modifierValue: .15,
      },
    ],
    minStacks: 0,
    maxStacks: 60,
    alwaysEnabled: false,
    appliesOnEveryStep: 10,
  },
  {
    key: `InnateGift`,
    name: `Innate Gift?`,
    details: `Sigrika can hold up to 2 stacks of Innate Gift?. Each stack grants Runic Outburst, Runic Chain Whip, Runic Soliskin and Forte Circuit - Learn My True Name 30% DMG Amplification.
This effect ends after Sigrika casts Forte Circuit - Learn My True Name or is switched off the field.`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "DMGDeepen",
        modifySpecificTalents: [
          "RunicOutburstDMG",
          "RunicChainWhipDMG",
          "RunicSoliskinDMG",
          "ForteCircuitLearnMyTrueNameDMG",
        ],
        modifierValue: .3,
      },
    ],
    minStacks: 0,
    maxStacks: 2,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillTrueNamesInvoked`,
    name: `Inherent Skill: True Names Invoked`,
    details: `<div>Casting <span class="Highlight">Intro Skill - Solsworn Etymology</span> grants <span class="Highlight">Convergent</span> for 20s.<br><br><span class="Title">Convergent</span><br>The next time Sigrika obtains a <span class="Highlight">Rune</span>, she additionally obtains a <span class="Highlight">Rune</span> of the same type and removes <span class="Highlight">Convergent</span>.<br>When Sigrika holds <span class="Highlight">Divergent</span> and <span class="Highlight">Convergent</span> at the same time, <span class="Highlight">Convergent</span> takes priority.<br>When Sigrika holds 100 points of <span class="Highlight">Full Stop</span><, <span class="Highlight">Convergent</span> doesn't take effect.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillTrueNamesAligned`,
    name: `Inherent Skill: True Names Aligned`,
    details: `<div>When any nearby Resonators in the team cast Echo Skill, Sigrika gains a stack of <span class="Highlight">Blessing of Runes</span>, up to 6 stacks. Echoes with the same name can only trigger this effect once. <br>This effect resets upon a lineup change.<br><br><span class="Title">Blessing of Runes</span><br>Each stack of <span class="Highlight">Blessing of Runes</span> grants the active Resonator in the team 3% Aero DMG Bonus and 3% Echo Skill DMG Bonus.<br>When <span class="Highlight">Blessing of Runes</span> reaches 6 stacks. Sigrika gains an additional 30% increase in Aero DMG Bonus and Echo Skill DMG Bonus.</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "Aero",
        modifierValue: 0.03,
      },
      {
        modifier: "EchoDMGBonus",
        modifierValue: 0.03,
      },
    ],
    minStacks: 0,
    maxStacks: 6,
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
