export const skillAttacks = {
  name: "Resonance Skill: Whizzing Fight Spirit",
  description: `<div class="skilldescription">Chixia unleashes a flurry of shots, dealing <span class="Fire">Fusion DMG</span>.
  <br> 
  <br><span class="Highlight">Whizzing Fight Spirit</span> has 2 initial charges.</div>`,
  attacks: [
    {
      key: "WhizzingFightSpiritSkillDMG",
      label: "Skill DMG",
      talents: {
        "1": "16.00%*8",
        "2": "17.32%*8",
        "3": "18.63%*8",
        "4": "20.47%*8",
        "5": "21.78%*8",
        "6": "23.29%*8",
        "7": "25.39%*8",
        "8": "27.48%*8",
        "9": "29.58%*8",
        "10": "31.81%*8",
      },
      type: "Skill",
    },
  ],
};
