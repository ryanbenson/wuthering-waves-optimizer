export const buffs = [
  {
    key: `TuneBreakBoost`,
    name: `Tune Break Boost`,
    details: `<div><span class="Highlight">Basic Attack - Visual Impact</span> consumes 3 points of <span class="Highlight">True Color</span> and grants all nearby Resonators in the team <span class="Param">40</span> points of <span class="Highlight">Tune Break Boost</span> for 30s. Responding to <span class="Highlight">Tune Strain - Interfered</span>: For each stack of <span class="Highlight">Tune Strain - Interfered</span> on the target, each point of Lynae's <span class="Highlight">Tune Break Boost</span> increases her total DMG against that target by 0.12%</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "tuneBreakDMGBonus",
        modifierValue: 0.0012,
      },
    ],
    minStacks: 0,
    maxStacks: 40,
    alwaysEnabled: false,
  },
  {
    key: `PrismaticOverblast`,
    name: `Prismatic Overblast`,
    details: `Casting this skill grants all nearby Resonators in the team 24% All DMG Bonus that lasts for 30s.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGBonus",
        modifierValue: 0.24,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillColorsNeverFade`,
    name: `Inherent Skill: Colors Never Fade!`,
    details: `<div>After casting <span class="Highlight"><strong>Basic Attack - Visual Impact</strong></span>, Lynae leaves <span class="Highlight"><strong>Spray Paint</strong></span> on the ground and continuously inflicts <span class="Highlight"><strong>Photochromic Flux</strong></span> on targets within the <span class="Highlight"><strong>Spray Paint</strong></span> for 5s, triggered once every 2s. When <span class="Highlight"><strong>Spray Paint</strong></span> is on the ground, switching to another <span class="Highlight"><strong>Resonance Mode</strong></span> doesn't affect the <span class="Highlight"><strong>Photochromic Flux</strong></span> effects inflicted by the <span class="Highlight"><strong>Spray Paint</strong></span>.<br><size=10><br>With Lynae in the team, the expedition motorbike's Energy Tank expands by 600 points. Lynae enters <span class="Highlight"><strong>Kaleidoscopic Parade</strong></span> automatically while on the expedition motorbike and restores 20% of <span class="Highlight"><strong>Lumiflow</strong></span>.</size=10></div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillAdaptiveOpticsEverydayApplications`,
    name: `Inherent Skill: Adaptive Optics: Everyday Applications`,
    details: `<div>Casting <span class="Highlight"><strong>Intro Skill - Time to Show Some Colors!</strong></span> increases Lynae's <span class="Light"><strong>Spectro DMG</strong></span> by 25% for 9s. <br><size=10><br>During <span class="Highlight"><strong>Kaleidoscopic Parade</strong></span>, if Lynae isn't in combat, dodging without directional input grants her <span class="Highlight"><strong>Optic Camo</strong></span> for 15s, which will be removed when Lynae casts any skill other than dodging or is switched off the field. Performing environmental, gameplay or functional interactions, or entering combat, removes the <span class="Highlight"><strong>Optic Camo</strong></span>. With <span class="Highlight"><strong>Optic Camo</strong></span>, Lynae may enter an enemy's aggro range without triggering combat.</size=10></div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Spectro",
        modifierValue: 0.25,
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
