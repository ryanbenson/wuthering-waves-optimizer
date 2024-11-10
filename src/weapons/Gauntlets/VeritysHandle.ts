const weaponInfo: WeaponInfo = {
  key: "VeritysHandle",
  name: "Verity's Handle",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/VeritysHandle.png",
  description: "",
  type: "Gauntlets",
  rarity: 5,
  passiveName: "Exploring the Origin",
  passiveValue:
    "All attribute damage bonus increases by 12%/15%/18%/21%/24%. When casting Resonance Liberation, Resonance Liberation DMG increases by 48%/60%/72%/84%/96% and lasts for 8 seconds; when casting Resonance Skills, this effect is extended by 5 seconds, and can be extended up to 3 times.",
  passiveData: [
    {
      key: "VeritysHandleAllAttributeDMGBonus",
      hasStacks: false,
      modifier: "AllElementAttributeBonus",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      minStacks: 0,
      maxStacks: 0,
      details: "All attribute damage bonus increases by 12%/15%/18%/21%/24%.",
      alwaysEnabled: false,
    },
    {
      key: "VeritysHandleResonanceLiberationDMGBonus",
      hasStacks: false,
      modifier: "ResonanceLiberationDMGBonus",
      modifierByRefinement: {
        "1": 0.48,
        "2": 0.6,
        "3": 0.72,
        "4": 0.84,
        "5": 0.96,
      },
      minStacks: 0,
      maxStacks: 0,
      details:
        "When casting Resonance Liberation, Resonance Liberation DMG increases by 48%/60%/72%/84%/96% and lasts for 8 seconds; when casting Resonance Skills, this effect is extended by 5 seconds, and can be extended up to 3 times.",
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 47,
    modifier: "CritRate",
    modifierValue: 0.054,
  },
  "20": {
    attack: 122,
    modifier: "CritRate",
    modifierValue: 0.095,
  },
  "20+": {
    attack: 153,
    modifier: "CritRate",
    modifierValue: 0.095,
  },
  "40": {
    attack: 232,
    modifier: "CritRate",
    modifierValue: 0.137,
  },
  "40+": {
    attack: 264,
    modifier: "CritRate",
    modifierValue: 0.137,
  },
  "50": {
    attack: 303,
    modifier: "CritRate",
    modifierValue: 0.158,
  },
  "50+": {
    attack: 335,
    modifier: "CritRate",
    modifierValue: 0.158,
  },
  "60": {
    attack: 374,
    modifier: "CritRate",
    modifierValue: 0.179,
  },
  "60+": {
    attack: 406,
    modifier: "CritRate",
    modifierValue: 0.179,
  },
  "70": {
    attack: 445,
    modifier: "CritRate",
    modifierValue: 0.2,
  },
  "70+": {
    attack: 476,
    modifier: "CritRate",
    modifierValue: 0.2,
  },
  "80": {
    attack: 516,
    modifier: "CritRate",
    modifierValue: 0.221,
  },
  "80+": {
    attack: 547,
    modifier: "CritRate",
    modifierValue: 0.221,
  },
  "90": {
    attack: 587,
    modifier: "CritRate",
    modifierValue: 0.243,
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
