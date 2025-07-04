export const buffs = [
  {
    key: `FeralFangMarked`,
    name: `Feral Fang Marked`,
    details: `The DMG Multiplier for Feral Fang to marked targets is increased by 50%.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["FeralFangDMG"],
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `PackHunt`,
    name: `Pack Hunt`,
    details: `Resonators with <span class="Highlight">Pack Hunt</span> gain a 6% ATK increase, and 10% Fusion DMG Bonus when they attack Overlord Class or Calamity Class targets (Both are non-stackable).`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.06,
      },
      {
        modifier: "Fusion",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `PackHuntFusionTeam`,
    name: `Pack Hunt Fusion Team`,
    details: `Resonators with <span class="Highlight">Pack Hunt</span>: If there are 3 Fusion Resonators in the team, the Fusion DMG Bonus against Overlord Class or Calamity Class targets additionally increases by 10%.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `PackHuntFusionEnhanced`,
    name: `Pack Hunt Enhanced`,
    details: `When the active Resonator casts <span class="Highlight">Intro Skill, Pack Hunt</span> is enhanced, granting an additional 6% ATK increase to all Resonators in the team, up to a maximum of 18%.`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.06,
      },
    ],
    minStacks: 0,
    maxStacks: 2,
    alwaysEnabled: false,
  },
  {
    key: `WildfireBanner`,
    name: `Wildfire Banner`,
    details: `<span class="Title">Wildfire Banner</span><br>Lupa's ATK is increased by 12% by 8s when performing the following actions:<br>- Casting Resonance Skill <span class="Highlight">Feral Fang</span>.<br>- Casting <span class="Highlight">Heavy Attack - Wolf's Gnawing</span>, <span class="Highlight">Heavy Attack - Wolf's Claw</span>, or <span class="Highlight">Mid-air Attack - Firestrike</span>.<br>- Casting Resonance Liberation <span class="Highlight">Fire-Kissed Glory</span>.<br>- Casting <span class="Highlight">Dance With the Wolf</span> and <span class="Highlight">Dance With the Wolf - Climax</span>.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.12,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillRememberMyName`,
    name: `Inherent Skill: Remember My Name`,
    details: `<div class="skilldescription">After dashing for 2.5s, Lupa enters Sprint state. The next <span class="Highlight">Basic Attack</span> is replaced with <span class="Highlight">Basic Attack - Starfall</span>.<br>Gain increased resistance to interruptions while casting <span class="Highlight">Heavy Attack - Wolf's Gnawing</span>, <span class="Highlight">Heavy Attack - Wolf's Claw</span>, and <span class="Highlight">Mid-air Attack - Firestrike</span>.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `InherentSkillApplauseofVictory`,
    name: `Inherent Skill: Applause of Victory`,
    details: `<div class="skilldescription">Defeating a <span class="Highlight">marked</span> target resets the cooldown of Resonance Skill <span class="Highlight">Shewolf's Hunt</span>.<br><span class="Title">Resonance Liberation - Glory</span><br>Casting Resonance Liberation <span class="Highlight">Fire-Kissed Glory</span> grants <span class="Highlight">Glory</span>. Within 35s:<br>Attacks of all Resonators in the team ignore 3% of the target's Fusion RES. For each Fusion Resonator in the team other than Lupa, this effect increases by 3%, up to the maximum of 9%.</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "ResistShred:Fusion",
        modifierValue: 0.03,
      },
    ],
    minStacks: 0,
    maxStacks: 3,
    alwaysEnabled: false,
    replacedBy: "SequenceNode3WolflameHowlsinHerWakeIgnoreFusion",
  },
  {
    key: `InherentSkillApplauseofVictoryFullFusionTeam`,
    name: `Inherent Skill: Applause of Victory: Fusion Team`,
    details: `When there are 3 Fusion Resonators in the team, Resonators' attacks further ignore 6% Fusion RES.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResistShred:Fusion",
        modifierValue: 0.06,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
    replacedBy: "SequenceNode3WolflameHowlsinHerWakeIgnoreFusion",
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
