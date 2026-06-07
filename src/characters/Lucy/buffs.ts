export const buffs = [
  {
    key: "SQL",
    name: "SQL",
    details: `<div>After casting <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Deadlock</span>, Lucy enters <span style="color:#ffd12f;" class="font-bold">Algorithm Compaction</span> and gains 1 stacks of <span style="color:#ffd12f;" class="font-bold">SQL</span>.<br>While in <span style="color:#ffd12f;" class="font-bold">Algorithm Compaction</span>, casting <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Deadlock</span> will not grant <span style="color:#ffd12f;" class="font-bold">SQL</span> again.<br>When casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Multi-threading</span>, if Lucy has <span style="color:#ffd12f;" class="font-bold">SQL</span>, increase this attack's DMG Multiplier by 270% and remove <span style="color:#ffd12f;" class="font-bold">SQL</span>.<br>When casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Multi-threading</span>, if Lucy does not have <span style="color:#ffd12f;" class="font-bold">SQL</span>, she loses 20% of current HP. If Lucy's HP is below 1%, no HP is consumed.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["HeavyAttackMultithreadingDMG"],
        modifierValue: 2.7,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SpoofingProgramCyberwareMalfunction",
    name: "Spoofing Program: Cyberware Malfunction",
    details: `<div>Requires 4 RAM. Marked targets take 5% more DMG for 30s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "specialMultiplier",
        modifierValue: 0.05,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SpoofingProgramBreachProtocol",
    name: "Spoofing Program: Breach Protocol",
    details: `<div>Requires 4 RAM. Marked targets' DEF is reduced by 5% for 30s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEFIgnore",
        modifierValue: 0.05,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "AlgorithmCompaction",
    name: "Algorithm Compaction",
    details: `<div>After casting <span style="color:#f7ca2f"><strong>Resonance Skill - Deadlock</strong></span>, Lucy enters Algorithm Compaction and gains 1 stacks of SQL. Her Basic Attack is replaced with <span style="color:#f7ca2f"><strong>Basic Attack - Thread Shredding</strong></span>, and Heavy Attack is replaced with <span style="color:#f7ca2f"><strong>Heavy Attack - Single Threading</strong></span>. Lucy's Spectro DMG Bonus is increased by 65% for 8s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Spectro",
        modifierValue: 0.65,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillGhostCyberware`,
    name: `Inherent Skil: Ghost Cyberware`,
    details: `<div>When Lucy is the active Resonator in the team, if she takes no damage for 8s, she gains 1 stack of <span style="color:#f7ca2f"><strong>Optical Illusion</strong></span>. Max 1 stack by default.<br><span style="color:#f7ca2f"><strong>Optical Illusion</strong></span>: When attacked, reduce this instance of DMG by 100%. If Lucy is hit or launched from the attack, she immediately recovers and triggers a successful <span style="color:#f7ca2f"><strong>Dodge</strong></span> if she's on the ground. After this effect is triggered, remove 1 stack of <span style="color:#f7ca2f"><strong>Optical Illusion</strong></span>. This effect can be triggered up to 1 time every 0.5s.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillFunctionCracking`,
    name: `Inherent Skill: Function Cracking`,
    details: `<div>When <span style="color:#f7ca2f"><strong>Resonance Skill - Payload</strong></span>, <span style="color:#f7ca2f"><strong>Resonance Skill - Pulse Interference</strong></span>, or <span style="color:#f7ca2f"><strong>Resonance Skill - Deadlock</strong></span> damages an <span style="color:#f7ca2f"><strong>Overlord Class</strong></span> or <span style="color:#f7ca2f"><strong>Calamity Class</strong></span> enemy, Lucy applies <span style="color:#f7ca2f"><strong>Botnet Mark</strong></span> on them for 2 min. While <span style="color:#f7ca2f"><strong>Botnet Mark</strong></span> is active, when a Resonator in the team defeats that target with direct damage, Lucy gains the <span style="color:#f7ca2f"><strong>Network Backdoor</strong></span> effect. If Rebecca is in the team, she gains the same effect.<br><br><span style="color:#a89969"><strong>Network Backdoor</strong></span><br>Grants 10% All DMG Amplification and 10% additional Hack DMG Multiplier. This effect lasts for 2 min and stacks up to 2 times. At 2 stacks, additionally increases All DMG Amplification by 5% and Hack DMG Multiplier by 5%. When Lucy is downed, she can no longer gain <span style="color:#f7ca2f"><strong>Network Backdoor</strong></span>, and any existing <span style="color:#f7ca2f"><strong>Network Backdoor</strong></span> effects become invalid.</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "DMGDeepen",
        modifierValue: 0.1,
      },
      {
        modifier: "DMGDeepen:Hack",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 2,
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
