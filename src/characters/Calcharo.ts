interface CharacterData {
  [level: string]: LevelData;
}

interface LevelData {
  hp: number;
  attack: number;
  defense: number;
}

const characterData: CharacterData = {
  "1": {
    hp: 840,
    attack: 35,
    defense: 97,
  },
  "20": {
    hp: 2184,
    attack: 91,
    defense: 248,
  },
  "20+": {
    hp: 2744,
    attack: 117,
    defense: 311,
  },
  "40": {
    hp: 4160,
    attack: 176,
    defense: 471,
  },
  "40+": {
    hp: 4720,
    attack: 202,
    defense: 248,
  },
  "50": {
    hp: 5428,
    attack: 232,
    defense: 614,
  },
  "50+": {
    hp: 5988,
    attack: 258,
    defense: 677,
  },
  "60": {
    hp: 6696,
    attack: 287,
    defense: 757,
  },
  "60+": {
    hp: 7256,
    attack: 314,
    defense: 820,
  },
  "70": {
    hp: 7964,
    attack: 343,
    defense: 899,
  },
  "70+": {
    hp: 8524,
    attack: 361,
    defense: 962,
  },
  "80": {
    hp: 9232,
    attack: 390,
    defense: 1042,
  },
  "80+": {
    hp: 9792,
    attack: 408,
    defense: 1105,
  },
  "90": {
    hp: 10500,
    attack: 437,
    defense: 1185,
  },
};

interface NormalAttackLevel {
  part1_1Damage: string;
  part1_2Damage: string;
  part2Damage: string;
  part3_1Damage: string;
  part3_2Damage: string;
  part3_3Damage: string;
  part3_4Damage: string;
  part4_1Damage: string;
  part4_2Damage: string;
  part4_3Damage: string;
  heavyAttack_1Damage: string;
  heavyAttack_2Damage: string;
  heavyAttack_3Damage: string;
  heavyAttack_4Damage: string;
  heavyAttack_5Damage: string;
  midAirAttackDamage: string;
  dodgeCounter_1Damage: string;
  dodgeCounter_2Damage: string;
  dodgeCounter_3Damage: string;
  dodgeCounter_4Damage: string;
  heavyAttackStaminaConsumption: number;
  midAirAttackStaminaConsumption: number;
}

interface NormalAttacks {
  [level: string]: NormalAttackLevel;
}

const normalAttacksData: NormalAttacks = {
  "1": {
    part1_1Damage: "23.00%",
    part1_2Damage: "23.00%",
    part2Damage: "50.00%",
    part3_1Damage: "42.84%",
    part3_2Damage: "21.42%",
    part3_3Damage: "21.42%",
    part3_4Damage: "21.42%",
    part4_1Damage: "39.99%",
    part4_2Damage: "39.99%",
    part4_3Damage: "53.32%",
    heavyAttack_1Damage: "20.80%",
    heavyAttack_2Damage: "20.80%",
    heavyAttack_3Damage: "20.80%",
    heavyAttack_4Damage: "20.80%",
    heavyAttack_5Damage: "20.80%",
    midAirAttackDamage: "62.00%",
    dodgeCounter_1Damage: "33.44%",
    dodgeCounter_2Damage: "33.44%",
    dodgeCounter_3Damage: "33.44%",
    dodgeCounter_4Damage: "42.99%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
  "2": {
    part1_1Damage: "24.89%",
    part1_2Damage: "24.89%",
    part2Damage: "54.10%",
    part3_1Damage: "46.36%",
    part3_2Damage: "23.18%",
    part3_3Damage: "23.18%",
    part3_4Damage: "23.18%",
    part4_1Damage: "43.27%",
    part4_2Damage: "43.27%",
    part4_3Damage: "57.70%",
    heavyAttack_1Damage: "22.51%",
    heavyAttack_2Damage: "22.51%",
    heavyAttack_3Damage: "22.51%",
    heavyAttack_4Damage: "22.51%",
    heavyAttack_5Damage: "22.51%",
    midAirAttackDamage: "67.09%",
    dodgeCounter_1Damage: "36.18%",
    dodgeCounter_2Damage: "36.18%",
    dodgeCounter_3Damage: "36.18%",
    dodgeCounter_4Damage: "46.52%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
  "3": {
    part1_1Damage: "26.78%",
    part1_2Damage: "26.78%",
    part2Damage: "58.20%",
    part3_1Damage: "49.87%",
    part3_2Damage: "24.94%",
    part3_3Damage: "24.94%",
    part3_4Damage: "24.94%",
    part4_1Damage: "46.55%",
    part4_2Damage: "46.55%",
    part4_3Damage: "62.07%",
    heavyAttack_1Damage: "24.22%",
    heavyAttack_2Damage: "24.22%",
    heavyAttack_3Damage: "24.22%",
    heavyAttack_4Damage: "24.22%",
    heavyAttack_5Damage: "24.22%",
    midAirAttackDamage: "72.17%",
    dodgeCounter_1Damage: "38.93%",
    dodgeCounter_2Damage: "38.93%",
    dodgeCounter_3Damage: "38.93%",
    dodgeCounter_4Damage: "50.05%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
  "4": {
    part1_1Damage: "29.42%",
    part1_2Damage: "29.42%",
    part2Damage: "63.94%",
    part3_1Damage: "54.79%",
    part3_2Damage: "27.40%",
    part3_3Damage: "27.40%",
    part3_4Damage: "27.40%",
    part4_1Damage: "51.14%",
    part4_2Damage: "51.14%",
    part4_3Damage: "68.19%",
    heavyAttack_1Damage: "26.60%",
    heavyAttack_2Damage: "26.60%",
    heavyAttack_3Damage: "26.60%",
    heavyAttack_4Damage: "26.60%",
    heavyAttack_5Damage: "26.60%",
    midAirAttackDamage: "79.29%",
    dodgeCounter_1Damage: "42.76%",
    dodgeCounter_2Damage: "42.76%",
    dodgeCounter_3Damage: "42.76%",
    dodgeCounter_4Damage: "54.98%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
  "5": {
    part1_1Damage: "31.30%",
    part1_2Damage: "31.30%",
    part2Damage: "68.04%",
    part3_1Damage: "58.30%",
    part3_2Damage: "29.15%",
    part3_3Damage: "29.15%",
    part3_4Damage: "29.15%",
    part4_1Damage: "54.42%",
    part4_2Damage: "54.42%",
    part4_3Damage: "72.56%",
    heavyAttack_1Damage: "28.31%",
    heavyAttack_2Damage: "28.31%",
    heavyAttack_3Damage: "28.31%",
    heavyAttack_4Damage: "28.31%",
    heavyAttack_5Damage: "28.31%",
    midAirAttackDamage: "84.37%",
    dodgeCounter_1Damage: "45.51%",
    dodgeCounter_2Damage: "45.51%",
    dodgeCounter_3Damage: "45.51%",
    dodgeCounter_4Damage: "58.51%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
  "6": {
    part1_1Damage: "33.47%",
    part1_2Damage: "33.47%",
    part2Damage: "72.76%",
    part3_1Damage: "62.34%",
    part3_2Damage: "31.17%",
    part3_3Damage: "31.17%",
    part3_4Damage: "31.17%",
    part4_1Damage: "58.36%",
    part4_2Damage: "58.36%",
    part4_3Damage: "77.87%",
    heavyAttack_1Damage: "30.20%",
    heavyAttack_2Damage: "30.20%",
    heavyAttack_3Damage: "30.20%",
    heavyAttack_4Damage: "30.20%",
    heavyAttack_5Damage: "30.20%",
    midAirAttackDamage: "90.11%",
    dodgeCounter_1Damage: "48.61%",
    dodgeCounter_2Damage: "48.61%",
    dodgeCounter_3Damage: "48.61%",
    dodgeCounter_4Damage: "62.53%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
  "7": {
    part1_1Damage: "35.98%",
    part1_2Damage: "35.98%",
    part2Damage: "78.27%",
    part3_1Damage: "67.03%",
    part3_2Damage: "33.52%",
    part3_3Damage: "33.52%",
    part3_4Damage: "33.52%",
    part4_1Damage: "62.96%",
    part4_2Damage: "62.96%",
    part4_3Damage: "83.94%",
    heavyAttack_1Damage: "32.54%",
    heavyAttack_2Damage: "32.54%",
    heavyAttack_3Damage: "32.54%",
    heavyAttack_4Damage: "32.54%",
    heavyAttack_5Damage: "32.54%",
    midAirAttackDamage: "97.08%",
    dodgeCounter_1Damage: "52.32%",
    dodgeCounter_2Damage: "52.32%",
    dodgeCounter_3Damage: "52.32%",
    dodgeCounter_4Damage: "67.30%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
  "8": {
    part1_1Damage: "38.49%",
    part1_2Damage: "38.49%",
    part2Damage: "83.78%",
    part3_1Damage: "71.72%",
    part3_2Damage: "35.86%",
    part3_3Damage: "35.86%",
    part3_4Damage: "35.86%",
    part4_1Damage: "67.56%",
    part4_2Damage: "67.56%",
    part4_3Damage: "90.01%",
    heavyAttack_1Damage: "34.87%",
    heavyAttack_2Damage: "34.87%",
    heavyAttack_3Damage: "34.87%",
    heavyAttack_4Damage: "34.87%",
    heavyAttack_5Damage: "34.87%",
    midAirAttackDamage: "104.04%",
    dodgeCounter_1Damage: "56.03%",
    dodgeCounter_2Damage: "56.03%",
    dodgeCounter_3Damage: "56.03%",
    dodgeCounter_4Damage: "72.07%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
  "9": {
    part1_1Damage: "41.00%",
    part1_2Damage: "41.00%",
    part2Damage: "89.29%",
    part3_1Damage: "76.41%",
    part3_2Damage: "38.20%",
    part3_3Damage: "38.20%",
    part3_4Damage: "38.20%",
    part4_1Damage: "72.16%",
    part4_2Damage: "72.16%",
    part4_3Damage: "96.08%",
    heavyAttack_1Damage: "37.21%",
    heavyAttack_2Damage: "37.21%",
    heavyAttack_3Damage: "37.21%",
    heavyAttack_4Damage: "37.21%",
    heavyAttack_5Damage: "37.21%",
    midAirAttackDamage: "111.01%",
    dodgeCounter_1Damage: "59.74%",
    dodgeCounter_2Damage: "59.74%",
    dodgeCounter_3Damage: "59.74%",
    dodgeCounter_4Damage: "76.84%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
  "10": {
    part1_1Damage: "43.94%",
    part1_2Damage: "43.94%",
    part2Damage: "95.80%",
    part3_1Damage: "82.54%",
    part3_2Damage: "41.27%",
    part3_3Damage: "41.27%",
    part3_4Damage: "41.27%",
    part4_1Damage: "77.19%",
    part4_2Damage: "77.19%",
    part4_3Damage: "102.71%",
    heavyAttack_1Damage: "39.93%",
    heavyAttack_2Damage: "39.93%",
    heavyAttack_3Damage: "39.93%",
    heavyAttack_4Damage: "39.93%",
    heavyAttack_5Damage: "39.93%",
    midAirAttackDamage: "119.13%",
    dodgeCounter_1Damage: "63.72%",
    dodgeCounter_2Damage: "63.72%",
    dodgeCounter_3Damage: "63.72%",
    dodgeCounter_4Damage: "81.93%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
};

interface ResonanceSkillLevel {
  exterminationOrderPart1_1Damage: string;
  exterminationOrderPart1_2Damage: string;
  exterminationOrderPart1_3Damage: string;
  exterminationOrderPart2_1Damage: string;
  exterminationOrderPart2_2Damage: string;
  exterminationOrderPart2_3Damage: string;
  exterminationOrderPart3_1Damage: string;
  exterminationOrderPart3_2Damage: string;
  cooldown: number;
  exterminationOrderConEnergyRegen: number;
}

interface ResonanceSkill {
  [level: string]: RefactoredResonanceSkillLevel;
}

const resonanceSkillData: ResonanceSkill = {
  "1": {
    exterminationOrderPart1_1Damage: "25.94%",
    exterminationOrderPart1_2Damage: "25.94%",
    exterminationOrderPart1_3Damage: "34.59%",
    exterminationOrderPart2_1Damage: "38.91%",
    exterminationOrderPart2_2Damage: "38.91%",
    exterminationOrderPart2_3Damage: "51.88%",
    exterminationOrderPart3_1Damage: "108.08%",
    exterminationOrderPart3_2Damage: "108.08%",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
  "2": {
    exterminationOrderPart1_1Damage: "28.07%",
    exterminationOrderPart1_2Damage: "28.07%",
    exterminationOrderPart1_3Damage: "37.42%",
    exterminationOrderPart2_1Damage: "42.10%",
    exterminationOrderPart2_2Damage: "42.10%",
    exterminationOrderPart2_3Damage: "56.13%",
    exterminationOrderPart3_1Damage: "116.94%",
    exterminationOrderPart3_2Damage: "116.94%",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
  "3": {
    exterminationOrderPart1_1Damage: "30.20%",
    exterminationOrderPart1_2Damage: "30.20%",
    exterminationOrderPart1_3Damage: "40.26%",
    exterminationOrderPart2_1Damage: "45.29%",
    exterminationOrderPart2_2Damage: "45.29%",
    exterminationOrderPart2_3Damage: "60.39%",
    exterminationOrderPart3_1Damage: "125.80%",
    exterminationOrderPart3_2Damage: "125.80%",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
  "4": {
    exterminationOrderPart1_1Damage: "33.17%",
    exterminationOrderPart1_2Damage: "33.17%",
    exterminationOrderPart1_3Damage: "44.23%",
    exterminationOrderPart2_1Damage: "49.76%",
    exterminationOrderPart2_2Damage: "49.76%",
    exterminationOrderPart2_3Damage: "66.34%",
    exterminationOrderPart3_1Damage: "138.21%",
    exterminationOrderPart3_2Damage: "138.21%",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
  "5": {
    exterminationOrderPart1_1Damage: "35.30%",
    exterminationOrderPart1_2Damage: "35.30%",
    exterminationOrderPart1_3Damage: "47.07%",
    exterminationOrderPart2_1Damage: "52.95%",
    exterminationOrderPart2_2Damage: "52.95%",
    exterminationOrderPart2_3Damage: "70.60%",
    exterminationOrderPart3_1Damage: "147.07%",
    exterminationOrderPart3_2Damage: "147.07%",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
  "6": {
    exterminationOrderPart1_1Damage: "37.75%",
    exterminationOrderPart1_2Damage: "37.75%",
    exterminationOrderPart1_3Damage: "50.33%",
    exterminationOrderPart2_1Damage: "56.62%",
    exterminationOrderPart2_2Damage: "56.62%",
    exterminationOrderPart2_3Damage: "75.49%",
    exterminationOrderPart3_1Damage: "157.26%",
    exterminationOrderPart3_2Damage: "157.26%",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
  "7": {
    exterminationOrderPart1_1Damage: "41.15%",
    exterminationOrderPart1_2Damage: "41.15%",
    exterminationOrderPart1_3Damage: "54.87%",
    exterminationOrderPart2_1Damage: "61.72%",
    exterminationOrderPart2_2Damage: "61.72%",
    exterminationOrderPart2_3Damage: "82.30%",
    exterminationOrderPart3_1Damage: "171.44%",
    exterminationOrderPart3_2Damage: "171.44%",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
  "8": {
    exterminationOrderPart1_1Damage: "44.55%",
    exterminationOrderPart1_2Damage: "44.55%",
    exterminationOrderPart1_3Damage: "59.40%",
    exterminationOrderPart2_1Damage: "66.83%",
    exterminationOrderPart2_2Damage: "66.83%",
    exterminationOrderPart2_3Damage: "89.10%",
    exterminationOrderPart3_1Damage: "185.62%",
    exterminationOrderPart3_2Damage: "185.62%",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
  "9": {
    exterminationOrderPart1_1Damage: "47.96%",
    exterminationOrderPart1_2Damage: "47.96%",
    exterminationOrderPart1_3Damage: "63.94%",
    exterminationOrderPart2_1Damage: "71.93%",
    exterminationOrderPart2_2Damage: "71.93%",
    exterminationOrderPart2_3Damage: "95.91%",
    exterminationOrderPart3_1Damage: "199.80%",
    exterminationOrderPart3_2Damage: "199.80%",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
  "10": {
    exterminationOrderPart1_1Damage: "51.57%",
    exterminationOrderPart1_2Damage: "51.57%",
    exterminationOrderPart1_3Damage: "68.76%",
    exterminationOrderPart2_1Damage: "77.36%",
    exterminationOrderPart2_2Damage: "77.36%",
    exterminationOrderPart2_3Damage: "103.14%",
    exterminationOrderPart3_1Damage: "214.87%",
    exterminationOrderPart3_2Damage: "214.87%",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
};

interface ResonanceLiberationLevel {
  skillDamage: string;
  necessaryMeansDamage_1: string;
  necessaryMeansDamage_2: string;
  houndsRoarPart1: string;
  houndsRoarPart2_1: string;
  houndsRoarPart2_2: string;
  houndsRoarPart2_3: string;
  houndsRoarPart2_4: string;
  houndsRoarPart3: string;
  houndsRoarPart4_1: string;
  houndsRoarPart4_2: string;
  houndsRoarPart4_3: string;
  houndsRoarPart4_4: string;
  houndsRoarPart4_5: string;
  houndsRoarPart4_6: string;
  houndsRoarPart5_1: string;
  houndsRoarPart5_2: string;
  heavyAttackDamage_1: string;
  heavyAttackDamage_2: string;
  heavyAttackDamage_3: string;
  heavyAttackDamage_4: string;
  heavyAttackDamage_5: string;
  dodgeCounterDamage_1: string;
  dodgeCounterDamage_2: string;
  dodgeCounterDamage_3: string;
  dodgeCounterDamage_4: string;
  dodgeCounterDamage_5: string;
  dodgeCounterDamage_6: string;
  heavyAttackStaminaConsumption: number;
  deathbladeGearDuration: number;
  cooldown: number;
  resEnergyCost: number;
  conEnergyRegen: number;
}

interface ResonanceLiberation {
  [level: string]: ResonanceLiberationLevel;
}

const resonanceLiberationData: ResonanceLiberation = {
  "1": {
    skillDamage: "300.00%",
    necessaryMeansDamage_1: "100.00%",
    necessaryMeansDamage_2: "100.00%",
    houndsRoarPart1: "44.30%",
    houndsRoarPart2_1: "17.72%",
    houndsRoarPart2_2: "17.72%",
    houndsRoarPart2_3: "26.58%",
    houndsRoarPart2_4: "26.58%",
    houndsRoarPart3: "82.41%",
    houndsRoarPart4_1: "17.52%",
    houndsRoarPart4_2: "17.52%",
    houndsRoarPart4_3: "17.52%",
    houndsRoarPart4_4: "17.52%",
    houndsRoarPart4_5: "17.52%",
    houndsRoarPart4_6: "17.52%",
    houndsRoarPart5_1: "75.54%",
    houndsRoarPart5_2: "75.54%",
    heavyAttackDamage_1: "31.20%",
    heavyAttackDamage_2: "31.20%",
    heavyAttackDamage_3: "31.20%",
    heavyAttackDamage_4: "31.20%",
    heavyAttackDamage_5: "31.20%",
    dodgeCounterDamage_1: "28.67%",
    dodgeCounterDamage_2: "28.67%",
    dodgeCounterDamage_3: "28.67%",
    dodgeCounterDamage_4: "28.67%",
    dodgeCounterDamage_5: "28.67%",
    dodgeCounterDamage_6: "28.67%",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
  "2": {
    skillDamage: "324.60%",
    necessaryMeansDamage_1: "108.20%",
    necessaryMeansDamage_2: "108.20%",
    houndsRoarPart1: "47.93%",
    houndsRoarPart2_1: "19.18%",
    houndsRoarPart2_2: "19.18%",
    houndsRoarPart2_3: "28.76%",
    houndsRoarPart2_4: "28.76%",
    houndsRoarPart3: "89.17%",
    houndsRoarPart4_1: "18.95%",
    houndsRoarPart4_2: "18.95%",
    houndsRoarPart4_3: "18.95%",
    houndsRoarPart4_4: "18.95%",
    houndsRoarPart4_5: "18.95%",
    houndsRoarPart4_6: "18.95%",
    houndsRoarPart5_1: "81.74%",
    houndsRoarPart5_2: "81.74%",
    heavyAttackDamage_1: "33.76%",
    heavyAttackDamage_2: "33.76%",
    heavyAttackDamage_3: "33.76%",
    heavyAttackDamage_4: "33.76%",
    heavyAttackDamage_5: "33.76%",
    dodgeCounterDamage_1: "31.02%",
    dodgeCounterDamage_2: "31.02%",
    dodgeCounterDamage_3: "31.02%",
    dodgeCounterDamage_4: "31.02%",
    dodgeCounterDamage_5: "31.02%",
    dodgeCounterDamage_6: "31.02%",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
  "3": {
    skillDamage: "349.20%",
    necessaryMeansDamage_1: "116.40%",
    necessaryMeansDamage_2: "116.40%",
    houndsRoarPart1: "51.56%",
    houndsRoarPart2_1: "20.63%",
    houndsRoarPart2_2: "20.63%",
    houndsRoarPart2_3: "30.94%",
    houndsRoarPart2_4: "30.94%",
    houndsRoarPart3: "95.93%",
    houndsRoarPart4_1: "20.39%",
    houndsRoarPart4_2: "20.39%",
    houndsRoarPart4_3: "20.39%",
    houndsRoarPart4_4: "20.39%",
    houndsRoarPart4_5: "20.39%",
    houndsRoarPart4_6: "20.39%",
    houndsRoarPart5_1: "87.93%",
    houndsRoarPart5_2: "87.93%",
    heavyAttackDamage_1: "36.32%",
    heavyAttackDamage_2: "36.32%",
    heavyAttackDamage_3: "36.32%",
    heavyAttackDamage_4: "36.32%",
    heavyAttackDamage_5: "36.32%",
    dodgeCounterDamage_1: "33.37%",
    dodgeCounterDamage_2: "33.37%",
    dodgeCounterDamage_3: "33.37%",
    dodgeCounterDamage_4: "33.37%",
    dodgeCounterDamage_5: "33.37%",
    dodgeCounterDamage_6: "33.37%",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
  "4": {
    skillDamage: "383.64%",
    necessaryMeansDamage_1: "127.88%",
    necessaryMeansDamage_2: "127.88%",
    houndsRoarPart1: "56.65%",
    houndsRoarPart2_1: "22.66%",
    houndsRoarPart2_2: "22.66%",
    houndsRoarPart2_3: "33.99%",
    houndsRoarPart2_4: "33.99%",
    houndsRoarPart3: "105.39%",
    houndsRoarPart4_1: "22.40%",
    houndsRoarPart4_2: "22.40%",
    houndsRoarPart4_3: "22.40%",
    houndsRoarPart4_4: "22.40%",
    houndsRoarPart4_5: "22.40%",
    houndsRoarPart4_6: "22.40%",
    houndsRoarPart5_1: "96.61%",
    houndsRoarPart5_2: "96.61%",
    heavyAttackDamage_1: "39.90%",
    heavyAttackDamage_2: "39.90%",
    heavyAttackDamage_3: "39.90%",
    heavyAttackDamage_4: "39.90%",
    heavyAttackDamage_5: "39.90%",
    dodgeCounterDamage_1: "36.66%",
    dodgeCounterDamage_2: "36.66%",
    dodgeCounterDamage_3: "36.66%",
    dodgeCounterDamage_4: "36.66%",
    dodgeCounterDamage_5: "36.66%",
    dodgeCounterDamage_6: "36.66%",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
  "5": {
    skillDamage: "408.24%",
    necessaryMeansDamage_1: "136.08%",
    necessaryMeansDamage_2: "136.08%",
    houndsRoarPart1: "60.28%",
    houndsRoarPart2_1: "24.11%",
    houndsRoarPart2_2: "24.11%",
    houndsRoarPart2_3: "36.17%",
    houndsRoarPart2_4: "36.17%",
    houndsRoarPart3: "112.14%",
    houndsRoarPart4_1: "23.83%",
    houndsRoarPart4_2: "23.83%",
    houndsRoarPart4_3: "23.83%",
    houndsRoarPart4_4: "23.83%",
    houndsRoarPart4_5: "23.83%",
    houndsRoarPart4_6: "23.83%",
    houndsRoarPart5_1: "102.80%",
    houndsRoarPart5_2: "102.80%",
    heavyAttackDamage_1: "42.46%",
    heavyAttackDamage_2: "42.46%",
    heavyAttackDamage_3: "42.46%",
    heavyAttackDamage_4: "42.46%",
    heavyAttackDamage_5: "42.46%",
    dodgeCounterDamage_1: "39.01%",
    dodgeCounterDamage_2: "39.01%",
    dodgeCounterDamage_3: "39.01%",
    dodgeCounterDamage_4: "39.01%",
    dodgeCounterDamage_5: "39.01%",
    dodgeCounterDamage_6: "39.01%",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
  "6": {
    skillDamage: "436.53%",
    necessaryMeansDamage_1: "145.51%",
    necessaryMeansDamage_2: "145.51%",
    houndsRoarPart1: "64.46%",
    houndsRoarPart2_1: "25.79%",
    houndsRoarPart2_2: "25.79%",
    houndsRoarPart2_3: "38.68%",
    houndsRoarPart2_4: "38.68%",
    houndsRoarPart3: "119.92%",
    houndsRoarPart4_1: "25.49%",
    houndsRoarPart4_2: "25.49%",
    houndsRoarPart4_3: "25.49%",
    houndsRoarPart4_4: "25.49%",
    houndsRoarPart4_5: "25.49%",
    houndsRoarPart4_6: "25.49%",
    houndsRoarPart5_1: "109.92%",
    houndsRoarPart5_2: "109.92%",
    heavyAttackDamage_1: "45.40%",
    heavyAttackDamage_2: "45.40%",
    heavyAttackDamage_3: "45.40%",
    heavyAttackDamage_4: "45.40%",
    heavyAttackDamage_5: "45.40%",
    dodgeCounterDamage_1: "41.72%",
    dodgeCounterDamage_2: "41.72%",
    dodgeCounterDamage_3: "41.72%",
    dodgeCounterDamage_4: "41.72%",
    dodgeCounterDamage_5: "41.72%",
    dodgeCounterDamage_6: "41.72%",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
  "7": {
    skillDamage: "475.89%",
    necessaryMeansDamage_1: "158.63%",
    necessaryMeansDamage_2: "158.63%",
    houndsRoarPart1: "70.27%",
    houndsRoarPart2_1: "28.11%",
    houndsRoarPart2_2: "28.11%",
    houndsRoarPart2_3: "42.16%",
    houndsRoarPart2_4: "42.16%",
    houndsRoarPart3: "130.73%",
    houndsRoarPart4_1: "27.78%",
    houndsRoarPart4_2: "27.78%",
    houndsRoarPart4_3: "27.78%",
    houndsRoarPart4_4: "27.78%",
    houndsRoarPart4_5: "27.78%",
    houndsRoarPart4_6: "27.78%",
    houndsRoarPart5_1: "119.83%",
    houndsRoarPart5_2: "119.83%",
    heavyAttackDamage_1: "49.50%",
    heavyAttackDamage_2: "49.50%",
    heavyAttackDamage_3: "49.50%",
    heavyAttackDamage_4: "49.50%",
    heavyAttackDamage_5: "49.50%",
    dodgeCounterDamage_1: "45.48%",
    dodgeCounterDamage_2: "45.48%",
    dodgeCounterDamage_3: "45.48%",
    dodgeCounterDamage_4: "45.48%",
    dodgeCounterDamage_5: "45.48%",
    dodgeCounterDamage_6: "45.48%",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
  "8": {
    skillDamage: "515.25%",
    necessaryMeansDamage_1: "171.75%",
    necessaryMeansDamage_2: "171.75%",
    houndsRoarPart1: "76.08%",
    houndsRoarPart2_1: "30.43%",
    houndsRoarPart2_2: "30.43%",
    houndsRoarPart2_3: "45.65%",
    houndsRoarPart2_4: "45.65%",
    houndsRoarPart3: "141.54%",
    houndsRoarPart4_1: "30.08%",
    houndsRoarPart4_2: "30.08%",
    houndsRoarPart4_3: "30.08%",
    houndsRoarPart4_4: "30.08%",
    houndsRoarPart4_5: "30.08%",
    houndsRoarPart4_6: "30.08%",
    houndsRoarPart5_1: "129.74%",
    houndsRoarPart5_2: "129.74%",
    heavyAttackDamage_1: "53.59%",
    heavyAttackDamage_2: "53.59%",
    heavyAttackDamage_3: "53.59%",
    heavyAttackDamage_4: "53.59%",
    heavyAttackDamage_5: "53.59%",
    dodgeCounterDamage_1: "49.24%",
    dodgeCounterDamage_2: "49.24%",
    dodgeCounterDamage_3: "49.24%",
    dodgeCounterDamage_4: "49.24%",
    dodgeCounterDamage_5: "49.24%",
    dodgeCounterDamage_6: "49.24%",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
  "9": {
    skillDamage: "554.61%",
    necessaryMeansDamage_1: "184.87%",
    necessaryMeansDamage_2: "184.87%",
    houndsRoarPart1: "81.89%",
    houndsRoarPart2_1: "32.76%",
    houndsRoarPart2_2: "32.76%",
    houndsRoarPart2_3: "49.14%",
    houndsRoarPart2_4: "49.14%",
    houndsRoarPart3: "152.35%",
    houndsRoarPart4_1: "32.38%",
    houndsRoarPart4_2: "32.38%",
    houndsRoarPart4_3: "32.38%",
    houndsRoarPart4_4: "32.38%",
    houndsRoarPart4_5: "32.38%",
    houndsRoarPart4_6: "32.38%",
    houndsRoarPart5_1: "139.66%",
    houndsRoarPart5_2: "139.66%",
    heavyAttackDamage_1: "57.68%",
    heavyAttackDamage_2: "57.68%",
    heavyAttackDamage_3: "57.68%",
    heavyAttackDamage_4: "57.68%",
    heavyAttackDamage_5: "57.68%",
    dodgeCounterDamage_1: "53.00%",
    dodgeCounterDamage_2: "53.00%",
    dodgeCounterDamage_3: "53.00%",
    dodgeCounterDamage_4: "53.00%",
    dodgeCounterDamage_5: "53.00%",
    dodgeCounterDamage_6: "53.00%",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
  "10": {
    skillDamage: "596.43%",
    necessaryMeansDamage_1: "198.81%",
    necessaryMeansDamage_2: "198.81%",
    houndsRoarPart1: "88.07%",
    houndsRoarPart2_1: "35.23%",
    houndsRoarPart2_2: "35.23%",
    houndsRoarPart2_3: "52.84%",
    houndsRoarPart2_4: "52.84%",
    houndsRoarPart3: "163.84%",
    houndsRoarPart4_1: "34.82%",
    houndsRoarPart4_2: "34.82%",
    houndsRoarPart4_3: "34.82%",
    houndsRoarPart4_4: "34.82%",
    houndsRoarPart4_5: "34.82%",
    houndsRoarPart4_6: "34.82%",
    houndsRoarPart5_1: "150.19%",
    houndsRoarPart5_2: "150.19%",
    heavyAttackDamage_1: "62.03%",
    heavyAttackDamage_2: "62.03%",
    heavyAttackDamage_3: "62.03%",
    heavyAttackDamage_4: "62.03%",
    heavyAttackDamage_5: "62.03%",
    dodgeCounterDamage_1: "56.99%",
    dodgeCounterDamage_2: "56.99%",
    dodgeCounterDamage_3: "56.99%",
    dodgeCounterDamage_4: "56.99%",
    dodgeCounterDamage_5: "56.99%",
    dodgeCounterDamage_6: "56.99%",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
};

interface IntroSkillLevel {
  skillDamage1_1: string;
  skillDamage1_2: string;
  skillDamage1_3: string;
  skillDamage1_4: string;
  conEnergyRegen: number;
}

interface IntroSkill {
  [level: string]: IntroSkillLevel;
}

const introSkillData: IntroSkill = {
  "1": {
    skillDamage1_1: "20.00%",
    skillDamage1_2: "20.00%",
    skillDamage1_3: "30.00%",
    skillDamage1_4: "30.00%",
    conEnergyRegen: 10,
  },
  "2": {
    skillDamage1_1: "21.64%",
    skillDamage1_2: "21.64%",
    skillDamage1_3: "32.46%",
    skillDamage1_4: "32.46%",
    conEnergyRegen: 10,
  },
  "3": {
    skillDamage1_1: "23.28%",
    skillDamage1_2: "23.28%",
    skillDamage1_3: "34.92%",
    skillDamage1_4: "34.92%",
    conEnergyRegen: 10,
  },
  "4": {
    skillDamage1_1: "25.58%",
    skillDamage1_2: "25.58%",
    skillDamage1_3: "38.37%",
    skillDamage1_4: "38.37%",
    conEnergyRegen: 10,
  },
  "5": {
    skillDamage1_1: "27.22%",
    skillDamage1_2: "27.22%",
    skillDamage1_3: "40.83%",
    skillDamage1_4: "40.83%",
    conEnergyRegen: 10,
  },
  "6": {
    skillDamage1_1: "29.11%",
    skillDamage1_2: "29.11%",
    skillDamage1_3: "43.66%",
    skillDamage1_4: "43.66%",
    conEnergyRegen: 10,
  },
  "7": {
    skillDamage1_1: "31.73%",
    skillDamage1_2: "31.73%",
    skillDamage1_3: "47.59%",
    skillDamage1_4: "47.59%",
    conEnergyRegen: 10,
  },
  "8": {
    skillDamage1_1: "34.35%",
    skillDamage1_2: "34.35%",
    skillDamage1_3: "51.53%",
    skillDamage1_4: "51.53%",
    conEnergyRegen: 10,
  },
  "9": {
    skillDamage1_1: "36.98%",
    skillDamage1_2: "36.98%",
    skillDamage1_3: "55.47%",
    skillDamage1_4: "55.47%",
    conEnergyRegen: 10,
  },
  "10": {
    skillDamage1_1: "39.77%",
    skillDamage1_2: "39.77%",
    skillDamage1_3: "59.65%",
    skillDamage1_4: "59.65%",
    conEnergyRegen: 10,
  },
};

interface OutroSkill {
  skillDamage1_1: string;
  skillDamage1_2: string;
}
const outroSkillData: OutroSkill = {
  skillDamage1_1: "195.98%",
  skillDamage1_2: "391.96%",
};

interface ForteCircuitLevel {
  mercyDamage1_1: string;
  mercyDamage1_2: string;
  mercyDamage1_3: string;
  mercyDamage1_4: string;
  mercyDamage1_5: string;
  mercyDamage1_6: string;
  mercyDamage1_7: string;
  mercyDamage1_8: string;
  mercyDamage1_9: string;
  deathMessengerDamage1_1: string;
  deathMessengerDamage1_2: string;
  deathMessengerDamage1_3: string;
  deathMessengerDamage1_4: string;
  deathMessengerDamage1_5: string;
  deathMessengerDamage1_6: string;
  deathMessengerDamage1_7: string;
  deathMessengerDamage1_8: string;
  deathMessengerDamage1_9: string;
  mercyConEnergyRegen: number;
  deathMessengerConEnergyRegen: number;
}

interface ForteCircuit {
  [level: string]: ForteCircuitLevel;
}

const forteCircuitData: ForteCircuit = {
  "1": {
    mercyDamage1_1: "19.67%",
    mercyDamage1_2: "19.67%",
    mercyDamage1_3: "19.67%",
    mercyDamage1_4: "19.67%",
    mercyDamage1_5: "19.67%",
    mercyDamage1_6: "19.67%",
    mercyDamage1_7: "19.67%",
    mercyDamage1_8: "19.67%",
    mercyDamage1_9: "39.34%",
    deathMessengerDamage1_1: "49.18%",
    deathMessengerDamage1_2: "49.18%",
    deathMessengerDamage1_3: "49.18%",
    deathMessengerDamage1_4: "49.18%",
    deathMessengerDamage1_5: "49.18%",
    deathMessengerDamage1_6: "49.18%",
    deathMessengerDamage1_7: "49.18%",
    deathMessengerDamage1_8: "49.18%",
    deathMessengerDamage1_9: "98.35%",
    mercyConEnergyRegen: 6,
    deathMessengerConEnergyRegen: 5,
  },
  "2": {
    mercyDamage1_1: "21.29%",
    mercyDamage1_2: "21.29%",
    mercyDamage1_3: "21.29%",
    mercyDamage1_4: "21.29%",
    mercyDamage1_5: "21.29%",
    mercyDamage1_6: "21.29%",
    mercyDamage1_7: "21.29%",
    mercyDamage1_8: "21.29%",
    mercyDamage1_9: "42.57%",
    deathMessengerDamage1_1: "53.21%",
    deathMessengerDamage1_2: "53.21%",
    deathMessengerDamage1_3: "53.21%",
    deathMessengerDamage1_4: "53.21%",
    deathMessengerDamage1_5: "53.21%",
    deathMessengerDamage1_6: "53.21%",
    deathMessengerDamage1_7: "53.21%",
    deathMessengerDamage1_8: "53.21%",
    deathMessengerDamage1_9: "106.42%",
    mercyConEnergyRegen: 6,
    deathMessengerConEnergyRegen: 5,
  },
  "3": {
    mercyDamage1_1: "22.90%",
    mercyDamage1_2: "22.90%",
    mercyDamage1_3: "22.90%",
    mercyDamage1_4: "22.90%",
    mercyDamage1_5: "22.90%",
    mercyDamage1_6: "22.90%",
    mercyDamage1_7: "22.90%",
    mercyDamage1_8: "22.90%",
    mercyDamage1_9: "45.80%",
    deathMessengerDamage1_1: "57.24%",
    deathMessengerDamage1_2: "57.24%",
    deathMessengerDamage1_3: "57.24%",
    deathMessengerDamage1_4: "57.24%",
    deathMessengerDamage1_5: "57.24%",
    deathMessengerDamage1_6: "57.24%",
    deathMessengerDamage1_7: "57.24%",
    deathMessengerDamage1_8: "57.24%",
    deathMessengerDamage1_9: "114.48%",
    mercyConEnergyRegen: 6,
    deathMessengerConEnergyRegen: 5,
  },
  "4": {
    mercyDamage1_1: "25.16%",
    mercyDamage1_2: "25.16%",
    mercyDamage1_3: "25.16%",
    mercyDamage1_4: "25.16%",
    mercyDamage1_5: "25.16%",
    mercyDamage1_6: "25.16%",
    mercyDamage1_7: "25.16%",
    mercyDamage1_8: "25.16%",
    mercyDamage1_9: "50.31%",
    deathMessengerDamage1_1: "62.89%",
    deathMessengerDamage1_2: "62.89%",
    deathMessengerDamage1_3: "62.89%",
    deathMessengerDamage1_4: "62.89%",
    deathMessengerDamage1_5: "62.89%",
    deathMessengerDamage1_6: "62.89%",
    deathMessengerDamage1_7: "62.89%",
    deathMessengerDamage1_8: "62.89%",
    deathMessengerDamage1_9: "125.77%",
    mercyConEnergyRegen: 6,
    deathMessengerConEnergyRegen: 5,
  },
  "5": {
    mercyDamage1_1: "26.77%",
    mercyDamage1_2: "26.77%",
    mercyDamage1_3: "26.77%",
    mercyDamage1_4: "26.77%",
    mercyDamage1_5: "26.77%",
    mercyDamage1_6: "26.77%",
    mercyDamage1_7: "26.77%",
    mercyDamage1_8: "26.77%",
    mercyDamage1_9: "53.54%",
    deathMessengerDamage1_1: "66.92%",
    deathMessengerDamage1_2: "66.92%",
    deathMessengerDamage1_3: "66.92%",
    deathMessengerDamage1_4: "66.92%",
    deathMessengerDamage1_5: "66.92%",
    deathMessengerDamage1_6: "66.92%",
    deathMessengerDamage1_7: "66.92%",
    deathMessengerDamage1_8: "66.92%",
    deathMessengerDamage1_9: "133.84%",
    mercyConEnergyRegen: 6,
    deathMessengerConEnergyRegen: 5,
  },
  "6": {
    mercyDamage1_1: "28.63%",
    mercyDamage1_2: "28.63%",
    mercyDamage1_3: "28.63%",
    mercyDamage1_4: "28.63%",
    mercyDamage1_5: "28.63%",
    mercyDamage1_6: "28.63%",
    mercyDamage1_7: "28.63%",
    mercyDamage1_8: "28.63%",
    mercyDamage1_9: "57.25%",
    deathMessengerDamage1_1: "71.56%",
    deathMessengerDamage1_2: "71.56%",
    deathMessengerDamage1_3: "71.56%",
    deathMessengerDamage1_4: "71.56%",
    deathMessengerDamage1_5: "71.56%",
    deathMessengerDamage1_6: "71.56%",
    deathMessengerDamage1_7: "71.56%",
    deathMessengerDamage1_8: "71.56%",
    deathMessengerDamage1_9: "143.11%",
    mercyConEnergyRegen: 6,
    deathMessengerConEnergyRegen: 5,
  },
  "7": {
    mercyDamage1_1: "31.21%",
    mercyDamage1_2: "31.21%",
    mercyDamage1_3: "31.21%",
    mercyDamage1_4: "31.21%",
    mercyDamage1_5: "31.21%",
    mercyDamage1_6: "31.21%",
    mercyDamage1_7: "31.21%",
    mercyDamage1_8: "31.21%",
    mercyDamage1_9: "62.41%",
    deathMessengerDamage1_1: "78.01%",
    deathMessengerDamage1_2: "78.01%",
    deathMessengerDamage1_3: "78.01%",
    deathMessengerDamage1_4: "78.01%",
    deathMessengerDamage1_5: "78.01%",
    deathMessengerDamage1_6: "78.01%",
    deathMessengerDamage1_7: "78.01%",
    deathMessengerDamage1_8: "78.01%",
    deathMessengerDamage1_9: "156.02%",
    mercyConEnergyRegen: 6,
    deathMessengerConEnergyRegen: 5,
  },
  "8": {
    mercyDamage1_1: "33.79%",
    mercyDamage1_2: "33.79%",
    mercyDamage1_3: "33.79%",
    mercyDamage1_4: "33.79%",
    mercyDamage1_5: "33.79%",
    mercyDamage1_6: "33.79%",
    mercyDamage1_7: "33.79%",
    mercyDamage1_8: "33.79%",
    mercyDamage1_9: "67.57%",
    deathMessengerDamage1_1: "84.46%",
    deathMessengerDamage1_2: "84.46%",
    deathMessengerDamage1_3: "84.46%",
    deathMessengerDamage1_4: "84.46%",
    deathMessengerDamage1_5: "84.46%",
    deathMessengerDamage1_6: "84.46%",
    deathMessengerDamage1_7: "84.46%",
    deathMessengerDamage1_8: "84.46%",
    deathMessengerDamage1_9: "168.92%",
    mercyConEnergyRegen: 6,
    deathMessengerConEnergyRegen: 5,
  },
  "9": {
    mercyDamage1_1: "36.37%",
    mercyDamage1_2: "36.37%",
    mercyDamage1_3: "36.37%",
    mercyDamage1_4: "36.37%",
    mercyDamage1_5: "36.37%",
    mercyDamage1_6: "36.37%",
    mercyDamage1_7: "36.37%",
    mercyDamage1_8: "36.37%",
    mercyDamage1_9: "72.73%",
    deathMessengerDamage1_1: "90.91%",
    deathMessengerDamage1_2: "90.91%",
    deathMessengerDamage1_3: "90.91%",
    deathMessengerDamage1_4: "90.91%",
    deathMessengerDamage1_5: "90.91%",
    deathMessengerDamage1_6: "90.91%",
    deathMessengerDamage1_7: "90.91%",
    deathMessengerDamage1_8: "90.91%",
    deathMessengerDamage1_9: "181.82%",
    mercyConEnergyRegen: 6,
    deathMessengerConEnergyRegen: 5,
  },
  "10": {
    mercyDamage1_1: "39.11%",
    mercyDamage1_2: "39.11%",
    mercyDamage1_3: "39.11%",
    mercyDamage1_4: "39.11%",
    mercyDamage1_5: "39.11%",
    mercyDamage1_6: "39.11%",
    mercyDamage1_7: "39.11%",
    mercyDamage1_8: "39.11%",
    mercyDamage1_9: "78.22%",
    deathMessengerDamage1_1: "97.77%",
    deathMessengerDamage1_2: "97.77%",
    deathMessengerDamage1_3: "97.77%",
    deathMessengerDamage1_4: "97.77%",
    deathMessengerDamage1_5: "97.77%",
    deathMessengerDamage1_6: "97.77%",
    deathMessengerDamage1_7: "97.77%",
    deathMessengerDamage1_8: "97.77%",
    deathMessengerDamage1_9: "195.53%",
    mercyConEnergyRegen: 6,
    deathMessengerConEnergyRegen: 5,
  },
};

export const character = { ...characterData };
export const normalAttacks = { ...normalAttacksData };
export const normalSkill = { ...resonanceSkillData };
export const resonanceSkill = { ...resonanceSkillData };
export const resonanceLiberation = { ...resonanceLiberationData };
export const introSkill = { ...introSkillData };
export const outroSkill = { ...outroSkillData };
export const forteCircuit = { ...forteCircuitData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
export function getNormalAttacksStatsByTalentLevel(
  talentLevel: string
): NormalAttackLevel {
  return normalAttacks[talentLevel];
}
export function getResonanceSkillStatsByTalentLevel(
  talentLevel: string
): ResonanceSkillLevel {
  return resonanceSkillData[talentLevel];
}
export function getResonanceLiberationStatsByTalentLevel(
  talentLevel: string
): ResonanceLiberationLevel {
  return resonanceLiberationData[talentLevel];
}
export function getIntroSkillStatsByTalentLevel(
  talentLevel: string
): IntroSkillLevel {
  return introSkillData[talentLevel];
}
export function getForteCircuitStatsByTalentLevel(
  talentLevel: string
): ForteCircuitLevel {
  return forteCircuitData[talentLevel];
}
