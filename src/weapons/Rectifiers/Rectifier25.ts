const weaponInfo: WeaponInfo = {
  name: "Rectifier#25",
  description:
    "Improved version of a Rectifier prototype from the Huanglong next-gen mass production weaponry project. With surging power and highly purified lens, its sound is only played by the wise of steel-like will.",
  type: "Rectifier",
  rarity: 4,
  passiveName: "Dawnbringer",
  passiveValue:
    "When Resonance Skill is released, if the Resonator's HP is below 60%, restores their HP by 5%/6.25%/7.5%/8.75%/10%. This effect can be triggered 1 time(s) every 8s; if the Resonator's HP is above 60%, increases ATK by 12%/15%/18%/21%/24%, lasting for 10s.",
  passiveData: [
    {
      key: "ATK",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      minStacks: 0,
      maxStacks: 0,
      details:
        "If the Resonator's HP is above 60%, increases ATK by 12%/15%/18%/21%/24%, lasting for 10s.",
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 27,
    modifier: "Energy Regen",
    modifierValue: 0.115,
  },
  "20": {
    attack: 70,
    modifier: "Energy Regen",
    modifierValue: 0.204,
  },
  "40": {
    attack: 133,
    modifier: "Energy Regen",
    modifierValue: 0.294,
  },
  "50": {
    attack: 174,
    modifier: "Energy Regen",
    modifierValue: 0.339,
  },
  "60": {
    attack: 215,
    modifier: "Energy Regen",
    modifierValue: 0.383,
  },
  "70": {
    attack: 255,
    modifier: "Energy Regen",
    modifierValue: 0.428,
  },
  "80": {
    attack: 296,
    modifier: "Energy Regen",
    modifierValue: 0.473,
  },
  "90": {
    attack: 337,
    modifier: "Energy Regen",
    modifierValue: 0.518,
  },
  "20+": {
    attack: 88,
    modifier: "Energy Regen",
    modifierValue: 0.204,
  },
  "40+": {
    attack: 151,
    modifier: "Energy Regen",
    modifierValue: 0.294,
  },
  "50+": {
    attack: 192,
    modifier: "Energy Regen",
    modifierValue: 0.339,
  },
  "60+": {
    attack: 233,
    modifier: "Energy Regen",
    modifierValue: 0.383,
  },
  "70+": {
    attack: 273,
    modifier: "Energy Regen",
    modifierValue: 0.428,
  },
  "80+": {
    attack: 314,
    modifier: "Energy Regen",
    modifierValue: 0.473,
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
