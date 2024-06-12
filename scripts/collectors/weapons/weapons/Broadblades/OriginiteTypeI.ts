const weaponInfo: WeaponInfo = {
  name: "Originite: Type I",
  description:
    "A mass-produced broadblade model developed in Huanglong. Codename: Order.",
  type: "Broadblade",
  rarity: 3,
  passiveName: "Temperance",
  passiveValue:
    "When Resonance Skill is released, restores HP by 3%/3.75%/4.5%/5.25%/6%. This effect can be triggered 1 time(s) every 12s.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 24,
    modifier: "DEF",
    modifierValue: 0.085,
  },
  "20": {
    attack: 62,
    modifier: "DEF",
    modifierValue: 0.151,
  },
  "40": {
    attack: 118,
    modifier: "DEF",
    modifierValue: 0.218,
  },
  "50": {
    attack: 155,
    modifier: "DEF",
    modifierValue: 0.251,
  },
  "60": {
    attack: 191,
    modifier: "DEF",
    modifierValue: 0.284,
  },
  "70": {
    attack: 227,
    modifier: "DEF",
    modifierValue: 0.318,
  },
  "80": {
    attack: 263,
    modifier: "DEF",
    modifierValue: 0.35100000000000003,
  },
  "90": {
    attack: 300,
    modifier: "DEF",
    modifierValue: 0.384,
  },
  "20+": {
    attack: 78,
    modifier: "DEF",
    modifierValue: 0.151,
  },
  "40+": {
    attack: 134,
    modifier: "DEF",
    modifierValue: 0.218,
  },
  "50+": {
    attack: 171,
    modifier: "DEF",
    modifierValue: 0.251,
  },
  "60+": {
    attack: 207,
    modifier: "DEF",
    modifierValue: 0.284,
  },
  "70+": {
    attack: 243,
    modifier: "DEF",
    modifierValue: 0.318,
  },
  "80+": {
    attack: 279,
    modifier: "DEF",
    modifierValue: 0.35100000000000003,
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
