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
  name: "Gauntlets of Voyager",
  description:
    "The Gauntlets provided by the Pioneer Association for the far walkers, with bright colors, not easy to lose, hard texture, can cope with various extreme environments for a long time, and are very popular among the explorer group.",
  type: "Gauntlets",
  rarity: 3,
  passiveName: "Crusade",
  passiveValue:
    "When Resonance Skill is released, restores Resonance Energy by 8/9/10/11/12. This effect can be triggered 1 time(s) every 20s.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 26,
    modifier: "DEF",
    modifierValue: 0.068,
  },
  "20": {
    attack: 67,
    modifier: "DEF",
    modifierValue: 0.121,
  },
  "40": {
    attack: 128,
    modifier: "DEF",
    modifierValue: 0.174,
  },
  "50": {
    attack: 168,
    modifier: "DEF",
    modifierValue: 0.201,
  },
  "60": {
    attack: 207,
    modifier: "DEF",
    modifierValue: 0.227,
  },
  "70": {
    attack: 246,
    modifier: "DEF",
    modifierValue: 0.254,
  },
  "80": {
    attack: 285,
    modifier: "DEF",
    modifierValue: 0.281,
  },
  "90": {
    attack: 325,
    modifier: "DEF",
    modifierValue: 0.307,
  },
  "20+": {
    attack: 84,
    modifier: "DEF",
    modifierValue: 0.121,
  },
  "40+": {
    attack: 146,
    modifier: "DEF",
    modifierValue: 0.174,
  },
  "50+": {
    attack: 185,
    modifier: "DEF",
    modifierValue: 0.201,
  },
  "60+": {
    attack: 224,
    modifier: "DEF",
    modifierValue: 0.227,
  },
  "70+": {
    attack: 263,
    modifier: "DEF",
    modifierValue: 0.254,
  },
  "80+": {
    attack: 303,
    modifier: "DEF",
    modifierValue: 0.281,
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
