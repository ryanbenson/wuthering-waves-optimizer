export const skillAttacks = {
  name: "Resonance Skill: Warrior's Blade",
  description: `<div>Augusta leaps and slams down her Broadblade, dealing <span class="ingame-Thunder">Electro DMG</span>.</div>`,
  icon: "https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconAogusita/SP_IconAogusitaB3.webp",
  attacks: [
    {
      key: "WarriorsBladeDMG",
      label: "Warrior's Blade DMG",
      talents: {
        "1": "110.00%*3",
        "2": "119.02%*3",
        "3": "128.04%*3",
        "4": "140.67%*3",
        "5": "149.69%*3",
        "6": "160.07%*3",
        "7": "174.50%*3",
        "8": "188.93%*3",
        "9": "203.36%*3",
        "10": "218.70%*3",
      },
      type: "Skill",
    },
  ],
};
