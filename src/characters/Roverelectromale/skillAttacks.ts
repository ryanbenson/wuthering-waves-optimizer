export const skillAttacks = {
  name: "Resonance Skill: Thunderclap",
  description: `<div>Launch the Cloudrift Bolt and grapple towards the target, dealing <span style="color:#ebb0ff;">Electro DMG</span>. Press <span style="color:#ffd12f;" class="font-bold">Normal Attack</span> shortly after to cast <span style="color:#ffd12f;" class="font-bold">Basic Attack - Repel</span>, dealing Electro DMG, considered Basic Attack DMG.</div>`,
  attacks: [
    {
      key: "SkillDMG",
      label: "Skill DMG",
      talents: {
        "1": "50.40%*2",
        "2": "54.53%*2",
        "3": "58.67%*2",
        "4": "64.45%*2",
        "5": "68.59%*2",
        "6": "73.34%*2",
        "7": "79.95%*2",
        "8": "86.56%*2",
        "9": "93.17%*2",
        "10": "100.20%*2",
      },
      type: "Skill",
    },
    {
      key: "BasicAttackRepelDMG",
      label: "Basic Attack - Repel DMG",
      talents: {
        "1": "28.23%+42.34%",
        "2": "30.54%+45.81%",
        "3": "32.86%+49.28%",
        "4": "36.10%+54.14%",
        "5": "38.41%+57.62%",
        "6": "41.07%+61.61%",
        "7": "44.78%+67.16%",
        "8": "48.48%+72.72%",
        "9": "52.18%+78.27%",
        "10": "56.12%+84.17%",
      },
      type: "Basic",
    }
  ],
};
