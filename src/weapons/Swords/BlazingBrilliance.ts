interface WeaponInfo {
  name: string;
  description: string;
  type: string;
  rarity: number;
  passiveName: string;
  passiveValue: string;
  passiveData: WeaponPassiveData[];
}

interface WeaponPassiveData {
  hasStacks: boolean;
  modifier: string;
  modifierByRefinement: WeaponPassiveModifierByRefinement;
  minStacks?: number;
  maxStacks?: number;
  details: string;
  alwaysEnabled: boolean;
}

interface WeaponPassiveModifierByRefinement {
  [refinement: string]: number;
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
  name: "Blazing Brilliance",
  description:
    "Forged from the very essence and feathers of a legendary bird, this weapon blazes with an intensity that bathes the world in its luminous glow. With each fiery surge, it consumes all in its path, leaving nothing but ashes in its wake.",
  type: "Sword",
  rarity: 5,
  passiveName: "Crimson Phoenix",
  passiveValue:
    "Increases CRIT Rate by 8%/10%/12%/14%/16%. Upon dealing damage, increases [Searing Feather] by 1 stack, gaining 1 stack every 0.5s. When Resonance Skill is released, increases [Searing Feather] by an extra 5 stacks. Each stack of [Searing Feather] increases Resonance Skill DMG Bonus by 4%/5%/6%/7%/8%, stacking up to 14 times. After reaching 14 stacks of [Searing Feather], all stacks will reset within 10s.",
  passiveData: [
    {
      hasStacks: false,
      modifier: "CritRate",
      modifierByRefinement: {
        "1": 0.08,
        "2": 0.1,
        "3": 0.12,
        "4": 0.14,
        "5": 0.16,
      },
      details: "Increases CRIT Rate by 8%/10%/12%/14%/16%",
      alwaysEnabled: true,
    },
    {
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
    modifier: "ATK",
    modifierValue: 0.081,
  },
  "20": {
    attack: 122,
    modifier: "ATK",
    modifierValue: 0.143,
  },
  "40": {
    attack: 232,
    modifier: "ATK",
    modifierValue: 0.206,
  },
  "50": {
    attack: 303,
    modifier: "ATK",
    modifierValue: 0.238,
  },
  "60": {
    attack: 374,
    modifier: "ATK",
    modifierValue: 0.269,
  },
  "70": {
    attack: 445,
    modifier: "ATK",
    modifierValue: 0.301,
  },
  "80": {
    attack: 516,
    modifier: "ATK",
    modifierValue: 0.332,
  },
  "90": {
    attack: 587,
    modifier: "ATK",
    modifierValue: 0.364,
  },
  "20+": {
    attack: 153,
    modifier: "ATK",
    modifierValue: 0.143,
  },
  "40+": {
    attack: 264,
    modifier: "ATK",
    modifierValue: 0.206,
  },
  "50+": {
    attack: 335,
    modifier: "ATK",
    modifierValue: 0.238,
  },
  "60+": {
    attack: 406,
    modifier: "ATK",
    modifierValue: 0.269,
  },
  "70+": {
    attack: 476,
    modifier: "ATK",
    modifierValue: 0.301,
  },
  "80+": {
    attack: 547,
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
