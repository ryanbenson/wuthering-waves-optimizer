export const skillAttacks = {
  name: "Resonance Skill: Windqueller",
  description: `<div class="skilldescription">Dash forward a certain distance, dealing <span class="Wind">Aero DMG</span>.
  <br> 
  <br>Can be cast in the air.</div>`,
  attacks: [
    {
      key: "Windqueller",
      label: "Skill DMG",
      talents: {
        "1": "53.50%*4",
        "2": "57.88%*4",
        "3": "62.27%*4",
        "4": "68.41%*4",
        "5": "72.80%*4",
        "6": "77.84%*4",
        "7": "84.86%*4",
        "8": "91.88%*4",
        "9": "98.90%*4",
        "10": "106.36%*4",
      },
      type: "Skill",
    },
  ],
};
