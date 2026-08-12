export const introAttacks = {
  name: "Intro Skill: Thunder Bombardment",
  description: `<div class="skilldescription">Attack the target, dealing <span class="Thunder">Electro DMG</span>.</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconYuanwu/SP_IconYuanwuQTE.webp",
  attacks: [
    {
      key: "ThunderBombardmentSkillDMG",
      label: "Thunder Bombardment DMG",
      talents: {
        "1": "32.00%",
        "2": "34.63%",
        "3": "37.25%",
        "4": "40.93%",
        "5": "43.55%",
        "6": "46.57%",
        "7": "50.77%",
        "8": "54.96%",
        "9": "59.16%",
        "10": "63.62%",
      },
      type: "Intro",
      attribute: "defense",
    },
  ],
};
