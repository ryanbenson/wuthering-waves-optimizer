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
  name: "Pistols of Voyager",
  description:
    "The Pistols provided by the Pioneer Association for the far walkers, with bright colors, not easy to lose, hard texture, can cope with various extreme environments for a long time, and is very popular among the explorer group.",
  type: "Pistols",
  rarity: 3,
  passiveName: "Long Journey",
  passiveValue:
    "When Resonance Skill is released, restores Resonance Energy by 8/9/10/11/12. This effect can be triggered 1 time(s) every 20s.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 24,
    modifier: "ATK",
    modifierValue: 0.067,
  },
  "20": {
    attack: 62,
    modifier: "ATK",
    modifierValue: 0.119,
  },
  "40": {
    attack: 118,
    modifier: "ATK",
    modifierValue: 0.172,
  },
  "50": {
    attack: 155,
    modifier: "ATK",
    modifierValue: 0.198,
  },
  "60": {
    attack: 191,
    modifier: "ATK",
    modifierValue: 0.224,
  },
  "70": {
    attack: 227,
    modifier: "ATK",
    modifierValue: 0.251,
  },
  "80": {
    attack: 263,
    modifier: "ATK",
    modifierValue: 0.277,
  },
  "90": {
    attack: 300,
    modifier: "ATK",
    modifierValue: 0.303,
  },
  "20+": {
    attack: 78,
    modifier: "ATK",
    modifierValue: 0.119,
  },
  "40+": {
    attack: 134,
    modifier: "ATK",
    modifierValue: 0.172,
  },
  "50+": {
    attack: 171,
    modifier: "ATK",
    modifierValue: 0.198,
  },
  "60+": {
    attack: 207,
    modifier: "ATK",
    modifierValue: 0.224,
  },
  "70+": {
    attack: 243,
    modifier: "ATK",
    modifierValue: 0.251,
  },
  "80+": {
    attack: 279,
    modifier: "ATK",
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

export function getWeapon() {
  return {
    info: weaponInfo,
    data: weaponData,
    getWeaponInfo,
    getWeaponData,
    getWeaponDataByLevel,
  };
}
