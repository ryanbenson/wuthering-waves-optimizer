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
  name: "Static Mist",
  description:
    "Grip the sleek frame and feel its cool surface as you aim down the sight. With a pull of the trigger, unleash a thick smoke barrage onto the battlefield with these powerful Pistols in your hands.",
  type: "Pistols",
  rarity: 5,
  passiveName: "Stormy Resolution",
  passiveValue:
    "Increases Energy Regen by 12.8%/16%/19.2%/22.4%/25.6%. When Outro Skill is released, increases the switched-in Resonator's ATK by 10%/12.5%/15%/17.5%/20%, stacking up to 1 time(s). This effect lasts for 14s.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 47,
    modifier: "Crit. Rate",
    modifierValue: 0.054,
  },
  "20": {
    attack: 122,
    modifier: "Crit. Rate",
    modifierValue: 0.095,
  },
  "40": {
    attack: 232,
    modifier: "Crit. Rate",
    modifierValue: 0.137,
  },
  "50": {
    attack: 303,
    modifier: "Crit. Rate",
    modifierValue: 0.158,
  },
  "60": {
    attack: 374,
    modifier: "Crit. Rate",
    modifierValue: 0.179,
  },
  "70": {
    attack: 445,
    modifier: "Crit. Rate",
    modifierValue: 0.2,
  },
  "80": {
    attack: 516,
    modifier: "Crit. Rate",
    modifierValue: 0.221,
  },
  "90": {
    attack: 587,
    modifier: "Crit. Rate",
    modifierValue: 0.243,
  },
  "20+": {
    attack: 153,
    modifier: "Crit. Rate",
    modifierValue: 0.095,
  },
  "40+": {
    attack: 264,
    modifier: "Crit. Rate",
    modifierValue: 0.137,
  },
  "50+": {
    attack: 335,
    modifier: "Crit. Rate",
    modifierValue: 0.158,
  },
  "60+": {
    attack: 406,
    modifier: "Crit. Rate",
    modifierValue: 0.179,
  },
  "70+": {
    attack: 476,
    modifier: "Crit. Rate",
    modifierValue: 0.2,
  },
  "80+": {
    attack: 547,
    modifier: "Crit. Rate",
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
