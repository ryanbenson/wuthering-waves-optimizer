export const introAttacks = {
  name: "Intro Skill: Attack the Must-Defend",
  description: `<div>Attack the target, dealing <span class="ingame-Wind">Aero DMG</span>, considered as Heavy Attack DMG.<br>Within a certain period of time after casting this skill, press <span class="ingame-Highlight">Normal Attack</span> to perform Basic Attack <span class="ingame-Highlight">Thus Spoke the Blade: Inkwash</span> Stage 3.</div>`,
  attacks: [
    {
      key: "RoamingwiththeWindDMG",
      label: "Roaming with the Wind DMG",
      talents: {
        "1": "95.12%",
        "2": "102.92%",
        "3": "110.72%",
        "4": "121.64%",
        "5": "129.44%",
        "6": "138.41%",
        "7": "150.89%",
        "8": "163.37%",
        "9": "175.85%",
        "10": "189.11%",
      },
      type: "Intro",
    },
  ],
};
