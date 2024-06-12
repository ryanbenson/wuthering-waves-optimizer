const weaponInfo: WeaponInfo = {
  name: "Helios Cleaver",
  description:
    "The Broadblade born from the aerial phenomenon. The blacksmith incorporates the feelings of witnessing the alien star into the weapon, making it look hollow and light, but it can exert the invincible gravity of the starfall.",
  type: "Broadblade",
  rarity: 4,
  passiveName: "Plasma Recoiler",
  passiveValue:
    "Within 12s after Resonance Skill is released, increases ATK by 3%/3.75%/4.5%/5.25%/6% every 2s, stacking up to 4 time(s). When the number of stacks reaches 12, all stacks will be reset within 1s.",
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
