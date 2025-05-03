export const forteCircuitAttacks = {
  name: "Forte Circuit: Symphony of Wind and Verse",
  description: `<div class="skilldescription"><span class="Title">Heavy Attack - Quadruple Downbeat</span><br>When there are 3 segments of Musical Essence, Heavy Attack is replaced with <span class="Highlight">Heavy Attack - Quadruple Downbeat</span>.<br>Consume all Music Essense to shoot <span class="Highlight">Downbeat Notes</span> forward to deal <span class="Wind">Aero DMG</span>, pulling in the nearby targets and inflicting 1 stack of <span class="Highlight">Aero Erosion</span> on the target hit.<br><span class="Highlight">Heavy Attack - Quadruple Downbeat</span> can be cast in mid-air close to the ground.<br><span class="Title">Musical Essence</span><br>Ciaccona can hold up to 3 segments of Musical Essence.<br>Casting <span class="Highlight">Basic Attack Stage 4</span> or <span class="Highlight">Intro Skill</span> recovers 1 segment of Musical Essence.</div>`,
  attacks: [
    {
      key: "QuadrupleDownbeatDMG",
      label: "Quadruple Downbeat DMG",
      type: "Heavy",
      talents: {
        "1": "15.80%*10 + 157.95%",
        "2": "17.10%*10 + 170.91%",
        "3": "18.39%*10 + 183.86%",
        "4": "20.20%*10 + 201.99%",
        "5": "21.50%*10 + 214.94%",
        "6": "22.99%*10 + 229.84%",
        "7": "25.06%*10 + 250.56%",
        "8": "27.13%*10 + 271.28%",
        "9": "29.21%*10 + 292.01%",
        "10": "31.41%*10 + 314.03%",
      },
    },
  ],
};
