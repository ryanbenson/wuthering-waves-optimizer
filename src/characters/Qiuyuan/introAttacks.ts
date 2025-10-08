export const introAttacks = {
  name: "Intro Skill: Attack the Must-Defend",
  description: `<div>Attack the target, dealing <span class="ingame-Wind">Aero DMG</span>, considered as Heavy Attack DMG.<br>Within a certain period of time after casting this skill, press <span class="ingame-Highlight">Normal Attack</span> to perform Basic Attack <span class="ingame-Highlight">Thus Spoke the Blade: Inkwash</span> Stage 3.</div>`,
  attacks: [
    {
      key: "AttacktheMustDefendDMG",
      label: "Attack the Must-Defend DMG",
      talents: {
        "1": "4.80%*5+24.00%+72.00%",
        "2": "5.20%*5+25.97%+77.91%",
        "3": "5.59%*5+27.94%+83.81%",
        "4": "6.14%*5+30.70%+92.08%",
        "5": "6.54%*5+32.66%+97.98%",
        "6": "6.99%*5+34.93%+104.77%",
        "7": "7.62%*5+38.08%+114.22%",
        "8": "8.25%*5+41.22%+123.66%",
        "9": "8.88%*5+44.37%+133.11%",
        "10": "9.55%*5+47.72%+143.15%",
      },
      type: "Heavy",
    },
  ],
};
