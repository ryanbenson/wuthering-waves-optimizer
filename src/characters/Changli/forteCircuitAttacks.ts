export const forteCircuitAttacks = {
  name: "Forte Circuit: Flaming Sacrifice",
  description:
    `<div class="skilldescription"><span class="Title">Heavy Attack: Flaming Sacrifice</span><br>When releasing <span class="Highlight">Heavy Attack</span>, if Changli carries 4 stacks of Enflamement, she consumes all stacks of Enflamement to cast <span class="Highlight">Flaming Sacrifice</span>, dealing <span class="Fire">Fusion DMG</span>, considered as Resonance Skill DMG.<br>While casting <span class="Highlight">Flaming Sacrifice</span>, Changli takes 40% less DMG.<br><br><span class="Title">Enflamement</span><br>Changli can hold up to 4 stacks of Enflamement.<br>Changli obtains 1 stack of Enflamement for every Basic Attack: <span class="Highlight">True Sight - Conquest</span> on hit.<br>Changli obtains 1 stack of Enflamement for every Basic Attack: <span class="Highlight">True Sight - Charge</span> on hit.<br>Changli obtains 4 stacks of Enflamement for every Resonance Liberation <span class="Highlight">Radiance of Fealty</span>.</div>`,
  attacks: [
    {
      key: "FlamingVowDMG",
      label: "Flaming Sacrifice DMG",
      talents: {
        "1": "19.74%*5 + 230.30%",
        "2": "21.36%*5 + 249.18%",
        "3": "22.98%*5 + 268.07%",
        "4": "25.25%*5 + 294.51%",
        "5": "26.87%*5 + 313.39%",
        "6": "28.73%*5 + 335.11%",
        "7": "31.32%*5 + 365.32%",
        "8": "33.91%*5 + 395.54%",
        "9": "36.50%*5 + 425.75%",
        "10": "39.25%*5 + 457.85%",
      },
      type: "Skill",
    },
  ],
};
