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
  [level: string]: ResonanceSkillLevel;
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

export const resonanceSkill = { ...resonanceSkillData };

export function getResonanceSkillStatsByTalentLevel(
  talentLevel: string
): ResonanceSkillLevel {
  return resonanceSkillData[talentLevel];
}
