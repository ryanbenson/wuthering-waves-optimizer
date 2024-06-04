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
  name: "Guardian Gauntlets",
  description:
    "The first Jinzhou Magistrate, in memory of the mysterious person who helped defend the border and build the city, created the Guardian series under his guidance. Today, it has become an indispensable cornerstone in the development of new weapons.",
  type: "Gauntlets",
  rarity: 3,
  passiveName: "Collective Strength",
  passiveValue:
    "Increases Resonance Liberation DMG Bonus by 12%/15%/18%/21%/24%.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 24,
    modifier: "DEF",
    modifierValue: 0.085,
  },
  "20": {
    attack: 62,
    modifier: "DEF",
    modifierValue: 0.151,
  },
  "40": {
    attack: 118,
    modifier: "DEF",
    modifierValue: 0.218,
  },
  "50": {
    attack: 155,
    modifier: "DEF",
    modifierValue: 0.251,
  },
  "60": {
    attack: 191,
    modifier: "DEF",
    modifierValue: 0.284,
  },
  "70": {
    attack: 227,
    modifier: "DEF",
    modifierValue: 0.318,
  },
  "80": {
    attack: 263,
    modifier: "DEF",
    modifierValue: 0.351,
  },
  "90": {
    attack: 300,
    modifier: "DEF",
    modifierValue: 0.384,
  },
  "20+": {
    attack: 78,
    modifier: "DEF",
    modifierValue: 0.151,
  },
  "40+": {
    attack: 134,
    modifier: "DEF",
    modifierValue: 0.218,
  },
  "50+": {
    attack: 171,
    modifier: "DEF",
    modifierValue: 0.251,
  },
  "60+": {
    attack: 207,
    modifier: "DEF",
    modifierValue: 0.284,
  },
  "70+": {
    attack: 243,
    modifier: "DEF",
    modifierValue: 0.318,
  },
  "80+": {
    attack: 279,
    modifier: "DEF",
    modifierValue: 0.35100000000000003,
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
