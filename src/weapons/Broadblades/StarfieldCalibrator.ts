const weaponInfo: WeaponInfo = {
  name: "Starfield Calibrator",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/StarfieldCalibrator.png",
  description: `Every pattern can be observed. Every phenomenon can be understood.
The ideal may lie light-years away, yet the path toward it rests within her own hands.`,
  type: "Broadblade",
  rarity: 5,
  passiveName: `Definite Solution`,
  passiveValue: `<span class="skilldescription">Increases DEF by <span class="Param">16%/20%/24%/28%/32%</span>. Casting Resonance Liberation restores <span class="Param">8/10/12/14/16</span> points of Concerto Energy. This effect can be triggered 1 stack every 20s. When the wielder heals Resonators, increases Crit. DMG of all nearby Resonators in the team by <span class="Param">20%/25%/30%/35%/40%</span> for 4s. Effects of the same name cannot be stacked.</span>`,
  passiveData: [
    {
      key: "DefiniteSolutionDEF",
      hasStacks: false,
      modifier: "DEF",
      modifierByRefinement: {
        "1": 0.16,
        "2": 0.2,
        "3": 0.24,
        "4": 0.28,
        "5": 0.32,
      },
      details: `Increases DEF by <span class="Param">16%/20%/24%/28%/32%</span>`,
      alwaysEnabled: true,
    },
    {
      key: "DefiniteSolutionCritDMG",
      hasStacks: false,
      modifier: "CritDMG",
      modifierByRefinement: {
        "1": 0.2,
        "2": 0.25,
        "3": 0.3,
        "4": 0.35,
        "5": 0.4,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `When the wielder heals Resonators, increases Crit. DMG of all nearby Resonators in the team by <span class="Param">20%/25%/30%/35%/40%</span> for 4s. Effects of the same name cannot be stacked.`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 40,
    modifier: "CritRate",
    modifierValue: 0.08,
  },
  "20": {
    attack: 104,
    modifier: "CritRate",
    modifierValue: 0.142,
  },
  "40": {
    attack: 198,
    modifier: "CritRate",
    modifierValue: 0.204,
  },
  "50": {
    attack: 258,
    modifier: "CritRate",
    modifierValue: 0.235,
  },
  "60": {
    attack: 318,
    modifier: "CritRate",
    modifierValue: 0.266,
  },
  "70": {
    attack: 379,
    modifier: "CritRate",
    modifierValue: 0.297,
  },
  "80": {
    attack: 439,
    modifier: "CritRate",
    modifierValue: 0.328,
  },
  "90": {
    attack: 500,
    modifier: "CritRate",
    modifierValue: 0.36,
  },
  "20+": {
    attack: 130,
    modifier: "CritRate",
    modifierValue: 0.142,
  },
  "40+": {
    attack: 224,
    modifier: "CritRate",
    modifierValue: 0.204,
  },
  "50+": {
    attack: 285,
    modifier: "CritRate",
    modifierValue: 0.235,
  },
  "60+": {
    attack: 345,
    modifier: "CritRate",
    modifierValue: 0.266,
  },
  "70+": {
    attack: 405,
    modifier: "CritRate",
    modifierValue: 0.297,
  },
  "80+": {
    attack: 466,
    modifier: "CritRate",
    modifierValue: 0.328,
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
