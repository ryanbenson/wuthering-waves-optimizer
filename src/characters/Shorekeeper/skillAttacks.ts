export const skillAttacks = {
  name: "Resonance Skill: Chaos Theory",
  description: `<div class="skilldescription">Restore HP for all nearby party members and summon 5 <span class="Highlight">Dim Star Butterflies</span>, which automatically track and attack a target, dealing <span class="Light">Spectro DMG</span>. Follow up with <span class="Highlight">Basic Attack</span> in time to start the Basic Attack cycle from <span class="Highlight">Stage 2</span>.<br>Can be performed in mid-air.</div>`,
  attacks: [
    {
      key: "DimStarButterflyDMG",
      label: "Dim Star Butterfly DMG",
      talents: {
        "1": "15.75%",
        "2": "17.04%",
        "3": "18.33%",
        "4": "20.14%",
        "5": "21.43%",
        "6": "22.91%",
        "7": "24.98%",
        "8": "27.05%",
        "9": "29.11%",
        "10": "31.31%",
      },
      type: "Skill",
    },
    {
      key: "ChaosTheoryHealing",
      label: "Chaos Theory Healing",
      talents: {
        "1": "660 + 3.00%",
        "2": "715 + 3.25%",
        "3": "769 + 3.50%",
        "4": "845 + 3.84%",
        "5": "899 + 4.09%",
        "6": "961 + 4.37%",
        "7": "1047 + 4.76%",
        "8": "1134 + 5.16%",
        "9": "1221 + 5.55%",
        "10": "1313 + 5.97%",
      },
      type: "Healing",
      attribute: "hp"
    },
  ],
};
