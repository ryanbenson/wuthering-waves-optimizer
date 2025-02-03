export const resonanceChains = [
  {
    key: "SequenceNode1SolitudesEmbrace",
    name: "Sequence Node 1: Solitude's Embrace",
    details: `<span class="skilldescription"><span class="Highlight">Basic Attack V</span> increases Sanhua's Crit. Rate by 15% for 10s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3AnomalousVision",
    name: "Sequence Node 3: Anomalous Vision",
    details: `<span class="skilldescription">Sanhua's damage dealt is increased by 35% against targets with HP below 70%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGBonus",
        modifierValue: 0.35,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4BladeMastery",
    name: "Sequence Node 4: Blade Mastery",
    details: `<span class="skilldescription">Resonance Liberation <span class="Highlight">Glacial Gaze</span> restores 10 Resonance Energy. 
    <br>DMG of the next Heavy Attack <span class="Highlight">Detonate</span> within 5s is increased by 120%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: ["DetonateDMG"],
        modifierValue: 1.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5UnravelingFate",
    name: "Sequence Node 5: Unraveling Fate",
    details: `<span class="skilldescription">Crit. DMG of Forte Circuit <span class="Highlight">Ice Burst</span> is increased by 100%. Ice Creations (Ice Thorn, Ice Prism, and Glacier) will explode even if they are not detonated.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifySpecificTalents: [
          "GlacierBurstDMG",
          "IcePrismBurstDMG",
          "IceThornBurstDMG",
        ],
        modifierValue: 1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6DaybreakRadiance",
    name: "Sequence Node 6: Daybreak Radiance",
    details: `<span class="skilldescription">After an Ice Prism or a Glacier is detonated, all team members' ATK is increased by 10% for 20s, stacking up to 2 times.</span>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 2,
    alwaysEnabled: false,
  },
];
