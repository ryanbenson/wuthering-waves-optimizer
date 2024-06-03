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
  "name": "Guardian Rectifier",
  "description": "The first Jinzhou Magistrate, in memory of the mysterious person who helped defend the border and build the city, created the Guardian series under his guidance. Today, it has become an indispensable cornerstone for the development of new weapons.",
  "type": "Rectifier",
  "rarity": 3,
  "passiveName": "Companionship",
  "passiveValue": "Increases Basic Attack and Heavy Attack DMG Bonus by 12%/15%/18%/21%/24%."
};

const weaponData: WeaponData = {
  "1": {
    "attack": 26,
    "modifier": "ATK",
    "modifierValue": 0.054000000000000006
  },
  "20": {
    "attack": 67,
    "modifier": "ATK",
    "modifierValue": 0.095
  },
  "40": {
    "attack": 128,
    "modifier": "ATK",
    "modifierValue": 0.13699999999999998
  },
  "50": {
    "attack": 168,
    "modifier": "ATK",
    "modifierValue": 0.158
  },
  "60": {
    "attack": 207,
    "modifier": "ATK",
    "modifierValue": 0.179
  },
  "70": {
    "attack": 246,
    "modifier": "ATK",
    "modifierValue": 0.2
  },
  "80": {
    "attack": 285,
    "modifier": "ATK",
    "modifierValue": 0.221
  },
  "90": {
    "attack": 325,
    "modifier": "ATK",
    "modifierValue": 0.243
  },
  "20+": {
    "attack": 84,
    "modifier": "ATK",
    "modifierValue": 0.095
  },
  "40+": {
    "attack": 146,
    "modifier": "ATK",
    "modifierValue": 0.13699999999999998
  },
  "50+": {
    "attack": 185,
    "modifier": "ATK",
    "modifierValue": 0.158
  },
  "60+": {
    "attack": 224,
    "modifier": "ATK",
    "modifierValue": 0.179
  },
  "70+": {
    "attack": 263,
    "modifier": "ATK",
    "modifierValue": 0.2
  },
  "80+": {
    "attack": 303,
    "modifier": "ATK",
    "modifierValue": 0.221
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