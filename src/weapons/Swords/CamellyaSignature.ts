const weaponInfo: WeaponInfo = {
  name: "Camellya Signature",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/CamellyaSigTmp.jpg",
  description:
    "Coming Soon",
  type: "Sword",
  rarity: 5,
  passiveName: "Coming Soon",
  passiveValue:
    "Attack power increases by 12/15/18/21/24%. When dealing Basic Attack damage, Basic Attack damage increases by 12/15/18/21/24%, lasting for 12s; Can be triggered once every 1s, stacking up to 5 times.",
  passiveData: [
    {
      key: "CamellyaSigAtk",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details: "Attack power increases by 12/15/18/21/24%.",
      alwaysEnabled: true,
    },
    {
      key: "CamellyaSigBasicBonus",
      hasStacks: true,
      modifier: "BasicAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      minStacks: 0,
      maxStacks: 5,
      details:
        "When dealing Basic Attack damage, Basic Attack damage increases by 12/15/18/21/24%, lasting for 12s; Can be triggered once every 1s, stacking up to 5 times.",
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
    "1": {
      attack: 47,
      modifier: "CritRate",
      modifierValue: 0.054,  // 5.4%
    },
    "20": {
      attack: 122,
      modifier: "CritRate",
      modifierValue: 0.095,  // 9.5%
    },
    "20+": {
      attack: 153,
      modifier: "CritRate",
      modifierValue: 0.095,  // 9.5%
    },
    "40": {
      attack: 232,
      modifier: "CritRate",
      modifierValue: 0.137,  // 13.7%
    },
    "40+": {
      attack: 264,
      modifier: "CritRate",
      modifierValue: 0.137,  // 13.7%
    },
    "50": {
      attack: 303,
      modifier: "CritRate",
      modifierValue: 0.158,  // 15.8%
    },
    "50+": {
      attack: 335,
      modifier: "CritRate",
      modifierValue: 0.158,  // 15.8%
    },
    "60": {
      attack: 374,
      modifier: "CritRate",
      modifierValue: 0.179,  // 17.9%
    },
    "60+": {
      attack: 406,
      modifier: "CritRate",
      modifierValue: 0.179,  // 17.9%
    },
    "70": {
      attack: 445,
      modifier: "CritRate",
      modifierValue: 0.200,  // 20.0%
    },
    "70+": {
      attack: 476,
      modifier: "CritRate",
      modifierValue: 0.200,  // 20.0%
    },
    "80": {
      attack: 516,
      modifier: "CritRate",
      modifierValue: 0.221,  // 22.1%
    },
    "80+": {
      attack: 547,
      modifier: "CritRate",
      modifierValue: 0.221,  // 22.1%
    },
    "90": {
      attack: 587,
      modifier: "CritRate",
      modifierValue: 0.243,  // 24.3%
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
