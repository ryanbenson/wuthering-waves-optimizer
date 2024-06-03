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
  "name": "Guardian Sword",
  "description": "The first Jinzhou Magistrate, in memory of the mysterious person who helped defend the border and build the city, created the Guardian series under his guidance. Today, it has become an indispensable cornerstone for the development of new weapons.",
  "type": "Sword",
  "rarity": 3,
  "passiveName": "Unified",
  "passiveValue": "Increases Resonance Skill DMG by 12%/15%/18%/21%/24%."
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