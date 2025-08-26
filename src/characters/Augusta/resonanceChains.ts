export const resonanceChains = [
  {
    key: "SequenceNode1BeholdtheNamelessOne",
    name: "Sequence Node 1: Behold the Nameless One",
    details: `<span class="skilldescription">Performing Resonance Skill <span class="Highlight">Fire-Kissed Glory</span> recovers 10 Concerto Energy for Lupa and increases Lupa's Crit. Rate by 20% for 10s.<br><span class="Highlight">Dance With the Wolf - Climax</span> is immune to interruption.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2EveryGroundHerHuntingField",
    name: "Sequence Node 2: Every Ground, Her Hunting Field",
    details: `<span class="skilldescription">Performing <span class="Highlight">Fire-Kissed Glory</span>, <span class="Highlight">Heavy Attack - Wolf's Gnawing</span>,  <span class="Highlight">Heavy Attack - Wolf's Claw</span>, or <span class="Highlight">Mid-air Attack - Firestrike</span> gives 20% Fusion DMG Bonus to all Resonators in the team for 30s, stacking up to 2 times.</span>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 2,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3WolflameHowlsinHerWake",
    name: "Sequence Node 3: Wolflame Howls in Her Wake",
    details: `<span class="skilldescription">The DMG Multiplier of Intro Skill <span class="Highlight">Nowhere to Run!</span> increases by 100%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["NowheretoRunDMG"],
        modifierValue: 1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3WolflameHowlsinHerWakeIgnoreFusion",
    name: "Sequence Node 3: Wolflame Howls in Her Wake: Fusion RES Ignore",
    details: `<span class="skilldescription">The effect of Resonance Liberation <span class="Highlight">Glory</span> is now updated as follows:<br>Casting Resonance Liberation <span class="Highlight">Fire-Kissed Glory</span> grants <span class="Highlight">Glory</span>. Attacks of all Resonators in the team ignore 15% Fusion RES for 35s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResistShred:Fusion",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
    replaces: "InherentSkillApplauseofVictory",
  },
  {
    key: "SequenceNode4HighandAflameIsHerBanner",
    name: "Sequence Node 4: High and Aflame Is Her Banner",
    details: `<span class="skilldescription">The DMG Multiplier of <span class="Highlight">Dance With the Wolf - Climax</span> increases by 125%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["DanceWiththeWolfClimaxDMG"],
        modifierValue: 1.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5EmbracetheThunderousTriumph",
    name: "Sequence Node 5: Embrace the Thunderous Triumph",
    details: `<span class="skilldescription">Performing Intro Skill <span class="Highlight">Try Focusing, Eh?</span> or <span class="Highlight">Nowhere to Run!</span> gives 15% Resonance Liberation DMG Bonus for 10s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResonanceLiberationDMGBonus",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6TotheBrightestFlamingStar",
    name: "Sequence Node 6: To the Brightest Flaming Star",
    details: `<span class="skilldescription">- The damage dealt by Forte Circuit <span class="Highlight">Dance With the Wolf - Climax</span>, Resonance Liberation <span class="Highlight">Fire-Kissed Glory</span>, and Intro Skill <span class="Highlight">Nowhere to Run!</span> ignores 30% of the target's DEF.<br>- Resonance Skill <span class="Highlight">Feral Fang</span> restores 100 points of Wolflame on hit, triggered once per 20s.<br>- Forte Circuit <span class="Highlight">Dance With the Wolf</span> is replaced with <span class="Highlight">Dance With the Wolf - Climax</span>. <span class="Highlight">Dance With the Wolf - Climax</span> can be performed when Lupa is not in <span class="Highlight">Burning Matchpoint</span> state.<br>- Casting Intro Skill <span class="Highlight">Nowhere to Run!</span> no longer ends <span class="Highlight">Pack Hunt</span> and <span class="Highlight">Glory</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEFIgnore",
        modifySpecificTalents: [
          "DanceWiththeWolfClimaxDMG",
          "FireKissedGloryDMG",
          "NowheretoRunDMG",
        ],
        modifierValue: 0.3,
      },
      {
        // TODO: This doesn't work. but it will need to. Essentially, the modifierValue
        // list is a list of team buffs with a list of attacks it buffs.
        // we need to add the NowheretoRunDMG to that list when this gets activated.
        modifier: "AppendAnotherTalent",
        modifySpecificTalents: ["NowheretoRunDMG"],
        modifierValue: [
          "PackHuntFusionTeam",
          "PackHuntFusionEnhanced",
          "InherentSkillApplauseofVictory",
          "InherentSkillApplauseofVictoryFullFusionTeam",
        ],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
