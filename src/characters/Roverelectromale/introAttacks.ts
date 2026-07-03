export const introAttacks = {
  name: "Intro Skill: Thunderous Fury",
  description: `<div>Attack the target, dealing <span style="color:#ebb0ff;">Electro DMG</span>.</div>`,
  attacks: [
    {
      key: "SkillDMG",
      label: "Skill DMG",
      talents: {
        "1": "16.80%*2+50.40%",
        "2": "18.18%*2+54.54%",
        "3": "19.56%*2+58.67%",
        "4": "21.49%*2+64.46%",
        "5": "22.87%*2+68.59%",
        "6": "24.45%*2+73.34%",
        "7": "26.65%*2+79.95%",
        "8": "28.86%*2+86.57%",
        "9": "31.06%*2+93.18%",
        "10": "33.41%*2+100.21%",
      },
      type: "Intro",
    }
  ],
};
