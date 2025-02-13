export const liberationAttacks = {
  name: "Resonance Liberation: Dawn of Enlightenment",
  description: `<div class="skilldescription">Phoebe concentrates the light in her hands into the Mirror of Enlightenment and smashes it, dealing <span class="Light">Spectro DMG</span>.<br>- <span class="Highlight">Absolution</span> Enhancement: Increase DMG Multiplier by 255%.<br>- <span class="Highlight">Confession</span> Enhancement: Apply <saptag=1>8 stack of <span class="Highlight">Spectro Frazzle</span> to targets hit .</saptag=1></div>`,
  attacks: [
    {
      key: "DawnofEnlightenmentDMG",
      label: "Dawn of Enlightenment DMG",
      talents: {
        "1": "202.00%",
        "2": "218.57%",
        "3": "235.13%",
        "4": "258.32%",
        "5": "274.89%",
        "6": "293.94%",
        "7": "320.44%",
        "8": "346.94%",
        "9": "373.44%",
        "10": "401.60%",
      },
      type: "Liberation",
    },
  ],
};
