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
  name: "Rectifier of Voyager",
  description:
    "The Rectifier provided by the Pioneer Association for the explorers, with bright colors, not easy to lose, hard texture, can cope with various extreme environments for a long time, is very popular among the explorers.",
  type: "Rectifier",
  rarity: 3,
  passiveName: "Crusade",
  passiveValue:
    "When Resonance Skill is released, restores Resonance Energy by 8/9/10/11/12. This effect can be triggered 1 time(s) every 20s.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 24,
    modifier: "Energy Regen",
    modifierValue: 0.072,
  },
  "20": {
    attack: 62,
    modifier: "Energy Regen",
    modifierValue: 0.127,
  },
  "40": {
    attack: 118,
    modifier: "Energy Regen",
    modifierValue: 0.183,
  },
  "50": {
    attack: 155,
    modifier: "Energy Regen",
    modifierValue: 0.211,
  },
  "60": {
    attack: 191,
    modifier: "Energy Regen",
    modifierValue: 0.239,
  },
  "70": {
    attack: 227,
    modifier: "Energy Regen",
    modifierValue: 0.267,
  },
  "80": {
    attack: 263,
    modifier: "Energy Regen",
    modifierValue: 0.295,
  },
  "90": {
    attack: 300,
    modifier: "Energy Regen",
    modifierValue: 0.323,
  },
  "20+": {
    attack: 78,
    modifier: "Energy Regen",
    modifierValue: 0.127,
  },
  "40+": {
    attack: 134,
    modifier: "Energy Regen",
    modifierValue: 0.183,
  },
  "50+": {
    attack: 171,
    modifier: "Energy Regen",
    modifierValue: 0.211,
  },
  "60+": {
    attack: 207,
    modifier: "Energy Regen",
    modifierValue: 0.239,
  },
  "70+": {
    attack: 243,
    modifier: "Energy Regen",
    modifierValue: 0.267,
  },
  "80+": {
    attack: 279,
    modifier: "Energy Regen",
    modifierValue: 0.295,
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
