const weaponInfo: WeaponInfo = {
  name: "Pistols#26",
  description:
    "The Huaxu Academy has independently improved and developed the first highly practical high-performance Pistols based on the previous source energy weapons, representing the Academy's meticulous research and pointing directly to the profound.",
  type: "Pistols",
  rarity: 4,
  passiveName: "Omniscient",
  passiveValue:
    "When the Resonator takes no damage, increases ATK by 6%/7.5%/9%/10.5%/12% every 5s, stacking up to 2 time(s). This effect lasts for 8s. When the Resonator takes damage, reduces the number of stacks by 1 and restores their HP by 5%/6.25%/7.5%/8.75%/10%.",
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
