export const introAttacks = {
  name: "Intro Skill: Grand Entrance",
  description: `<div class="skilldescription">Chixia makes a heroic entrance and fires rapidly with her dual pistols at the target, dealing <span class="Fire">Fusion DMG</span>.</div>`,
  attacks: [
    {
      key: "GrandEntranceSkillDMG",
      label: "Grand Entrance DMG",
      talents: {
        "1": "24.75%*2 + 12.38%*4",
        "2": "26.78%*2 + 13.39%*4",
        "3": "28.81%*2 + 14.41%*4",
        "4": "31.66%*2 + 15.83%*4",
        "5": "33.68%*2 + 16.84%*4",
        "6": "36.02%*2 + 18.01%*4",
        "7": "39.27%*2 + 19.64%*4",
        "8": "42.51%*2 + 21.26%*4",
        "9": "45.76%*2 + 22.88%*4",
        "10": "49.21%*2 + 24.61%*4",
      },
      type: "Intro",
    },
  ],
};
