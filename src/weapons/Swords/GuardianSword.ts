const weaponInfo: WeaponInfo = {
  name: "Guardian Sword",
  description:
    "The first Jinzhou Magistrate, in memory of the mysterious person who helped defend the border and build the city, created the Guardian series under his guidance. Today, it has become an indispensable cornerstone for the development of new weapons.",
  type: "Sword",
  rarity: 3,
  passiveName: "Unified",
  passiveValue: "Increases Resonance Skill DMG by 12%/15%/18%/21%/24%.",
  passiveData: [
    {
      key: "ResonanceSkillDMGBonus",
      hasStacks: false,
      modifier: "ResonanceSkillDMGBonus",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details: "Increases Resonance Skill DMG by 12%/15%/18%/21%/24%.",
      alwaysEnabled: true,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 24,
    modifier: "HP",
    modifierValue: 0.067,
  },
  "20": {
    attack: 62,
    modifier: "HP",
    modifierValue: 0.119,
  },
  "40": {
    attack: 118,
    modifier: "HP",
    modifierValue: 0.172,
  },
  "50": {
    attack: 155,
    modifier: "HP",
    modifierValue: 0.198,
  },
  "60": {
    attack: 191,
    modifier: "HP",
    modifierValue: 0.224,
  },
  "70": {
    attack: 227,
    modifier: "HP",
    modifierValue: 0.251,
  },
  "80": {
    attack: 263,
    modifier: "HP",
    modifierValue: 0.277,
  },
  "90": {
    attack: 300,
    modifier: "HP",
    modifierValue: 0.303,
  },
  "20+": {
    attack: 78,
    modifier: "HP",
    modifierValue: 0.119,
  },
  "40+": {
    attack: 134,
    modifier: "HP",
    modifierValue: 0.172,
  },
  "50+": {
    attack: 171,
    modifier: "HP",
    modifierValue: 0.198,
  },
  "60+": {
    attack: 207,
    modifier: "HP",
    modifierValue: 0.224,
  },
  "70+": {
    attack: 243,
    modifier: "HP",
    modifierValue: 0.251,
  },
  "80+": {
    attack: 279,
    modifier: "HP",
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

export function getWeapon() {
  return {
    info: weaponInfo,
    data: weaponData,
    getWeaponInfo,
    getWeaponData,
    getWeaponDataByLevel,
  };
}
