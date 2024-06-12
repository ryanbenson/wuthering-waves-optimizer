const weaponInfo: WeaponInfo = {
  name: "Augment",
  description:
    "This Rectifier is a ceremonial weapon used by the Jinzhou Magistrate of Huanglong at the inauguration ceremony. The golden ginkgo leaf pattern represents that Huanglong should be like ginkgo, although it is left alone in the world, it is still prosperous and long-lasting.",
  type: "Rectifier",
  rarity: 4,
  passiveName: "Forgiving Resilience",
  passiveValue:
    "When Resonance Liberation is released, increases the caster's ATK by 15%/23.25%/31.5%/39.75%/48%, lasting for 15s.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 33,
    modifier: "Crit. Rate",
    modifierValue: 0.045,
  },
  "20": {
    attack: 85,
    modifier: "Crit. Rate",
    modifierValue: 0.079,
  },
  "40": {
    attack: 163,
    modifier: "Crit. Rate",
    modifierValue: 0.114,
  },
  "50": {
    attack: 213,
    modifier: "Crit. Rate",
    modifierValue: 0.132,
  },
  "60": {
    attack: 263,
    modifier: "Crit. Rate",
    modifierValue: 0.149,
  },
  "70": {
    attack: 312,
    modifier: "Crit. Rate",
    modifierValue: 0.16699999999999998,
  },
  "80": {
    attack: 362,
    modifier: "Crit. Rate",
    modifierValue: 0.184,
  },
  "90": {
    attack: 412,
    modifier: "Crit. Rate",
    modifierValue: 0.20199999999999999,
  },
  "20+": {
    attack: 107,
    modifier: "Crit. Rate",
    modifierValue: 0.079,
  },
  "40+": {
    attack: 185,
    modifier: "Crit. Rate",
    modifierValue: 0.114,
  },
  "50+": {
    attack: 235,
    modifier: "Crit. Rate",
    modifierValue: 0.132,
  },
  "60+": {
    attack: 285,
    modifier: "Crit. Rate",
    modifierValue: 0.149,
  },
  "70+": {
    attack: 334,
    modifier: "Crit. Rate",
    modifierValue: 0.16699999999999998,
  },
  "80+": {
    attack: 384,
    modifier: "Crit. Rate",
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
