export const introAttacks = {
  name: "Intro Skill: Frostedge",
  description: `<div>Deal <span style="color:#41aefb"><strong>Glacio DMG</strong></span>, considered Resonance Liberation DMG, and apply1 stack of <span style="color:#f7ca2f"><strong><span class="Highlight">Glacio Chafe</span></strong></span> on hit.<br>In <span style="color:#f7ca2f"><strong><span class="Highlight">Present Self</span></strong></span>, casting this skill restores 200 points of <span style="color:#f7ca2f"><strong><span class="Highlight">Dedication</span></strong></span>. Press or hold <span style="color:#f7ca2f"><strong>Normal Attack</strong></span> within a certain period after casting this skill to cast <span style="color:#f7ca2f"><strong>Basic Attack - Foreclaimed Self Stage 3</strong></span>.<br>In <span style="color:#f7ca2f"><strong><span class="Highlight">Foreclaimed Self</span></strong></span>, press <span style="color:#f7ca2f"><strong>Normal Attack</strong></span> within a certain period after casting this skill to cast <span style="color:#f7ca2f"><strong>Basic Attack - Foreclaimed Self Stage 2</strong></span>.</div>`,
  attacks: [
    {
      key: "FrostedgeDMG",
      label: "Frostedge DMG",
      talents: {
        "1": "78.54%",
        "2": "84.99%",
        "3": "91.43%",
        "4": "100.44%",
        "5": "106.88%",
        "6": "114.29%",
        "7": "124.59%",
        "8": "134.90%",
        "9": "145.20%",
        "10": "156.15%",
      },
      type: "Liberation",
    },
  ],
};
