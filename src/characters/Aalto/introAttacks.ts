export const introAttacks = {
  name: "Intro Skill: Feint Shot",
  description: `<div class="skilldescription">Aalto shows up out of thin air to perform rapid continuous shooting, dealing <span class="Wind">Aero DMG</span>.</div>`,
  attacks: [
    {
      key: "FeintShotSkillDMG",
      label: "Feint Shot DMG",
      talents: {
        "1": "33.34%*3",
        "2": "36.07%*3",
        "3": "38.8%*3",
        "4": "42.63%*3",
        "5": "45.36%*3",
        "6": "48.51%*3",
        "7": "52.88%*3",
        "8": "57.25%*3",
        "9": "61.63%*3",
        "10": "66.27%*3",
      },
      type: "Intro",
    },
  ],
};
