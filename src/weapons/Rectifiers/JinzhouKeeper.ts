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
  name: "Jinzhou Keeper",
  description:
    "A weapon designed to commemorate the Midnight Rangers' vigilant protection for Jinzhou. \"Cast your gaze towards the north, where the city's silhouette fades, its gates veiled by the tranquil rain.\"",
  type: "Rectifier",
  rarity: 4,
  passiveName: "Guardian",
  passiveValue:
    "When Intro Skill is released, increases the caster's ATK by 8%/10%/12%/14%/16% and HP by 10%/12.5%/15%/17.5%/20%, lasting for 15s.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 31,
    modifier: "ATK",
    modifierValue: 0.081,
  },
  "20": {
    attack: 80,
    modifier: "ATK",
    modifierValue: 0.143,
  },
  "40": {
    attack: 153,
    modifier: "ATK",
    modifierValue: 0.206,
  },
  "50": {
    attack: 200,
    modifier: "ATK",
    modifierValue: 0.238,
  },
  "60": {
    attack: 247,
    modifier: "ATK",
    modifierValue: 0.269,
  },
  "70": {
    attack: 293,
    modifier: "ATK",
    modifierValue: 0.301,
  },
  "80": {
    attack: 340,
    modifier: "ATK",
    modifierValue: 0.332,
  },
  "90": {
    attack: 387,
    modifier: "ATK",
    modifierValue: 0.364,
  },
  "20+": {
    attack: 101,
    modifier: "ATK",
    modifierValue: 0.143,
  },
  "40+": {
    attack: 174,
    modifier: "ATK",
    modifierValue: 0.206,
  },
  "50+": {
    attack: 221,
    modifier: "ATK",
    modifierValue: 0.238,
  },
  "60+": {
    attack: 267,
    modifier: "ATK",
    modifierValue: 0.269,
  },
  "70+": {
    attack: 314,
    modifier: "ATK",
    modifierValue: 0.301,
  },
  "80+": {
    attack: 361,
    modifier: "ATK",
    modifierValue: 0.332,
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
