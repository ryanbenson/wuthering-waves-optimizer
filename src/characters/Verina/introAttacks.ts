export const introAttacks = {
  name: "Intro Skill: Verdant Growth",
  description: `<div class="skilldescription">Verina attacks the target, dealing <span class="Light">Spectro DMG</span>.</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconJueyuan/SP_IconJueyuanQTE.webp",
  attacks: [
    {
      key: "VerdantGrowthDMG",
      label: "Verdant Growth DMG",
      talents: {
        "1": "50.00%",
        "2": "54.10%",
        "3": "58.20%",
        "4": "63.94%",
        "5": "68.04%",
        "6": "72.76%",
        "7": "79.32%",
        "8": "85.88%",
        "9": "92.44%",
        "10": "99.41%",
      },
      type: "Intro",
    },
  ],
};
