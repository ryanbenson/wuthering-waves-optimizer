export const skillAttacks = {
  name: "Resonance Skill: Harmonic Allegro",
  description: `<div class="skilldescription">Move a certain distance, dealing <span class="Wind">Aero DMG</span> and inflicting 1 stack of <span class="Highlight">Aero Erosion</span> on the target upon hit.<br>Press Normal Attack in time to cast Basic Attack Stage 2.<br>- When Ciaccona interrupts Basic Attack, Heavy Attack, Mid-air Attack, or <span class="Highlight">Solo Concert</span> with Resonance Skill, an <span class="Highlight">Ensemble Sylph</span> is generated.<br>- Ciaccona's Resonance Skill can be cast in mid-air.</div>`,
  attacks: [
    {
      key: "HarmonicAllegroDMG",
      label: "Harmonic Allegro DMG",
      type: "Skill",
      talents: {
        "1": "20.32%*4",
        "2": "21.98%*4",
        "3": "23.65%*4",
        "4": "25.98%*4",
        "5": "27.65%*4",
        "6": "29.56%*4",
        "7": "32.23%*4",
        "8": "34.89%*4",
        "9": "37.56%*4",
        "10": "40.39%*4",
      },
    },
  ],
};
