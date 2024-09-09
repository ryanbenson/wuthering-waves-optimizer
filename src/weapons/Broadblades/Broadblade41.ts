const weaponInfo: WeaponInfo = {
  name: "Broadblade#41",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/Broadblade41.png",
  description:
    "Improved version of a mass-produced broadblade model developed in Huanglong. With its formidable performance and innovative technologies, this broadblade carries a weight only to be wielded by seasoned warriors.",
  type: "Broadblade",
  rarity: 4,
  passiveName: "Veteran",
  passiveValue:
    "When the Resonator's HP is above 80%, increases ATK by 12%/15%/18%/21%/24%. When the Resonator's HP is below 40%/50%/60%/70%/80%, restores their HP by 5%/6.25%/7.5%/8.75%/10% for dealing Basic Attack DMG or Heavy Attack DMG. This effect can be triggered 1 time(s) every 8s.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 33,
    modifier: "EnergyRegen",
    modifierValue: 0.072,
  },
  "20": {
    attack: 85,
    modifier: "EnergyRegen",
    modifierValue: 0.127,
  },
  "40": {
    attack: 163,
    modifier: "EnergyRegen",
    modifierValue: 0.183,
  },
  "50": {
    attack: 213,
    modifier: "EnergyRegen",
    modifierValue: 0.211,
  },
  "60": {
    attack: 263,
    modifier: "EnergyRegen",
    modifierValue: 0.239,
  },
  "70": {
    attack: 312,
    modifier: "EnergyRegen",
    modifierValue: 0.267,
  },
  "80": {
    attack: 362,
    modifier: "EnergyRegen",
    modifierValue: 0.295,
  },
  "90": {
    attack: 412,
    modifier: "EnergyRegen",
    modifierValue: 0.323,
  },
  "20+": {
    attack: 107,
    modifier: "EnergyRegen",
    modifierValue: 0.127,
  },
  "40+": {
    attack: 185,
    modifier: "EnergyRegen",
    modifierValue: 0.183,
  },
  "50+": {
    attack: 235,
    modifier: "EnergyRegen",
    modifierValue: 0.211,
  },
  "60+": {
    attack: 285,
    modifier: "EnergyRegen",
    modifierValue: 0.239,
  },
  "70+": {
    attack: 334,
    modifier: "EnergyRegen",
    modifierValue: 0.267,
  },
  "80+": {
    attack: 384,
    modifier: "EnergyRegen",
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

export function getWeapon() {
  return {
    info: weaponInfo,
    data: weaponData,
    getWeaponInfo,
    getWeaponData,
    getWeaponDataByLevel,
  };
}
