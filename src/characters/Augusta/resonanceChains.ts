export const resonanceChains = [
  {
    key: "SequenceNode1StainedinScorchedEarth",
    name: "Sequence Node 1: Stained in Scorched Earth",
    details: `<div>- Each stack of <a onclick="showTermExplan(130601)" class="ingame-term-desc">Crown of Wills</a> additionally increases Augusta's Crit. DMG by 15%. <br>- The max stack of Crown of Wills is increased to 2.<br>- Casting <span class="ingame-Highlight">Intro Skill - Stride of Goldenflare</span> now grants 1 stack of Crown of Wills. <br>- <span class="ingame-Highlight">Resonance Skill - Undying Sunlight: Strike</span>, <span class="ingame-Highlight">Resonance Skill - Undying Sunlight: Leap</span>, and <span class="ingame-Highlight">Resonance Skill - Undying Sunlight: Plunge</span> are now immune to interruption.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2CleansedinCrimsonWar",
    name: "Sequence Node 2: Cleansed in Crimson War",
    details: `<div>- <a onclick="showTermExplan(130601)" class="ingame-term-desc">Crown of Wills</a> provides additional effects: Each stack increases Augusta's Crit. Rate by 20%.<br>- For every 1% of Crit. Rate over 100%, Augusta gains 2% Crit. DMG increase, up to 100%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritOverflow",
        modifierValue: 0.02,
        overflowStep: 1, // for every 1% CR
        overflowMin: 1, // must be 100% CR
        overflowMax: 1, // can only get 100% CD from this
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3ForgedinRotandRuin",
    name: "Sequence Node 3: Forged in Rot and Ruin",
    details: `<div>The following skills have their DMG Multiplier increased by 25%: <br>- <span class="ingame-Highlight">Heavy Attack - Thunderoar: Backstep</span>, <span class="ingame-Highlight">Dodge Counter - Thunderoar: Backstep</span>, <span class="ingame-Highlight">Heavy Attack - Thunderoar: Spinslash</span>, <span class="ingame-Highlight">Heavy Attack - Thunderoar: Uppercut</span>.<br>- <span class="ingame-Highlight">Resonance Skill - Undying Sunlight: Plunge</span>.<br>- <span class="ingame-Highlight">Resonance Liberation - Sublime is the Sun: Sunborne</span>, <span class="ingame-Highlight">Resonance Liberation - Sublime is the Sun: Everbright Protector</span>.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "HeavyAttackThunderoarBackstepDMG",
          "DodgeCounterThunderoarBackstepDMG",
          "HeavyAttackThunderoarSpinslashDMG",
          "HeavyAttackThunderoarUppercutDMG",
          "ResonanceSkillUndyingSunlightPlungeDMG",
          "SublimeistheSunSunborneDMG",
          "SublimeistheSunEverbrightProtectorDMG",
        ],
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4AscentinSunandGlory",
    name: "Sequence Node 4: Ascent in Sun and Glory",
    details: `<div>Casting <span class="ingame-Highlight">Intro Skill - Stride of Goldenflare</span> increases the ATK of all Resonators in the team by 20% for 30s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5UnshakeninWrathfulTides",
    name: "Sequence Node 5: Unshaken in Wrathful Tides",
    details: `<div>The Shield provided by <span class="ingame-Highlight">Inherent Skill - Glory's Favor</span> is increased by 50%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["InherentSkillGlorysFavor"],
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6EngravedinRadiantLight",
    name: "Sequence Node 6: Engraved in Radiant Light",
    details: `<div>- Augusta can now hold up to 4 stacks of <a onclick="showTermExplan(130601)" class="ingame-term-desc">Crown of Wills</a>. <br>- For every 1% of Crit. Rate over 150%, Augusta gains 2% Crit. DMG increase, up to 50%.<br>- When Augusta performs <span class="ingame-Highlight">Heavy Attack - Thunderoar: Spinslash</span> or <span class="ingame-Highlight">Heavy Attack - Thunderoar: Uppercut</span>, she obtains 2 stacks of Crown of Wills. Augusta can only obtain 2 stacks of Crown of Wills every 1s via <span class="ingame-Highlight">Engraved in Radiant Light</span>. <br>- While casting <span class="ingame-Highlight">Heavy Attack - Thunderoar: Spinslash</span> or <span class="ingame-Highlight">Heavy Attack - Thunderoar: Uppercut</span>, Thunder Rage is triggered at the spot, dealing two instances of <span class="ingame-Thunder">Electro DMG</span>, with each instance equal to 100% of Augusta's ATK, considered as Heavy Attack DMG.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritOverflow",
        modifierValue: 0.02,
        overflowStep: 1, // for every 1% CR
        overflowMin: 1.5, // must be 100% CR
        overflowMax: 0.5, // can only get 100% CD from this
      },
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode6EngravedinRadiantLight"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
