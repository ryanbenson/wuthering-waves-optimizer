const weaponInfo: WeaponInfo = {
  name: "Blazing Brilliance",
  description:
    "Forged from the very essence and feathers of a legendary bird, this weapon blazes with an intensity that bathes the world in its luminous glow. With each fiery surge, it consumes all in its path, leaving nothing but ashes in its wake.",
  type: "Sword",
  rarity: 5,
  passiveName: "Crimson Phoenix",
  passiveValue:
    "Increases CRIT Rate by 12%/15%/18%/21%/24%. Upon dealing damage, increases [Searing Feather] by 1 stack, gaining 1 stack every 0.5s. When Resonance Skill is released, increases [Searing Feather] by an extra 5 stacks. Each stack of [Searing Feather] increases Resonance Skill DMG Bonus by 4%/5%/6%/7%/8%, stacking up to 14 times. After reaching 14 stacks of [Searing Feather], all stacks will reset within 10s.",
  passiveData: [
    {
      key: "CritRate",
      hasStacks: false,
      modifier: "CritRate",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details: "Increases CRIT Rate by 12%/15%/18%/21%/24%.",
      alwaysEnabled: true,
    },
    {
      key: "ResonanceSkillDMGBonus",
      hasStacks: true,
      modifier: "ResonanceSkillDMGBonus",
      modifierByRefinement: {
        "1": 0.04,
        "2": 0.05,
        "3": 0.06,
        "4": 0.07,
        "5": 0.08,
      },
      minStacks: 0,
      maxStacks: 14,
      details:
        "Upon dealing damage, increases [Searing Feather] by 1 stack, gaining 1 stack every 0.5s. When Resonance Skill is released, increases [Searing Feather] by an extra 5 stacks. Each stack of [Searing Feather] increases Resonance Skill DMG Bonus by 4%/5%/6%/7%/8%, stacking up to 14 times. After reaching 14 stacks of [Searing Feather], all stacks will reset within 10s.",
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
