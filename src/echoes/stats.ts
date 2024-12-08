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
    HP: { 2: 7.2, 3: 10.2, 4: 14.2, 5: 22.8 },
    ATK: { 2: 5.7, 3: 8.1, 4: 11.3, 5: 18.0 },
    DEF: { 2: 5.7, 3: 8.1, 4: 11.3, 5: 18.0 },
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
    DEF: { 2: 13.5, 3: 18.7, 4: 26.0, 5: 41.8 },
    CritRate: { 2: 7.1, 3: 9.8, 4: 13.8, 5: 22.0 },
    CritDMG: { 2: 14.3, 3: 19.7, 4: 27.7, 5: 44.0 },
    HealingBonus: { 2: 8.5, 3: 11.9, 4: 16.3, 5: 26.0 },
  },
};

interface SubStatTable {
  [stat: string]: number[];
}

export const subStatsTable: SubStatTable = {
  CritRate: [6.3, 6.9, 7.5, 8.1, 8.7, 9.3, 9.9, 10.5],
  CritDMG: [12.6, 13.8, 15, 16.2, 17.4, 18.6, 19.8, 21],
  ATK: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  ATK_FLAT: [30, 40, 50, 60, 70],
  HP: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  HP_FLAT: [320, 360, 390, 430, 470, 510, 540, 580],
  DEF: [8.1, 9, 10, 10.9, 11.8, 12.8, 13.8, 14.7],
  DEF_FLAT: [30, 40, 50, 60, 70],
  BasicAttackDMGBonus: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  HeavyAttackDMGBonus: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  ResonanceSkillDMGBonus: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  ResonanceLiberationDMGBonus: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  EnergyRegen: [6.8, 7.6, 8.4, 9.2, 10, 10.8, 11.6, 12.4],
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

export const subStatIconMap: Record<string, string> = {
  HP_FLAT: "https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png",
  ATK_FLAT:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png",
  DEF_FLAT:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/def.png",
  ATK: "https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png",
  HP: "https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png",
  DEF: "https://ryanbenson.github.io/wuthering-waves-assets/images/def.png",
  EnergyRegen:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/energyregen.png",
  CritRate:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/critrate.png",
  CritDMG:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/critdamage.png",
  BasicAttackDMGBonus:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/basicatkdmgbonus.png",
  HeavyAttackDMGBonus:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/heavyatkdmgbonus.png",
  ResonanceSkillDMGBonus:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/skilldmgbonus.png",
  ResonanceLiberationDMGBonus:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/liberationdmgbonus.png",
  Glacio:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/glaciodmgbonus.png",
  Fusion:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/fusiondmgbonus.png",
  Electro:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/electrodmgbonus.png",
  Aero: "https://ryanbenson.github.io/wuthering-waves-assets/images/aerodmgbonus.png",
  Spectro:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/spectrodmgbonus.png",
  Havoc:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/havocdmgbonus.png",
  HealingBonus:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/healingbonus.png",
};

export function getSubStatIconByType(type: string): string {
  return subStatIconMap[type];
}

export const echoSetImageMap: Record<string, string> = {
  FreezingFrost:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/FreezingFrost.webp",
  MoltenRift:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/MoltenRift.webp",
  VoidThunder:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/VoidThunder.webp",
  SierraGale:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/SierraGale.webp",
  CelestialLight:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/CelestialLight.webp",
  SunSinkingEclipse:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/SunSinkingEclipse.webp",
  RejuvenatingGlow:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/RejuvenatingGlow.webp",
  MoonlitClouds:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/MoonlitClouds.webp",
  LingeringTunes:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/LingeringTunes.webp",
  AHeartOfDetermination:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/aheartofdetermination.png",
  TheVeilofHiddenNight:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/TheVeilofHiddenNight.png",
  TheEternalLight:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/TheEternalLight.png",
  ASongofHighHeavens:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/ASongofHighHeavens.png",
  BravetheWaves:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/BravetheWaves.png",
};

export function getEchoSetIconByType(type: string): string {
  return echoSetImageMap[type];
}

export const echoSetLabelMap: Record<string, string> = {
  FreezingFrost: "Freezing Frost",
  MoltenRift: "Molten Rift",
  VoidThunder: "Void Thunder",
  SierraGale: "Sierra Gale",
  CelestialLight: "Celestial Light",
  SunSinkingEclipse: "Sun-sinking Eclipse",
  RejuvenatingGlow: "Rejuvenating Glow",
  MoonlitClouds: "Moonlit Clouds",
  LingeringTunes: "Lingering Tunes",
  AHeartOfDetermination: "A Heart Of Determination",
  TheVeilofHiddenNight: "The Veil of Hidden Night",
  TheEternalLight: "The Eternal Light",
  ASongofHighHeavens: "A Song of High Heavens",
  BravetheWaves: "Brave the Waves",
};

export function getEchoSetLabelByType(type: string): string {
  return echoSetLabelMap[type];
}

type EchoAttack = {
  key: string;
  label: string;
  talent: string;
  type: string;
  element: string;
};
export const echoAttacks: EchoAttack[] = [
  {
    key: "TheVeilofHiddenNightDMG",
    label: "The Veil of Hidden Night DMG",
    talent: "480%",
    type: "Outro",
    element: "Havoc",
  },
];
