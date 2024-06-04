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
  name: "Comet Flare",
  description:
    "The Rectifier born from the aerial phenomenon. The forger integrates the feelings of witnessing the alien stars into the weapon, making it look delicate and light, but it can be stable and constant, and it can be responsive.",
  type: "Rectifier",
  rarity: 4,
  passiveName: "Luminous Protection",
  passiveValue:
    "When hitting a target with Basic Attacks or Heavy Attacks, increases Healing Bonus by 3%/3.5%/4%/4.5%/5%, stacking up to 3 time(s). This effect lasts for 8s and can be triggered 1 time(s) every 0.6s.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 33,
    modifier: "HP",
    modifierValue: 0.067,
  },
  "20": {
    attack: 85,
    modifier: "HP",
    modifierValue: 0.119,
  },
  "40": {
    attack: 163,
    modifier: "HP",
    modifierValue: 0.172,
  },
  "50": {
    attack: 213,
    modifier: "HP",
    modifierValue: 0.198,
  },
  "60": {
    attack: 263,
    modifier: "HP",
    modifierValue: 0.224,
  },
  "70": {
    attack: 312,
    modifier: "HP",
    modifierValue: 0.251,
  },
  "80": {
    attack: 362,
    modifier: "HP",
    modifierValue: 0.277,
  },
  "90": {
    attack: 412,
    modifier: "HP",
    modifierValue: 0.303,
  },
  "20+": {
    attack: 107,
    modifier: "HP",
    modifierValue: 0.119,
  },
  "40+": {
    attack: 185,
    modifier: "HP",
    modifierValue: 0.172,
  },
  "50+": {
    attack: 235,
    modifier: "HP",
    modifierValue: 0.198,
  },
  "60+": {
    attack: 285,
    modifier: "HP",
    modifierValue: 0.224,
  },
  "70+": {
    attack: 334,
    modifier: "HP",
    modifierValue: 0.251,
  },
  "80+": {
    attack: 384,
    modifier: "HP",
    modifierValue: 0.277,
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
