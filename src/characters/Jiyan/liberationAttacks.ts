export const liberationAttacks = {
  name: "Resonance Liberation: Emerald Storm: Prelude",
  description: `<div class="skilldescription">After releasing Emerald Storm: Prelude, Jiyan enters <span class="Highlight">Qingloong Mode</span>.
  <br> 
  <br><span class="Title">Qingloong Mode</span>
  <br>Jiyan has increased Anti-interruption;
  <br><span class="Highlight">Basic Attack</span>, <span class="Highlight">Heavy Attack</span> and <span class="Highlight">Dodge Counter</span> are replaced with Heavy Attack <span class="Highlight">Lance of Qingloong</span>.
  <br> 
  <br><span class="Title">Heavy Attack: Lance of Qingloong</span>
  <br>Perform up to 3 continuous attacks, dealing <span class="Wind">Aero DMG</span>, considered as Heavy Attack damage.</div>`,
  attacks: [
    {
      key: "LanceOfQingloongPart1DMG",
      label: "Lance of Qingloong Part 1 DMG",
      talents: {
        "1": "32.95%*8",
        "2": "35.66%*8",
        "3": "38.36%*8",
        "4": "42.14%*8",
        "5": "44.84%*8",
        "6": "47.95%*8",
        "7": "52.28%*8",
        "8": "56.60%*8",
        "9": "60.93%*8",
        "10": "65.52%*8",
      },
      type: "Heavy",
    },
    {
      key: "LanceOfQingloongPart2DMG",
      label: "Lance of Qingloong Part 2 DMG",
      talents: {
        "1": "30.96%*8",
        "2": "33.49%*8",
        "3": "36.03%*8",
        "4": "39.59%*8",
        "5": "42.13%*8",
        "6": "45.05%*8",
        "7": "49.11%*8",
        "8": "53.17%*8",
        "9": "57.23%*8",
        "10": "61.55%*8",
      },
      type: "Heavy",
    },
    {
      key: "LanceOfQingloongPart3DMG",
      label: "Lance of Qingloong Part 3 DMG",
      talents: {
        "1": "33.58%*8",
        "2": "36.33%*8",
        "3": "39.08%*8",
        "4": "42.94%*8",
        "5": "45.69%*8",
        "6": "48.86%*8",
        "7": "53.27%*8",
        "8": "57.67%*8",
        "9": "62.08%*8",
        "10": "66.76%*8",
      },
      type: "Heavy",
    },
  ],
};
