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
    attack: 33,
    modifier: "EnergyRegen",
    modifierValue: 0.171,
  },
  "20": {
    attack: 85,
    modifier: "EnergyRegen",
    modifierValue: 0.304,
  },
  "40": {
    attack: 163,
    modifier: "EnergyRegen",
    modifierValue: 0.437,
  },
  "50": {
    attack: 213,
    modifier: "EnergyRegen",
    modifierValue: 0.504,
  },
  "60": {
    attack: 263,
    modifier: "EnergyRegen",
    modifierValue: 0.57,
  },
  "70": {
    attack: 312,
    modifier: "EnergyRegen",
    modifierValue: 0.637,
  },
  "80": {
    attack: 362,
    modifier: "EnergyRegen",
    modifierValue: 0.703,
  },
  "90": {
    attack: 412,
    modifier: "EnergyRegen",
    modifierValue: 0.77,
  },
  "20+": {
    attack: 107,
    modifier: "EnergyRegen",
    modifierValue: 0.304,
  },
  "40+": {
    attack: 185,
    modifier: "EnergyRegen",
    modifierValue: 0.437,
  },
  "50+": {
    attack: 235,
    modifier: "EnergyRegen",
    modifierValue: 0.504,
  },
  "60+": {
    attack: 285,
    modifier: "EnergyRegen",
    modifierValue: 0.57,
  },
  "70+": {
    attack: 334,
    modifier: "EnergyRegen",
    modifierValue: 0.637,
  },
  "80+": {
    attack: 384,
    modifier: "EnergyRegen",
    modifierValue: 0.703,
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
