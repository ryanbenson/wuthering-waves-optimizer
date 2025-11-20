export const introAttacks = {
  name: "Intro Skill: Reverberance - Return",
  description: `<div>Attack the target, dealing <span class="Dark">Havoc DMG</span>.<br>While not in <span class="Highlight">Chainsaw Mode</span>, press <span class="Highlight">Normal Attack</span> shortly after casting this skill to cast <span class="Highlight">Basic Attack Stage 2</span>.<br>While in <span class="Highlight">Chainsaw Mode</span>, use <span class="Highlight">Normal Attack</span> shortly after casting this skill to cast <span class="Highlight">Sawring - Blitz Stage 2</span>.</div>`,
  attacks: [
    {
      key: "ReverberanceReturnDMG",
      label: "Reverberance - Return DMG",
      talents: {
        "1": "48.00%",
        "2": "51.94%",
        "3": "55.88%",
        "4": "61.39%",
        "5": "65.32%",
        "6": "69.85%",
        "7": "76.15%",
        "8": "82.44%",
        "9": "88.74%",
        "10": "95.43%",
      },
      type: "Intro",
    },
  ],
};
