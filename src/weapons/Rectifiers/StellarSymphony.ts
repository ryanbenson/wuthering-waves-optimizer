const weaponInfo: WeaponInfo = {
  name: "Stellar Symphony",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/StellarSymphony.png",
  description:
    "The core carrying energy simulates the cycle of star evolution. Infinity takes the singularity as its source, scattering the star clusters it pulls in. However, as the extinction flows, there is always an endless echo at the end of the final fall - that is the greeting when a new star is born.",
  type: "Rectifier",
  rarity: 5,
  passiveName: "The Stars",
  passiveValue:
    "HP increases by 12%/15%/18%/21%/24%. When the Intro skill causes healing, it restores 8 points of Concert Energy to itself and increases the ATK of all characters in the nearby team by 10% for 30 seconds. It can be triggered once every 20 seconds. Effects with the same name cannot be stacked.",
  passiveData: [
    {
      key: "StellarSymphonyHP",
      hasStacks: false,
      modifier: "HP",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details: "HP increases by 12%/15%/18%/21%/24%",
      alwaysEnabled: true,
    },
    {
      key: "StellarSymphonyATK",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.14,
        "2": 0.175,
        "3": 0.21,
        "4": 0.245,
        "5": 0.28,
      },
      details:
        "When the Intro skill causes healing, it restores 8 points of Concert Energy to itself and increases the ATK of all characters in the nearby team by 14%/17.5%/21%/24.5%/28% for 30 seconds. It can be triggered once every 20 seconds. Effects with the same name cannot be stacked.",
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 33,
    modifier: "EnergyRegen",
    modifierValue: 0.171,
  },
  "20": {
    attack: 85,
    modifier: "EnergyRegen",
    modifierValue: 0.304,
  },
  "20+": {
    attack: 107,
    modifier: "EnergyRegen",
    modifierValue: 0.304,
  },
  "40": {
    attack: 163,
    modifier: "EnergyRegen",
    modifierValue: 0.437,
  },
  "40+": {
    attack: 185,
    modifier: "EnergyRegen",
    modifierValue: 0.437,
  },
  "50": {
    attack: 213,
    modifier: "EnergyRegen",
    modifierValue: 0.504,
  },
  "50+": {
    attack: 235,
    modifier: "EnergyRegen",
    modifierValue: 0.504,
  },
  "60": {
    attack: 263,
    modifier: "EnergyRegen",
    modifierValue: 0.57,
  },
  "60+": {
    attack: 285,
    modifier: "EnergyRegen",
    modifierValue: 0.57,
  },
  "70": {
    attack: 312,
    modifier: "EnergyRegen",
    modifierValue: 0.637,
  },
  "70+": {
    attack: 334,
    modifier: "EnergyRegen",
    modifierValue: 0.637,
  },
  "80": {
    attack: 362,
    modifier: "EnergyRegen",
    modifierValue: 0.703,
  },
  "80+": {
    attack: 384,
    modifier: "EnergyRegen",
    modifierValue: 0.703,
  },
  "90": {
    attack: 412,
    modifier: "EnergyRegen",
    modifierValue: 0.77,
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
