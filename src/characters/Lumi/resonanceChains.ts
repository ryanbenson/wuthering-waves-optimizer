export const resonanceChains = [
  {
    key: "SequenceNode2WuWuLogisticsHasReceivedthePackage",
    name: "Sequence Node 2: WuWu Logistics Has Received the Package",
    details: `<span class="skilldescription">When <span class="Highlight">Enhanced Lunge</span> and <span class="Highlight">Enhanced Backstep</span> hits an enemy, ignores <span class="Highlight">20%</span> of the target’s defense.
    </span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEFIgnore",
        modifySpecificTalents: [
          "EnhancedLungeDMG",
          "EnhancedBackstepDMG",
        ],
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3ExpressDeliveryinTransit",
    name: "Sequence Node 3: Express Delivery in Transit",
    details: `<span class="skilldescription"><span class="Highlight">Resonance Liberation Tweet Delivery</span> damage increases by <span class="Highlight">30%</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["TweetDeliveryDMG"],
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4TheLightsareBeingDeliveredtoYou",
    name: "Sequence Node 4: The Lights are Being Delivered to You",
    details: `<span class="skilldescription">Lumi’s <span class="Highlight">Basic Attack</span> damage increases by <span class="Highlight">30%</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "BasicAttackDMGBonus",
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5TheExpressHasBeenSuccessfullySignedFor",
    name: "Sequence Node 5: The Express Has Been Successfully Signed For",
    details: `<span class="skilldescription">When <span class="Highlight">【Red Light Energy】</span> is full, <span class="Highlight">Piercing Bright Light</span> damage multiplier increases by <span class="Highlight">100%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["PiercingBrightLightDMG"],
        modifierValue: 1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6GiveaFiveStarPraise",
    name: "Sequence Node 6: Give a Five-Star Praise",
    details: `<span class="skilldescription">When casting <span class="Highlight">Outro Skill</span>, Resonators in the team increases their Attack power by <span class="Highlight">20%</span>, lasting for <span class="Highlight">‘?’s</span>.</span>`,
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
];
