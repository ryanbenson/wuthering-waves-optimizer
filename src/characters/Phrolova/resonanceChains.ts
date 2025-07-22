export const resonanceChains = [
  {
    key: "SequenceNode1AKeytoNetherworldsSecrets",
    name: "Sequence Node 1: A Key to Netherworld's Secrets",
    details: `<span class="skilldescription">The DMG Multiplier of <span class="ingame-Highlight">Movement of Fate and Finality</span> is increased by 80%.<br>The DMG Multiplier of <span class="ingame-Highlight">Murmurs in a Haunting Dream</span> is increased by 80%.<br>If Phrolova has less than 2 <span class="ingame-Highlight">Volatile Notes</span> when she is not in the <span class="ingame-Highlight">Maestro</span> and stays out of combat for 4s, she gains <span class="ingame-Highlight">Volatile Note - Cadenza</span> until she has at least 2 <span class="ingame-Highlight">Volatile Notes</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "MovementOfFateAndFinalityDMG",
          "MurmursInAHauntingDreamDMG",
        ],
        modifierValue: 0.8,
      },
    ],
    minStacks: 0,
    maxStacks: 4,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2ARopeTiedtoaLifeBeyond",
    name: "Sequence Node 2: A Rope Tied to a Life Beyond",
    details: `<span class="skilldescription">The DMG Multiplier of <span class="ingame-Highlight">Scarlet Coda</span> is increased by 75%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["ScarletCodaDMG"],
        modifierValue: 0.75,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2ARopeTiedtoaLifeBeyondAftersound",
    name: "Sequence Node 2: A Rope Tied to a Life Beyond (Aftersound)",
    details: `<span class="skilldescription"><span class="ingame-Highlight">Aftersound</span> now additionally increased the DMG Multiplier of <span class="ingame-Highlight">Scarlet Coda</span> by 75%.<br>Casting <span class="ingame-Highlight">Scarlet Coda</span> grants 14 Stacks of <span class="ingame-Highlight">Aftersound</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["ScarletCodaDMG"],
        modifierValue: 0.75,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3ADaggertoCutCleanObsessions",
    name: "Sequence Node 3: A Dagger to Cut Clean Obsessions",
    details: `<span class="skilldescription">Echo Skill DMG is Amplified by 80%.<br>The DMG Multiplier of <span class="ingame-Highlight">Suite of Immortality</span> is increased by 80%.<br>Casting <span class="ingame-Highlight">Scarlet Coda</span>, all <span class="ingame-Highlight">Volatile Notes</span> will be converted to <span class="ingame-Highlight">Volatile Notes - Cadenza</span> in order of acquisition.<br>Targets hit by <span class="ingame-Highlight">Enhanced Attack - Hecate: Cadenza</span> will have their ATK reduced by 20% for 15s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGDeepen:Echo",
        modifierValue: 0.8,
      },
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["SuiteofImmortalityDMG"],
        modifierValue: 0.8,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4ATorchIlluminatingthePath",
    name: "Sequence Node 4: A Torch Illuminating the Path",
    details: `<span class="skilldescription">After casting <span class="ingame-Highlight">Echo Skill</span>, grant 20% ATK increase for all Resonators in the team for 30s.</span>`,
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
    key: "SequenceNode5AForkedRoadinFatesHeartland",
    name: "Sequence Node 5: A Forked Road in Fate's Heartland",
    details: `<span class="skilldescription">Upon entering the <span class="ingame-Highlight">Maestro</span> state, generate a field to Stagnate the nearby targets, which lasts for 4s. Leaving the <span class="ingame-Highlight">Maestro</span> state or switching to other Resonators removes the Stagnation effect early.<br>Damage taken during the <span class="ingame-Highlight">Maestro</span> state is reduced by 30%.</span>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6ANighttoDepartFromEternalRest",
    name: "Sequence Node 6: A Night to Depart From Eternal Rest",
    details: `<span class="skilldescription">The DMG Multiplier of <span class="Highlight">Enhanced Attack - Hecate</span> is increased by 24%.<br><br>
During <span class="Highlight">Movement of Fate</span> and <span class="Highlight">Finality and Murmurs in a Haunting Dream</span>, command Hecate to cast 1 <span class="Highlight">Apparition of Beyond - Hecate</span>, dealing <span class="Dark">Havoc DMG</span> equal to 216.42% of Phrolova's ATK (considered Echo Skill DMG) and granting 8 stacks of <span class="Highlight">Aftersound</span> on hit.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "EnhancedAttackHecateStringsDMG",
          "EnhancedAttackHecateWindsDMG",
          "EnhancedAttackHecateCadenzaDMG",
        ],
        modifierValue: 0.24,
      },
      {
        modifier: "EnableAttack",
        modifierValue: ["ApparitionofBeyondHecate"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6ANighttoDepartFromEternalRestOffField",
    name: "Sequence Node 6: A Night to Depart From Eternal Rest (Off-Field)",
    details: `<span class="skilldescription">If Phrolova is not the active Resonator during the Maestro state, targets take 40% more DMG from Hecate and Phrolova.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "specialMultiplier",
        modifySpecificTalents: [
          "BasicAttackHecateStage1DMG",
          "BasicAttackHecateStage2DMG",
          "EnhancedAttackHecateStringsDMG",
          "EnhancedAttackHecateWindsDMG",
          "EnhancedAttackHecateCadenzaDMG",
        ],
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6ANighttoDepartFromEternalRestOnField",
    name: "Sequence Node 6: A Night to Depart From Eternal Rest (On-Field)",
    details: `<span class="skilldescription"> If Phrolova is the active Resonator during the Maestro state, gain 60% Havoc DMG Bonus.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Havoc",
        modifierValue: 0.6,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
