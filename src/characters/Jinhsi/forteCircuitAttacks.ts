export const forteCircuitAttacks = {
  name: "Forte Circuit: Flaming Vow",
  description:
    '<div class="skilldescription"><span class="Title">Heavy Attack: Flaming Sacrifice</span><br>When releasing <span class="Highlight">Heavy Attack</span>, if Changli carries 4 stacks of [Enflamement], she consumes all stacks of [Enflamement] to release <span class="Highlight">Flaming Sacrifice</span>, dealing <span class="Fire">Fusion DMG</span>, considered as Resonance Skill DMG.<br><span class="Title">Enflamement</span><br>Changli can hold up to 4 stacks of [Enflamement].<br>Changli obtains 1 stack of [Enflamement] for every Basic Attack: <span class="Highlight">True Sight - Conquest</span> on hit.<br>Changli obtains 1 stack of [Enflamement] for every Basic Attack: <span class="Highlight">True Sight - Charge</span> on hit.<br>Changli obtains 4 stacks of [Enflamement] for every Resonance Liberation <span class="Highlight">Radiance of Fealty</span>.</div>',
  attacks: [
    {
      key: "FlamingVowDMG",
      label: "Flaming Vow DMG",
      talents: {
        "1": "16.31%*5 + 190.25%",
        "2": "17.65%*5 + 205.85%",
        "3": "18.99%*5 + 221.45%",
        "4": "20.86%*5 + 243.29%",
        "5": "22.19%*5 + 258.89%",
        "6": "23.73%*5 + 276.83%",
        "7": "25.87%*5 + 301.79%",
        "8": "28.01%*5 + 326.75%",
        "9": "30.15%*5 + 351.71%",
        "10": "32.42%*5 + 378.23%",
      },
      type: "Skill",
    },
  ],
};
