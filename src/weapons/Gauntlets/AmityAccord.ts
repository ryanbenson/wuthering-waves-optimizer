const weaponInfo: WeaponInfo = {
  name: "Amity Accord",
  description:
    'A weapon designed to commemorate the Midnight Rangers\' comradeship. "Thin garments yield to icy moons, while armor withstands the chill of stars."',
  type: "Gauntlets",
  rarity: 4,
  passiveName: "Camaraderie",
  passiveValue:
    "When Intro Skill is released, increases Resonance Liberation DMG Bonus by 20%/25%/30%/35%/40%, lasting for 15s.",
  passiveData: [
    {
      key: "AmityAccordResonanceLiberationDMGBonus",
      hasStacks: false,
      modifier: "ResonanceSkillDMGBonus",
      modifierByRefinement: {
        "1": 0.2,
        "2": 0.25,
        "3": 0.3,
        "4": 0.35,
        "5": 0.4,
      },
      minStacks: 0,
      maxStacks: 0,
      details:
        "When Intro Skill is released, increases Resonance Liberation DMG Bonus by 20%/25%/30%/35%/40%, lasting for 15s.",
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
