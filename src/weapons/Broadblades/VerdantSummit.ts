const weaponInfo: WeaponInfo = {
  name: "Verdant Summit",
  description:
    "The ancient mountain stands tall, its peak reaching towards the sky. A river flows for thousands of years, forming the blade of a powerful weapon. As it is unsheathed, a powerful dragon's roar echoes through the heavens and earth, causing the sea to churn. This awe-inspiring weapon strikes fear in all who witness its might.",
  type: "Broadblade",
  rarity: 5,
  passiveName: "Swordsworn",
  passiveValue:
    "Increases Attribute DMG Bonus by 12%/15%/18%/21%/24%. Every time Intro Skill or Resonance Liberation is cast, increases Heavy Attack DMG Bonus by 24%/30%/36%/42%/48%, stacking up to 2 time(s). This effect lasts for 14s.",
  passiveData: [
    {
      key: "AllAttributeBonus",
      hasStacks: false,
      modifier: "AllAttributeBonus",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details: "Increases Attribute DMG Bonus by 12%/15%/18%/21%/24%.",
      alwaysEnabled: true,
    },
    {
      key: "HeavyAttackDMGBonus",
      hasStacks: true,
      modifier: "HeavyAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.24,
        "2": 0.3,
        "3": 0.36,
        "4": 0.42,
        "5": 0.48,
      },
      minStacks: 0,
      maxStacks: 2,
      details:
        "Every time Intro Skill or Resonance Liberation is cast, increases Heavy Attack DMG Bonus by 24%/30%/36%/42%/48%, stacking up to 2 time(s). This effect lasts for 14s.",
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 47,
    modifier: "CritDMG",
    modifierValue: 0.108,
  },
  "20": {
    attack: 122,
    modifier: "CritDMG",
    modifierValue: 0.191,
  },
  "40": {
    attack: 232,
    modifier: "CritDMG",
    modifierValue: 0.275,
  },
  "50": {
    attack: 303,
    modifier: "CritDMG",
    modifierValue: 0.317,
  },
  "60": {
    attack: 374,
    modifier: "CritDMG",
    modifierValue: 0.359,
  },
  "70": {
    attack: 445,
    modifier: "CritDMG",
    modifierValue: 0.401,
  },
  "80": {
    attack: 516,
    modifier: "CritDMG",
    modifierValue: 0.443,
  },
  "90": {
    attack: 587,
    modifier: "CritDMG",
    modifierValue: 0.486,
  },
  "20+": {
    attack: 153,
    modifier: "CritDMG",
    modifierValue: 0.191,
  },
  "40+": {
    attack: 264,
    modifier: "CritDMG",
    modifierValue: 0.275,
  },
  "50+": {
    attack: 335,
    modifier: "CritDMG",
    modifierValue: 0.317,
  },
  "60+": {
    attack: 406,
    modifier: "CritDMG",
    modifierValue: 0.359,
  },
  "70+": {
    attack: 476,
    modifier: "CritDMG",
    modifierValue: 0.401,
  },
  "80+": {
    attack: 547,
    modifier: "CritDMG",
    modifierValue: 0.443,
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
