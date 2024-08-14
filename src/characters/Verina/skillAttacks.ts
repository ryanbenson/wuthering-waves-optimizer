export const skillAttacks = {
  name: "Resonance Skill: Botany Experiment",
  description: `<div class="skilldescription">Verina converges an energy field in front to grow foliage, dealing <span class="Light">Spectro DMG</span> within the range.</div>`,
  attacks: [
    {
      key: "BotanyExperimentDMG",
      label: "Skill DMG",
      talents: {
        "1": "18.00%*3 + 36.00%",
        "2": "19.48%*3 + 38.96%",
        "3": "20.96%*3 + 41.91%",
        "4": "23.02%*3 + 46.04%",
        "5": "24.50%*3 + 48.99%",
        "6": "26.20%*3 + 52.39%",
        "7": "28.56%*3 + 57.11%",
        "8": "30.92%*3 + 61.83%",
        "9": "33.28%*3 + 66.56%",
        "10": "35.79%*3 + 71.58%",
      },
      type: "Skill",
    },
  ],
};
