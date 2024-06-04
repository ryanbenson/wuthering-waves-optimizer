interface WeaponInfo {
  name: string;
  description: string;
  type: string;
  rarity: number;
  passiveName: string;
  passiveValue: string;
}

interface WeaponLevelData {
  attack: number;
  modifier: string;
  modifierValue: number;
}

interface WeaponData {
  [level: string]: WeaponLevelData;
}

const weaponInfo: WeaponInfo = {
  name: "Autumntrace",
  description:
    "This Broadblade is a ceremonial weapon used by the Jinzhou Magistrate of the Huanglong province at the inauguration ceremony. The golden ginkgo leaf pattern represents that Huanglong should be like ginkgo, although it is left alone in the world, it is still prosperous and long-lasting.",
  type: "Broadblade",
  rarity: 4,
  passiveName: "Edge Direction",
  passiveValue:
    "Increases ATK by 4%/6.2%/8.4%/10.6%/12.8% upon dealing Basic Attack DMG or Heavy Attack DMG, stacking up to 5 time(s). This effect lasts for 7s and can be triggered 1 time(s) every 1s.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 33,
    modifier: "Crit. Rate",
    modifierValue: 0.045,
  },
  "20": {
    attack: 85,
    modifier: "Crit. Rate",
    modifierValue: 0.079,
  },
  "40": {
    attack: 163,
    modifier: "Crit. Rate",
    modifierValue: 0.114,
  },
  "50": {
    attack: 213,
    modifier: "Crit. Rate",
    modifierValue: 0.132,
  },
  "60": {
    attack: 263,
    modifier: "Crit. Rate",
    modifierValue: 0.149,
  },
  "70": {
    attack: 312,
    modifier: "Crit. Rate",
    modifierValue: 0.167,
  },
  "80": {
    attack: 362,
    modifier: "Crit. Rate",
    modifierValue: 0.184,
  },
  "90": {
    attack: 412,
    modifier: "Crit. Rate",
    modifierValue: 0.202,
  },
  "20+": {
    attack: 107,
    modifier: "Crit. Rate",
    modifierValue: 0.079,
  },
  "40+": {
    attack: 185,
    modifier: "Crit. Rate",
    modifierValue: 0.114,
  },
  "50+": {
    attack: 235,
    modifier: "Crit. Rate",
    modifierValue: 0.132,
  },
  "60+": {
    attack: 285,
    modifier: "Crit. Rate",
    modifierValue: 0.149,
  },
  "70+": {
    attack: 334,
    modifier: "Crit. Rate",
    modifierValue: 0.167,
  },
  "80+": {
    attack: 384,
    modifier: "Crit. Rate",
    modifierValue: 0.184,
  },
};

export function getWeaponInfo(): WeaponInfo {
  return weaponInfo;
}

export function getWeaponData(): WeaponData {
  return weaponData;
}

export function getWeaponDataByLevel(level: string): WeaponLevelData {
  return weaponData[level];
}
