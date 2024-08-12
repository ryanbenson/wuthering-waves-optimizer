export const resonanceChains = [
  {
    key: "SequenceNode3FlamingRecitativo",
    name: "Sequence Node 3: Flaming Recitativo",
    details: `<span class="skilldescription">During Resonance Liberation <span class="Highlight">Burning Rhapsody</span>, the Crit. DMG of Resonance Liberation's <span class="Highlight">Marcato</span> is increased by 30%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifySpecificTalents: ["MarcatoDamage", "SequenceNodeFuneraryQuartet"],
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNodeFuneraryQuartet",
    name: "Sequence Node 5: Funerary Quartet",
    details: `<span class="skilldescription">When Resonance Skill <span class="Highlight">Passionate Variation</span> or Resonance Skill <span class="Highlight">Fury Fugue</span> hits a target, Coordinated Attacks will be triggered to fire 4 Resonance Liberation's <span class="Highlight">Marcato</span> hit(s), dealing <span class="Fire">Fusion Damage</span>. DMG of Resonance Liberation's <span class="Highlight">Marcato</span> fired in this way is reduced by 50%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNodeFuneraryQuartet"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6ApoplecticInstrumental",
    name: "Sequence Node 6: Apoplectic Instrumental",
    details: `<span class="skilldescription">When Resonance Liberation <span class="Highlight">Violent Finale</span> is cast, ATK of all team members is increased by 20% for 20s.</span>`,
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
