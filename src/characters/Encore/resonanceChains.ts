export const resonanceChains = [
  {
    key: "SequenceNode1WoolysFairyTale",
    name: "Sequence Node 1: Wooly's Fairy Tale",
    details: `<span class="skilldescription">When <span class="Highlight">Basic Attack</span> hits a target, Encore's Fusion DMG Bonus is increased by 3%, stacking up to 4 time(s) for 6s.</span>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.03,
      },
    ],
    minStacks: 0,
    maxStacks: 4,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2SheepcountingLullaby",
    name: "Sequence Node 2: Sheep-counting Lullaby",
    details: `<span class="skilldescription">Encore additionally restores 10 Resonance Energy when casting Basic Attack <span class="Highlight">Wooly Strike</span> or Resonance Skill <span class="Highlight">Energetic Welcome</span>. This can be triggered once every 10s.</span>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3FogTheBlackShores",
    name: "Sequence Node 3: Fog? The Black Shores!",
    details: `<span class="skilldescription">The DMG multiplier of Heavy Attack <span class="Highlight">Cloudy Frenzy</span> and Heavy Attack <span class="Highlight">Cosmos Rupture</span> is increased by 40%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["CloudyFrenzyDamage", "CosmosRuptureDamage"],
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4AdventureLetsgo!",
    name: "Sequence Node 4: Adventure? Let’s go!",
    details: `<span class="skilldescription">Heavy Attack <span class="Highlight">Cosmos Rupture</span> increases the Fusion DMG Bonus of all team members by 20% for 30s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5HeroTakestheStage",
    name: "Sequence Node 5: Hero Takes the Stage!",
    details: `<span class="skilldescription">Resonance Skill DMG Bonus is increased by 35%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResonanceSkillDMGBonus",
        modifierValue: 0.35,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6WooliesSavetheWorld",
    name: "Sequence Node 6: Woolies Save the World!",
    details: `<span class="skilldescription">During Resonance Liberation <span class="Highlight">Cosmos Rave</span>, Encore gains 1 stack(s) of "Lost Lamb" every time she deals damage, each stack increasing her ATK by 5% for 10s, stacking up to 5 time(s).</span>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.05,
      },
    ],
    minStacks: 0,
    maxStacks: 5,
    alwaysEnabled: false,
  },
];
