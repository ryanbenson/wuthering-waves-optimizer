export const resonanceChains = [
  {
    key: "SequenceNode1EmbracetheEndlessWaves",
    name: "Sequence Node 1: Embrace the Endless Waves",
    details: `<span class="skilldescription">Casting <span class="Highlight">Resonance Skill</span> recovers 1 point of Trance. The DMG Multiplier of Resonance Skill <span class="Highlight">Graceful Step</span>, Resonance Skill <span class="Highlight">Flickering Reverie</span>, and Forte Circuit <span class="Highlight">Perception Drain</span> is increased by 50%. Immune to interruptions while casting <span class="Highlight">Perception Drain</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["GracefulStepDMG", "FlickeringReverieDMG", "PerceptionDrainDMG"],
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2SurrendertotheIllusiveReverie",
    name: "Sequence Node 2: Surrender to the Illusive Reverie",
    details: `<span class="skilldescription">Resonance Liberation <span class="Highlight">Flowing Suffocation</span> now sends the target into <span class="Highlight">Hazy Dream</span>. The DMG Multiplier of <span class="Highlight">Jolt</span> triggered by Cantarella is increased by 245%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["JoltDMG"],
        modifierValue: 2.45,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3GazeintotheAbyss",
    name: "Sequence Node 3: Gaze into the Abyss",
    details: `<span class="skilldescription">The DMG Multiplier of Resonance Liberation <span class="Highlight">Flowing Suffocation</span> is increased by 370%. After casting Resonance Liberation <span class="Highlight">Flowing Suffocation</span>, enter into <span class="Highlight">Mirage</span>. If already in <span class="Highlight">Mirage</span>, casting Resonance Liberation <span class="Highlight">Flowing Suffocation</span> does not activate the Mirage state again.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["FlowingSuffocationDMG"],
        modifierValue: 3.7,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4PoreonYourOwnSoul",
    name: "Sequence Node 4: Pore on Your Own Soul",
    details: `<span class="skilldescription">When in <span class="Highlight">Mirage</span>, Healing Bonus is increased by 25%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HealingBonus",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5RestinYourReflection",
    name: "Sequence Node 5: Rest in Your Reflection",
    details: `<span class="skilldescription">The maximum number of <span class="Highlight">Dreamweavers</span> Cantarella can summon through Resonance Liberation <span class="Highlight">Diffusion</span> is increased by 5.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentReplace",
        modifySpecificTalents: ["DiffusionDMG"],
        modifierValue: {
          "1": "7.31%*26",
          "2": "7.91%*26",
          "3": "8.51%*26",
          "4": "9.35%*26",
          "5": "9.95%*26",
          "6": "10.64%*26",
          "7": "11.60%*26",
          "8": "12.56%*26",
          "9": "13.52%*26",
          "10": "14.54%*26"
        },
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6FallFallandFallDeeperintotheDreamMultiplier",
    name: "Sequence Node 6: Fall, Fall... and Fall Deeper into the Dream - Phantom Sting",
    details: `<span class="skilldescription">Increase the DMG Multiplier of Basic Attack <span class="Highlight">Phantom Sting</span> by 80%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["PhantomStingStage1DMG", "PhantomStingStage2DMG", "PhantomStingStage3DMG"],
        modifierValue: 0.8,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6FallFallandFallDeeperintotheDreamDefIgnore",
    name: "Sequence Node 6: Fall, Fall... and Fall Deeper into the Dream - Defense Ignore",
    details: `<span class="skilldescription">Casting Resonance Liberation <span class="Highlight">Flowing Suffocation</span> makes Cantarella's DMG ignore 30% of the target's DEF for 10s.<br>For the first 1.2s of <span class="Highlight">Hazy Dream</span>, when the target takes an instance of DMG that does not inflict <span class="Highlight">Hazy Dream</span>, <span class="Highlight">Jolt</span> will not be triggered on the target.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEFIgnore",
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
