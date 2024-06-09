interface WeaponInfo {
  name: string;
  description: string;
  type: string;
  rarity: number;
  passiveName: string;
  passiveValue: string;
}

interface WeaponLevelData {
  attack: number;
  modifier: string;
  modifierValue: number;
}

interface WeaponData {
  [level: string]: WeaponLevelData;
}

const weaponInfo: WeaponInfo = {
  name: "Stonard",
  description:
    "These Gauntlets are ceremonial weapon used at the inauguration ceremony of the Huanglong Magistrate. The golden ginkgo leaf pattern represents that Huanglong should be like a ginkgo, although it is left alone in the world, it is still prosperous and long-lasting.",
  type: "Gauntlets",
  rarity: 4,
  passiveName: "Wallbreaker",
  passiveValue:
    "When Resonance Skill is released, increases the caster's Resonance Liberation DMG Bonus by 18%/27%/36%/45%/54%, lasting for 15s.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 33,
    modifier: "CritRate",
    modifierValue: 0.045,
  },
  "20": {
    attack: 85,
    modifier: "CritRate",
    modifierValue: 0.079,
  },
  "40": {
    attack: 163,
    modifier: "CritRate",
    modifierValue: 0.114,
  },
  "50": {
    attack: 213,
    modifier: "CritRate",
    modifierValue: 0.132,
  },
  "60": {
    attack: 263,
    modifier: "CritRate",
    modifierValue: 0.149,
  },
  "70": {
    attack: 312,
    modifier: "CritRate",
    modifierValue: 0.167,
  },
  "80": {
    attack: 362,
    modifier: "CritRate",
    modifierValue: 0.184,
  },
  "90": {
    attack: 412,
    modifier: "CritRate",
    modifierValue: 0.202,
  },
  "20+": {
    attack: 107,
    modifier: "CritRate",
    modifierValue: 0.079,
  },
  "40+": {
    attack: 185,
    modifier: "CritRate",
    modifierValue: 0.114,
  },
  "50+": {
    attack: 235,
    modifier: "CritRate",
    modifierValue: 0.132,
  },
  "60+": {
    attack: 285,
    modifier: "CritRate",
    modifierValue: 0.149,
  },
  "70+": {
    attack: 334,
    modifier: "CritRate",
    modifierValue: 0.167,
  },
  "80+": {
    attack: 384,
    modifier: "CritRate",
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

export function getWeapon() {
  return {
    info: weaponInfo,
    data: weaponData,
    getWeaponInfo,
    getWeaponData,
    getWeaponDataByLevel,
  };
}
