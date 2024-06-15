export const buffs = [
  {
    key: "InherentSkillBloodshed Awaken",
    name: "Inherent Skill: Bloodshed Awaken",
    details: `<div class="skilldescription">When casting Heavy Attack <span class="Highlight">"Mercy"</span>, Calcharo's Resonance Liberation DMG Bonus is increased by 10% for 15s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResonanceLiberationDMGBonus",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
