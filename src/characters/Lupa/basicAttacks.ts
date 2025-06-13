export const basicAttacks = {
  name: "Normal Attack: Flaming Star",
  description: `<div class="skilldescription"><span class="Title">Basic Attack</span><br>Perform up to 4 consecutive attacks, dealing <span class="Fire">Fusion DMG</span>.<br>- After Basic Attack Stage 3, press Normal Attack in the right time to cast <span class="Highlight">Mid-air Attack Stage 1</span>.<br>- After <span class="Highlight">Dodge Counter</span>, Basic Attack <span class="Highlight">Starfall</span>, Resonance Skill <span class="Highlight">Shewolf's Hunt</span>, or Resonance Skill <span class="Highlight">Feral Fang</span>, press Normal Attack in the right time to cast <span class="Highlight">Basic Attack Stage 2</span>.<br><span class="Title">Heavy Attack</span><br>Consume STA to attack the target, dealing <span class="Fire">Fusion DMG</span>.<br><span class="Title">Heavy Attack - Wolf's Gnawing</span><br>When Wolflame reaches 50 points, <span class="Highlight">Heavy Attack</span> will be replaced by <span class="Highlight">Wolf's Gnawing</span>, consuming STA to attack the target and dealing <span class="Fire">Fusion DMG</span>.<br>- This attack does not restore Wolflame. Consume 50 points of Wolflame to perform this attack and gain <saptag=2>1 point of Wolfaith.<br><span class="Title">Heavy Attack - Wolf's Claw</span><br>When Wolflame reaches 50 points and Wolfaith reaches 1 points, <span class="Highlight">Heavy Attack</span> will be replaced by <span class="Highlight">Wolf's Claw</span>, consuming STA to attack the target and dealing <span class="Fire">Fusion DMG</span>.<br>- If Wolflame reaches 50 points and Wolfaith reaches 1 points after performing <span class="Highlight">Mid-air Attack - Firestrike</span> or <span class="Highlight">Heavy Attack - Wolf's Gnawing</span>, press <span class="Highlight">Normal Attack</span> in time to perform <span class="Highlight">Heavy Attack - Wolf's Claw</span>.<br>- This attack does not restore Wolflame. Consume 50 points of Wolflame to perform this attack and gain <saptag=8>1 point of Wolfaith.<br><span class="Title">Mid-air Attack</span> <br>Consume Stamina to perform up to 3 attacks in mid-air, dealing <span class="Fire">Fusion DMG</span>. The <span class="Highlight">Mid-air Attack</span> cycle will not be reset.<br><span class="Title">Mid-air Attack - Firestrike</span><br>When Wolflame reaches 50 points, <span class="Highlight">Mid-air Attack Stage 3</span> will be replaced by <span class="Highlight">Mid-air Attack - Firestrike</span>, consuming STA to attack the target and dealing <span class="Fire">Fusion DMG</span> (considered Heavy Attack DMG).<br>- This attack does not restore Wolflame. Consume 50 points of Wolflame to perform this attack and gain <saptag=11>1 point of Wolfaith.<br><span class="Title">Plunging Attack</span><br>Hold Normal Attack while airborne to perform a Plunging Attack at the cost of STA, dealing <span class="Fire">Fusion DMG</span>. After performing this attack, press Normal Attack in time to perform Basic Attack <span class="Highlight">Starfall</span>.<br>- If a a successful <span class="Highlight">Dodge</span> is performed while casting <span class="Highlight">Basic Attack Stage 3</span> or <span class="Highlight">Mid-air Attack - Firestrike</span>, press <span class="Highlight">Normal Attack</span> to perform <span class="Highlight">Plunging Attack</span> at the cost of STA.<br><span class="Title">Basic Attack - Starfall</span><br>Attack the target, dealing <span class="Fire">Fusion DMG</span>.<br><span class="Title">Dodge Counter</span><br>Press Normal Attack after a successful Dodge to attack the target, dealing <span class="Fire">Fusion DMG</span>.</saptag=11></saptag=8></saptag=2><div></div></div>`,
  attacks: [
    {
      key: "Stage1DMG",
      label: "Stage 1 DMG",
      type: "Basic",
      talents: {
        "1": "11.33% + 11.33% + 22.66%",
        "2": "12.26% + 12.26% + 24.52%",
        "3": "13.19% + 13.19% + 26.37%",
        "4": "14.49% + 14.49% + 28.97%",
        "5": "15.42% + 15.42% + 30.83%",
        "6": "16.49% + 16.49% + 32.97%",
        "7": "17.97% + 17.97% + 35.94%",
        "8": "19.46% + 19.46% + 38.91%",
        "9": "20.94% + 20.94% + 41.88%",
        "10": "22.52% + 22.52% + 45.04%"
      }
    },
    {
      key: "Stage2DMG",
      label: "Stage 2 DMG",
      type: "Basic",
      talents: {
        "1": "45.31%",
        "2": "49.03%",
        "3": "52.74%",
        "4": "57.94%",
        "5": "61.66%",
        "6": "65.93%",
        "7": "71.87%",
        "8": "77.82%",
        "9": "83.76%",
        "10": "90.08%"
      }
    },
    {
      key: "Stage3DMG",
      label: "Stage 3 DMG",
      type: "Basic",
      talents: {
        "1": "39.66% + 6.61%*6",
        "2": "42.91% + 7.16%*6",
        "3": "46.16% + 7.70%*6",
        "4": "50.71% + 8.46%*6",
        "5": "53.96% + 9.00%*6",
        "6": "57.70% + 9.62%*6",
        "7": "62.91% + 10.49%*6",
        "8": "68.11% + 11.36%*6",
        "9": "73.31% + 12.22%*6",
        "10": "78.84% + 13.14%*6"
      }
    },
    {
      key: "Stage4DMG",
      label: "Stage 4 DMG",
      type: "Basic",
      talents: {
        "1": "37.16% + 37.16% + 24.77%*2",
        "2": "40.21% + 40.21% + 26.81%*2",
        "3": "43.25% + 43.25% + 28.84%*2",
        "4": "47.52% + 47.52% + 31.68%*2",
        "5": "50.56% + 50.56% + 33.71%*2",
        "6": "54.07% + 54.07% + 36.05%*2",
        "7": "58.94% + 58.94% + 39.30%*2",
        "8": "63.82% + 63.82% + 42.55%*2",
        "9": "68.69% + 68.69% + 45.80%*2",
        "10": "73.87% + 73.87% + 49.25%*2"
      }
    },
    {
      key: "HeavyAttack",
      label: "Heavy Attack",
      type: "Heavy",
      talents: {
        "1": "28.35% + 28.35%",
        "2": "30.68% + 30.68%",
        "3": "33.00% + 33.00%",
        "4": "36.26% + 36.26%",
        "5": "38.58% + 38.58%",
        "6": "41.25% + 41.25%",
        "7": "44.97% + 44.97%",
        "8": "48.69% + 48.69%",
        "9": "52.41% + 52.41%",
        "10": "56.36% + 56.36%"
      }
    },
    {
      key: "HeavyAttackWolfsGnawingDMG",
      label: "Heavy Attack - Wolf's Gnawing DMG",
      type: "Heavy",
      talents: {
        "1": "28.22% + 28.22%",
        "2": "30.54% + 30.54%",
        "3": "32.85% + 32.85%",
        "4": "36.09% + 36.09%",
        "5": "38.41% + 38.41%",
        "6": "41.07% + 41.07%",
        "7": "44.77% + 44.77%",
        "8": "48.47% + 48.47%",
        "9": "52.18% + 52.18%",
        "10": "56.11% + 56.11%"
      }
    },
    {
      key: "HeavyAttackWolfsClawDMG",
      label: "Heavy Attack - Wolf's Claw DMG",
      type: "Heavy",
      talents: {
        "1": "36.29% + 9.08%*4 + 48.39%",
        "2": "39.27% + 9.82%*4 + 52.35%",
        "3": "42.24% + 10.56%*4 + 56.32%",
        "4": "46.41% + 11.61%*4 + 61.88%",
        "5": "49.38% + 12.35%*4 + 65.84%",
        "6": "52.81% + 13.21%*4 + 70.41%",
        "7": "57.57% + 14.40%*4 + 76.75%",
        "8": "62.33% + 15.59%*4 + 83.10%",
        "9": "67.09% + 16.78%*4 + 89.45%",
        "10": "72.15% + 18.04%*4 + 96.19%"
      }
    },
    {
      key: "MidairAttackStage1DMG",
      label: "Mid-air Attack Stage 1 DMG",
      type: "Basic",
      talents: {
        "1": "38.59%",
        "2": "41.76%",
        "3": "44.92%",
        "4": "49.35%",
        "5": "52.52%",
        "6": "56.16%",
        "7": "61.22%",
        "8": "66.28%",
        "9": "71.35%",
        "10": "76.73%"
      }
    },
    {
      key: "MidairAttackStage2DMG",
      label: "Mid-air Attack Stage 2 DMG",
      type: "Basic",
      talents: {
        "1": "38.85% + 9.72%*4",
        "2": "42.04% + 10.51%*4",
        "3": "45.22% + 11.31%*4",
        "4": "49.68% + 12.42%*4",
        "5": "52.87% + 13.22%*4",
        "6": "56.53% + 14.14%*4",
        "7": "61.62% + 15.41%*4",
        "8": "66.72% + 16.68%*4",
        "9": "71.82% + 17.96%*4",
        "10": "77.23% + 19.31%*4"
      }
    },
    {
      key: "MidairAttackStage3DMG",
      label: "Mid-air Attack Stage 3 DMG",
      type: "Basic",
      talents: {
        "1": "14.33% + 14.33%",
        "2": "15.50% + 15.50%",
        "3": "16.68% + 16.68%",
        "4": "18.32% + 18.32%",
        "5": "19.50% + 19.50%",
        "6": "20.85% + 20.85%",
        "7": "22.72% + 22.72%",
        "8": "24.60% + 24.60%",
        "9": "26.48% + 26.48%",
        "10": "28.48% + 28.48%"
      }
    },
    {
      key: "MidairAttackFirestrikeDMG",
      label: "Mid-air Attack - Firestrike DMG",
      type: "Heavy",
      talents: {
        "1": "14.33% + 14.33%",
        "2": "15.50% + 15.50%",
        "3": "16.68% + 16.68%",
        "4": "18.32% + 18.32%",
        "5": "19.50% + 19.50%",
        "6": "20.85% + 20.85%",
        "7": "22.72% + 22.72%",
        "8": "24.60% + 24.60%",
        "9": "26.48% + 26.48%",
        "10": "28.48% + 28.48%"
      }
    },
    {
      key: "PlungingAttackDMG",
      label: "Plunging Attack DMG",
      type: "Basic",
      talents: {
        "1": "13.18% + 26.35% + 13.18%",
        "2": "14.26% + 28.52% + 14.26%",
        "3": "15.34% + 30.68% + 15.34%",
        "4": "16.85% + 33.70% + 16.85%",
        "5": "17.93% + 35.86% + 17.93%",
        "6": "19.18% + 38.35% + 19.18%",
        "7": "20.90% + 41.80% + 20.90%",
        "8": "22.63% + 45.26% + 22.63%",
        "9": "24.36% + 48.72% + 24.36%",
        "10": "26.20% + 52.39% + 26.20%"
      }
    },
    {
      key: "BasicAttackStarfallDMG",
      label: "Basic Attack - Starfall DMG",
      type: "Basic",
      talents: {
        "1": "6.37%*4 + 59.39%",
        "2": "6.89%*4 + 64.26%",
        "3": "7.41%*4 + 69.12%",
        "4": "8.14%*4 + 75.94%",
        "5": "8.66%*4 + 80.81%",
        "6": "9.26%*4 + 86.41%",
        "7": "10.10%*4 + 94.20%",
        "8": "10.93%*4 + 101.99%",
        "9": "11.77%*4 + 109.78%",
        "10": "12.65%*4 + 118.06%"
      }
    },
    {
      key: "DodgeCounterDMG",
      label: "Dodge Counter DMG",
      type: "Basic",
      talents: {
        "1": "17.20%*4 + 68.77%",
        "2": "18.61%*4 + 74.41%",
        "3": "20.02%*4 + 80.05%",
        "4": "21.99%*4 + 87.94%",
        "5": "23.40%*4 + 93.58%",
        "6": "25.02%*4 + 100.06%",
        "7": "27.28%*4 + 109.09%",
        "8": "29.53%*4 + 118.11%",
        "9": "31.79%*4 + 127.13%",
        "10": "34.18%*4 + 136.72%"
      }
    }
  ],  
};
