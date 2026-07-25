export const skillAttacks = {
  name: "Resonance Skill: Severing Note",
  description: `<div><span class="Title">Severing Note: Judgement</span></span><br><br>Deals <span style="color:#c7ffed";>Aero DMG</span>. During this skill, gain 30 points of <span style="color:#ffd12f;" class="font-bold">Qin Heart</span>.<br><size=10></span><br><br><span class="Title">Severing Note: Ascendant</span></span><br><br>While casting <span style="color:#ffd12f;" class="font-bold">Basic Attack - Stringblade Stage 2</span> or <span style="color:#ffd12f;" class="font-bold">Basic Attack - Stringblade Stage 3</span>, <span style="color:#ffd12f;" class="font-bold">Resonance Skill</span> is replaced by <span style="color:#ffd12f;" class="font-bold">Severing Note: Ascendant</span>.<br>Deals <span style="color:#c7ffed";>Aero DMG</span>.<br>This skill is <span style="color:#ffd12f;" class="font-bold">Drawn Stance</span>.</div>`,
  attacks: [
    {
      key: "SeveringNoteJudgementDMG",
      label: "Severing Note: Judgement DMG",
      talents: {
        "1": "9.45%*2+44.10%",
        "2": "10.23%*2+47.72%",
        "3": "11.00%*2+51.34%",
        "4": "12.09%*2+56.40%",
        "5": "12.86%*2+60.02%",
        "6": "13.76%*2+64.17%",
        "7": "15.00%*2+69.96%",
        "8": "16.24%*2+75.75%",
        "9": "17.48%*2+81.53%",
        "10": "18.79%*2+87.68%",
      },
      type: "Skill",
    },
    {
      key: "SeveringNoteAscendantDMG",
      label: "Severing Note: Ascendant DMG",
      talents: {
        "1": "14.28%+16.66%*2",
        "2": "15.46%+18.03%*2",
        "3": "16.63%+19.40%*2",
        "4": "18.27%+21.31%*2",
        "5": "19.44%+22.68%*2",
        "6": "20.78%+24.25%*2",
        "7": "22.66%+26.43%*2",
        "8": "24.53%+28.62%*2",
        "9": "26.40%+30.80%*2",
        "10": "28.40%+33.13%*2",
      },
      type: "Skill",
    }
  ],
};
