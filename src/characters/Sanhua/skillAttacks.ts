export const skillAttacks = {
  name: "Resonance Skill: Eternal Frost",
  description: `<div class="skilldescription">Sanhua sends an air blade to create 1 "Ice Prism" on the ground, dealing <span class="Ice">Glacio DMG</span>.</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconSanhua/SP_IconSanhuaB1.webp",
  attacks: [
    {
      key: "EternalFrostSkillDMG",
      label: "Eternal Frost DMG",
      talents: {
        "1": "181.00%",
        "2": "195.85%",
        "3": "210.69%",
        "4": "231.47%",
        "5": "246.31%",
        "6": "263.38%",
        "7": "287.13%",
        "8": "310.87%",
        "9": "334.62%",
        "10": "359.85%",
      },
      type: "Skill",
    },
  ],
};
