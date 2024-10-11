export const basicAttacks = {
  name: "Normal Attack: Breeding",
  description: `<div class="skilldescription"><span class="Highlight">Basic</span><br>Performs up to 5 consecutive attacks, dealing <span class="Dark">Havoc</span> damage.
  After casting <span class="Highlight">Basic Attack Stage 3</span>, holding <span class="Highlight">Normal Attack</span> will continuously attack the target, dealing <span class="Dark">Havoc</span> damage.
  When <span class="Highlight">Basic Attack Stage 4</span> ends, immediately cast <span class="Highlight">Basic Attack Stage 5.</span>
  <br><br>
  <span class="Highlight">Heavy</span><br>
  Consumes Stamina to attack the target, dealing <span class="Dark">Havoc</span> damage.
  <br><br>
  <span class="Highlight">Plunging</span><br>
  Consumes Stamina to perform a plunging attack, dealing <span class="Havoc">Havoc</span> damage.
  <br><br>
  <span class="Highlight">Dodge Counter</span><br>
  When pressing the <span class="Highlight">Normal Attack</span> after successfully dodging, Camellya attacks the target, dealing <span class="Dark">Havoc</span> damage.
  </div>`,
  attacks: [
    {
      key: "NormalAttackStage1DMG",
      label: "Stage 1 DMG",
      talents: {
        "1": "31.45%",
        "2": "34.03%",
        "3": "36.61%",
        "4": "40.22%",
        "5": "42.80%",
        "6": "45.77%",
        "7": "49.89%",
        "8": "54.02%",
        "9": "58.15%",
        "10": "62.53%",
      },
      type: "Basic",
    },
    {
      key: "NormalAttackStage2DMG",
      label: "Stage 2 DMG",
      talents: {
        "1": "23.38%*2",
        "2": "25.30%*2",
        "3": "27.21%*2",
        "4": "29.90%*2",
        "5": "31.81%*2",
        "6": "34.02%*2",
        "7": "37.08%*2",
        "8": "40.15%*2",
        "9": "43.22%*2",
        "10": "46.48%*2",
      },
      type: "Basic",
    },
    {
      key: "NormalAttackStage3DMG",
      label: "Stage 3 DMG",
      talents: {
        "1": "25.50%*3",
        "2": "27.59%*3",
        "3": "29.68%*3",
        "4": "32.61%*3",
        "5": "34.70%*3",
        "6": "37.11%*3",
        "7": "40.45%*3",
        "8": "43.80%*3",
        "9": "47.14%*3",
        "10": "50.70%*3",
      },
      type: "Basic",
    },
    {
      key: "NormalAttackStage4DMG",
      label: "Stage 4 DMG",
      talents: {
        "1": "12.42%*20",
        "2": "13.44%*20",
        "3": "14.46%*20",
        "4": "15.89%*20",
        "5": "16.91%*20",
        "6": "18.08%*20",
        "7": "19.71%*20",
        "8": "21.34%*20",
        "9": "22.97%*20",
        "10": "24.70%*20",
      },
      type: "Basic",
    },
    {
      key: "NormalAttackStage5DMG",
      label: "Stage 5 DMG",
      talents: {
        "1": "24.23%*4",
        "2": "26.22%*4",
        "3": "28.20%*4",
        "4": "30.98%*4",
        "5": "32.97%*4",
        "6": "35.25%*4",
        "7": "38.43%*4",
        "8": "41.61%*4",
        "9": "44.79%*4",
        "10": "48.17%*4",
      },
      type: "Basic",
    },
    {
      key: "HeavyAttackDMG",
      label: "Heavy Attack DMG",
      talents: {
        "1": "44.33%*3",
        "2": "47.97%*3",
        "3": "51.60%*3",
        "4": "56.69%*3",
        "5": "60.33%*3",
        "6": "64.51%*3",
        "7": "70.32%*3",
        "8": "76.14%*3",
        "9": "81.96%*3",
        "10": "88.14%*3",
      },
      type: "Heavy",
    },
    {
      key: "MidAirAttackDMG",
      label: "Mid-air Attack DMG",
      talents: {
        "1": "33.00%*2",
        "2": "35.71%*2",
        "3": "38.42%*2",
        "4": "42.21%*2",
        "5": "44.91%*2",
        "6": "48.02%*2",
        "7": "52.35%*2",
        "8": "56.68%*2",
        "9": "61.01%*2",
        "10": "65.61%*2",
      },
      type: "Basic",
    },
    {
      key: "DodgeCounterDMG",
      label: "Dodge Counter DMG",
      talents: {
        "1": "50.00%*3",
        "2": "54.10%*3",
        "3": "58.20%*3",
        "4": "63.94%*3",
        "5": "68.04%*3",
        "6": "72.75%*3",
        "7": "79.31%*3",
        "8": "85.87%*3",
        "9": "92.43%*3",
        "10": "99.40%*3",
      },
      type: "Basic",
    },
  ],
};
