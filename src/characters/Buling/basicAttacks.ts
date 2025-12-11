export const basicAttacks = {
  name: "Normal Attack: Hexagram Calls, Lightning Falls",
  description: `<div><size=40><span class="Title">Basic Attack</span><br>Perform up to 4 consecutive attacks, dealing <span class="Thunder">Electro DMG</span>.<br><size=10><br><size=40><span class="Title">Heavy Attack - Mountain Over Thunder</span><br><span class="Highlight">Hold Normal Attack</span> to consume the highlighted Trigram - Mountain and Trigram - Thunder from left to right and cast <span class="Highlight">Heavy Attack - Mountain Over Thunder</span>, dealing <span class="Thunder">Electro DMG</span>.<br><size=10><br><size=40><span class="Title">Heavy Attack - Thunder Over Mountain</span><br><span class="Highlight">Hold Normal Attack</span> to consume the highlighted Trigram - Thunder and Trigram - Mountain from left to right and cast <span class="Highlight">Heavy Attack - Thunder Over Mountain</span>, dealing a small amount of <span class="Thunder">Electro DMG</span> and additionally reducing the target's Vibration Strength.<br><size=10><br><size=40><span class="Title">Heavy Attack - Twin Mountains</span><br><span class="Highlight">Hold Normal Attack</span> to consume the highlighted 2 Trigrams - Mountain from left to right and cast <span class="Highlight">Heavy Attack - Twin Mountains</span>, healing all nearby Resonators in the team.<br><size=10><br><size=40><span class="Title">Heavy Attack - Twin Thunders</span><br><span class="Highlight">Hold Normal Attack</span> to consume the highlighted 2 Trigrams - Thunder from left to right and cast <span class="Highlight">Heavy Attack - Twin Thunders</span>, healing all nearby Resonators in the team once per second for 8s.<br><size=10><br><size=40><span class="Title">Heavy Attack - Ghost Gate Omen</span><br>When <span class="Highlight">holding Normal Attack</span> with fewer than 2 Trigrams, Buling fails the divination, becoming temporarily immobilized and losing all Trigrams and 20% of her current HP. This effect will not consume HP if Buling's current HP is below 1%.<br><size=10><br><size=40><span class="Title">Mid-air Attack</span><br>Consume STA to perform Mid-air Attack, dealing <span class="Thunder">Electro DMG</span>.<br><size=10><br><size=40><span class="Title">Dodge Counter</span><br><span class="Highlight">Press Normal Attack</span> right after a successful Dodge to perform <span class="Highlight">Basic Attack Stage 3</span>, dealing <span class="Thunder">Electro DMG</span>.<br>- After performing <span class="Highlight">Dodge Counter</span>, <span class="Highlight">press Normal Attack</span> to perform <span class="Highlight">Basic Attack Stage 4</span>.<br><size=10><br><size=40><span class="Title">Trigram</span><br>Buling can hold up to 4 Trigrams. When Trigrams reach the max number, gaining new Trigrams moves all Trigrams 1 slot to the left, and the original leftmost Trigram will be removed.<br>- Trigram - Mountain is obtained when <span class="Highlight">Basic Attack Stage 2</span> deals damage.<br>- Trigram - Thunder is obtained when <span class="Highlight">Basic Attack Stage 4</span> or <span class="Highlight">Mid-air Attack</span> deals damage.<br>- Trigram - Thunder is obtained when casting <span class="Highlight">Resonance Skill - In Shadow Thunder Stirs</span>.</size=40></size=10></size=40></size=10></size=40></size=10></size=40></size=10></size=40></size=10></size=40></size=10></size=40></size=10></size=40></size=10></size=40></div>`,
  attacks: [
  {
    key: "Stage1DMG",
    label: "Stage 1 DMG",
    type: "Basic",
    talents: {
      "1": "10.43%*2",
      "2": "11.28%*2",
      "3": "12.14%*2",
      "4": "13.34%*2",
      "5": "14.19%*2",
      "6": "15.17%*2",
      "7": "16.54%*2",
      "8": "17.91%*2",
      "9": "19.28%*2",
      "10": "20.73%*2"
    }
  },
  {
    key: "Stage2DMG",
    label: "Stage 2 DMG",
    type: "Basic",
    talents: {
      "1": "16.83%*2",
      "2": "18.21%*2",
      "3": "19.59%*2",
      "4": "21.52%*2",
      "5": "22.90%*2",
      "6": "24.49%*2",
      "7": "26.69%*2",
      "8": "28.90%*2",
      "9": "31.11%*2",
      "10": "33.45%*2"
    }
  },
  {
    key: "Stage3DMG",
    label: "Stage 3 DMG",
    type: "Basic",
    talents: {
      "1": "11.83%*2",
      "2": "12.80%*2",
      "3": "13.77%*2",
      "4": "15.13%*2",
      "5": "16.10%*2",
      "6": "17.21%*2",
      "7": "18.76%*2",
      "8": "20.31%*2",
      "9": "21.87%*2",
      "10": "23.51%*2"
    }
  },
  {
    key: "Stage4DMG",
    label: "Stage 4 DMG",
    type: "Basic",
    talents: {
      "1": "47.10%",
      "2": "50.97%",
      "3": "54.83%",
      "4": "60.24%",
      "5": "64.10%",
      "6": "68.54%",
      "7": "74.72%",
      "8": "80.90%",
      "9": "87.08%",
      "10": "93.64%"
    }
  },
  {
    key: "MidairAttackDMG",
    label: "Mid-air Attack DMG",
    type: "Basic",
    talents: {
      "1": "37.20%",
      "2": "40.26%",
      "3": "43.31%",
      "4": "47.58%",
      "5": "50.63%",
      "6": "54.13%",
      "7": "59.02%",
      "8": "63.90%",
      "9": "68.78%",
      "10": "73.96%"
    }
  },
  {
    key: "DodgeCounterDMG",
    label: "Dodge Counter DMG",
    type: "Basic",
    talents: {
      "1": "11.83%*2",
      "2": "12.80%*2",
      "3": "13.77%*2",
      "4": "15.13%*2",
      "5": "16.10%*2",
      "6": "17.21%*2",
      "7": "18.76%*2",
      "8": "20.31%*2",
      "9": "21.87%*2",
      "10": "23.51%*2"
    }
  },
  {
    key: "HeavyAttackMountainOverThunderDMG",
    label: "Heavy Attack - Mountain Over Thunder DMG",
    type: "Heavy",
    talents: {
      "1": "90.00%",
      "2": "97.38%",
      "3": "104.76%",
      "4": "115.10%",
      "5": "122.48%",
      "6": "130.96%",
      "7": "142.77%",
      "8": "154.58%",
      "9": "166.39%",
      "10": "178.93%"
    }
  },
  {
    key: "HeavyAttackThunderOverMountainDMG",
    label: "Heavy Attack - Thunder Over Mountain DMG",
    type: "Heavy",
    talents: {
      "1": "45.00%",
      "2": "48.69%",
      "3": "52.38%",
      "4": "57.55%",
      "5": "61.24%",
      "6": "65.48%",
      "7": "71.39%",
      "8": "77.29%",
      "9": "83.20%",
      "10": "89.47%"
    }
  },
  {
    key: "HeavyAttackTwinMountainsHealing",
    label: "Heavy Attack - Twin Mountains Healing",
    type: "Healing",
    talents: {
      "1": "360+68.00%",
      "2": "390+73.58%",
      "3": "420+79.16%",
      "4": "461+86.96%",
      "5": "490+92.54%",
      "6": "524+98.95%",
      "7": "572+107.87%",
      "8": "619+116.79%",
      "9": "666+125.72%",
      "10": "716+135.20%"
    }
  },
  {
    key: "HeavyAttackTwinThundersHealing",
    label: "Heavy Attack - Twin Thunders Healing",
    type: "Healing",
    talents: {
      "1": "85+9.20%",
      "2": "92+9.96%",
      "3": "99+10.71%",
      "4": "109+11.77%",
      "5": "116+12.52%",
      "6": "124+13.39%",
      "7": "135+14.60%",
      "8": "146+15.81%",
      "9": "158+17.01%",
      "10": "169+18.30%"
    }
  }
],
};
