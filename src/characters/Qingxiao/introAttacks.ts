export const introAttacks = {
  name: "Intro Skill: Tonality Shift",
  description: `<div>Deal <span style="color:#c7ffed";>Aero DMG</span>. Upon casting, gain 30 points of <span style="color:#ffd12f;" class="font-bold">Sword Cadence</span> and gain <span style="color:#ffd12f;" class="font-bold">Resonant Chime</span>.<br></span><br><br><span class="Title">Resonant Chime</span></span><br><br>Casting <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Severing Note: Judgement</span> grants 30 points of <span style="color:#ffd12f;" class="font-bold">Qin Heart</span> and removes <span style="color:#ffd12f;" class="font-bold">Resonant Chime</span>.</div>`,
  attacks: [
    {
      key: "TonalityShiftDMG",
      label: "Tonality Shift DMG",
      talents: {
        "1": "20.02%+23.35%*2",
        "2": "21.66%+25.27%*2",
        "3": "23.30%+27.18%*2",
        "4": "25.60%+29.86%*2",
        "5": "27.24%+31.78%*2",
        "6": "29.13%+33.98%*2",
        "7": "31.75%+37.04%*2",
        "8": "34.38%+40.11%*2",
        "9": "37.00%+43.17%*2",
        "10": "39.79%+46.42%*2",
      },
      type: "Intro",
    }
  ],
};
