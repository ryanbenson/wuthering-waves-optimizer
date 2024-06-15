const weaponInfo: WeaponInfo = {
  name: "Dauntless Evernight",
  description:
    'A weapon designed to commemorate the Midnight Rangers\' preparedness. "Autumn fades in endless nights, ready blades gleam with silent might."',
  type: "Broadblade",
  rarity: 4,
  passiveName: "Battlebound",
  passiveValue:
    "When Intro Skill is released, increases ATK by 8%/10%/12%/14%/16% and DEF by 15%/18.75%/22.5%/26.25%/30%, lasting for 15s.",
  passiveData: [
    {
      key: "ATK",
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
        "When Intro Skill is released, increases ATK by 8%/10%/12%/14%/16% and DEF by 15%/18.75%/22.5%/26.25%/30%, lasting for 15s. (ATK)",
      alwaysEnabled: false,
    },
    {
      key: "DEF",
      hasStacks: false,
      modifier: "DEF",
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
        "When Intro Skill is released, increases ATK by 8%/10%/12%/14%/16% and DEF by 15%/18.75%/22.5%/26.25%/30%, lasting for 15s. (ATK)",
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 27,
    modifier: "DEF",
    modifierValue: 0.136,
  },
  "20": {
    attack: 70,
    modifier: "DEF",
    modifierValue: 0.243,
  },
  "40": {
    attack: 133,
    modifier: "DEF",
    modifierValue: 0.349,
  },
  "50": {
    attack: 174,
    modifier: "DEF",
    modifierValue: 0.402,
  },
  "60": {
    attack: 215,
    modifier: "DEF",
    modifierValue: 0.455,
  },
  "70": {
    attack: 255,
    modifier: "DEF",
    modifierValue: 0.509,
  },
  "80": {
    attack: 296,
    modifier: "DEF",
    modifierValue: 0.562,
  },
  "90": {
    attack: 337,
    modifier: "DEF",
    modifierValue: 0.615,
  },
  "20+": {
    attack: 88,
    modifier: "DEF",
    modifierValue: 0.243,
  },
  "40+": {
    attack: 151,
    modifier: "DEF",
    modifierValue: 0.349,
  },
  "50+": {
    attack: 192,
    modifier: "DEF",
    modifierValue: 0.402,
  },
  "60+": {
    attack: 233,
    modifier: "DEF",
    modifierValue: 0.455,
  },
  "70+": {
    attack: 273,
    modifier: "DEF",
    modifierValue: 0.509,
  },
  "80+": {
    attack: 314,
    modifier: "DEF",
    modifierValue: 0.562,
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
