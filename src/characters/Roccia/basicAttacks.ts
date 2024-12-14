export const basicAttacks = {
  name: `Normal Attack: "Perlo, take it easy."`,
  description: `<div class="skilldescription">
<span class="Title">Basic Attack</span><br>
Performs up to 4 consecutive attacks, dealing <span class="Dark">Havoc</span> damage.<br>
<br>
<span class="Title">Heavy Attack</span><br>
Consumes STAMINA to attack a target, dealing <span class="Dark">Havoc</span> damage. If the target is hit and 【Imagination】 has at least 100 points, Roccia is launched into the air, entering the Leap Fantasy state. You can charge by holding the Basic Attack button, with longer charging increasing the amount of 【Imagination】 gained. Charging can continue even if STAMINA is exhausted. Releasing the Basic Attack mid-charge, or reaching the maximum charging time, will automatically cast a Heavy Attack..<br>
<br>
<span class="Title">Aerial Attack</span><br>
Consumes STAMINA to perform a downward aerial attack, dealing <span class="Dark">Havoc</span> damage.<br>
<br>
<span class="Title">Dodge Counterattack</span><br>
After successfully dodging, pressing Basic Attack within a short time will attack the target, dealing <span class="Dark">Havoc</span> damage.</span>.`,
  attacks: [
    {
      key: "BasicAttackStage1DMG",
      label: "Stage 1 DMG",
      talents: {
        "1": "36.81%",
        "2": "39.83%",
        "3": "42.85%",
        "4": "47.07%",
        "5": "50.09%",
        "6": "53.56%",
        "7": "58.39%",
        "8": "63.22%",
        "9": "68.05%",
        "10": "73.18%",
      },
      type: "Basic",
    },
    {
      key: "BasicAttackStage2DMG",
      label: "Stage 2 DMG",
      talents: {
        "1": "19.19%*3",
        "2": "20.76%*3",
        "3": "22.33%*3",
        "4": "24.53%*3",
        "5": "26.11%*3",
        "6": "27.92%*3",
        "7": "30.43%*3",
        "8": "32.95%*3",
        "9": "35.47%*3",
        "10": "38.14%*3",
      },
      type: "Basic",
    },
    {
      key: "BasicAttackStage3DMG",
      label: "Stage 3 DMG",
      talents: {
        "1": "17.00%*2 + 51.00%",
        "2": "18.40%*2 + 55.19%",
        "3": "19.79%*2 + 59.37%",
        "4": "21.74%*2 + 65.22%",
        "5": "23.14%*2 + 69.41%",
        "6": "24.74%*2 + 74.22%",
        "7": "26.97%*2 + 80.91%",
        "8": "29.20%*2 + 87.60%",
        "9": "31.43%*2 + 94.29%",
        "10": "33.80%*2 + 101.40%",
      },
      type: "Basic",
    },
    {
      key: "BasicAttackStage4DMG",
      label: "Stage 4 DMG",
      talents: {
        "1": "52.41%*2",
        "2": "56.70%*2",
        "3": "61.00%*2",
        "4": "67.02%*2",
        "5": "71.31%*2",
        "6": "76.26%*2",
        "7": "83.13%*2",
        "8": "90.01%*2",
        "9": "96.88%*2",
        "10": "104.19%*2",
      },
      type: "Basic",
    },
    {
      key: "HeavyAttackDMG",
      label: "Heavy Attack DMG",
      talents: {
        "1": "85.00%",
        "2": "91.97%",
        "3": "98.94%",
        "4": "108.70%",
        "5": "115.67%",
        "6": "123.69%",
        "7": "134.84%",
        "8": "145.99%",
        "9": "157.14%",
        "10": "168.99%",
      },
      type: "Heavy",
    },
    {
      key: "AerialAttackDMG",
      label: "Aerial Attack DMG",
      talents: {
        "1": "52.70%",
        "2": "57.03%",
        "3": "61.35%",
        "4": "67.40%",
        "5": "71.72%",
        "6": "76.69%",
        "7": "83.60%",
        "8": "90.52%",
        "9": "97.43%",
        "10": "104.78%",
      },
      type: "Basic",
    },
    {
      key: "DodgeCounterattackDMG",
      label: "Dodge Counterattack DMG",
      talents: {
        "1": "34.66%*3",
        "2": "37.50%*3",
        "3": "40.34%*3",
        "4": "44.32%*3",
        "5": "47.16%*3",
        "6": "50.43%*3",
        "7": "54.97%*3",
        "8": "59.52%*3",
        "9": "64.07%*3",
        "10": "68.88%*3",
      },
      type: "Basic",
    },
  ],
};
