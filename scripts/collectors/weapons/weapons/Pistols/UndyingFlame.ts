const weaponInfo: WeaponInfo = {
  name: "Undying Flame",
  description:
    "A weapon designed to commemorate the Midnight Rangers' dedication. \"Let my body ablaze, flames dance to banish all evil's haze.\"",
  type: "Pistols",
  rarity: 4,
  passiveName: "Loyalty",
  passiveValue:
    "When Intro Skill is released, increases Resonance Skill DMG Bonus by 20%/25%/30%/35%/40% for 15s.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 33,
    modifier: "ATK",
    modifierValue: 0.067,
  },
  "20": {
    attack: 85,
    modifier: "ATK",
    modifierValue: 0.11900000000000001,
  },
  "40": {
    attack: 163,
    modifier: "ATK",
    modifierValue: 0.172,
  },
  "50": {
    attack: 213,
    modifier: "ATK",
    modifierValue: 0.198,
  },
  "60": {
    attack: 263,
    modifier: "ATK",
    modifierValue: 0.22399999999999998,
  },
  "70": {
    attack: 312,
    modifier: "ATK",
    modifierValue: 0.251,
  },
  "80": {
    attack: 362,
    modifier: "ATK",
    modifierValue: 0.27699999999999997,
  },
  "90": {
    attack: 412,
    modifier: "ATK",
    modifierValue: 0.303,
  },
  "20+": {
    attack: 107,
    modifier: "ATK",
    modifierValue: 0.11900000000000001,
  },
  "40+": {
    attack: 185,
    modifier: "ATK",
    modifierValue: 0.172,
  },
  "50+": {
    attack: 235,
    modifier: "ATK",
    modifierValue: 0.198,
  },
  "60+": {
    attack: 285,
    modifier: "ATK",
    modifierValue: 0.22399999999999998,
  },
  "70+": {
    attack: 334,
    modifier: "ATK",
    modifierValue: 0.251,
  },
  "80+": {
    attack: 384,
    modifier: "ATK",
    modifierValue: 0.27699999999999997,
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
