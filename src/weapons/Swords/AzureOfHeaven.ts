const weaponInfo: WeaponInfo = {
  name: "Azure of Heaven",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/AzureOfHeaven.png",
  description: "Forged of flowing wind, sheathed in the azure sky. Once the blade is drawn, all sound falls still.\nThat never-fading azure is her resolve, her vow, and her ideal.",
  type: "Sword",
  rarity: 5,
  passiveName: "Unbending",
  passiveValue: "Grants 12%/15%/18%/21%/24% All-Attribute DMG Bonus. When Havoc Bane is applied, Heavy Attack DMG is Amplified by 36%/45%/54%/63%/72%, and Heavy Attack DMG ignores 12%/15%/18%/21%/24% of the target's DEF, for 8/8/8/8/8s.",
  passiveData: [
    {
      key: "AzureOfHeavenAllElementAttributeBonus",
      hasStacks: false,
      modifier: "AllElementAttributeBonus",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details: "Grants 12%/15%/18%/21%/24% All-Attribute DMG Bonus.",
      alwaysEnabled: true,
    },
    {
      key: "AzureOfHeavenHeavyAmplify",
      hasStacks: false,
      modifier: "DMGDeepen:Heavy",
      modifierByRefinement: {
        "1": 0.36,
        "2": 0.45,
        "3": 0.54,
        "4": 0.63,
        "5": 0.72,
      },
      details: "When Havoc Bane is applied, Heavy Attack DMG is Amplified by 36%/45%/54%/63%/72% for 8s.",
      alwaysEnabled: false,
    },
    {
      key: "AzureOfHeavenHeavyDefIgnore",
      hasStacks: false,
      modifier: "DEFIgnore:Heavy",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details: "WWhen Havoc Bane is applied, Heavy Attack DMG ignores 12%/15%/18%/21%/24% of the target's DEF, for 8s",
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
    modifierValue: 0.096,
  },
  "40": {
    attack: 232,
    modifier: "CritRate",
    modifierValue: 0.138,
  },
  "50": {
    attack: 303,
    modifier: "CritRate",
    modifierValue: 0.159,
  },
  "60": {
    attack: 374,
    modifier: "CritRate",
    modifierValue: 0.18,
  },
  "70": {
    attack: 445,
    modifier: "CritRate",
    modifierValue: 0.201,
  },
  "80": {
    attack: 516,
    modifier: "CritRate",
    modifierValue: 0.222,
  },
  "90": {
    attack: 587,
    modifier: "CritRate",
    modifierValue: 0.243,
  },
  "20+": {
    attack: 153,
    modifier: "CritRate",
    modifierValue: 0.096,
  },
  "40+": {
    attack: 264,
    modifier: "CritRate",
    modifierValue: 0.138,
  },
  "50+": {
    attack: 335,
    modifier: "CritRate",
    modifierValue: 0.159,
  },
  "60+": {
    attack: 406,
    modifier: "CritRate",
    modifierValue: 0.18,
  },
  "70+": {
    attack: 476,
    modifier: "CritRate",
    modifierValue: 0.201,
  },
  "80+": {
    attack: 547,
    modifier: "CritRate",
    modifierValue: 0.222,
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
