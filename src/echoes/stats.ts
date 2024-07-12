interface RankColors {
  "2": string;
  "3": string;
  "4": string;
  "5": string;
}

export const rankColors: RankColors = {
  2: "#11cb11",
  3: "#0580ff",
  4: "#a314a3",
  5: "#e1e115",
};

interface StatLevel {
  [stat: string]: StatLevelData;
}

interface StatLevelData {
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}

interface StatsTable {
  [level: number]: StatLevel;
}

export const statsTable: StatsTable = {
  1: {
    HP: { 2: 5.7, 3: 8.1, 4: 11.3, 5: 18.0 },
    ATK: { 2: 5.7, 3: 8.1, 4: 11.3, 5: 18.0 },
    DEF: { 2: 7.2, 3: 10.2, 4: 14.2, 5: 22.8 },
  },
  3: {
    HP: { 2: 9.6, 3: 14.0, 4: 18.9, 5: 30 },
    ATK: { 2: 9.6, 3: 14.0, 4: 18.9, 5: 30 },
    DEF: { 2: 12.3, 3: 17.0, 4: 23.9, 5: 38 },
    Glacio: { 2: 9.6, 3: 14.0, 4: 18.9, 5: 30 },
    Fusion: { 2: 9.6, 3: 14.0, 4: 18.9, 5: 30 },
    Electro: { 2: 9.6, 3: 14.0, 4: 18.9, 5: 30 },
    Aero: { 2: 9.6, 3: 14.0, 4: 18.9, 5: 30 },
    Spectro: { 2: 9.6, 3: 14.0, 4: 18.9, 5: 30 },
    Havoc: { 2: 9.6, 3: 14.0, 4: 18.9, 5: 30 },
    EnergyRegen: { 2: 10, 3: 14.2, 4: 20.1, 5: 32.0 },
  },
  4: {
    HP: { 2: 10.6, 3: 14.6, 4: 20.5, 5: 33.0 },
    ATK: { 2: 10.6, 3: 14.6, 4: 20.5, 5: 33.0 },
    DEF: { 2: 13.5, 3: 18.7, 4: 26.0, 5: 41.5 },
    CritRate: { 2: 7.1, 3: 9.8, 4: 13.8, 5: 22.0 },
    CritDMG: { 2: 14.3, 3: 19.7, 4: 27.7, 5: 44.0 },
    HealingBonus: { 2: 8.5, 3: 11.9, 4: 16.3, 5: 26.0 },
  },
};

interface FlatBonusesByRankByType {
  [level: number]: FlatBonusesByRankByTypeData;
}

interface FlatBonusesByRankByTypeData {
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}

export const flatBonusesByRankByType: FlatBonusesByRankByType = {
  1: {
    2: 296,
    3: 516,
    4: 957,
    5: 2280,
  },
  3: {
    2: 31,
    3: 44,
    4: 63,
    5: 100,
  },
  4: {
    2: 46,
    3: 68,
    4: 92,
    5: 150,
  },
};

export const subStats: string[] = [
  "HP_FLAT",
  "ATK_FLAT",
  "DEF_FLAT",
  "ATK",
  "HP",
  "DEF",
  "EnergyRegen",
  "CritRate",
  "CritDMG",
  "BasicAttackDMGBonus",
  "HeavyAttackDMGBonus",
  "ResonanceSkillDMGBonus",
  "ResonanceLiberationDMGBonus",
];

interface SubStatRanges {
  [subStat: string]: SubStatRangeData;
}

interface SubStatRangeData {
  min: number;
  max: number;
}

export const subStatRanges: SubStatRanges = {
  HP_FLAT: { min: 320, max: 580 },
  ATK_FLAT: { min: 30, max: 60 },
  DEF_FLAT: { min: 40, max: 70 },
  ATK: { min: 6.4, max: 11.6 },
  HP: { min: 6.4, max: 11.6 },
  DEF: { min: 8.1, max: 14.7 },
  EnergyRegen: { min: 6.8, max: 12.4 },
  CritRate: { min: 6.3, max: 10.5 },
  CritDMG: { min: 12.6, max: 21.0 },
  BasicAttackDMGBonus: { min: 6.4, max: 11.6 },
  HeavyAttackDMGBonus: { min: 6.4, max: 11.6 },
  ResonanceSkillDMGBonus: { min: 6.4, max: 11.6 },
  ResonanceLiberationDMGBonus: { min: 6.4, max: 11.6 },
};

interface SubStatLabelMap {
  [subStatKey: string]: string;
}
export const subStatLabelMap: SubStatLabelMap = {
  HP_FLAT: "HP",
  ATK_FLAT: "ATK",
  DEF_FLAT: "DEF",
  ATK: "ATK%",
  HP: "HP%",
  DEF: "DEF%",
  EnergyRegen: "Energy Regen",
  CritRate: "Crit Rate",
  CritDMG: "Crit DMG",
  BasicAttackDMGBonus: "Basic Attack DMG Bonus",
  HeavyAttackDMGBonus: "Heavy Attack DMG Bonus",
  ResonanceSkillDMGBonus: "Resonance Skill DMG Bonus",
  ResonanceLiberationDMGBonus: "Resonance Liberation DMG Bonus",
  Glacio: "Glacio DMG Bonus",
  Fusion: "Fusion DMG Bonus",
  Electro: "Electro DMG Bonus",
  Aero: "Aero DMG Bonus",
  Spectro: "Spectro DMG Bonus",
  Havoc: "Havoc DMG Bonus",
  HealingBonus: "Healing Bonus",
};

export function getReadableSubStatLabel(key: string): string {
  return subStatLabelMap[key];
}
