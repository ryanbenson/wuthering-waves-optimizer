export const liberationAttacks = {
  name: "Resonance Liberation: Omega Storm",
  description: `<div class="skilldescription">Unleash the power of the Eye of Tempest, dealing <span class="Wind">Aero DMG</span> and healing all nearby Resonators in the team.<br>Can be cast in mid-air close to the ground.</div>`,
  attacks: [
    {
      key: "OmegaStormDMG",
      label: "Omega Storm DMG",
      talents: {
        "1": "270.00%",
        "2": "292.14%",
        "3": "314.28%",
        "4": "345.28%",
        "5": "367.42%",
        "6": "392.88%",
        "7": "428.31%",
        "8": "463.73%",
        "9": "499.15%",
        "10": "536.79%",
      },
      type: "Liberation",
    },
    {
      key: "OmegaStormHealing",
      label: "Omega Storm Healing",
      talents: {
        "1": "1100 + 36.67%",
        "2": "1232 + 38.13%",
        "3": "1375 + 39.60%",
        "4": "1540 + 41.80%",
        "5": "1738 + 44.73%",
        "6": "1925 + 47.67%",
        "7": "1958 + 53.17%",
        "8": "2002 + 59.40%",
        "9": "2035 + 66.00%",
        "10": "2090 + 77.00%",
      },
      type: "Healing",
    }
  ],  
};
