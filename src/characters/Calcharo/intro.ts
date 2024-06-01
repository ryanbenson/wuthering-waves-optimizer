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

export const introSkill = { ...introSkillData };

export function getIntroSkillStatsByTalentLevel(
  talentLevel: string
): IntroSkillLevel {
  return introSkillData[talentLevel];
}
