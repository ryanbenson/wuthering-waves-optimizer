export const basicAttacks = {
  name: "Basic Attack: Execution",
  description: `
    <div class="skilldescription">
      <span class="Title">Basic Attack</span>
      <br>
      Danjin performs up to 3 consecutive attacks, dealing <span class="Dark">Havoc DMG</span>.
      <br>
      <br>
      <span class="Title">Heavy Attack</span>
      <br>Danjin combines her Forte with the blade in her hand and consumes
      Stamina to launch consecutive attacks, dealing <span class="Dark">Havoc DMG</span>.
      <br>
      <br>
      <span class="Title">Mid-air Attack</span>
      <br>Consumme Stamina to perform a Mid-air Plunging Attack, dealing
      <span class="Dark">Havoc DMG</span>.
      <br>
      <br>
      <span class="Title">Dodge counter</span>
      <br>Use <span class="Highlight">Basic Attack</span> after a successfull
      <span class="Highlight">Dodge</span> to launch an attack, dealing
      <span class="Dark">Havoc DMG</span>.
      <br>
      <br>
      <span class="Title">Dodge Counter: Ruby Shades</span>
      <br>After a successfull Dodge Counter, Danjin can use Resonance Skill
      <span class="Highlight">Crimson Fragment</span> to perform Resonance Skill:
      <span class="Highlight">Crimson Erosion</span>.
    </div>`,
  attacks: [
    {
      key: "Part1DMG",
      label: "Part 1 DMG",
      talents: {
        "1":  "28.80%",
        "2":  "31.17%",
        "3":  "33.53%",
        "4":  "36.83%",
        "5":  "39.20%",
        "6":  "41.91%",
        "7":  "45.69%",
        "8":  "49.47%",
        "9":  "53.25%",
        "10": "57.26%",
      },
      type: "Basic",
    },
    {
      key: "Part2DMG",
      label: "Part 2 DMG",
      talents: {
        "1":  "29.60%",
        "2":  "32.03%",
        "3":  "34.46%",
        "4":  "37.86%",
        "5":  "40.28%",
        "6":  "43.08%",
        "7":  "46.96%",
        "8":  "50.84%",
        "9":  "54.73%",
        "10": "58.85%",
      },
      type: "Basic",
    },
    {
      key: "Part3DMG",
      label: "Part 3 DMG",
      talents: {
        "1":  "40.00%",
        "2":  "43.28%",
        "3":  "46.56%",
        "4":  "51.16%",
        "5":  "54.44%",
        "6":  "58.21%",
        "7":  "63.46%",
        "8":  "68.70%",
        "9":  "73.95%",
        "10": "79.53%",
      },
      type: "Basic",
    },
    {
      key: "HeavyAttackDMG2",
      label: "Heavy Attack DMG",
      talents: {
        "1":  "18.67%*3",
        "2":  "20.20%*3",
        "3":  "21.73%*3",
        "4":  "23.88%*3",
        "5":  "25.41%*3",
        "6":  "27.17%*3",
        "7":  "29.62%*3",
        "8":  "32.06%*3",
        "9":  "34.51%*3",
        "10": "37.12%*3",
      },
      type: "Heavy",
    },
    {
      key: "MidAirAttackDMG2",
      label: "Mid-Air Attack DMG",
      talents: {
        "1":  "49.60%",
        "2":  "53.67%",
        "3":  "57.74%",
        "4":  "63.43%",
        "5":  "67.50%",
        "6":  "72.18%",
        "7":  "78.69%",
        "8":  "85.19%",
        "9":  "91.70%",
        "10": "98.61%",
      },
      type: "Basic",
    },
    {
      key: "DodgeCounterDMG2",
      label: "Dodge Counter DMG",
      talents: {
        "1":  "32.00%*3",
        "2":  "34.63%*3",
        "3":  "37.25%*3",
        "4":  "40.93%*3",
        "5":  "43.55%*3",
        "6":  "56.57%*3",
        "7":  "50.77%*3",
        "8":  "54.96%*3",
        "9":  "59.16%*3",
        "10": "63.62%*3",
      },
      type: "Basic",
    },
  ],
};
