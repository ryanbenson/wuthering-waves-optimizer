const weaponInfo: WeaponInfo = {
  name: "Pistols of Night",
  description:
    "May victory prevail the lasting night. This type of pistols not only carries the oath of protection but also contains the hope of rejuvenation.",
  type: "Pistols",
  rarity: 3,
  passiveName: "Chivalry",
  passiveValue:
    "When Intro Skill is released, increases ATK by 8%/10%/12%/14%/16%, lasting for 10s.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 26,
    modifier: "ATK",
    modifierValue: 0.054000000000000006,
  },
  "20": {
    attack: 67,
    modifier: "ATK",
    modifierValue: 0.095,
  },
  "40": {
    attack: 128,
    modifier: "ATK",
    modifierValue: 0.13699999999999998,
  },
  "50": {
    attack: 168,
    modifier: "ATK",
    modifierValue: 0.158,
  },
  "60": {
    attack: 207,
    modifier: "ATK",
    modifierValue: 0.179,
  },
  "70": {
    attack: 246,
    modifier: "ATK",
    modifierValue: 0.2,
  },
  "80": {
    attack: 285,
    modifier: "ATK",
    modifierValue: 0.221,
  },
  "90": {
    attack: 325,
    modifier: "ATK",
    modifierValue: 0.243,
  },
  "20+": {
    attack: 84,
    modifier: "ATK",
    modifierValue: 0.095,
  },
  "40+": {
    attack: 146,
    modifier: "ATK",
    modifierValue: 0.13699999999999998,
  },
  "50+": {
    attack: 185,
    modifier: "ATK",
    modifierValue: 0.158,
  },
  "60+": {
    attack: 224,
    modifier: "ATK",
    modifierValue: 0.179,
  },
  "70+": {
    attack: 263,
    modifier: "ATK",
    modifierValue: 0.2,
  },
  "80+": {
    attack: 303,
    modifier: "ATK",
    modifierValue: 0.221,
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
