const weaponInfo: WeaponInfo = {
  name: "Rectifier of Voyager",
  description:
    "The Rectifier provided by the Pioneer Association for the explorers, with bright colors, not easy to lose, hard texture, can cope with various extreme environments for a long time, is very popular among the explorers.",
  type: "Rectifier",
  rarity: 3,
  passiveName: "Crusade",
  passiveValue:
    "When Resonance Skill is released, restores Resonance Energy by 8/9/10/11/12. This effect can be triggered 1 time(s) every 20s.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 24,
    modifier: "Energy Regen",
    modifierValue: 0.07200000000000001,
  },
  "20": {
    attack: 62,
    modifier: "Energy Regen",
    modifierValue: 0.127,
  },
  "40": {
    attack: 118,
    modifier: "Energy Regen",
    modifierValue: 0.183,
  },
  "50": {
    attack: 155,
    modifier: "Energy Regen",
    modifierValue: 0.21100000000000002,
  },
  "60": {
    attack: 191,
    modifier: "Energy Regen",
    modifierValue: 0.239,
  },
  "70": {
    attack: 227,
    modifier: "Energy Regen",
    modifierValue: 0.267,
  },
  "80": {
    attack: 263,
    modifier: "Energy Regen",
    modifierValue: 0.295,
  },
  "90": {
    attack: 300,
    modifier: "Energy Regen",
    modifierValue: 0.32299999999999995,
  },
  "20+": {
    attack: 78,
    modifier: "Energy Regen",
    modifierValue: 0.127,
  },
  "40+": {
    attack: 134,
    modifier: "Energy Regen",
    modifierValue: 0.183,
  },
  "50+": {
    attack: 171,
    modifier: "Energy Regen",
    modifierValue: 0.21100000000000002,
  },
  "60+": {
    attack: 207,
    modifier: "Energy Regen",
    modifierValue: 0.239,
  },
  "70+": {
    attack: 243,
    modifier: "Energy Regen",
    modifierValue: 0.267,
  },
  "80+": {
    attack: 279,
    modifier: "Energy Regen",
    modifierValue: 0.295,
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
