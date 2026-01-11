export const buffs = [
  {
    key: `InterferedMarker`,
    name: `Interfered Marker`,
    details: `<div>Targets affected by <span class="Highlight">Tune Rupture - Interfered</span> or <span class="Highlight">Tune Strain - Interfered</span> take increased DMG from all nearby Resonators in the team. For every 1% of Mornye's Energy Regen exceeding 100%, their DMG is increased by 0.25%, up to 40%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGBonus:AdditionalBase",
        modifierValue: 0.0025,
        maximumValue: 0.4,
        modifierStep: 1,
        modifierBasedOn: "EnergyRegen",
        modifierTargetAttr: "DMGBonus",
        minStatValue: 1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `HighSyntonyField`,
    name: `High Syntony Field`,
    details: `<div><span class="Highlight">High Syntony Field</span> lasts for 25s.<br>
- Increases the DEF of all nearby Resonators in the team within the <span class="Highlight">High Syntony Field</span> by 20%.<br>
- Inherits the <span class="Highlight">Syntony Field</span>'s boost to resistance to interruption and <span class="Highlight">Off-Tune Buildup Rate</span>.<br>
- Inherits the <span class="Highlight">Syntony Field</span>'s healing effect and increases the Healing Multiplier by 40%.</div>`,
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
    key: "StatBonusHealingBonus1",
    name: "Stat Bonus: Healing Bonus+",
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
    key: "StatBonusHealingBonus2",
    name: "Stat Bonus: Healing Bonus+",
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
    key: "StatBonusHealingBonus3",
    name: "Stat Bonus: Healing Bonus+",
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
    key: "StatBonusHealingBonus4",
    name: "Stat Bonus: Healing Bonus+",
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
    key: "StatBonusDEF1",
    name: "Stat Bonus: DEF+",
    details: `<div class="skilldescription">DEF increased by 2.28%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEF",
        modifierValue: 0.0228,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusDEF2",
    name: "Stat Bonus: DEF+",
    details: `<div class="skilldescription">DEF increased by 2.28%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEF",
        modifierValue: 0.0228,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusDEF3",
    name: "Stat Bonus: DEF+",
    details: `<div class="skilldescription">DEF increased by 5.32%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEF",
        modifierValue: 0.0532,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "StatBonusDEF4",
    name: "Stat Bonus: DEF+",
    details: `<div class="skilldescription">DEF increased by 5.32%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEF",
        modifierValue: 0.0532,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
