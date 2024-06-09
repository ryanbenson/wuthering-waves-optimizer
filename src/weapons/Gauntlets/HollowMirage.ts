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
  name: "Hollow Mirage",
  description:
    "The Gauntlets born from the strange phenomenon in the sky. The blacksmith infused the feelings of witnessing the strange star into the weapon, making it look hollow and light, but it can exert a tremendous momentum while protecting the user.",
  type: "Gauntlets",
  rarity: 4,
  passiveName: "Celestial Blessing",
  passiveValue:
    "When Resonance Liberation is released, grants 3 stack(s) of Iron Armor. Each stack increases ATK and DEF by 3%/3.5%/4%/4.5%/5%, stacking up to 3 time(s). When the Resonator takes damage, reduces the number of stacks by 1.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 33,
    modifier: "ATK",
    modifierValue: 0.067,
  },
  "20": {
    attack: 85,
    modifier: "ATK",
    modifierValue: 0.119,
  },
  "40": {
    attack: 163,
    modifier: "ATK",
    modifierValue: 0.172,
  },
  "50": {
    attack: 213,
    modifier: "ATK",
    modifierValue: 0.198,
  },
  "60": {
    attack: 263,
    modifier: "ATK",
    modifierValue: 0.224,
  },
  "70": {
    attack: 312,
    modifier: "ATK",
    modifierValue: 0.251,
  },
  "80": {
    attack: 362,
    modifier: "ATK",
    modifierValue: 0.277,
  },
  "90": {
    attack: 412,
    modifier: "ATK",
    modifierValue: 0.303,
  },
  "20+": {
    attack: 107,
    modifier: "ATK",
    modifierValue: 0.11900000000000001,
  },
  "40+": {
    attack: 185,
    modifier: "ATK",
    modifierValue: 0.172,
  },
  "50+": {
    attack: 235,
    modifier: "ATK",
    modifierValue: 0.198,
  },
  "60+": {
    attack: 285,
    modifier: "ATK",
    modifierValue: 0.22399999999999998,
  },
  "70+": {
    attack: 334,
    modifier: "ATK",
    modifierValue: 0.251,
  },
  "80+": {
    attack: 384,
    modifier: "ATK",
    modifierValue: 0.27699999999999997,
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
