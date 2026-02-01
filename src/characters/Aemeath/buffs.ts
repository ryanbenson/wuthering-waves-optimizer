export const buffs = [
  {
    key: `HighSyntonyField`,
    name: `High Syntony Field`,
    details: `<div><span class="Highlight"><strong>High Syntony Field</strong></span> lasts for 25s.<br>
- Increases the DEF of all nearby Resonators in the team within the <span class="Highlight"><strong>High Syntony Field</strong></span> by 20%.<br>
- Inherits the <span class="Highlight"><strong>Syntony Field</strong></span>'s boost to resistance to interruption and <span class="Highlight">Off-Tune Buildup Rate</span>.<br>
- Inherits the <span class="Highlight"><strong>Syntony Field</strong></span>'s healing effect and increases the Healing Multiplier by 40%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEF",
        modifierValue: 0.2,
      },
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["SyntonyFieldHealing"],
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `CriticalProtocol`,
    name: `Critical Protocol`,
    details: `<div>For every 1% of Mornye's Energy Regen exceeding 100%, this skill gains an additional 0.5% Crit. Rate (up to 80%) and 1% Crit. DMG (up to 160%).</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate:AdditionalBase",
        modifierValue: 0.005,
        maximumValue: 0.8,
        modifierStep: 1,
        modifierBasedOn: "EnergyRegen",
        modifierTargetAttr: "CritRate",
        minStatValue: 1,
        modifySpecificTalents: ["CriticalProtocolDMG"],
      },
      {
        modifier: "CritDMG:AdditionalBase",
        modifierValue: 0.01,
        maximumValue: 1.6,
        modifierStep: 1,
        modifierBasedOn: "EnergyRegen",
        modifierTargetAttr: "CritDMG",
        minStatValue: 1,
        modifySpecificTalents: ["CriticalProtocolDMG"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "OutroSkillRecursion",
    name: "Outro Skill: Recursion",
    details: `<div class="skilldescription">Resonators in the team gain 25% All DMG Amplification for 30s.</div>`,
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
    key: `InherentSkillBlueprint`,
    name: `Inherent Skill: Blueprint`,
    details: `<div>Mornye's Energy Regen is increased by 10%.<br>Casting <span class="Highlight"><strong>Intro Skill - Convergence</strong></span> restores 20 points of Concerto Energy, triggered once every 20s.<br>Casting <span class="Highlight"><strong>Basic Attack - Wide Field Observation Mode Stage 3</strong></span> restores 20 points of Concerto Energy, triggered once every 20s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnergyRegen",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillBoundedness`,
    name: `Inherent Skill: Boundedness`,
    details: `<div>Casting <span class="Highlight"><strong>Resonance Skill - Expectation Error</strong></span> or <span class="Highlight"><strong>Resonance Skill - Distributed Array</strong></span> grants <span class="Highlight"><strong>Proof of Boundedness</strong></span> to all Resonators in the team:<br>- <span class="Highlight"><strong>Proof of Boundedness</strong></span> lasts for 60s and can be gained once every 5 min.<br>- When the active Resonator takes DMG greater than 30% of their Max HP, they instead take DMG equal to 30% of their Max HP. This effect can trigger up to 3 times. <span class="Highlight"><strong>Proof of Boundedness</strong></span> is removed after triggering it 3 times.<br>- When the active Resonator takes a fatal blow, they are not downed by this instance of damage. This effect can trigger up to 1 time. <span class="Highlight"><strong>Proof of Boundedness</strong></span> is removed after triggering it 1 time.<br>- When <span class="Highlight"><strong>Proof of Boundedness</strong></span> is removed, the active Resonator restores HP equal to 150% of Mornye's DEF.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["InherentSkillBoundedness"],
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
