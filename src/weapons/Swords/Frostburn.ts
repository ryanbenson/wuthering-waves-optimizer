const weaponInfo: WeaponInfo = {
  name: "Frostburn",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/Frostburn.png",
  description:
    `How keen a blade it takes to impale this unrelenting night?<br>She presses ever forward for the answer, those unbound wishes roaring in her veins.`,
  type: "Sword",
  rarity: 5,
  passiveName: "Self No More",
  passiveValue:
    "ATK is increased by 12%. When the wielder applies Glacio Chafe, Glacio DMG is Amplified by 28%, and Resonance Liberation DMG ignores 10% of the target's DEF for 20%s. If the wielder is the active Resonator in the team, Glacio Chafe DMG dealt to all targets within a certain range is Amplified by 20% for 6s. This effect can be triggered up to 1 time every 0.1s. Only the strongest effect of the same name applies.",
  passiveData: [
    {
      key: "FrostburnATK",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details: "ATK is increased by 12%/15%/18%/21%/24%.",
      alwaysEnabled: true,
    },
    {
      key: "FrostburnGlacioDMGBonus",
      hasStacks: false,
      modifier: "DMGDeepen:Glacio",
      modifierByRefinement: {
        "1": 0.28,
        "2": 0.35,
        "3": 0.42,
        "4": 0.49,
        "5": 0.56,
      },
      minStacks: 0,
      maxStacks: 0,
      details:
        "When the wielder applies Glacio Chafe, Glacio DMG is Amplified by 28%/35%/42%/49%/56%",
      alwaysEnabled: false,
    },
    {
      key: "FrostburnResonanceLiberationDMGIgnoreDEF",
      hasStacks: false,
      modifier: "DEFIgnore:Liberation",
      modifierByRefinement: {
        "1": 0.1,
        "2": 0.125,
        "3": 0.15,
        "4": 0.175,
        "5": 0.2,
      },
      minStacks: 0,
      maxStacks: 1,
      details:
        "Resonance Liberation DMG ignores 10%/12.5%/15%/17.5%/20% of the target's DEF for 20%s",
      alwaysEnabled: false,
    },
    {
      key: "FrostburnDMGDeepenGlacioChafe",
      hasStacks: false,
      modifier: "DMGDeepen:GlacioChafe",
      modifierByRefinement: {
        "1": 0.2,
        "2": 0.25,
        "3": 0.3,
        "4": 0.35,
        "5": 0.4,
      },
      minStacks: 0,
      maxStacks: 1,
      details:
        "Glacio Chafe DMG dealt to all targets within a certain range is Amplified by 20%/25%/30%/35%/40% for 6s. This effect can be triggered up to 1 time every 0.1s. Only the strongest effect of the same name applies.",
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
  "40": {
    attack: 232,
    modifier: "CritRate",
    modifierValue: 0.137,
  },
  "50": {
    attack: 303,
    modifier: "CritRate",
    modifierValue: 0.158,
  },
  "60": {
    attack: 374,
    modifier: "CritRate",
    modifierValue: 0.179,
  },
  "70": {
    attack: 445,
    modifier: "CritRate",
    modifierValue: 0.2,
  },
  "80": {
    attack: 516,
    modifier: "CritRate",
    modifierValue: 0.221,
  },
  "90": {
    attack: 587,
    modifier: "CritRate",
    modifierValue: 0.243,
  },
  "20+": {
    attack: 153,
    modifier: "CritRate",
    modifierValue: 0.095,
  },
  "40+": {
    attack: 264,
    modifier: "CritRate",
    modifierValue: 0.137,
  },
  "50+": {
    attack: 335,
    modifier: "CritRate",
    modifierValue: 0.158,
  },
  "60+": {
    attack: 406,
    modifier: "CritRate",
    modifierValue: 0.179,
  },
  "70+": {
    attack: 476,
    modifier: "CritRate",
    modifierValue: 0.2,
  },
  "80+": {
    attack: 547,
    modifier: "CritRate",
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

export function getWeapon() {
  return {
    info: weaponInfo,
    data: weaponData,
    getWeaponInfo,
    getWeaponData,
    getWeaponDataByLevel,
  };
}
