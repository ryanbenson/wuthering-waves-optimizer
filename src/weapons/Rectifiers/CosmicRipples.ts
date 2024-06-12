const weaponInfo: WeaponInfo = {
  name: "Cosmic Ripples",
  description:
    "Take hold of the frozen Rectifier, a powerful tool imbued with the energy of the celestial lake. Let it lead you to ultimate knowledge and vanquish all obstacles in your path.",
  type: "Rectifier",
  rarity: 5,
  passiveName: "Stormy Resolution",
  passiveValue:
    "Increases Energy Regen by 12.8%/16%/19.2%/22.4%/25.6%. When hitting a target with Basic Attacks, increases Basic Attack DMG Bonus by 3.2%/4%/4.8%/5.6%/6.4%, stacking up to 5 time(s). This effect lasts for 8s and can be triggered 1 time(s) every 0.5s.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 40,
    modifier: "ATK",
    modifierValue: 0.12,
  },
  "20": {
    attack: 104,
    modifier: "ATK",
    modifierValue: 0.213,
  },
  "40": {
    attack: 198,
    modifier: "ATK",
    modifierValue: 0.306,
  },
  "50": {
    attack: 258,
    modifier: "ATK",
    modifierValue: 0.353,
  },
  "60": {
    attack: 318,
    modifier: "ATK",
    modifierValue: 0.399,
  },
  "70": {
    attack: 379,
    modifier: "ATK",
    modifierValue: 0.446,
  },
  "80": {
    attack: 439,
    modifier: "ATK",
    modifierValue: 0.493,
  },
  "90": {
    attack: 500,
    modifier: "ATK",
    modifierValue: 0.54,
  },
  "20+": {
    attack: 130,
    modifier: "ATK",
    modifierValue: 0.213,
  },
  "40+": {
    attack: 224,
    modifier: "ATK",
    modifierValue: 0.306,
  },
  "50+": {
    attack: 285,
    modifier: "ATK",
    modifierValue: 0.353,
  },
  "60+": {
    attack: 345,
    modifier: "ATK",
    modifierValue: 0.399,
  },
  "70+": {
    attack: 405,
    modifier: "ATK",
    modifierValue: 0.446,
  },
  "80+": {
    attack: 466,
    modifier: "ATK",
    modifierValue: 0.493,
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
