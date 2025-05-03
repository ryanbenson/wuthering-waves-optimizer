export const resonanceChains = [
  {
    key: "SequenceNode1WhereWindSings",
    name: "Sequence Node 1: Where Wind Sings",
    details: `<span class="skilldescription">Casting Resonance Skill <span class="Highlight">Harmonic Allegro</span> grants Ciaccona immunity to interruption for 3s. Casting Basic Attack increases Ciaccona's ATK by 35% for 10s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.35,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2SongoftheFourSeasons",
    name: "Sequence Node 2: Song of the Four Seasons",
    details: `<span class="skilldescription">During Resonance Liberation <span class="Highlight">Singer's Triple Cadenza</span>, Resonators in the team gain 40% Aero DMG Bonus.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Aero",
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3StarlitImprov",
    name: "Sequence Node 3: Starlit Improv",
    details: `<span class="skilldescription">Casting <span class="Highlight">Basic Attack Stage 4</span> additionally grants <saptag=0>1 segment of Musical Essence. Resonance Skill <span class="Highlight">Harmonic Allegro</span> gains 1 more charge.</saptag=0></span>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4ToccataandFugue",
    name: "Sequence Node 4: Toccata and Fugue",
    details: `<span class="skilldescription">Ciaccona ignores 45% of the targets' DEF when dealing damage with Heavy Attack <span class="Highlight">Quadruple Downbeat</span>;<br>Ciaccona ignores 45% of the targets' DEF when dealing Resonance Liberation DMG.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEFIgnore",
        modifySpecificTalents: [
          "QuadrupleDownbeatDMG",
          "ImprovisedSymphonicPoemSkillDMG",
          "SymphonicPoemTonicDMG",
          "SequenceNode6UnendingCadence",
        ],
        modifierValue: 0.45,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5EternalIdylltoLastinSummer",
    name: "Sequence Node 5: Eternal Idyll to Lasting Summer",
    details: `<span class="skilldescription">Gain 40% Resonance Liberation DMG Bonus;<br>DMG taken by Resonators within and around the range of Resonance Liberation <span class="Highlight">Singer's Triple Cadenza</span> is reduced by 30%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResonanceLiberationDMGBonus",
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6UnendingCadence",
    name: "Sequence Node 6: Unending Cadence",
    details: `<span class="skilldescription">When in <span class="Highlight">Solo Concert</span>, Ciaccona or <span class="Highlight">Ensemble Sylph</span> deals <span class="Wind">Aero DMG</span> equal to 220% of Ciaccona's ATK to nearby targets, considered Resonance Liberation DMG.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode6UnendingCadence"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
