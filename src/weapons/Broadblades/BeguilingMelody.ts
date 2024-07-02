const weaponInfo: WeaponInfo = {
  name: "Beguiling Melody",
  description:
    "Forged from the scale of Jué, this weapon resembles a musical instrument more than a tool of destruction.",
  type: "Broadblade",
  rarity: 5,
  passiveName: "Heaven Blessed",
  passiveValue:
    "When Intro Skill is cast, restores 4/5/6/7/8 Concerto Energy. When Outro Skill is cast, restores 4/5/6/7/8 Resonance Energy.",
  passiveData: [],
};

const weaponData: WeaponData = {
  "1": {
    attack: 24,
    modifier: "ATK",
    modifierValue: 0.067,
  },
  "20": {
    attack: 62,
    modifier: "ATK",
    modifierValue: 0.119,
  },
  "40": {
    attack: 118,
    modifier: "ATK",
    modifierValue: 0.172,
  },
  "50": {
    attack: 155,
    modifier: "ATK",
    modifierValue: 0.198,
  },
  "60": {
    attack: 191,
    modifier: "ATK",
    modifierValue: 0.224,
  },
  "70": {
    attack: 227,
    modifier: "ATK",
    modifierValue: 0.251,
  },
  "80": {
    attack: 263,
    modifier: "ATK",
    modifierValue: 0.277,
  },
  "90": {
    attack: 300,
    modifier: "ATK",
    modifierValue: 0.303,
  },
  "20+": {
    attack: 78,
    modifier: "ATK",
    modifierValue: 0.119,
  },
  "40+": {
    attack: 134,
    modifier: "ATK",
    modifierValue: 0.172,
  },
  "50+": {
    attack: 171,
    modifier: "ATK",
    modifierValue: 0.198,
  },
  "60+": {
    attack: 207,
    modifier: "ATK",
    modifierValue: 0.251,
  },
  "70+": {
    attack: 243,
    modifier: "ATK",
    modifierValue: 0.251,
  },
  "80+": {
    attack: 279,
    modifier: "ATK",
    modifierValue: 0.277,
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
