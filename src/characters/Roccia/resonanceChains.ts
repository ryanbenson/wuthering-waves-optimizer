export const resonanceChains = [
  {
    key: "SequenceNode1WhenShadowsEngulftheHull",
    name: "Sequence Node 1: When Shadows Engulf the Hull",
    details: `<span class="skilldescription">Casting Resonance Skill <span class="Highlight">Acrobatic Trick</span> grants 100 additional Imagination and 10 Concerto Energy.<br>Immune to interruptions when casting Basic Attack <span class="Highlight">Real Fantasy</span></span>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2WhentheLuceaniteGleamsHavoc",
    name: "Sequence Node 2: When the Luceanite Gleams",
    details: `<span class="skilldescription">Casting Basic Attack <span class="Highlight">Real Fantasy</span> grants all Resonators in the team 10% Havoc DMG Bonus for 30s, stacking up to <saptag=1>3 time.</span>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "Havoc",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 3,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2WhentheLuceaniteGleamsHavocMaxed",
    name: "Sequence Node 2: When the Luceanite Gleams",
    details: `<span class="skilldescription"> Upon reaching the max stacks, it grants all Resonators in the team 10% additional Havoc DMG Bonus for 30s.</saptag=1></span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Havoc",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3WhentheHeartSeesandHandsFeel",
    name: "Sequence Node 3: When the Heart Sees and Hands Feel",
    details: `<span class="skilldescription">Casting Intro Skill <span class="Highlight">Pero, Help</span> increases Roccia's Crit. Rate by 10% and Crit. DMG by 30% for 15s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.1,
      },
      {
        modifier: "CritDMG",
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4WhenWondersGatherintheBox",
    name: "Sequence Node 4: When Wonders Gather in the Box",
    details: `<span class="skilldescription">Casting Resonance Skill <span class="Highlight">Acrobatic Trick</span> increases Basic Attack <span class="Highlight">Real Fantasy</span>'s DMG Multiplier by 60% for 12s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "RealFantasyStage1DMG",
          "RealFantasyStage2DMG",
          "RealFantasyStage3DMG",
          "SequenceNode6WhentheGoldenWingsFlyDMG",
        ],
        modifierValue: 0.6,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5WhenDreamsAreRebornonStage",
    name: "Sequence Node 5: When Dreams Are Reborn on Stage",
    details: `<span class="skilldescription">Increase Resonance Liberation <span class="Highlight">Commedia Improvviso!</span>'s DMG Multiplier by 20% and <span class="Highlight">Heavy Attack</span>'s DMG Multiplier by 80%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["CommediaImprovvisoDMG"],
        modifierValue: 0.2,
      },
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "HeavyAttackDMG",
          "CommediaImprovvisoDMG",
          "RealFantasyStage1DMG",
          "RealFantasyStage2DMG",
          "RealFantasyStage3DMG",
          "SequenceNode6WhentheGoldenWingsFlyDMG",
        ],
        modifierValue: 0.8,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6WhentheGoldenWingsFly",
    name: "Sequence Node 6: When the Golden Wings Fly",
    details: `<span class="skilldescription">Casting Resonance Liberation <span class="Highlight">Commedia Improvviso!</span> grants the following effects for 12s:<br>- Basic Attack <span class="Highlight">Real Fantasy</span> ignores enemies' DEF by 60%.<br>- When Roccia lands after performing Basic Attack <span class="Highlight">Real Fantasy</span> Stage 3, she is launched into mid-air, activating <span class="Highlight">Beyond Imagination</span>. In this state, <span class="Highlight">Basic Attack</span> becomes Basic Attack <span class="Highlight">Reality Recreation</span>, dealing DMG equal to 100% of Basic Attack <span class="Highlight">Real Fantasy</span> Stage 3 DMG, considered Heavy Attack DMG. Roccia is immune to interruptions while casting Basic Attack <span class="Highlight">Reality Recreation</span>.<br>- When Roccia lands after performing Basic Attack <span class="Highlight">Reality Recreation</span>, she is launched into mid-air, activating <span class="Highlight">Beyond Imagination</span>. Basic Attack <span class="Highlight">Reality Recreation</span> is only available in the <span class="Highlight">Beyond Imagination</span> state.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEFIgnore",
        modifySpecificTalents: [
          "RealFantasyStage1DMG",
          "RealFantasyStage2DMG",
          "RealFantasyStage3DMG",
          "SequenceNode6WhentheGoldenWingsFlyDMG",
        ],
        modifierValue: 0.6,
      },
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode6WhentheGoldenWingsFlyDMG"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
