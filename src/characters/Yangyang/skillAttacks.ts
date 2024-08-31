export const skillAttacks = {
  name: "Resonance Skill: Zephyr Domain",
  description: `<div class="skilldescription">Yangyang wields her sword to create a whirling vortex of winds that gathers nearby enemies to the center, dealing <span class="Wind">Aero DMG</span>.</div>`,
  attacks: [
    {
      key: "ZephyrDomainSkillDMG",
      label: "Zephyr Domain DMG",
      talents: {
        "1": "17.37%*4 + 104.22%",
        "2": "18.79%*4 + 112.76%",
        "3": "20.21%*4 + 121.31%",
        "4": "22.21%*4 + 133.27%",
        "5": "23.63%*4 + 141.82%",
        "6": "25.27%*4 + 151.65%",
        "7": "27.55%*4 + 165.32%",
        "8": "29.83%*4 + 178.99%",
        "9": "32.11%*4 + 192.67%",
        "10": "34.53%*4 + 207.19%",
      },
      type: "Skill",
    },
  ],
};
