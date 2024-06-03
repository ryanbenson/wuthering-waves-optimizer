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
  "name": "Originite: Type IV",
  "description": "To develop new Tacetite weapons, the Huaxu Academy has built a test-type Gauntlets for the purpose of technical verification. In addition to the impressive weapon performance, the biggest feature is that it can enhance the physical activity of the Resonator to heal wounds through attacks.",
  "type": "Gauntlets",
  "rarity": 3,
  "passiveName": "Rejuvinate",
  "passiveValue": "When hitting a target with Basic Attacks, restores HP by 0.5%/0.65%/0.8%/0.95%/1.1%. This effect can be triggered 1 time(s) every 3s."
};

const weaponData: WeaponData = {
  "1": {
    "attack": 24,
    "modifier": "Crit. DMG",
    "modifierValue": 0.09
  },
  "20": {
    "attack": 62,
    "modifier": "Crit. DMG",
    "modifierValue": 0.159
  },
  "40": {
    "attack": 118,
    "modifier": "Crit. DMG",
    "modifierValue": 0.22899999999999998
  },
  "50": {
    "attack": 155,
    "modifier": "Crit. DMG",
    "modifierValue": 0.264
  },
  "60": {
    "attack": 191,
    "modifier": "Crit. DMG",
    "modifierValue": 0.299
  },
  "70": {
    "attack": 227,
    "modifier": "Crit. DMG",
    "modifierValue": 0.33399999999999996
  },
  "80": {
    "attack": 263,
    "modifier": "Crit. DMG",
    "modifierValue": 0.369
  },
  "90": {
    "attack": 300,
    "modifier": "Crit. DMG",
    "modifierValue": 0.405
  },
  "20+": {
    "attack": 78,
    "modifier": "Crit. DMG",
    "modifierValue": 0.159
  },
  "40+": {
    "attack": 134,
    "modifier": "Crit. DMG",
    "modifierValue": 0.22899999999999998
  },
  "50+": {
    "attack": 171,
    "modifier": "Crit. DMG",
    "modifierValue": 0.264
  },
  "60+": {
    "attack": 207,
    "modifier": "Crit. DMG",
    "modifierValue": 0.299
  },
  "70+": {
    "attack": 243,
    "modifier": "Crit. DMG",
    "modifierValue": 0.33399999999999996
  },
  "80+": {
    "attack": 279,
    "modifier": "Crit. DMG",
    "modifierValue": 0.369
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