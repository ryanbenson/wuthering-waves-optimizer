const weaponInfo: WeaponInfo = {
  name: "Cadenza",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/Cadenza.png",
  description:
    "An ascending crescendo. These pistols unleash bullets with the force of thunder, tearing through the heavens like a symphony of destruction.",
  type: "Pistols",
  rarity: 4,
  passiveName: "Ceaseless Aria",
  passiveValue:
    "When Resonance Skill is released, restores Concerto Energy by 8/10/12/14/16. This effect can be triggered 1 time every 20s.",
  passiveData: [
    {
      key: "CadenzaConcertoEnergy",
      hasStacks: true,
      modifier: null,
      modifierByRefinement: {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
      },
      minStacks: 0,
      maxStacks: 1,
      details:
        "When Resonance Skill is released, restores Concerto Energy by 8/10/12/14/16. This effect can be triggered 1 time every 20s.",
      alwaysEnabled: true,
    },
  ]
};

const weaponData: WeaponData = {
  "1": {
    attack: 27,
    modifier: "EnergyRegen",
    modifierValue: 0.115,
  },
  "20": {
    attack: 70,
    modifier: "EnergyRegen",
    modifierValue: 0.204,
  },
  "40": {
    attack: 133,
    modifier: "EnergyRegen",
    modifierValue: 0.294,
  },
  "50": {
    attack: 174,
    modifier: "EnergyRegen",
    modifierValue: 0.339,
  },
  "60": {
    attack: 215,
    modifier: "EnergyRegen",
    modifierValue: 0.383,
  },
  "70": {
    attack: 255,
    modifier: "EnergyRegen",
    modifierValue: 0.428,
  },
  "80": {
    attack: 296,
    modifier: "EnergyRegen",
    modifierValue: 0.473,
  },
  "90": {
    attack: 337,
    modifier: "EnergyRegen",
    modifierValue: 0.518,
  },
  "20+": {
    attack: 88,
    modifier: "EnergyRegen",
    modifierValue: 0.204,
  },
  "40+": {
    attack: 151,
    modifier: "EnergyRegen",
    modifierValue: 0.294,
  },
  "50+": {
    attack: 192,
    modifier: "EnergyRegen",
    modifierValue: 0.339,
  },
  "60+": {
    attack: 233,
    modifier: "EnergyRegen",
    modifierValue: 0.383,
  },
  "70+": {
    attack: 273,
    modifier: "EnergyRegen",
    modifierValue: 0.428,
  },
  "80+": {
    attack: 314,
    modifier: "EnergyRegen",
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
