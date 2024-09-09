const weaponInfo: WeaponInfo = {
  name: "Augment",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/Augment.png",
  description:
    "This Rectifier is a ceremonial weapon used by the Jinzhou Magistrate of Huanglong at the inauguration ceremony. The golden ginkgo leaf pattern represents that Huanglong should be like ginkgo, although it is left alone in the world, it is still prosperous and long-lasting.",
  type: "Rectifier",
  rarity: 4,
  passiveName: "Forgiving Resilience",
  passiveValue:
    "When Resonance Liberation is released, increases the caster's ATK by 15%/23.25%/31.5%/39.75%/48%, lasting for 15s.",
  passiveData: [
    {
      key: "AugmentATK",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.15,
        "2": 0.2325,
        "3": 0.315,
        "4": 0.3975,
        "5": 0.48,
      },
      minStacks: 0,
      maxStacks: 0,
      details:
        "When Resonance Liberation is released, increases the caster's ATK by 15%/23.25%/31.5%/39.75%/48%, lasting for 15s.",
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 33,
    modifier: "CritRate",
    modifierValue: 0.045,
  },
  "20": {
    attack: 85,
    modifier: "CritRate",
    modifierValue: 0.079,
  },
  "40": {
    attack: 163,
    modifier: "CritRate",
    modifierValue: 0.114,
  },
  "50": {
    attack: 213,
    modifier: "CritRate",
    modifierValue: 0.132,
  },
  "60": {
    attack: 263,
    modifier: "CritRate",
    modifierValue: 0.149,
  },
  "70": {
    attack: 312,
    modifier: "CritRate",
    modifierValue: 0.167,
  },
  "80": {
    attack: 362,
    modifier: "CritRate",
    modifierValue: 0.184,
  },
  "90": {
    attack: 412,
    modifier: "CritRate",
    modifierValue: 0.202,
  },
  "20+": {
    attack: 107,
    modifier: "CritRate",
    modifierValue: 0.079,
  },
  "40+": {
    attack: 185,
    modifier: "CritRate",
    modifierValue: 0.114,
  },
  "50+": {
    attack: 235,
    modifier: "CritRate",
    modifierValue: 0.132,
  },
  "60+": {
    attack: 285,
    modifier: "CritRate",
    modifierValue: 0.149,
  },
  "70+": {
    attack: 334,
    modifier: "CritRate",
    modifierValue: 0.167,
  },
  "80+": {
    attack: 384,
    modifier: "CritRate",
    modifierValue: 0.184,
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
