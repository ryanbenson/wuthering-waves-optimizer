export const liberationAttacks = {
  name: "Resonance Liberation: Sundering Strike",
  description: `<div>Deal <span class="ingame-Wind">Aero DMG</span> to targets within range, considered as Echo Skill DMG.<br>For every 1% of Qiuyuan's Crit. Rate over 50%, this skill increases the Crit. DMG of all nearby active Resonators in the team by 2% for 30s, up to 30%.</div>`,
  attacks: [
    {
      key: "SunderingStrikeDMG",
      label: "Sundering Strike DMG",
      type: "Echo",
      talents: {
        "1": "400.00%",
        "2": "432.80%",
        "3": "465.60%",
        "4": "511.52%",
        "5": "544.32%",
        "6": "582.04%",
        "7": "634.52%",
        "8": "687.00%",
        "9": "739.48%",
        "10": "795.24%",
      },
    },
  ],
};
