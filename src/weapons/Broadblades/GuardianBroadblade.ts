const weaponInfo: WeaponInfo = {
  name: "Guardian Broadblade",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/GuardianBroadblade.png",
  description:
    "The first Jinzhou Magistrate, in memory of the mysterious person who helped defend the border and build the city, created the Guardian series under his guidance. Today, it has become an indispensable cornerstone in the development of new weapons.",
  type: "Broadblade",
  rarity: 3,
  passiveName: "Consensus",
  passiveValue:
    "Increases Basic Attack DMG and Heavy Attack DMG by 12%/15%/18%/21%/24%.",
  passiveData: [
    {
      key: "GuardianBroadbladeBasicAttackDMGBonus",
      hasStacks: false,
      modifier: "BasicAttackDMGBonus",
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
        "Increases Basic Attack DMG and Heavy Attack DMG by 12%/15%/18%/21%/24%. (Basic)",
      alwaysEnabled: true,
    },
    {
      key: "GuardianBroadbladeHeavyAttackDMGBonus",
      hasStacks: false,
      modifier: "HeavyAttackDMGBonus",
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
        "Increases Basic Attack DMG and Heavy Attack DMG by 12%/15%/18%/21%/24%. (Heavy)",
      alwaysEnabled: true,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 26,
    modifier: "ATK",
    modifierValue: 0.054,
  },
  "20": {
    attack: 67,
    modifier: "ATK",
    modifierValue: 0.095,
  },
  "40": {
    attack: 128,
    modifier: "ATK",
    modifierValue: 0.137,
  },
  "50": {
    attack: 168,
    modifier: "ATK",
    modifierValue: 0.158,
  },
  "60": {
    attack: 207,
    modifier: "ATK",
    modifierValue: 0.179,
  },
  "70": {
    attack: 246,
    modifier: "ATK",
    modifierValue: 0.2,
  },
  "80": {
    attack: 285,
    modifier: "ATK",
    modifierValue: 0.221,
  },
  "90": {
    attack: 325,
    modifier: "ATK",
    modifierValue: 0.243,
  },
  "20+": {
    attack: 84,
    modifier: "ATK",
    modifierValue: 0.095,
  },
  "40+": {
    attack: 146,
    modifier: "ATK",
    modifierValue: 0.137,
  },
  "50+": {
    attack: 185,
    modifier: "ATK",
    modifierValue: 0.158,
  },
  "60+": {
    attack: 224,
    modifier: "ATK",
    modifierValue: 0.179,
  },
  "70+": {
    attack: 263,
    modifier: "ATK",
    modifierValue: 0.2,
  },
  "80+": {
    attack: 303,
    modifier: "ATK",
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
