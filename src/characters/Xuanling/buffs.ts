export const buffs = [
  {
    key: `InherentSkillUnbrokenVow`,
    name: `Inherent Skill: Unbroken Vow`,
    details: `<div>When a target has 1 to 3 stacks of <span style="color:#ffd12f;" class="font-bold">Havoc Bane</span>, each stack of <span style="color:#ffd12f;" class="font-bold">Havoc Bane</span> Amplifies the DMG Yangyang: Xuanling deals to it by 10%.<br><size=10></span><br><br>When a target has 4 to 6 stacks of <span style="color:#ffd12f;" class="font-bold">Havoc Bane</span>, each stack of <span style="color:#ffd12f;" class="font-bold">Havoc Bane</span> Amplifies the DMG Yangyang: Xuanling deals to it by 12%.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillOneLifeOneBlade`,
    name: `Inherent Skill: One Life, One Blade`,
    details: `<div>When Yangyang: Xuanling casts Resonance Liberation <span style="color:#ffd12f;" class="font-bold">Hush of a Thousand Voices</span>, it applies <span style="color:#ffd12f;" class="font-bold">Havoc Bane</span> to the targets it hits, up to the maximum stacks.<br><size=10></span><br><br>When Resonators in the team apply <span style="color:#ffd12f;" class="font-bold">Havoc Bane</span> to a target, Xuanling gains 1 stack of <span style="color:#ffd12f;" class="font-bold">Windbound</span>. <span style="color:#ffd12f;" class="font-bold">Windbound</span> can be gained once every 1s, stacking up to 6 times.<br><size=10></span><br><br>When <span style="color:#ffd12f;" class="font-bold">Windbound</span> reaches 6 stacks, Yangyang: Xuanling removes all <span style="color:#ffd12f;" class="font-bold">Windbound</span> and gains <span style="color:#ffd12f;" class="font-bold">One with the Wind</span>.<br>While <span style="color:#ffd12f;" class="font-bold">One with the Wind</span> is active, when Xuanling casts <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Sword Stance Flow: Azure</span> or <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Sword Stance Flow: Feather</span>, she summons <span style="color:#ffd12f;" class="font-bold">Feather Release: Xuanling</span> to attack the target, applying 6 stacks of <span style="color:#ffd12f;" class="font-bold">Havoc Bane</span> to the target. <span style="color:#ffd12f;" class="font-bold">Feather Release: Xuanling</span> can trigger once every 5s.<br><size=10></span><br><br>Once <span style="color:#ffd12f;" class="font-bold">Feather Release: Xuanling</span> is successfully summoned, the <span style="color:#ffd12f;" class="font-bold">One with the Wind</span> state is removed.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `StatBonusCritRate1`,
    name: `Stat Bonus: Crit. Rate+`,
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
    key: `StatBonusCritRate2`,
    name: `Stat Bonus: Crit. Rate+`,
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
    key: `StatBonusCritRate3`,
    name: `Stat Bonus: Crit. Rate+`,
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
    key: `StatBonusCritRate4`,
    name: `Stat Bonus: Crit. Rate+`,
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
    key: `StatBonusATK1`,
    name: `Stat Bonus: ATK+`,
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
    key: `StatBonusATK2`,
    name: `Stat Bonus: ATK+`,
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
    key: `StatBonusATK3`,
    name: `Stat Bonus: ATK+`,
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
    key: `StatBonusATK4`,
    name: `Stat Bonus: ATK+`,
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
  }
];
