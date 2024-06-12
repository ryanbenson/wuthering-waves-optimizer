const weaponInfo: WeaponInfo = {
  name: "Originite: Type IV",
  description:
    "To develop new Tacetite weapons, the Huaxu Academy has built a test-type Gauntlets for the purpose of technical verification. In addition to the impressive weapon performance, the biggest feature is that it can enhance the physical activity of the Resonator to heal wounds through attacks.",
  type: "Gauntlets",
  rarity: 3,
  passiveName: "Rejuvinate",
  passiveValue:
    "When hitting a target with Basic Attacks, restores HP by 0.5%/0.65%/0.8%/0.95%/1.1%. This effect can be triggered 1 time(s) every 3s.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 24,
    modifier: "CritDMG",
    modifierValue: 0.09,
  },
  "20": {
    attack: 62,
    modifier: "CritDMG",
    modifierValue: 0.159,
  },
  "40": {
    attack: 118,
    modifier: "CritDMG",
    modifierValue: 0.229,
  },
  "50": {
    attack: 155,
    modifier: "CritDMG",
    modifierValue: 0.264,
  },
  "60": {
    attack: 191,
    modifier: "CritDMG",
    modifierValue: 0.299,
  },
  "70": {
    attack: 227,
    modifier: "CritDMG",
    modifierValue: 0.334,
  },
  "80": {
    attack: 263,
    modifier: "CritDMG",
    modifierValue: 0.369,
  },
  "90": {
    attack: 300,
    modifier: "CritDMG",
    modifierValue: 0.405,
  },
  "20+": {
    attack: 78,
    modifier: "CritDMG",
    modifierValue: 0.159,
  },
  "40+": {
    attack: 134,
    modifier: "CritDMG",
    modifierValue: 0.229,
  },
  "50+": {
    attack: 171,
    modifier: "CritDMG",
    modifierValue: 0.264,
  },
  "60+": {
    attack: 207,
    modifier: "CritDMG",
    modifierValue: 0.299,
  },
  "70+": {
    attack: 243,
    modifier: "CritDMG",
    modifierValue: 0.334,
  },
  "80+": {
    attack: 279,
    modifier: "CritDMG",
    modifierValue: 0.369,
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
