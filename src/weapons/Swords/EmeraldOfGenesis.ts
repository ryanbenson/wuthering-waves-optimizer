const weaponInfo: WeaponInfo = {
  name: "Emerald of Genesis",
  description:
    "Pay heed: the frigid blade reveals an icy current that amalgamates into a whirlpool of thoughts. Use this powerful sequence to crush your enemies with ease using the Sword.",
  type: "Sword",
  rarity: 5,
  passiveName: "Stormy Resolution",
  passiveValue:
    "Increases Energy Regen by 12.8%/16%/19.2%/22.4%/25.6%. When Resonance Skill is released, increases ATK by 6%/7.5%/9%/10.5%/12%, stacking up to 2 time(s). This effect lasts for 10s.",
  passiveData: [
    {
      hasStacks: false,
      modifier: "EnergyRegen",
      modifierByRefinement: {
        "1": 0.128,
        "2": 0.16,
        "3": 0.192,
        "4": 0.224,
        "5": 0.256,
      },
      details: "Increases Energy Regen by 12.8%/16%/19.2%/22.4%/25.6%.",
      alwaysEnabled: true,
    },
    {
      hasStacks: true,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.06,
        "2": 0.075,
        "3": 0.09,
        "4": 0.105,
        "5": 0.12,
      },
      minStacks: 0,
      maxStacks: 2,
      details:
        "When Resonance Skill is released, increases ATK by 6%/7.5%/9%/10.5%/12%, stacking up to 2 time(s). This effect lasts for 10s.",
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 47,
    modifier: "CritRate",
    modifierValue: 0.054,
  },
  "20": {
    attack: 122,
    modifier: "CritRate",
    modifierValue: 0.095,
  },
  "40": {
    attack: 232,
    modifier: "CritRate",
    modifierValue: 0.137,
  },
  "50": {
    attack: 303,
    modifier: "CritRate",
    modifierValue: 0.158,
  },
  "60": {
    attack: 374,
    modifier: "CritRate",
    modifierValue: 0.179,
  },
  "70": {
    attack: 445,
    modifier: "CritRate",
    modifierValue: 0.2,
  },
  "80": {
    attack: 516,
    modifier: "CritRate",
    modifierValue: 0.221,
  },
  "90": {
    attack: 587,
    modifier: "CritRate",
    modifierValue: 0.243,
  },
  "20+": {
    attack: 153,
    modifier: "CritRate",
    modifierValue: 0.095,
  },
  "40+": {
    attack: 264,
    modifier: "CritRate",
    modifierValue: 0.137,
  },
  "50+": {
    attack: 335,
    modifier: "CritRate",
    modifierValue: 0.158,
  },
  "60+": {
    attack: 406,
    modifier: "CritRate",
    modifierValue: 0.179,
  },
  "70+": {
    attack: 476,
    modifier: "CritRate",
    modifierValue: 0.2,
  },
  "80+": {
    attack: 547,
    modifier: "CritRate",
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
