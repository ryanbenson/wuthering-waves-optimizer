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
  "name": "Originite: Type V",
  "description": "A rectifier model mass-produced in Huanglong. Codename: Chrono.",
  "type": "Rectifier",
  "rarity": 3,
  "passiveName": "Augment",
  "passiveValue": "When Intro Skill is released, restores HP by 5%/6.25%/7.5%/8.75%/10%. This effect can be triggered 1 time(s) every 20s."
};

const weaponData: WeaponData = {
  "1": {
    "attack": 24,
    "modifier": "HP",
    "modifierValue": 0.067
  },
  "20": {
    "attack": 62,
    "modifier": "HP",
    "modifierValue": 0.11900000000000001
  },
  "40": {
    "attack": 118,
    "modifier": "HP",
    "modifierValue": 0.172
  },
  "50": {
    "attack": 155,
    "modifier": "HP",
    "modifierValue": 0.198
  },
  "60": {
    "attack": 191,
    "modifier": "HP",
    "modifierValue": 0.22399999999999998
  },
  "70": {
    "attack": 227,
    "modifier": "HP",
    "modifierValue": 0.251
  },
  "80": {
    "attack": 263,
    "modifier": "HP",
    "modifierValue": 0.27699999999999997
  },
  "90": {
    "attack": 300,
    "modifier": "HP",
    "modifierValue": 0.303
  },
  "20+": {
    "attack": 78,
    "modifier": "HP",
    "modifierValue": 0.11900000000000001
  },
  "40+": {
    "attack": 134,
    "modifier": "HP",
    "modifierValue": 0.172
  },
  "50+": {
    "attack": 171,
    "modifier": "HP",
    "modifierValue": 0.198
  },
  "60+": {
    "attack": 207,
    "modifier": "HP",
    "modifierValue": 0.22399999999999998
  },
  "70+": {
    "attack": 243,
    "modifier": "HP",
    "modifierValue": 0.251
  },
  "80+": {
    "attack": 279,
    "modifier": "HP",
    "modifierValue": 0.27699999999999997
  }
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