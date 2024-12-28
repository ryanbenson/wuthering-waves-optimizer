export const resonanceChains = [
  {
    key: "SequenceNode1ParcelToBeDelivered",
    name: "Sequence Node 1: Parcel To Be Delivered",
    details: `<span class="skilldescription">After casting <span class="Highlight">Energized Rebound</span>, additionally recovers 60 STA within 3s.</span>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2LolloLogisticsReadytoHelp",
    name: "Sequence Node 2: Lollo Logistics, Ready to Help",
    details: `<span class="skilldescription"><span class="Highlight">Energized Pounce</span> and <span class="Highlight">Energized Rebound</span> ignore 20% of the target's DEF.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEFIgnore",
        modifySpecificTalents: ["EnergizedPounceDMG", "EnergizedReboundDMG"],
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3PriorityParcelInTransit",
    name: "Sequence Node 3: Priority Parcel In Transit",
    details: `<span class="skilldescription">The DMG of Resonance Liberation <span class="Highlight">Squeakie Express</span> is increased by 30%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["SqueakieExpressSkillDMG"],
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4CaptainLumiAtYourService",
    name: "Sequence Node 4: Captain Lumi, At Your Service",
    details: `<span class="skilldescription">Gain 30% Basic Attack DMG Bonus.</span>`,
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
    key: "SequenceNode5ParcelCollectedOnTime",
    name: "Sequence Node 5: Parcel Collected On Time",
    details: `<span class="skilldescription">When Spark is fully recovered, <span class="Highlight">Laser</span> DMG Multiplier is increased by 100%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["SingleLaserBeamDMG"],
        modifierValue: 1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6Giv MeAFivestarRating",
    name: "Sequence Node 6: Give Me A Five-star Rating",
    details: `<span class="skilldescription">Casting Resonance Liberation <span class="Highlight">Squeakie Express</span> increases all team members' ATK by 20% for 20s.</span>`,
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
