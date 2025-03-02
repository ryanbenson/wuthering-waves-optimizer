const weaponInfo: WeaponInfo = {
  name: "Unflickering Valor",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/UnflickeringValor.png",
  description:
    "Blistering winds and crashing waves, the sea devours all. Only a lonely boat lamp stands alight! Onwards! Towards the edge of the world you shall sail!",
  type: "Sword",
  rarity: 5,
  passiveName: "Laughter Prevails",
  passiveValue: `Increase Crit. Rate by <span class="param">8%/10%/12%/14%/16%</span>. Casting Resonance Liberation gives <span class="param">24%/30%/36%/42%/48%</span> Basic Attack DMG Bonus for <span class="param">10</span>s. Dealing Basic Attack DMG gives <span class="param">24%/30%/36%/42%/48%</span> Basic Attack DMG Bonus for <span class="param">4</span>s.`,
  passiveData: [
    {
      key: "UnflickeringValorCritRate",
      hasStacks: false,
      modifier: "CritRate",
      modifierByRefinement: {
        "1": 0.08,
        "2": 0.1,
        "3": 0.12,
        "4": 0.14,
        "5": 0.16,
      },
      details: `Increase Crit. Rate by <span class="param">8%/10%/12%/14%/16%</span>`,
      alwaysEnabled: true,
    },
    {
      key: "UnflickeringValorBasicAttackDMGBonus",
      hasStacks: false,
      modifier: "BasicAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.24,
        "2": 0.3,
        "3": 0.36,
        "4": 0.42,
        "5": 0.48,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Casting Resonance Liberation gives <span class="param">24%/30%/36%/42%/48%</span> Basic Attack DMG Bonus for <span class="param">10</span>s.`,
      alwaysEnabled: false,
    },
    {
      key: "UnflickeringValorBasicAttackDMGBonus2",
      hasStacks: false,
      modifier: "BasicAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.24,
        "2": 0.3,
        "3": 0.36,
        "4": 0.42,
        "5": 0.48,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Dealing Basic Attack DMG gives <span class="param">24%/30%/36%/42%/48%</span> Basic Attack DMG Bonus for <span class="param">4</span>s`,
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
