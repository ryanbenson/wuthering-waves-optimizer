const weaponInfo: WeaponInfo = {
  name: "Tyro Pistols",
  description:
    "The inception of valiant venture. A pair of pistols designed for novice Resonators. Contains a power not to be underestimated under its simple outlook.",
  type: "Pistols",
  rarity: 2,
  passiveName: "Prologue",
  passiveValue: "Increases ATK by 5%/6.25%/7.5%/8.75%/10%.",
  passiveData: [
    {
      key: "ATK",
      hasStacks: true,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.05,
        "2": 0.0625,
        "3": 0.075,
        "4": 0.0875,
        "5": 0.1,
      },
      minStacks: 0,
      maxStacks: 3,
      details: "Increases ATK by 5%/6.25%/7.5%/8.75%/10%.",
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 22,
    modifier: "ATK",
    modifierValue: 0.033,
  },
  "20": {
    attack: 57,
    modifier: "ATK",
    modifierValue: 0.058,
  },
  "40": {
    attack: 108,
    modifier: "ATK",
    modifierValue: 0.084,
  },
  "50": {
    attack: 142,
    modifier: "ATK",
    modifierValue: 0.097,
  },
  "60": {
    attack: 175,
    modifier: "ATK",
    modifierValue: 0.109,
  },
  "70": {
    attack: 208,
    modifier: "ATK",
    modifierValue: 0.122,
  },
  "20+": {
    attack: 71,
    modifier: "ATK",
    modifierValue: 0.058,
  },
  "40+": {
    attack: 123,
    modifier: "ATK",
    modifierValue: 0.084,
  },
  "50+": {
    attack: 156,
    modifier: "ATK",
    modifierValue: 0.097,
  },
  "60+": {
    attack: 190,
    modifier: "ATK",
    modifierValue: 0.109,
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
