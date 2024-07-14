export const skillAttacks = {
  name: "Resonance Skill: Flaming Woolies",
  description: `<div class="skilldescription"><span class="Title">Flaming Woolies</span>
    <br>Encore summons Cloudy and Cosmos to attack with burning rays, dealing <span class="Fire">Fusion DMG</span>.
    <br> 
    <br><span class="Title">Energetic Welcome</span>
    <br>After casting <span class="Highlight">Flaming Woolies</span>, use <span class="Highlight">Resonance Skill</span> to perform <span class="Highlight">Energetic Welcome</span>, dealing <span class="Fire">Fusion DMG</span>.</div>`,
  attacks: [
    {
      key: "FlamingWooliesDamage",
      label: "Flaming Woolies Damage",
      talents: {
        "1": "38.53%*8",
        "2": "41.69%*8",
        "3": "44.85%*8",
        "4": "49.28%*8",
        "5": "52.44%*8",
        "6": "56.07%*8",
        "7": "61.13%*8",
        "8": "66.18%*8",
        "9": "71.24%*8",
        "10": "76.61%*8",
      },
      type: "Skill",
    },
    {
      key: "EnergeticWelcomeDamage",
      label: "Energetic Welcome Damage",
      talents: {
        "1": "170.60%",
        "2": "184.58%",
        "3": "198.57%",
        "4": "218.16%",
        "5": "232.15%",
        "6": "248.24%",
        "7": "270.62%",
        "8": "293.00%",
        "9": "315.38%",
        "10": "339.16%",
      },
      type: "Skill",
    },
  ],
};
