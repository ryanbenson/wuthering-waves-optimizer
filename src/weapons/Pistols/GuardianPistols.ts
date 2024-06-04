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
  name: "Guardian Pistols",
  description:
    "The first Jinzhou Magistrate, in memory of the mysterious person who helped defend the border and build the city, created the Guardian series under his guidance. Now, it has become the cornerstone of the development of new weapons.",
  type: "Pistols",
  rarity: 3,
  passiveName: "Unity",
  passiveValue: "Increases Resonance Skill DMG Bonus by 12%/15%/18%/21%/24%.",
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
