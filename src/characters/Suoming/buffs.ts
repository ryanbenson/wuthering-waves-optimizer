export const buffs = [
  {
    key: `InherentSkillRainSoakedCovenant`,
    name: `Inherent Skill: Rain-Soaked Covenant`,
    details: `<div>Casting <span style="color:#ffd12f;" class="font-bold">Intro Skill - Furled Canopy: Flash Rift</span>, <span style="color:#ffd12f;" class="font-bold">Intro Skill - Unfurled Canopy: Thunder Rending</span>, <span style="color:#ffd12f;" class="font-bold">Intro Skill - Furled Canopy: Sealed Delusion (Unison)</span>, or <span style="color:#ffd12f;" class="font-bold">Intro Skill - Unfurled Canopy: Whirling Thunder (Unison)</span> grants 50% Electro DMG Bonus for 15s. Switching to another Resonator ends this effect early.<br>- When Suoming casts <span style="color:#ffd12f;" class="font-bold">Intro Skill - Furled Canopy: Sealed Delusion (Unison)</span> or <span style="color:#ffd12f;" class="font-bold">Intro Skill - Unfurled Canopy: Whirling Thunder (Unison)</span>, she additionally gains 10 points of Concerto Energy, triggered only once every 25s.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillSunkenSealForgedLock`,
    name: `Inherent Skill: Sunken Seal, Forged Lock`,
    details: `<div>When Suoming has <span style="color:#ffd12f;" class="font-bold">Unison</span> and is switched out, she gains the <span style="color:#ffd12f;" class="font-bold">Aligned Seals</span> effect for 30s.<br>While this effect is active, Suoming's <span style="color:#ffd12f;" class="font-bold">Outro Skill</span> grants the incoming Resonator 30% Electro DMG Bonus, plus an additional 20% for each stack of <span style="color:#ffd12f;" class="font-bold">Unison Boon</span> they have, up to 40%. This effect lasts for 8s or until the Resonator is switched out.<br><br>When Suoming has <span style="color:#ffd12f;" class="font-bold">Unison</span>, casting <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Furled Canopy: Rift Cleaver</span> removes <span style="color:#ffd12f;" class="font-bold">Unison</span>, consumes 20 points of Concerto Energy, and clears all <span style="color:#ffd12f;" class="font-bold">Delusion</span>, granting the <span style="color:#ffd12f;" class="font-bold">Seal Master</span> effect: the DMG Multipliers of <span style="color:#ffd12f;" class="font-bold">Basic Attack - Unfurled Canopy</span> and <span style="color:#ffd12f;" class="font-bold">Basic Attack - Unfurled Canopy: Whirling Thunder</span> are increased by 40%, and Suoming's Crit. DMG is increased by 80%. This effect lasts for 12s or until the Resonator is switched out.<br>- Gaining <span style="color:#ffd12f;" class="font-bold">Unison</span> ends this effect early.<br>- Gaining the <span style="color:#ffd12f;" class="font-bold">Aligned Seals</span> effect ends this effect early.<br>- The <span style="color:#ffd12f;" class="font-bold">Seal Master</span> effect cannot be gained while the <span style="color:#ffd12f;" class="font-bold">Aligned Seals</span> effect is active.<br>- While the <span style="color:#ffd12f;" class="font-bold">Seal Master</span> effect is active, press <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> shortly after casting <span style="color:#ffd12f;" class="font-bold">Basic Attack - Unfurled Canopy Stage 4</span> to chain into <span style="color:#ffd12f;" class="font-bold">Basic Attack - Unfurled Canopy Stage 2</span>.</div>`,
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
