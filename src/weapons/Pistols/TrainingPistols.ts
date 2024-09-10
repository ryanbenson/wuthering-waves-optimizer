const weaponInfo: WeaponInfo = {
  name: "Training Pistols",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/TrainingPistols.png",
  description:
    "These pistols are designed specifically for training and teaching, offering only the basic features.",
  type: "Pistols",
  rarity: 1,
  passiveName: "Persevere",
  passiveValue: "Increases ATK by 4%/5%/6%/7%/8%.",
  passiveData: [
    {
      key: "TrainingPistolsATK",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.04,
        "2": 0.05,
        "3": 0.06,
        "4": 0.07,
        "5": 0.08,
      },
      minStacks: 0,
      maxStacks: 0,
      details: "Increases ATK by 4%/5%/6%/7%/8%.",
      alwaysEnabled: true,
    },
  ],
  maxLevel: "70",
  weaponLevelOverride: [
    "1",
    "20",
    "20+",
    "40",
    "40+",
    "50",
    "50+",
    "60",
    "60+",
    "70",
  ]
};

const weaponData: WeaponData = {
  "1": {
    attack: 20,
    modifier: "ATK",
    modifierValue: 0.025,
  },
  "20": {
    attack: 52,
    modifier: "ATK",
    modifierValue: 0.045,
  },
  "40": {
    attack: 99,
    modifier: "ATK",
    modifierValue: 0.065,
  },
  "50": {
    attack: 129,
    modifier: "ATK",
    modifierValue: 0.075,
  },
  "60": {
    attack: 159,
    modifier: "ATK",
    modifierValue: 0.084,
  },
  "70": {
    attack: 189,
    modifier: "ATK",
    modifierValue: 0.094,
  },
  "20+": {
    attack: 65,
    modifier: "ATK",
    modifierValue: 0.045,
  },
  "40+": {
    attack: 112,
    modifier: "ATK",
    modifierValue: 0.065,
  },
  "50+": {
    attack: 142,
    modifier: "ATK",
    modifierValue: 0.075,
  },
  "60+": {
    attack: 172,
    modifier: "ATK",
    modifierValue: 0.084,
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
