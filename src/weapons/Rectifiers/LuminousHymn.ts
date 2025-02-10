const weaponInfo: WeaponInfo = {
  name: "Luminous Hymn",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/LuminousHymn.png",
  description:
    `"The Sentinel's grace, how sweet thou art. Our home was lost, but found at last. With twigs between my beaks, I brave the waves. Bound by love, we're crowned with holy light."`,
  type: "Rectifier",
  rarity: 5,
  passiveName: "Homebuilder's Anthem",
  passiveValue:
    "Increase ATK by 12%/15%/18%/21%/24%. Dealing DMG to enemies with Spectro Frazzle gives 14%/17.5%/21%/24.5%/28% Basic Attack and 14%/17.5%/21%/24.5%/28% Heavy Attack DMG Bonus respectively, stacking up to 3 times for 6s. Casing Outro Skill Amplifies the DMG from Spectro Frazzle on enemies around the active resonator by 30%/37.5%/45%/52.5%/60% for 30s. Effects of the same name cannot be stacked.",
  passiveData: [
    {
      key: "LuminousHymnATK",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details:
        `Increase ATK by <span class="param">12%/15%/18%/21%/24%.</span>`,
      alwaysEnabled: true,
    },
    {
      key: "LuminousHymnBasicDMGBonus",
      hasStacks: true,
      modifier: "BasicAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.14,
        "2": 0.175,
        "3": 0.21,
        "4": 0.245,
        "5": 0.28,
      },
      minStacks: 0,
      maxStacks: 3,
      details:
        `Dealing DMG to enemies with Spectro Frazzle gives <span class="param">14%/17.5%/21%/24.5%/28%</span> Basic Attack DMG Bonus, stacking up to 3 times for 6s.`,
      alwaysEnabled: false,
    },
    {
      key: "LuminousHymnHeavyDMGBonus",
      hasStacks: true,
      modifier: "HeavyAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.14,
        "2": 0.175,
        "3": 0.21,
        "4": 0.245,
        "5": 0.28,
      },
      minStacks: 0,
      maxStacks: 3,
      details:
        `Dealing DMG to enemies with Spectro Frazzle gives <span class="param">14%/17.5%/21%/24.5%/28%</span> Heavy Attack DMG Bonus, stacking up to 3 times for 6s.`,
      alwaysEnabled: false,
    },
    {
      key: "LuminousHymnSpectroFrazzle",
      hasStacks: false,
      modifier: "DMGDeepen:SpectroFrazzle",
      modifierByRefinement: {
        "1": 0.3,
        "2": 0.375,
        "3": 0.45,
        "4": 0.525,
        "5": 0.6,
      },
      minStacks: 0,
      maxStacks: 0,
      details:
        `Casing Outro Skill Amplifies the DMG from Spectro Frazzle on enemies around the active resonator by <span class="param">30%/37.5%/45%/52.5%/60%</span> for 30s. Effects of the same name cannot be stacked.`,
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
  "20+": {
    attack: 130,
    modifier: "CritRate",
    modifierValue: 0.142,
  },
  "40": {
    attack: 198,
    modifier: "CritRate",
    modifierValue: 0.204,
  },
  "40+": {
    attack: 224,
    modifier: "CritRate",
    modifierValue: 0.204,
  },
  "50": {
    attack: 258,
    modifier: "CritRate",
    modifierValue: 0.235,
  },
  "50+": {
    attack: 285,
    modifier: "CritRate",
    modifierValue: 0.235,
  },
  "60": {
    attack: 318,
    modifier: "CritRate",
    modifierValue: 0.266,
  },
  "60+": {
    attack: 345,
    modifier: "CritRate",
    modifierValue: 0.266,
  },
  "70": {
    attack: 379,
    modifier: "CritRate",
    modifierValue: 0.297,
  },
  "70+": {
    attack: 405,
    modifier: "CritRate",
    modifierValue: 0.297,
  },
  "80": {
    attack: 439,
    modifier: "CritRate",
    modifierValue: 0.328,
  },
  "80+": {
    attack: 466,
    modifier: "CritRate",
    modifierValue: 0.328,
  },
  "90": {
    attack: 500,
    modifier: "CritRate",
    modifierValue: 0.36,
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
