export const liberationAttacks = {
  name: "Resonance Liberation: Violent Finale",
  description:
    `<div class="skilldescription">Deal <span class="Fire">Fusion DMG</span>, and apply <span class="Highlight">Burning Rhapsody</span> to all characters on the team.<br> <br><span class="Title">Burning Rhapsody</span><br>When the active character's <span class="Highlight">Basic Attack</span> hits the target, Mortefi launches a Coordinated Attack, firing 1 <span class="Highlight">Marcato</span>.<br>When the active character's <span class="Highlight">Heavy Attack</span> hits the target, Mortefi launches a Coordinated Attack, firing 2 <span class="Highlight">Marcato</span>.<br>Mortefi can launch one Coordinated Attack every 0.35s.<br> <br><span class="Title">Marcato</span><br>Deals <span class="Fire">Fusion DMG</span>.</div>`,
  attacks: [
    {
      key: "ViolentFinaleDamage",
      label: "Violent Finale Damage",
      talents: {
        "1": "80.00%",
        "2": "86.56%",
        "3": "93.12%",
        "4": "102.31%",
        "5": "108.87%",
        "6": "116.41%",
        "7": "126.91%",
        "8": "137.40%",
        "9": "147.90%",
        "10": "159.05%",
      },
      type: "Liberation",
    },
    {
      key: "MarcatoDamage",
      label: "Marcato Damage",
      talents: {
        "1": "16.00%",
        "2": "17.32%",
        "3": "18.63%",
        "4": "20.47%",
        "5": "21.78%",
        "6": "23.29%",
        "7": "25.39%",
        "8": "27.48%",
        "9": "29.58%",
        "10": "31.81%",
      },
      type: "Liberation",
    },
  ],
};
