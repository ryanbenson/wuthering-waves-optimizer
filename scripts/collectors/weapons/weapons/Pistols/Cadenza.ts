const weaponInfo: WeaponInfo = {
  name: "Cadenza",
  description:
    "An ascending crescendo. These pistols unleash bullets with the force of thunder, tearing through the heavens like a symphony of destruction.",
  type: "Pistols",
  rarity: 4,
  passiveName: "Ceaseless Aria",
  passiveValue:
    "When Resonance Skill is released, restores Concerto Energy by 8/10/12/14/16. This effect can be triggered 1 time every 20s.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 27,
    modifier: "Energy Regen",
    modifierValue: 0.115,
  },
  "20": {
    attack: 70,
    modifier: "Energy Regen",
    modifierValue: 0.204,
  },
  "40": {
    attack: 133,
    modifier: "Energy Regen",
    modifierValue: 0.294,
  },
  "50": {
    attack: 174,
    modifier: "Energy Regen",
    modifierValue: 0.33899999999999997,
  },
  "60": {
    attack: 215,
    modifier: "Energy Regen",
    modifierValue: 0.38299999999999995,
  },
  "70": {
    attack: 255,
    modifier: "Energy Regen",
    modifierValue: 0.428,
  },
  "80": {
    attack: 296,
    modifier: "Energy Regen",
    modifierValue: 0.473,
  },
  "90": {
    attack: 337,
    modifier: "Energy Regen",
    modifierValue: 0.518,
  },
  "20+": {
    attack: 88,
    modifier: "Energy Regen",
    modifierValue: 0.204,
  },
  "40+": {
    attack: 151,
    modifier: "Energy Regen",
    modifierValue: 0.294,
  },
  "50+": {
    attack: 192,
    modifier: "Energy Regen",
    modifierValue: 0.33899999999999997,
  },
  "60+": {
    attack: 233,
    modifier: "Energy Regen",
    modifierValue: 0.38299999999999995,
  },
  "70+": {
    attack: 273,
    modifier: "Energy Regen",
    modifierValue: 0.428,
  },
  "80+": {
    attack: 314,
    modifier: "Energy Regen",
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
