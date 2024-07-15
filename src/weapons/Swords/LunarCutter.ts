const weaponInfo: WeaponInfo = {
  name: "Lunar Cutter",
  description:
    "The Sword born from the aerial phenomenon. The forger integrates the feelings of witnessing the alien star into the weapon, making it look light and sharp, but it can exert the energy of breaking the sky and cutting iron like mud.",
  type: "Sword",
  rarity: 4,
  passiveName: "Preordained",
  passiveValue:
    "Equipped Resonator gains 6 stack(s) of Oath upon entering the battlefield. Each stack increases ATK by 2%/2.5%/3%/3.5%/4%, up to 6 stacks. This effect can be triggered 1 time(s) every 12s.  Oath reduces by 1 stack(s) every 2s. Equipped Resonator gains an additional 6 stack(s) of Oath upon defeating an enemy.",
  passiveData: [
    {
      key: "LunarCutterATK",
      hasStacks: true,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.02,
        "2": 0.025,
        "3": 0.03,
        "4": 0.035,
        "5": 0.04,
      },
      minStacks: 0,
      maxStacks: 6,
      details:
        "Equipped Resonator gains 6 stack(s) of Oath upon entering the battlefield. Each stack increases ATK by 2%/2.5%/3%/3.5%/4%, up to 6 stacks. This effect can be triggered 1 time(s) every 12s.  Oath reduces by 1 stack(s) every 2s. Equipped Resonator gains an additional 6 stack(s) of Oath upon defeating an enemy.",
      alwaysEnabled: false,
    },
  ],
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
    modifierValue: 0.119,
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
    modifierValue: 0.224,
  },
  "70": {
    attack: 312,
    modifier: "ATK",
    modifierValue: 0.251,
  },
  "80": {
    attack: 362,
    modifier: "ATK",
    modifierValue: 0.277,
  },
  "90": {
    attack: 412,
    modifier: "ATK",
    modifierValue: 0.303,
  },
  "20+": {
    attack: 107,
    modifier: "ATK",
    modifierValue: 0.119,
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
    modifierValue: 0.224,
  },
  "70+": {
    attack: 334,
    modifier: "ATK",
    modifierValue: 0.251,
  },
  "80+": {
    attack: 384,
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
