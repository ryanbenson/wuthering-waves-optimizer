export const resonanceChains = [
  {
    key: "SequenceNode1OdysseyofBeginnings",
    name: "Sequence Node 1: Odyssey of Beginnings",
    details: `<span class="skilldescription">Rover's Crit. Rate is increased by 15% for 7s when casting Resonance Skill <span class="Highlight">Resonating Slashes</span> or Resonance Skill <span class="Highlight">Resonating Spin</span>.</span>`,
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
    key: "SequenceNode2MicrocosmicMurmurs",
    name: "Sequence Node 2: Microcosmic Murmurs",
    details: `<span class="skilldescription">Rover's Spectro DMG Bonus is increased by 20%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Spectro",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3VisagesofDust",
    name: "Sequence Node 3: Visages of Dust",
    details: `Rover's Energy Regen is increased by 20%.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnergyRegen",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4ResonatingLamella",
    name: "Sequence Node 4: Resonating Lamella",
    details: `<span class="skilldescription">When casting Resonance Liberation <span class="Highlight">Echoing Resonance</span>, Rover continuously restores HP for all team members: HP equal to 20% of Rover's ATK will be restored every second for 5s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode4ResonatingLamella"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5TemporalVirtuoso",
    name: "Sequence Node 5: Temporal Virtuoso",
    details: `<span class="skilldescription">Rover's Resonance Liberation DMG Bonus is increased by 40%.</span>`,
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
    key: "SequenceNode6EchoesofWanderlust",
    name: "Sequence Node 6: Echoes of Wanderlust",
    details: `<span class="skilldescription">Resonance Skill <span class="Highlight">Resonating Slashes</span> and Resonance Skill <span class="Highlight">Resonating Spin</span> reduces the target's Spectro DMG RES by 10% on hit for 20s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResistShred:Spectro",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
