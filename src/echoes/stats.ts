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

type StatLevel = Record<string, Record<string, number>>;

type StatsTable = Record<number, StatLevel>;

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
  ATK_FLAT: [30, 40, 50, 60],
  HP: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  HP_FLAT: [320, 360, 390, 430, 470, 510, 540, 580],
  DEF: [8.1, 9, 10, 10.9, 11.8, 12.8, 13.8, 14.7],
  DEF_FLAT: [40, 50, 60, 70],
  BasicAttackDMGBonus: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  HeavyAttackDMGBonus: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  ResonanceSkillDMGBonus: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  ResonanceLiberationDMGBonus: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  EnergyRegen: [6.8, 7.6, 8.4, 9.2, 10, 10.8, 11.6, 12.4],
};

type subStatsTableRollValue = {
  [stat: string]: Record<string, number>;
};
export const subStatsTableRollValue: subStatsTableRollValue = {
  CritRate: {
    "6.3": 30,
    "6.9": 40,
    "7.5": 50,
    "8.1": 60,
    "8.7": 70,
    "9.3": 80,
    "9.9": 90,
    "10.5": 100,
  },
  CritDMG: {
    "12.6": 30,
    "13.8": 40,
    "15": 50,
    "16.2": 60,
    "17.4": 70,
    "18.6": 80,
    "19.8": 90,
    "21": 100,
  },
  ATK: {
    "6.4": 30,
    "7.1": 40,
    "7.9": 50,
    "8.6": 60,
    "9.4": 70,
    "10.1": 80,
    "10.9": 90,
    "11.6": 100,
  },
  ATK_FLAT: {
    "30": 40,
    "40": 60,
    "50": 80,
    "60": 100,
  },
  HP: {
    "6.4": 30,
    "7.1": 40,
    "7.9": 50,
    "8.6": 60,
    "9.4": 70,
    "10.1": 80,
    "10.9": 90,
    "11.6": 100,
  },
  HP_FLAT: {
    "320": 30,
    "360": 40,
    "390": 50,
    "430": 60,
    "470": 70,
    "510": 80,
    "540": 90,
    "580": 100,
  },
  DEF: {
    "8.1": 30,
    "9": 40,
    "10": 50,
    "10.9": 60,
    "11.8": 70,
    "12.8": 80,
    "13.8": 90,
    "14.7": 100,
  },
  DEF_FLAT: {
    "40": 40,
    "50": 60,
    "60": 80,
    "70": 100,
  },
  BasicAttackDMGBonus: {
    "6.4": 30,
    "7.1": 40,
    "7.9": 50,
    "8.6": 60,
    "9.4": 70,
    "10.1": 80,
    "10.9": 90,
    "11.6": 100,
  },
  HeavyAttackDMGBonus: {
    "6.4": 30,
    "7.1": 40,
    "7.9": 50,
    "8.6": 60,
    "9.4": 70,
    "10.1": 80,
    "10.9": 90,
    "11.6": 100,
  },
  ResonanceSkillDMGBonus: {
    "6.4": 30,
    "7.1": 40,
    "7.9": 50,
    "8.6": 60,
    "9.4": 70,
    "10.1": 80,
    "10.9": 90,
    "11.6": 100,
  },
  ResonanceLiberationDMGBonus: {
    "6.4": 30,
    "7.1": 40,
    "7.9": 50,
    "8.6": 60,
    "9.4": 70,
    "10.1": 80,
    "10.9": 90,
    "11.6": 100,
  },
  EnergyRegen: {
    "6.8": 30,
    "7.6": 40,
    "8.4": 50,
    "9.2": 60,
    "10": 70,
    "10.8": 80,
    "11.6": 90,
    "12.4": 100,
  },
};

export function getSubstatRollValue(stat: string, statValue: string): number {
  const substat = subStatsTableRollValue[stat];
  return substat?.[statValue] ?? 0;
}

type echoRollValueData = {
  [stat: string]: string;
};
export function getRollValue(echoData: echoRollValueData): number {
  const echoStats = Object.entries(echoData);
  let totalRollValue = 0;
  echoStats.forEach((echoStat) => {
    const [stat, statValue] = echoStat;
    const statRollValue = getSubstatRollValue(stat, statValue);
    totalRollValue += statRollValue;
  });
  return totalRollValue;
}

type FlatBonusesByRankByTypeData = Record<number, number>;

type FlatBonusesByRankByType = Record<number, FlatBonusesByRankByTypeData>;

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
  EchoDMGBonus: "Echo DMG Bonus",
  HealingBonus: "Healing Bonus",
};
export const verboseStatLabelMap: Record<string, string> = {
  ATK: "ATK",
  HP: "HP",
  DEF: "DEF",
  "Energy Regen": "EnergyRegen",
  "Crit. Rate": "CritRate",
  "Crit. DMG": "CritDMG",
  "Basic Attack DMG Bonus": "BasicAttackDMGBonus",
  "Heavy Attack DMG Bonus": "HeavyAttackDMGBonus",
  "Resonance Skill DMG Bonus": "ResonanceSkillDMGBonus",
  "Resonance Skill DMG": "ResonanceSkillDMGBonus",
  "Resonance Skill": "ResonanceSkillDMGBonus",
  "Resonance Liberation DMG Bonus": "ResonanceLiberationDMGBonus",
  "Resonance Liberation DMG": "ResonanceLiberationDMGBonus",
  "Resonance Liberation": "ResonanceLiberationDMGBonus",
  "Glacio DMG Bonus": "Glacio",
  "Fusion DMG Bonus": "Fusion",
  "Electro DMG Bonus": "Electro",
  "Aero DMG Bonus": "Aero",
  "Spectro DMG Bonus": "Spectro",
  "Havoc DMG Bonus": "Havoc",
  "Echo DMG Bonus": "EchoDMGBonus",
  "Healing Bonus": "HealingBonus",
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
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/FreezingFrost.webp",
  MoltenRift:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/MoltenRift.webp",
  VoidThunder:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/VoidThunder.webp",
  SierraGale:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/SierraGale.webp",
  CelestialLight:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/CelestialLight.webp",
  SunSinkingEclipse:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/SunSinkingEclipse.webp",
  RejuvenatingGlow:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/RejuvenatingGlow.webp",
  MoonlitClouds:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/MoonlitClouds.webp",
  LingeringTunes:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/LingeringTunes.webp",
  FrostyResolve:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/FrostyResolve.webp",
  MidnightVeil:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/MidnightVeil.webp",
  EternalRadiance:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/EternalRadiance.webp",
  EmpyreanAnthem:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/EmpyreanAnthem.webp",
  TidebreakingCourage:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/TidebreakingCourage.webp",
  GustsofWelkin:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/GustsofWelkin.webp",
  WindwardPilgrimage:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/WindwardPilgrimage.webp",
  FlamingClawprint:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/FlamingClawprint.webp",
  DreamoftheLost:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/DreamoftheLost.webp",
  CrownofValor:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/CrownofValor.webp",
  LawofHarmony:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/LawofHarmony.webp",
  FlamewingsShadow:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/FlamewingsShadow.webp",
  ThreadofSeveredFate:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/ThreadofSeveredFate.webp",
  PactofNeonlightLeap:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/PactofNeonlightLeap.webp",
  RiteofGildedRevelation:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/RiteofGildedRevelation.webp",
  HaloofStarryRadiance:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/HaloofStarryRadiance.webp",
  TrailblazingStar:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/TrailblazingStar.webp",
  SoundofTrueName:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/SoundofTrueName.webp",
  ChromaticFoam:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/ChromaticFoam.webp",
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
  FrostyResolve: "Frosty Resolve",
  MidnightVeil: "Midnight Veil",
  EternalRadiance: "Eternal Radiance",
  EmpyreanAnthem: "Empyrean Anthem",
  TidebreakingCourage: "Tidebreaking Courage",
  GustsofWelkin: "Gusts of Welkin",
  WindwardPilgrimage: "Windward Pilgrimage",
  FlamingClawprint: "Flaming Clawprint",
  DreamoftheLost: "Dream of the Lost",
  CrownofValor: "Crown of Valor",
  LawofHarmony: "Law of Harmony",
  FlamewingsShadow: "Flamewing's Shadow",
  ThreadofSeveredFate: "Thread of Severed Fate",
  PactofNeonlightLeap: "Pact of Neonlight Leap",
  RiteofGildedRevelation: "Rite of Gilded Revelation",
  HaloofStarryRadiance: "Halo of Starry Radiance",
  TrailblazingStar: "Trailblazing Star",
  SoundofTrueName: "Sound of True Name",
  ChromaticFoam: "Chromatic Foam",
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
export const echoSetAttacks: EchoAttack[] = [
  {
    key: "MidnightVeilDMG",
    label: "Midnight Veil DMG",
    talent: "480%",
    type: "Outro",
    element: "Havoc",
  },
];

export type EchoObject = {
  echoId: string; // random string
  echo: string; // name of the echo. I use basically the name that's alpha-numeric e.g. AbyssalGladius
  echoSet: string; // name of the echo set, similar: MidnightVeil
  echoSubStatsType1: string; // substat (e.g. CritDMG, ATK, ATK_FLAT)
  echoSubStatsType2: string; // substat (e.g. CritDMG, ATK, ATK_FLAT)
  echoSubStatsType3: string; // substat (e.g. CritDMG, ATK, ATK_FLAT)
  echoSubStatsType4: string; // substat (e.g. CritDMG, ATK, ATK_FLAT)
  echoSubStatsType5: string; // substat (e.g. CritDMG, ATK, ATK_FLAT)
  echoSubStatsValue1: number; // e.g. 7.5, not in decimals
  echoSubStatsValue2: number; // e.g. 7.5, not in decimals
  echoSubStatsValue3: number; // e.g. 7.5, not in decimals
  echoSubStatsValue4: number; // e.g. 7.5, not in decimals
  echoSubStatsValue5: number; // e.g. 7.5, not in decimals
  rank: number; // rarity of the echo (1-5)
  stat: string; // main stat of the echo (e.g. Fusion, CritDMG, HP)
  type: number | string; // cost of the echo (1-4)
};

export function getEchoStats(echo: EchoObject): Record<string, number> {
  const stats: Record<string, number> = {};

  // add in the base stats (flat HP and flat ATK) that's guaranteed
  if (echo.type && echo.rank) {
    let stat = Number(echo.type) === 1 ? "HP_FLAT" : "ATK_FLAT";
    let statValue = flatBonusesByRankByType[Number(echo.type)][echo.rank];
    stats[stat] = (stats[stat] || 0) + statValue;
  }

  if (echo.type && echo.rank && echo.stat) {
    const max = statsTable?.[Number(echo.type)]?.[echo.stat]?.[echo.rank];
    if (max) {
      stats[echo.stat] = (stats[echo.stat] || 0) + max;
    }
  }

  if (echo.echoSubStatsType1 && echo.echoSubStatsValue1) {
    stats[echo.echoSubStatsType1] =
      (stats[echo.echoSubStatsType1] || 0) + echo.echoSubStatsValue1;
  }

  if (echo.echoSubStatsType2 && echo.echoSubStatsValue2) {
    stats[echo.echoSubStatsType2] =
      (stats[echo.echoSubStatsType2] || 0) + echo.echoSubStatsValue2;
  }

  if (echo.echoSubStatsType3 && echo.echoSubStatsValue3) {
    stats[echo.echoSubStatsType3] =
      (stats[echo.echoSubStatsType3] || 0) + echo.echoSubStatsValue3;
  }

  if (echo.echoSubStatsType4 && echo.echoSubStatsValue4) {
    stats[echo.echoSubStatsType4] =
      (stats[echo.echoSubStatsType4] || 0) + echo.echoSubStatsValue4;
  }

  if (echo.echoSubStatsType5 && echo.echoSubStatsValue5) {
    stats[echo.echoSubStatsType5] =
      (stats[echo.echoSubStatsType5] || 0) + echo.echoSubStatsValue5;
  }

  return stats;
}

export function getCombinedEchoStats(
  echoes: EchoObject[],
): Record<string, number> {
  const combinedStats: Record<string, number> = {};

  for (let i = 0; i < echoes.length; i++) {
    const echo = echoes[i];
    const echoStats = getEchoStats(echo);

    // Use Object.keys for slightly better performance than Object.entries
    const statTypes = Object.keys(echoStats);
    for (let j = 0; j < statTypes.length; j++) {
      const statType = statTypes[j];
      const statValue = echoStats[statType];
      combinedStats[statType] = (combinedStats[statType] || 0) + statValue;
    }
  }

  return combinedStats;
}
