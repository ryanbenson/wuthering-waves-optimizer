export const resonanceChains = [
  {
    key: "S1OnASecretPathNoOneKnows",
    name: "Sequence Node 1: On a Secret Path No One Knows",
    details: `<span class="skilldescription">When casting <span class="Highlight">Intro Skill</span> and <span class="Highlight">Outro Skill</span> Entangle, additionally restores 50 points of 【Red Camellia·Pistil】. When dealing basic attack damage, Critical Damage increases by 6%, lasting for 10s ; Triggers once every 1 sec, stacking up to 5 times.</span>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.06,
      },
    ],
    minStacks: 0,
    maxStacks: 5,
    alwaysEnabled: false,
  },
  {
    key: "S2CallingfortheFragranceoftheSilentFlower",
    name: "Sequence Node 2: Calling for the Fragrance of the Silent Flower",
    details: `<span class="skilldescription"><span class="Highlight">Resonance Skill Dayflower</span> damage multiplier increases by <span class="Highlight">120%</span>. <span class="Highlight">Heavy Attack</span> counts as <span class="Highlight">Basic Attack</span> damage, gaining the benefits of Resonance Circuit Bud state.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["DayflowerDMG"],
        modifierValue: 1.2,
      },
      {
        modifier: "talentTypeOverride",
        modifySpecificTalents: ["HeavyAttackDMG"],
        modifierValue: "Basic",
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "S3AThornisBetterThanaThousandFlowerSeedsLiberation",
    name: "Sequence Node 3: A Thorn is Better Than a Thousand Flower Seeds",
    details: `<span class="skilldescription"><span class="Highlight">Resonance Liberation</span> damage multiplier increases by <span class="Highlight">50%</span>.
    </span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["TheEmbersofYouthDMG"],
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "S3AThornisBetterThanaThousandFlowerSeedsATK",
    name: "Sequence Node 3: A Thorn is Better Than a Thousand Flower Seeds",
    details: `<span class="skilldescription">During Bud state, Camellya’s attack power increases by <span class="Highlight">58%</span>.
    </span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.58,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "S4ItsRootsContinueIntoEternity",
    name: "Sequence Node 4: Its Roots Continue Into Eternity",
    details: `<span class="skilldescription">After casting <span class="Highlight">Intro Skill</span>, the Resonators in the team receive a <span class="Highlight">25%</span> increase in <span class="Highlight">Basic Attack</span> damage, lasting for <span class="Highlight">30s</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "BasicAttackDMGBonus",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "S5PuttheInfiniteinthePalmofYourHand",
    name: "Sequence Node 5: Put the Infinite in the Palm of Your Hand",
    details: `<span class="skilldescription"><span class="Highlight">Resonance Liberation</span> damage multiplier additionally increases by <span class="Highlight">50%</span>. <span class="Highlight">Outro Skill Entangle</span> damage multiplier increases by <span class="Highlight">68%</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["TheEmbersofYouthDMG"],
        modifierValue: 0.5,
      },
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["EntangleDMG", "EntangleDayflowerDMG"],
        modifierValue: 0.68,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "S6Blooming orYouThousandsofTimes",
    name: "Sequence Node 6: Blooming for You Thousands of Times",
    details: `<span class="skilldescription">During <span class="Highlight">Resonance Circuit</span> Bud state, <span class="Highlight">Normal Attack</span>, <span class="Highlight">Heavy Attack</span>, <span class="Highlight">Normal Attack Vine Dance</span>, <span class="Highlight">Resonance Skill Red Camellia Bloom</span>, <span class="Highlight">Resonance Skill Dark Pistil Seeker</span> damage multiplier additionally increases by <span class="Highlight">150%</span>;<br>
    <span class="Highlight">Resonance Skill Eternal Flower</span>: Within 15s after casting <span class="Highlight">Resonance Skill Dayflower</span>, if Concerto Energy is filled up to <span class="Highlight">100</span> points, <span class="Highlight">Eternal Flower</span> can be casted, consuming <span class="Highlight">50</span> Concerto points, restoring <span class="Highlight">50</span> points of 【Red Camellia·Pistil】, then enters the Bud state, can be casted once every <span class="Highlight">25s</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "VineDanceStage1DMG",
          "VineDanceStage2DMG",
          "VineDanceStage3DMG",
          "VineDanceStage4DMG",
          "WhirlingDanceDMG",
          "AshenBlossomVineDanceDMG",
          "AtonementDMG",
          "FullBloomDMG",
          "DarkPistilSeekerDMG",
        ],
        modifierValue: 1.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
