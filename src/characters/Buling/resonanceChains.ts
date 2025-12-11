export const resonanceChains = [
  {
    key: "SequenceNode1ExorcistGadgetsLendMeYourPower",
    name: "Sequence Node 1: Exorcist Gadgets, Lend Me Your Power",
    details: `<div>The Crit. Rate of <span class="Highlight">Resonance Liberation - Flashing Thunder Spell: Harmony</span> is increased by 20% upon dealing damage.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifySpecificTalents: ["FlashingThunderSpellHarmonyDMG"],
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2TalismanBurnsSpiritsTurn",
    name: "Sequence Node 2: Talisman Burns, Spirits Turn",
    details: `<span class="skilldescription">Buling restores 25 points of Resonance Energy when she enters the <span class="Highlight">Yin-Yang Balance</span> state. This effect is triggered once every 24s.</span>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3SummonerofSpiritsSeekerofFate",
    name: "Sequence Node 3: Summoner of Spirits, Seeker of Fate",
    details: `<div>While <span class="Highlight">Five Thunders Spell Array</span> lasts, whenever the HP of Resonators in the team drops below 50%, immediately restore their HP by 350+150% of Buling's ATK. This effect can be triggered once every 24s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: [
          "SequenceNode3SummonerofSpiritsSeekerofFate",
        ],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4WandererofSolarisBlessedbyFortune",
    name: "Sequence Node 4: Wanderer of Solaris, Blessed by Fortune",
    details: `<span class="skilldescription">Buling gains 20% Healing Bonus.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5ForumBanNewAccount",
    name: "Sequence Node 5: Forum Ban? New Account!",
    details: `<span class="skilldescription"><span class="Highlight">Five Thunders Spell Array</span> instantly inflicts another 6 stacks of <span class="Highlight">Electro Flare</span> on all targets within its range upon generation.</span>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6AlmightyForumLordofThunderSpell",
    name: `Sequence Node 6: "Almighty Forum Lord of Thunder Spell"`,
    details: `<div>The <span class="Highlight">Thunder Spell - Heaven, Earth, Mind</span> state now grants 50% <span class="Highlight">Resonance Skill</span> DMG Bonus to the active Resonator in the team.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResonanceSkillDMGBonus",
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
