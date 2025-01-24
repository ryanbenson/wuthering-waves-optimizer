const weaponInfo: WeaponInfo = {
  name: "Lustrous Razor",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/LustrousRazor.png",
  description:
    "Gaze upon this Broadblade, its sharp edges glistening in the frigid air. As you wield it, you feel the power coursing through like a frozen river.",
  type: "Broadblade",
  rarity: 5,
  passiveName: "Incision",
  passiveValue:
    "Increases Energy Regen by 12.8%/16%/19.2%/22.4%/25.6%. When Resonance Skill is released, Resonance Liberation DMG is increased by 7%/8.75%/10.5%/12.25%/14%, stacking up to 3 times. This effect lasts for 12s.",
  passiveData: [
    {
      key: "LustrousRazorEnergyRegen",
      hasStacks: false,
      modifier: "EnergyRegen",
      modifierByRefinement: {
        "1": 0.128,
        "2": 0.16,
        "3": 0.192,
        "4": 0.224,
        "5": 0.256,
      },
      details: "Increases Energy Regen by 12.8%/16%/19.2%/22.4%/25.6%.",
      alwaysEnabled: true,
    },
    {
      key: "LustrousRazorResonanceLiberationDMGBonus",
      hasStacks: true,
      modifier: "ResonanceLiberationDMGBonus",
      modifierByRefinement: {
        "1": 0.07,
        "2": 0.0875,
        "3": 0.105,
        "4": 0.1225,
        "5": 0.14,
      },
      minStacks: 0,
      maxStacks: 3,
      details:
        "When Resonance Skill is released, Resonance Liberation DMG is increased by 7%/8.75%/10.5%/12.25%/14%, stacking up to 3 times. This effect lasts for 12s.",
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 47,
    modifier: "ATK",
    modifierValue: 0.081,
  },
  "20": {
    attack: 122,
    modifier: "ATK",
    modifierValue: 0.143,
  },
  "40": {
    attack: 232,
    modifier: "ATK",
    modifierValue: 0.206,
  },
  "50": {
    attack: 303,
    modifier: "ATK",
    modifierValue: 0.238,
  },
  "60": {
    attack: 374,
    modifier: "ATK",
    modifierValue: 0.269,
  },
  "70": {
    attack: 445,
    modifier: "ATK",
    modifierValue: 0.301,
  },
  "80": {
    attack: 516,
    modifier: "ATK",
    modifierValue: 0.332,
  },
  "90": {
    attack: 587,
    modifier: "ATK",
    modifierValue: 0.364,
  },
  "20+": {
    attack: 153,
    modifier: "ATK",
    modifierValue: 0.143,
  },
  "40+": {
    attack: 264,
    modifier: "ATK",
    modifierValue: 0.206,
  },
  "50+": {
    attack: 335,
    modifier: "ATK",
    modifierValue: 0.238,
  },
  "60+": {
    attack: 406,
    modifier: "ATK",
    modifierValue: 0.269,
  },
  "70+": {
    attack: 476,
    modifier: "ATK",
    modifierValue: 0.301,
  },
  "80+": {
    attack: 547,
    modifier: "ATK",
    modifierValue: 0.332,
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
