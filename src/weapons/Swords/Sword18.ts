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
  name: "Sword#18",
  description:
    "Improved version of a mass-produced sword model developed in Huanglong. With its sleek blade and minimalist design, this sword is exclusively crafted for the skilled hands of seasoned warriors.",
  type: "Sword",
  rarity: 4,
  passiveName: "Daybreak",
  passiveValue:
    "When Equipped Resonator's HP drops below 40%/50%/60%/70%/80%, increases Heavy Attack DMG by 18%/22.5%/27%/31.5%/36% and restores HP by 5%/6.25%/7.5%/8.75%/10% upon dealing Heavy Attack DMG. This effect can be triggered 1 time(s) every 8s.",
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
