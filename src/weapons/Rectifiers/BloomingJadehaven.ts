const weaponInfo: WeaponInfo = {
  name: "Blooming Jadehaven",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/BloomingJadehaven.png",
  description: "Jade to pillars, gold to nexus, a hundred mechanisms meshed into one working. Infinite forms divide and proliferate among the blooms, and it still fits in the palm of Her hand.\nWalls and mechanisms know no feeling. What makes a life's work worth the life is not the making, but that something in it was loved.",
  type: "Rectifier",
  rarity: 5,
  passiveName: "Hundredfold Artifice",
  passiveValue: "Grants 12%/15%/18%/21%/24% All-Attribute DMG Bonus. After the wielder inflicts Electro Flare or triggers Unison Response, Resonance Skill DMG is Amplified by 36%/45%/54%/63%/72% and ignores 10%/15%/20%/25%/30% of the target's Electro RES. While the wielder is on the field, Electro Flare DMG taken by targets within a certain range is Amplified by 30%/37.5%/45%/52.5%/60% for 30/30/30/30/30s. Only the highest value applies among effects of the same name.",
  passiveData: [
    {
      key: "BloomingsJadehavenAllElementAttributeBonus",
      hasStacks: false,
      modifier: "AllElementAttributeBonus",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details:
        "Grants 12%/15%/18%/21%/24% All-Attribute DMG Bonus",
      alwaysEnabled: true,
    },
    {
      key: "BloomingsJadehavenSkill",
      hasStacks: false,
      modifier: "DMGDeepen:Skill",
      modifierByRefinement: {
        "1": 0.36,
        "2": 0.45,
        "3": 0.54,
        "4": 0.63,
        "5": 0.72,
      },
      details:
        "After the wielder inflicts Electro Flare or triggers Unison Response, Resonance Skill DMG is Amplified by 36%/45%/54%/63%/72%",
      alwaysEnabled: false,
    },
    {
      key: "BloomingsJadehavenSkillShred",
      hasStacks: false,
      modifier: "ResistShred:Electro:Skill",
      modifierByRefinement: {
        "1": 0.1,
        "2": 0.15,
        "3": 0.2,
        "4": 0.25,
        "5": 0.3,
      },
      details:
        "After the wielder inflicts Electro Flare or triggers Unison Response, Resonance Skill DMG ignores 10%/15%/20%/25%/30% of the target's Electro RES.",
      alwaysEnabled: false,
    },
    {
      key: "BloomingsJadehavenFlareAmp",
      hasStacks: false,
      modifier: "DMGDeepen:ElectroFlare",
      modifierByRefinement: {
        "1": 0.3,
        "2": 0.375,
        "3": 0.45,
        "4": 0.525,
        "5": 0.6,
      },
      details:
        "While the wielder is on the field, Electro Flare DMG taken by targets within a certain range is Amplified by 30%/37.5%/45%/52.5%/60% for 30/30/30/30/30s. Only the highest value applies among effects of the same name.",
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
