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
  "name": "Abyss Surges",
  "description": "The Gauntlets pulsate with an uncontrollable force, emanating unspeakable anger from the depths of the unknown lake. As you don them, unleash your fury on helpless enemies. Feel its power surge through you.",
  "type": "Gauntlets",
  "rarity": 5,
  "passiveName": "Stormy Resolution",
  "passiveValue": "Increases Energy Regen by 12.8%/16%/19.2%/22.4%/25.6%. When hitting a target with Resonance Skill, increases Basic Attack DMG Bonus by 10%/12.5%/15%/17.5%/20%, lasting for 8s. When hitting a target with Basic Attacks, increases Resonance Skill DMG Bonus by 10%/12.5%/15%/17.5%/20%, lasting for 8s."
};

const weaponData: WeaponData = {
  "1": {
    "attack": 47,
    "modifier": "ATK",
    "modifierValue": 0.081
  },
  "20": {
    "attack": 122,
    "modifier": "ATK",
    "modifierValue": 0.14300000000000002
  },
  "40": {
    "attack": 232,
    "modifier": "ATK",
    "modifierValue": 0.20600000000000002
  },
  "50": {
    "attack": 303,
    "modifier": "ATK",
    "modifierValue": 0.23800000000000002
  },
  "60": {
    "attack": 374,
    "modifier": "ATK",
    "modifierValue": 0.26899999999999996
  },
  "70": {
    "attack": 445,
    "modifier": "ATK",
    "modifierValue": 0.301
  },
  "80": {
    "attack": 516,
    "modifier": "ATK",
    "modifierValue": 0.332
  },
  "90": {
    "attack": 587,
    "modifier": "ATK",
    "modifierValue": 0.364
  },
  "20+": {
    "attack": 153,
    "modifier": "ATK",
    "modifierValue": 0.14300000000000002
  },
  "40+": {
    "attack": 264,
    "modifier": "ATK",
    "modifierValue": 0.20600000000000002
  },
  "50+": {
    "attack": 335,
    "modifier": "ATK",
    "modifierValue": 0.23800000000000002
  },
  "60+": {
    "attack": 406,
    "modifier": "ATK",
    "modifierValue": 0.26899999999999996
  },
  "70+": {
    "attack": 476,
    "modifier": "ATK",
    "modifierValue": 0.301
  },
  "80+": {
    "attack": 547,
    "modifier": "ATK",
    "modifierValue": 0.332
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