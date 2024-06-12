const weaponInfo: WeaponInfo = {
  name: "Thunderbolt",
  description:
    "These Pistols are ceremonial weapons used in the inauguration ceremony of the Jinzhou Magistrate of Huanglong. The golden ginkgo leaf pattern represents that Huanglong should be like the ginkgo, although it is left in the world, it is still thriving.",
  type: "Pistols",
  rarity: 4,
  passiveName: "Unstoppable",
  passiveValue:
    "When hitting a target with Basic Attacks or Heavy Attacks, increases Resonance Skill DMG Bonus by 7%/11%/15%/19%/23%, stacking up to 3 time(s). This effect lasts for 10s and can be triggered 1 time(s) every 1s.",
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
