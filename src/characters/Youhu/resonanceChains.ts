export const resonanceChains = [
  {
    key: "SequenceNode1WatersideRespite",
    name: "Sequence Node 1: Waterside Respite",
    details: `<span class="skilldescription">Youhu has a 10% chance to gain immunity to damage and interruption after casting <span class="Highlight">Lucky Draw</span>. This effect lasts for 5s or until she is switched out.</span>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2SunroomSiesta",
    name: "Sequence Node 2: Sunroom Siesta",
    details: `<span class="skilldescription">The DMG bonus of <span class="Highlight">Antithesis</span>, <span class="Highlight">Triplet</span> and <span class="Highlight">Perfect Rhyme</span> on <span class="Highlight">Poetic Essence</span> is doubled.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "MultiplySelfBuff",
        modifySpecificTalents: ["PoeticEssenceSkillDMG"],
        modifierValue: 2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3RestlessSleep",
    name: "Sequence Node 3: Restless Sleep",
    details: `<span class="skilldescription">Youhu's ATK is increased by 20%.</span>`,
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
    key: "SequenceNode4FrostedLullaby",
    name: "Sequence Node 4: Frosted Lullaby",
    details: `<span class="skilldescription">Every time Resonance Skill <span class="Highlight">Scroll Divination</span> is cast, there is a 20% chance that the skill will not enter Cooldown.</span>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5DreamlandMeander",
    name: "Sequence Node 5: Dreamland Meander",
    details: `<span class="skilldescription">When Intro Skill <span class="Highlight">Scroll of Wonders</span> is cast, Youhu's Crit. Rate is increased by 15% for 14s.</span>`,
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
    key: "SequenceNode6SlumberEvermore",
    name: "Sequence Node 6: Slumber Evermore",
    details: `<span class="skilldescription">When casting Resonance Skill <span class="Highlight">Antique Appraisal</span>, gain 1 stack(s) of <span class="Highlight">Sky Blue</span>, stackable up to 4 times, lasting for 7s. Each stack increases Youhu's Crit. DMG by 15%.</span>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 4,
    alwaysEnabled: false,
  },
];
