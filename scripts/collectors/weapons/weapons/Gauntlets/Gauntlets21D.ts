const weaponInfo: WeaponInfo = {
  name: "Gauntlets#21D",
  description:
    "Huaxu Academy has independently improved and developed the first set of highly practical high-performance Gauntlets based on the previous source energy weapons, representing the care and warmth of the Academy, stable and lasting.",
  type: "Gauntlets",
  rarity: 4,
  passiveName: "Mastermind",
  passiveValue:
    "When the Resonator dashes or dodges, increases ATK by 8%/10%/12%/14%/16%. Increases Counter Attack DMG by 50%/62.5%/75%/87.5%/100%, lasting for 8s. When Counter Attack is performed, restores the Resonator's HP by 5%/6.25%/7.5%/8.75%/10%. This effect can be triggered 1 time(s) every 6s.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 31,
    modifier: "EnergyRegen",
    modifierValue: 0.086,
  },
  "20": {
    attack: 80,
    modifier: "EnergyRegen",
    modifierValue: 0.153,
  },
  "40": {
    attack: 153,
    modifier: "EnergyRegen",
    modifierValue: 0.22,
  },
  "50": {
    attack: 200,
    modifier: "EnergyRegen",
    modifierValue: 0.254,
  },
  "60": {
    attack: 247,
    modifier: "EnergyRegen",
    modifierValue: 0.287,
  },
  "70": {
    attack: 293,
    modifier: "EnergyRegen",
    modifierValue: 0.321,
  },
  "80": {
    attack: 340,
    modifier: "EnergyRegen",
    modifierValue: 0.355,
  },
  "90": {
    attack: 387,
    modifier: "EnergyRegen",
    modifierValue: 0.38799999999999996,
  },
  "20+": {
    attack: 101,
    modifier: "EnergyRegen",
    modifierValue: 0.153,
  },
  "40+": {
    attack: 174,
    modifier: "EnergyRegen",
    modifierValue: 0.22,
  },
  "50+": {
    attack: 221,
    modifier: "EnergyRegen",
    modifierValue: 0.254,
  },
  "60+": {
    attack: 267,
    modifier: "EnergyRegen",
    modifierValue: 0.287,
  },
  "70+": {
    attack: 314,
    modifier: "EnergyRegen",
    modifierValue: 0.321,
  },
  "80+": {
    attack: 361,
    modifier: "EnergyRegen",
    modifierValue: 0.355,
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
