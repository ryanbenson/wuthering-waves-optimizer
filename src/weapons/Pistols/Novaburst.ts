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
  "name": "Novaburst",
  "description": "Pistols born from the strange phenomena in the sky. The forger infused the weapon with the feelings from witnessing the strange star, making it look hollow and light, yet extremely stable, with the power of thunder when it fires.",
  "type": "Pistols",
  "rarity": 4,
  "passiveName": "Ever-changing",
  "passiveValue": "When the Resonator dashes or dodges, increases ATK by 4%/5%/6%/7%/8%, stacking up to 3 time(s). This effect lasts for 8s."
};

const weaponData: WeaponData = {
  "1": {
    "attack": 33,
    "modifier": "ATK",
    "modifierValue": 0.067
  },
  "20": {
    "attack": 85,
    "modifier": "ATK",
    "modifierValue": 0.11900000000000001
  },
  "40": {
    "attack": 163,
    "modifier": "ATK",
    "modifierValue": 0.172
  },
  "50": {
    "attack": 213,
    "modifier": "ATK",
    "modifierValue": 0.198
  },
  "60": {
    "attack": 263,
    "modifier": "ATK",
    "modifierValue": 0.22399999999999998
  },
  "70": {
    "attack": 312,
    "modifier": "ATK",
    "modifierValue": 0.251
  },
  "80": {
    "attack": 362,
    "modifier": "ATK",
    "modifierValue": 0.27699999999999997
  },
  "90": {
    "attack": 412,
    "modifier": "ATK",
    "modifierValue": 0.303
  },
  "20+": {
    "attack": 107,
    "modifier": "ATK",
    "modifierValue": 0.11900000000000001
  },
  "40+": {
    "attack": 185,
    "modifier": "ATK",
    "modifierValue": 0.172
  },
  "50+": {
    "attack": 235,
    "modifier": "ATK",
    "modifierValue": 0.198
  },
  "60+": {
    "attack": 285,
    "modifier": "ATK",
    "modifierValue": 0.22399999999999998
  },
  "70+": {
    "attack": 334,
    "modifier": "ATK",
    "modifierValue": 0.251
  },
  "80+": {
    "attack": 384,
    "modifier": "ATK",
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