const weaponInfo: WeaponInfo = {
  name: "Gauntlets#21D",
  description:
    "Huaxu Academy has independently improved and developed the first set of highly practical high-performance Gauntlets based on the previous source energy weapons, representing the care and warmth of the Academy, stable and lasting.",
  type: "Gauntlets",
  rarity: 4,
  passiveName: "Mastermind",
  passiveValue:
    "When the Resonator dashes or dodges, increases ATK by 8%/10%/12%/14%/16%. Increases Counter Attack DMG by 50%/62.5%/75%/87.5%/100%, lasting for 8s. When Counter Attack is performed, restores the Resonator's HP by 5%/6.25%/7.5%/8.75%/10%. This effect can be triggered 1 time(s) every 6s.",
  passiveData: [
    {
      key: "Gauntlets21DATK",
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
        "When the Resonator dashes or dodges, increases ATK by 8%/10%/12%/14%/16%.",
      alwaysEnabled: false,
    },
    {
      key: "Gauntlets21DCounterAttackDmg",
      hasStacks: false,
      modifier: "CounterAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.5,
        "2": 0.625,
        "3": 0.75,
        "4": 0.875,
        "5": 1,
      },
      minStacks: 0,
      maxStacks: 0,
      details:
        "Increases Counter Attack DMG by 50%/62.5%/75%/87.5%/100%, lasting for 8s.",
      alwaysEnabled: false,
    },
    {
      key: "Gauntlets21DHP",
      hasStacks: false,
      modifier: "HP",
      modifierByRefinement: {
        "1": 0.05,
        "2": 0.0625,
        "3": 0.075,
        "4": 0.0875,
        "5": 0.1,
      },
      minStacks: 0,
      maxStacks: 0,
      details:
        "When Counter Attack is performed, restores the Resonator's HP by 5%/6.25%/7.5%/8.75%/10%.",
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 31,
    modifier: "EnergyRegen",
    modifierValue: 0.086,
  },
  "20": {
    attack: 80,
    modifier: "EnergyRegen",
    modifierValue: 0.153,
  },
  "40": {
    attack: 153,
    modifier: "EnergyRegen",
    modifierValue: 0.22,
  },
  "50": {
    attack: 200,
    modifier: "EnergyRegen",
    modifierValue: 0.254,
  },
  "60": {
    attack: 247,
    modifier: "EnergyRegen",
    modifierValue: 0.287,
  },
  "70": {
    attack: 293,
    modifier: "EnergyRegen",
    modifierValue: 0.321,
  },
  "80": {
    attack: 340,
    modifier: "EnergyRegen",
    modifierValue: 0.355,
  },
  "90": {
    attack: 387,
    modifier: "EnergyRegen",
    modifierValue: 0.388,
  },
  "20+": {
    attack: 101,
    modifier: "EnergyRegen",
    modifierValue: 0.153,
  },
  "40+": {
    attack: 174,
    modifier: "EnergyRegen",
    modifierValue: 0.22,
  },
  "50+": {
    attack: 221,
    modifier: "EnergyRegen",
    modifierValue: 0.254,
  },
  "60+": {
    attack: 267,
    modifier: "EnergyRegen",
    modifierValue: 0.287,
  },
  "70+": {
    attack: 314,
    modifier: "EnergyRegen",
    modifierValue: 0.321,
  },
  "80+": {
    attack: 361,
    modifier: "EnergyRegen",
    modifierValue: 0.355,
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
