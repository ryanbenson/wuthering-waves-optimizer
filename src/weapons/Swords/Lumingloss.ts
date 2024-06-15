const weaponInfo: WeaponInfo = {
  name: "Lumingloss",
  description:
    "This Sword is a ceremonial weapon used by the Jinzhou Magistrate of Huanglong at the inauguration ceremony. The golden ginkgo leaf pattern represents that Huanglong should be like ginkgo, although it is left in the world, it is still prosperous and long-lasting.",
  type: "Sword",
  rarity: 4,
  passiveName: "Pale Gale",
  passiveValue:
    "When Resonance Skill is released, increases Basic Attack DMG and Heavy Attack DMG by 20%/31%/42%/53%/64%, stacking up to 1 time(s). This effect lasts for 10s and can be triggered 1 time(s) every 1s.",
  passiveData: [
    {
      key: "BasicAttackDMGBonus",
      hasStacks: true,
      modifier: "BasicAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.2,
        "2": 0.31,
        "3": 0.42,
        "4": 0.53,
        "5": 0.64,
      },
      minStacks: 0,
      maxStacks: 1,
      details:
        "When Resonance Skill is released, increases Basic Attack DMG and Heavy Attack DMG by 20%/31%/42%/53%/64%, stacking up to 1 time(s). This effect lasts for 10s and can be triggered 1 time(s) every 1s.",
      alwaysEnabled: false,
    },
    {
      key: "HeavyAttackDMGBonus",
      hasStacks: true,
      modifier: "HeavyAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.2,
        "2": 0.31,
        "3": 0.42,
        "4": 0.53,
        "5": 0.64,
      },
      minStacks: 0,
      maxStacks: 1,
      details:
        "When Resonance Skill is released, increases Basic Attack DMG and Heavy Attack DMG by 20%/31%/42%/53%/64%, stacking up to 1 time(s). This effect lasts for 10s and can be triggered 1 time(s) every 1s.",
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 31,
    modifier: "ATK",
    modifierValue: 0.081,
  },
  "20": {
    attack: 80,
    modifier: "ATK",
    modifierValue: 0.143,
  },
  "40": {
    attack: 153,
    modifier: "ATK",
    modifierValue: 0.206,
  },
  "50": {
    attack: 200,
    modifier: "ATK",
    modifierValue: 0.238,
  },
  "60": {
    attack: 247,
    modifier: "ATK",
    modifierValue: 0.269,
  },
  "70": {
    attack: 293,
    modifier: "ATK",
    modifierValue: 0.301,
  },
  "80": {
    attack: 340,
    modifier: "ATK",
    modifierValue: 0.332,
  },
  "90": {
    attack: 387,
    modifier: "ATK",
    modifierValue: 0.364,
  },
  "20+": {
    attack: 101,
    modifier: "ATK",
    modifierValue: 0.143,
  },
  "40+": {
    attack: 174,
    modifier: "ATK",
    modifierValue: 0.206,
  },
  "50+": {
    attack: 221,
    modifier: "ATK",
    modifierValue: 0.238,
  },
  "60+": {
    attack: 267,
    modifier: "ATK",
    modifierValue: 0.269,
  },
  "70+": {
    attack: 314,
    modifier: "ATK",
    modifierValue: 0.301,
  },
  "80+": {
    attack: 361,
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
