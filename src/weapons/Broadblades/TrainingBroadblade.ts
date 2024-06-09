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
  name: "Training Broadblade",
  description:
    "This broadblade is designed specifically for training and teaching, offering only the basic features.",
  type: "Broadblade",
  rarity: 1,
  passiveName: "Persevere",
  passiveValue: "Increases ATK by 4%/5%/6%/7%/8%.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 20,
    modifier: "ATK",
    modifierValue: 0.025,
  },
  "20": {
    attack: 52,
    modifier: "ATK",
    modifierValue: 0.045,
  },
  "40": {
    attack: 99,
    modifier: "ATK",
    modifierValue: 0.065,
  },
  "50": {
    attack: 129,
    modifier: "ATK",
    modifierValue: 0.075,
  },
  "60": {
    attack: 159,
    modifier: "ATK",
    modifierValue: 0.084,
  },
  "70": {
    attack: 189,
    modifier: "ATK",
    modifierValue: 0.094,
  },
  "20+": {
    attack: 65,
    modifier: "ATK",
    modifierValue: 0.045,
  },
  "40+": {
    attack: 112,
    modifier: "ATK",
    modifierValue: 0.065,
  },
  "50+": {
    attack: 142,
    modifier: "ATK",
    modifierValue: 0.075,
  },
  "60+": {
    attack: 172,
    modifier: "ATK",
    modifierValue: 0.084,
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

export function getWeapon() {
  return {
    info: weaponInfo,
    data: weaponData,
    getWeaponInfo,
    getWeaponData,
    getWeaponDataByLevel,
  };
}
