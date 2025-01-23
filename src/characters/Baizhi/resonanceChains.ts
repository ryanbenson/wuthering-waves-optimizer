export const resonanceChains = [
  {
    key: "SequenceNode2SilentTundra",
    name: "Sequence Node 2: Silent Tundra",
    details: `<span class="skilldescription">Resonance Skill <span class="Highlight">Emergency Plan</span> increases Baizhi's Glacio DMG Bonus by 15% and her Healing by 15% if she has 4 "Concentration". These effects last for 12s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Glacio",
        modifierValue: 0.15,
      },
      {
        modifier: "HealingBonus",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3VeritasLuxMea",
    name: "Sequence Node 3: Veritas Lux Mea",
    details: `<span class="skilldescription">Intro Skill <span class="Highlight">Overflowing Frost</span> increases Baizhi's Max HP by 12% for 10s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "HP",
        modifierValue: 0.12,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4EternalVerity",
    name: "Sequence Node 4: Eternal Verity",
    details: `<span class="skilldescription">Upon casting Resonance Liberation <span class="Highlight">Momentary Union</span>, Resonance Liberation <span class="Highlight">Remnant Entities</span> gains the following enhancements:<br>-<span class="Highlight">Remnant Entities</span> can be performed 2 more time(s);<br>-Healing multiplier of <span class="Highlight">Remnant Entities</span> is increased by 20%;<br>-<span class="Highlight">Remnant Entities</span> deals additional <span class="Ice">Glacio DMG</span> equal to 1.20% of Baizhi's Max HP.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["RemnantEntitiesHealing"],
        modifierValue: 0.2,
      },
      {
        modifier: "DMGBonus:MaxHP",
        modifySpecificTalents: ["RemnantEntitiesDamage"],
        modifierValue: 0.012,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6SeekersDevotion",
    name: "Sequence Node 6: Seeker's Devotion",
    details: `<span class="skilldescription">When <span class="Highlight">Euphonia</span> is picked up, increase the Glacio DMG Bonus of all characters nearby by 12% for 20s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Glacio",
        modifierValue: 0.12,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
