export const liberationAttacks = {
  name: "Resonance Liberation: Commedia Improvviso!",
  description: `<div class="skilldescription">Roccia's improvised comedy begins! Deal <span class="Dark">Havoc DMG</span> to the target, considered Heavy Attack DMG. For every 0.1% of Roccia's Crit. Rate over 50%, this skill increases the ATK of all Resnonators in the team by <saptag=2>1 point for 30s, up to 200 points.</saptag=2></div>`,
  attacks: [
    {
      key: "CommediaImprovvisoDMG",
      label: "Commedia Improvviso DMG",
      talents: {
        "1": "140.00%*3",
        "2": "151.48%*3",
        "3": "162.96%*3",
        "4": "179.04%*3",
        "5": "190.52%*3",
        "6": "203.72%*3",
        "7": "222.09%*3",
        "8": "240.45%*3",
        "9": "258.82%*3",
        "10": "278.34%*3",
      },
      type: "Heavy",
    },
  ],
};
