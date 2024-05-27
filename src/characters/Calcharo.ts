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
  part1Damage: string;
  part2Damage: string;
  part3Damage: string;
  part4Damage: string;
  heavyAttackDamage: string;
  midAirAttackDamage: string;
  dodgeCounterDamage: string;
  heavyAttackStaminaConsumption: number;
  midAirAttackStaminaConsumption: number;
}

interface NormalAttacks {
  [level: string]: NormalAttackLevel;
}

const normalAttacksData: NormalAttacks = {
  "1": {
    part1Damage: "23.00%*2",
    part2Damage: "50.00%",
    part3Damage: "42.84%+21.42%*3",
    part4Damage: "39.99%*2+53.32%",
    heavyAttackDamage: "20.80%*5",
    midAirAttackDamage: "62.00%",
    dodgeCounterDamage: "33.44%*3+42.99%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
  "2": {
    part1Damage: "24.89%*2",
    part2Damage: "54.10%",
    part3Damage: "46.36%+23.18%*3",
    part4Damage: "43.27%*2+57.70%",
    heavyAttackDamage: "22.51%*5",
    midAirAttackDamage: "67.09%",
    dodgeCounterDamage: "36.18%*3+46.52%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
  "3": {
    part1Damage: "26.78%*2",
    part2Damage: "58.20%",
    part3Damage: "49.87%+24.94%*3",
    part4Damage: "46.55%*2+62.07%",
    heavyAttackDamage: "24.22%*5",
    midAirAttackDamage: "72.17%",
    dodgeCounterDamage: "38.93%*3+50.05%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
  "4": {
    part1Damage: "29.42%*2",
    part2Damage: "63.94%",
    part3Damage: "54.79%+27.40%*3",
    part4Damage: "51.14%*2+68.19%",
    heavyAttackDamage: "26.60%*5",
    midAirAttackDamage: "79.29%",
    dodgeCounterDamage: "42.76%*3+54.98%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
  "5": {
    part1Damage: "31.30%*2",
    part2Damage: "68.04%",
    part3Damage: "58.30%+29.15%*3",
    part4Damage: "54.42%*2+72.56%",
    heavyAttackDamage: "28.31%*5",
    midAirAttackDamage: "84.37%",
    dodgeCounterDamage: "45.51%*3+58.51%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
  "6": {
    part1Damage: "33.47%*2",
    part2Damage: "72.76%",
    part3Damage: "62.34%+31.17%*3",
    part4Damage: "58.19%*2+77.59%",
    heavyAttackDamage: "30.27%*5",
    midAirAttackDamage: "90.22%",
    dodgeCounterDamage: "48.66%*3+62.56%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
  "7": {
    part1Damage: "36.49%*2",
    part2Damage: "79.32%",
    part3Damage: "67.96%+33.98%*3",
    part4Damage: "63.44%*2+84.59%",
    heavyAttackDamage: "33.00%*5",
    midAirAttackDamage: "98.36%",
    dodgeCounterDamage: "53.05%*3+68.20%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
  "8": {
    part1Damage: "39.51%*2",
    part2Damage: "85.88%",
    part3Damage: "73.58%+36.79%*3",
    part4Damage: "68.69%*2+91.58%",
    heavyAttackDamage: "35.73%*5",
    midAirAttackDamage: "106.49%",
    dodgeCounterDamage: "57.43%*3+73.84%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
  "9": {
    part1Damage: "42.53%*2",
    part2Damage: "92.44%",
    part3Damage: "79.20%+39.60%*3",
    part4Damage: "73.93%*2+98.58%",
    heavyAttackDamage: "38.46%*5",
    midAirAttackDamage: "114.62%",
    dodgeCounterDamage: "61.82%*3+79.48%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
  "10": {
    part1Damage: "45.73%*2",
    part2Damage: "99.41%",
    part3Damage: "85.18%+42.59%*3",
    part4Damage: "79.51%*2+106.01%",
    heavyAttackDamage: "41.36%*5",
    midAirAttackDamage: "123.27%",
    dodgeCounterDamage: "66.48%*3+85.47%",
    heavyAttackStaminaConsumption: 30,
    midAirAttackStaminaConsumption: 30,
  },
};

interface ResonanceSkillLevel {
  exterminationOrderPart1Damage: string;
  exterminationOrderPart2Damage: string;
  exterminationOrderPart3Damage: string;
  cooldown: number;
  exterminationOrderConEnergyRegen: number;
}

interface ResonanceSkill {
  [level: string]: ResonanceSkillLevel;
}

const resonanceSkillData: ResonanceSkill = {
  "1": {
    exterminationOrderPart1Damage: "25.94%*2+34.59%",
    exterminationOrderPart2Damage: "38.91%*2+51.88%",
    exterminationOrderPart3Damage: "108.08%*2",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
  "2": {
    exterminationOrderPart1Damage: "28.07%*2+37.42%",
    exterminationOrderPart2Damage: "42.10%*2+56.13%",
    exterminationOrderPart3Damage: "116.94%*2",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
  "3": {
    exterminationOrderPart1Damage: "30.20%*2+40.26%",
    exterminationOrderPart2Damage: "45.29%*2+60.39%",
    exterminationOrderPart3Damage: "125.80%*2",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
  "4": {
    exterminationOrderPart1Damage: "33.17%*2+44.23%",
    exterminationOrderPart2Damage: "49.76%*2+66.34%",
    exterminationOrderPart3Damage: "138.21%*2",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
  "5": {
    exterminationOrderPart1Damage: "35.30%*2+47.07%",
    exterminationOrderPart2Damage: "52.95%*2+70.60%",
    exterminationOrderPart3Damage: "147.07%*2",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
  "6": {
    exterminationOrderPart1Damage: "37.75%*2+50.33%",
    exterminationOrderPart2Damage: "56.62%*2+75.49%",
    exterminationOrderPart3Damage: "157.26%*2",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
  "7": {
    exterminationOrderPart1Damage: "41.15%*2+54.87%",
    exterminationOrderPart2Damage: "61.72%*2+82.30%",
    exterminationOrderPart3Damage: "171.44%*2",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
  "8": {
    exterminationOrderPart1Damage: "44.55%*2+59.40%",
    exterminationOrderPart2Damage: "66.83%*2+89.10%",
    exterminationOrderPart3Damage: "185.62%*2",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
  "9": {
    exterminationOrderPart1Damage: "47.96%*2+63.94%",
    exterminationOrderPart2Damage: "71.93%*2+95.91%",
    exterminationOrderPart3Damage: "199.80%*2",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
  "10": {
    exterminationOrderPart1Damage: "51.57%*2+68.76%",
    exterminationOrderPart2Damage: "77.36%*2+103.14%",
    exterminationOrderPart3Damage: "214.87%*2",
    cooldown: 10,
    exterminationOrderConEnergyRegen: 4,
  },
};

interface ResonanceLiberationLevel {
  skillDamage: string;
  necessaryMeansDamage: string;
  houndsRoarPart1: string;
  houndsRoarPart2: string;
  houndsRoarPart3: string;
  houndsRoarPart4: string;
  houndsRoarPart5: string;
  heavyAttackDamage: string;
  dodgeCounterDamage: string;
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
    necessaryMeansDamage: "100.00%*2",
    houndsRoarPart1: "44.30%",
    houndsRoarPart2: "17.72%*2+26.58%*2",
    houndsRoarPart3: "82.41%",
    houndsRoarPart4: "17.52%*6",
    houndsRoarPart5: "75.54%*2",
    heavyAttackDamage: "31.20%*5",
    dodgeCounterDamage: "28.67%*6",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
  "2": {
    skillDamage: "324.60%",
    necessaryMeansDamage: "108.20%*2",
    houndsRoarPart1: "47.93%",
    houndsRoarPart2: "19.18%*2+28.76%*2",
    houndsRoarPart3: "89.17%",
    houndsRoarPart4: "18.95%*6",
    houndsRoarPart5: "81.74%*2",
    heavyAttackDamage: "33.76%*5",
    dodgeCounterDamage: "31.02%*6",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
  "3": {
    skillDamage: "349.20%",
    necessaryMeansDamage: "116.40%*2",
    houndsRoarPart1: "51.56%",
    houndsRoarPart2: "20.63%*2+30.94%*2",
    houndsRoarPart3: "95.93%",
    houndsRoarPart4: "20.39%*6",
    houndsRoarPart5: "87.93%*2",
    heavyAttackDamage: "36.32%*5",
    dodgeCounterDamage: "33.37%*6",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
  "4": {
    skillDamage: "383.64%",
    necessaryMeansDamage: "127.88%*2",
    houndsRoarPart1: "56.65%",
    houndsRoarPart2: "22.66%*2+33.99%*2",
    houndsRoarPart3: "105.39%",
    houndsRoarPart4: "22.40%*6",
    houndsRoarPart5: "96.61%*2",
    heavyAttackDamage: "39.90%*5",
    dodgeCounterDamage: "36.66%*6",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
  "5": {
    skillDamage: "408.24%",
    necessaryMeansDamage: "136.08%*2",
    houndsRoarPart1: "60.28%",
    houndsRoarPart2: "24.11%*2+36.17%*2",
    houndsRoarPart3: "112.14%",
    houndsRoarPart4: "23.83%*6",
    houndsRoarPart5: "102.80%*2",
    heavyAttackDamage: "42.46%*5",
    dodgeCounterDamage: "39.01%*6",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
  "6": {
    skillDamage: "436.53%",
    necessaryMeansDamage: "145.51%*2",
    houndsRoarPart1: "64.46%",
    houndsRoarPart2: "25.79%*2+38.68%*2",
    houndsRoarPart3: "119.92%",
    houndsRoarPart4: "25.49%*6",
    houndsRoarPart5: "109.92%*2",
    heavyAttackDamage: "45.40%*5",
    dodgeCounterDamage: "41.72%*6",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
  "7": {
    skillDamage: "475.89%",
    necessaryMeansDamage: "158.63%*2",
    houndsRoarPart1: "70.27%",
    houndsRoarPart2: "28.11%*2+42.16%*2",
    houndsRoarPart3: "130.73%",
    houndsRoarPart4: "27.78%*6",
    houndsRoarPart5: "119.83%*2",
    heavyAttackDamage: "49.50%*5",
    dodgeCounterDamage: "45.48%*6",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
  "8": {
    skillDamage: "515.25%",
    necessaryMeansDamage: "171.75%*2",
    houndsRoarPart1: "76.08%",
    houndsRoarPart2: "30.43%*2+45.65%*2",
    houndsRoarPart3: "141.54%",
    houndsRoarPart4: "30.08%*6",
    houndsRoarPart5: "129.74%*2",
    heavyAttackDamage: "53.59%*5",
    dodgeCounterDamage: "49.24%*6",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
  "9": {
    skillDamage: "554.61%",
    necessaryMeansDamage: "184.87%*2",
    houndsRoarPart1: "81.89%",
    houndsRoarPart2: "32.76%*2+49.14%*2",
    houndsRoarPart3: "152.35%",
    houndsRoarPart4: "32.38%*6",
    houndsRoarPart5: "139.66%*2",
    heavyAttackDamage: "57.68%*5",
    dodgeCounterDamage: "53.00%*6",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
  "10": {
    skillDamage: "596.43%",
    necessaryMeansDamage: "198.81%*2",
    houndsRoarPart1: "88.07%",
    houndsRoarPart2: "35.23%*2+52.84%*2",
    houndsRoarPart3: "163.84%",
    houndsRoarPart4: "34.82%*6",
    houndsRoarPart5: "150.19%*2",
    heavyAttackDamage: "62.03%*5",
    dodgeCounterDamage: "56.99%*6",
    heavyAttackStaminaConsumption: 30,
    deathbladeGearDuration: 11,
    cooldown: 20,
    resEnergyCost: 125,
    conEnergyRegen: 20,
  },
};

interface IntroSkillLevel {
  skillDamage: string;
  conEnergyRegen: number;
}

interface IntroSkill {
  [level: string]: IntroSkillLevel;
}

const introSkillData: IntroSkill = {
  "1": {
    skillDamage: "20.00%*2+30.00%*2",
    conEnergyRegen: 10,
  },
  "2": {
    skillDamage: "21.64%*2+32.46%*2",
    conEnergyRegen: 10,
  },
  "3": {
    skillDamage: "23.28%*2+34.92%*2",
    conEnergyRegen: 10,
  },
  "4": {
    skillDamage: "25.58%*2+38.37%*2",
    conEnergyRegen: 10,
  },
  "5": {
    skillDamage: "27.22%*2+40.83%*2",
    conEnergyRegen: 10,
  },
  "6": {
    skillDamage: "29.11%*2+43.66%*2",
    conEnergyRegen: 10,
  },
  "7": {
    skillDamage: "31.73%*2+47.59%*2",
    conEnergyRegen: 10,
  },
  "8": {
    skillDamage: "34.35%*2+51.53%*2",
    conEnergyRegen: 10,
  },
  "9": {
    skillDamage: "36.98%*2+55.47%*2",
    conEnergyRegen: 10,
  },
  "10": {
    skillDamage: "39.77%*2+59.65%*2",
    conEnergyRegen: 10,
  },
};

interface OutroSkill {
  skillDamage: string;
}
const outroSkillData: OutroSkill = {
  skillDamage: "195.98%+391.96%",
};

interface ForteCircuitLevel {
  mercyDamage: string;
  deathMessengerDamage: string;
  mercyConEnergyRegen: number;
  deathMessengerConEnergyRegen: number;
}

interface ForteCircuit {
  [level: string]: ForteCircuitLevel;
}

const forteCircuitData: ForteCircuit = {
  "1": {
    mercyDamage: "19.67%*8+39.34%",
    deathMessengerDamage: "49.18%*8+98.35%",
    mercyConEnergyRegen: 6,
    deathMessengerConEnergyRegen: 5,
  },
  "2": {
    mercyDamage: "21.29%*8+42.57%",
    deathMessengerDamage: "53.21%*8+106.42%",
    mercyConEnergyRegen: 6,
    deathMessengerConEnergyRegen: 5,
  },
  "3": {
    mercyDamage: "22.90%*8+45.80%",
    deathMessengerDamage: "57.24%*8+114.48%",
    mercyConEnergyRegen: 6,
    deathMessengerConEnergyRegen: 5,
  },
  "4": {
    mercyDamage: "25.16%*8+50.31%",
    deathMessengerDamage: "62.89%*8+125.77%",
    mercyConEnergyRegen: 6,
    deathMessengerConEnergyRegen: 5,
  },
  "5": {
    mercyDamage: "26.77%*8+53.54%",
    deathMessengerDamage: "66.92%*8+133.84%",
    mercyConEnergyRegen: 6,
    deathMessengerConEnergyRegen: 5,
  },
  "6": {
    mercyDamage: "28.63%*8+57.25%",
    deathMessengerDamage: "71.56%*8+143.11%",
    mercyConEnergyRegen: 6,
    deathMessengerConEnergyRegen: 5,
  },
  "7": {
    mercyDamage: "31.21%*8+62.41%",
    deathMessengerDamage: "78.01%*8+156.02%",
    mercyConEnergyRegen: 6,
    deathMessengerConEnergyRegen: 5,
  },
  "8": {
    mercyDamage: "33.79%*8+67.57%",
    deathMessengerDamage: "84.46%*8+168.92%",
    mercyConEnergyRegen: 6,
    deathMessengerConEnergyRegen: 5,
  },
  "9": {
    mercyDamage: "36.37%*8+72.73%",
    deathMessengerDamage: "90.91%*8+181.82%",
    mercyConEnergyRegen: 6,
    deathMessengerConEnergyRegen: 5,
  },
  "10": {
    mercyDamage: "39.11%*8+78.22%",
    deathMessengerDamage: "97.77%*8+195.53%",
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
