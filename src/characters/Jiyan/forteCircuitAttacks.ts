export const forteCircuitAttacks = {
  name: "Forte Circuit: Qingloong at War",
  description: `<div class="skilldescription">When casting Resonance Skill <span class="Highlight">Windqueller</span>, if Jiyan has 30 or more "Resolve", he consumes 30 "Resolve" to increase the damage of this Resonance Skill <span class="Highlight">Windqueller</span> by 20%.<br>When Jiyan is in <span class="Highlight">Qingloong Mode</span>, DMG of Resonance Skill <span class="Highlight">Windqueller</span> is increased by 20% and no longer consumes "Resolve".<br> <br><span class="Title">Resonance Liberation: Emerald Storm: Finale</span><br>When casting Resonance Liberation <span class="Highlight">Emerald Storm: Prelude</span>, if Jiyan has 30 "Resolve" or more, he will consume 30 "Resolve" to cast Emerald Storm: Finale, dealing <span class="Wind">Aero DMG</span>, considered as Heavy Attack damage.<br>Emerald Storm: Finale can be cast in mid-air at low altitude.<br> <br><span class="Title">Resolve</span><br>Jiyan can hold up to 60 Resolve.<br>Jiyan gains "Resolve" when his Normal Attack <span class="Highlight">Lone Lance</span> hits the target.<br>Jiyan gains "Resolve" when the Intro Skill <span class="Highlight">Tactical Strike</span> hits the target.<br>If Jiyan does not hit a target within 15s, his "Resolve" will gradually decrease.</div>`,
  attacks: [
    {
      key: "EmeraldStormFinaleDamage",
      label: "Emerald Storm: Finale Damage",
      talents: {
        "1": "71.88%*2 + 215.64%",
        "2": "77.77%*2 + 233.33%",
        "3": "83.67%*2 + 251.01%",
        "4": "91.92%*2 + 275.77%",
        "5": "97.81%*2 + 293.45%",
        "6": "104.59%*2 + 313.78%",
        "7": "114.02%*2 + 342.08%",
        "8": "123.45%*2 + 370.37%",
        "9": "132.88%*2 + 398.66%",
        "10": "142.91%*2 + 428.73%",
      },
      type: "Heavy",
    },
  ],
};
