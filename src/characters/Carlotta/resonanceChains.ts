export const resonanceChains = [
  {
    key: "SequenceNode1BeautyBlazesBrightestBeforeItFades",
    name: "Sequence Node 1: Beauty Blazes Brightest Before It Fades",
    details: `<span class="skilldescription">Casting Resonance Skill <span class="Highlight">Art of Violence</span> increases Glacio DMG Bonus by 25% for 15s.<br>When Resonance Skill <span class="Highlight">Chromatic Splendor</span> hits a target inflicted with <span class="Highlight">Dispersion</span>, Carlotta additionally restores 30 points of Substance.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Glacio",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2FallenPetalsGiveLifetoNewBlooms",
    name: "Sequence Node 2: Fallen Petals Give Life to New Blooms",
    details: `<span class="skilldescription">Dealing DMG to targets inflicted with <span class="Highlight">Deconstruction</span> increases the Crit. Rate of this attack by 25%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3AdelanteCortadoSpinninginGrace",
    name: "Sequence Node 3: Adelante, Cortado, Spinning in Grace",
    details: `<span class="skilldescription">Enable Outro Skill <span class="Highlight">Kaleidoscope Sparks</span>: Deal 1 additional strike at the end of Outro Skill <span class="Highlight">Closing Remark</span>, dealing Glacio DMG equal to 1032.18% of Carlotta's ATK. The DMG Multiplier of Resonance Skill <span class="Highlight">Art of Violence</span> and Resonance Skill <span class="Highlight">Chromatic Splendor</span> is increased by 70%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode3StepForwardEleganceinProgression"],
      },
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["ArtofViolenceDMG", "ChromaticSplendorDMG"],
        modifierValue: 0.7,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4YesterdaysRaindropsMakeFinestWine",
    name: "Sequence Node 4: Yesterday's Raindrops Make Finest Wine",
    details: `<span class="skilldescription">Casting Heavy Attack, Heavy Attack <span class="Highlight">Containment Tactics</span>, and Heavy Attack <span class="Highlight">Imminent Oblivion</span> grants all team members 25% Resonance Skill DMG Bonus for 30s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResonanceSkillDMGBonus",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5ToasttoPastTodayandEveryDaytoCome",
    name: "Sequence Node 5: Toast to Past, Today, and Every Day to Come",
    details: `<span class="skilldescription">The DMG Multiplier of Heavy Attack <span class="Highlight">Imminent Oblivion</span> is increased by 40%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["ImminentOblivionDMG"],
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6AstheCurtainFallsIRemainWhatIAm",
    name: "Sequence Node 6: As the Curtain Falls, I Remain What I Am",
    details: `<span class="skilldescription">Shots of Resonance Liberation <span class="Highlight">Death Knell</span> deal higher DMG and shoot out double the number of crystal shards, representing a total increase of 169.5% in the DMG Multiplier of Resonance Liberation <span class="Highlight">Death Knell</span>.<br>Shots of Resonance Liberation <span class="Highlight">Death Knell</span> inflict <span class="Highlight">Scattering</span> on targets when hit, during which the target is immobilized. This effect is removed after 1.5s or when the target receives DMG.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["DeathKnellDMG"],
        modifierValue: 1.456,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
