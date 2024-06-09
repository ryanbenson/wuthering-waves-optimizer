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
  name: "Stringmaster",
  description:
    "As the puppet palm unfurls, deadly strings are unleashed with a menacing hum. The air crackles with power, immobilizing any foes caught in its grasp. The rapid bolts of electricity leave unhealable scars on their victims.",
  type: "Rectifier",
  rarity: 5,
  passiveName: "Electric Amplification",
  passiveValue:
    "Increases the DMG Bonus of all Resonance Attributes by 12%/15%/18%/21%/24%. When Resonance Skill hits a target, increases ATK by 12%/15%/18%/21%/24%, stacking up to 2. When the equipped character is not on the field, increases their ATK by an additional 12%/15%/18%/21%/24%.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 40,
    modifier: "Crit. Rate",
    modifierValue: 0.08,
  },
  "20": {
    attack: 104,
    modifier: "Crit. Rate",
    modifierValue: 0.142,
  },
  "40": {
    attack: 198,
    modifier: "Crit. Rate",
    modifierValue: 0.204,
  },
  "50": {
    attack: 258,
    modifier: "Crit. Rate",
    modifierValue: 0.235,
  },
  "60": {
    attack: 318,
    modifier: "Crit. Rate",
    modifierValue: 0.266,
  },
  "70": {
    attack: 379,
    modifier: "Crit. Rate",
    modifierValue: 0.297,
  },
  "80": {
    attack: 439,
    modifier: "Crit. Rate",
    modifierValue: 0.328,
  },
  "90": {
    attack: 500,
    modifier: "Crit. Rate",
    modifierValue: 0.36,
  },
  "20+": {
    attack: 130,
    modifier: "Crit. Rate",
    modifierValue: 0.142,
  },
  "40+": {
    attack: 224,
    modifier: "Crit. Rate",
    modifierValue: 0.204,
  },
  "50+": {
    attack: 285,
    modifier: "Crit. Rate",
    modifierValue: 0.235,
  },
  "60+": {
    attack: 345,
    modifier: "Crit. Rate",
    modifierValue: 0.266,
  },
  "70+": {
    attack: 405,
    modifier: "Crit. Rate",
    modifierValue: 0.297,
  },
  "80+": {
    attack: 466,
    modifier: "Crit. Rate",
    modifierValue: 0.32799999999999996,
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
