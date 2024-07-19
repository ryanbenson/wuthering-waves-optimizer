const weaponInfo: WeaponInfo = {
  name: "Gauntlets of Night",
  description:
    "May victory prevail the lasting night. In addition to the sworn oath of protection, these gauntlets also commemorates the sacrifices of those brave souls.",
  type: "Gauntlets",
  rarity: 3,
  passiveName: "Assemble",
  passiveValue:
    "When Intro Skill is released, increases ATK by 8%/10%/12%/14%/16%, lasting for 10s.",
  passiveData: [
    {
      key: "GauntletsofNightATK",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.08,
        "2": 0.1,
        "3": 0.12,
        "4": 0.14,
        "5": 0.16,
      },
      minStacks: 0,
      maxStacks: 0,
      details:
        "When Intro Skill is released, increases ATK by 8%/10%/12%/14%/16%, lasting for 10s.",
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 26,
    modifier: "ATK",
    modifierValue: 0.054,
  },
  "20": {
    attack: 67,
    modifier: "ATK",
    modifierValue: 0.095,
  },
  "40": {
    attack: 128,
    modifier: "ATK",
    modifierValue: 0.137,
  },
  "50": {
    attack: 168,
    modifier: "ATK",
    modifierValue: 0.158,
  },
  "60": {
    attack: 207,
    modifier: "ATK",
    modifierValue: 0.179,
  },
  "70": {
    attack: 246,
    modifier: "ATK",
    modifierValue: 0.2,
  },
  "80": {
    attack: 285,
    modifier: "ATK",
    modifierValue: 0.221,
  },
  "90": {
    attack: 325,
    modifier: "ATK",
    modifierValue: 0.243,
  },
  "20+": {
    attack: 84,
    modifier: "ATK",
    modifierValue: 0.095,
  },
  "40+": {
    attack: 146,
    modifier: "ATK",
    modifierValue: 0.137,
  },
  "50+": {
    attack: 185,
    modifier: "ATK",
    modifierValue: 0.158,
  },
  "60+": {
    attack: 224,
    modifier: "ATK",
    modifierValue: 0.179,
  },
  "70+": {
    attack: 263,
    modifier: "ATK",
    modifierValue: 0.2,
  },
  "80+": {
    attack: 303,
    modifier: "ATK",
    modifierValue: 0.221,
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
