const weaponInfo: WeaponInfo = {
  name: "Ages of Harvest",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/AgesOfHarvest.png",
  description:
    "Some see swordsmanship as the embodiment of the flows and shifts of time and space, with every move representing the answer to a philosophical inquisition into the ways of all beings. This bendy sword with its graceful handling seems to be capable of deconstructing even the indestructible and breaking away all that are in stasis: permafrost and stagnant time.",
  type: "Broadblade",
  rarity: 5,
  passiveName: "Heaven Blessed",
  passiveValue:
    "Gain 12%/15%/18%/21%/24% additional DMG Bonus for all Attributes. The wielder is bestowed with divine blessings and gains 1 stack of Blessing of Ages for each Basic Attack strike, for up to 4 stacks, which is removed when the wielder leaves the field. At 4 stacks of Blessing of Ages or more, the wielder consumes all stacks of Blessing of Ages when casting the next Resonance Skill, with its DMG increased by 48%/60%/72%/84%/96% for 2.5s. This can be triggered 1 time every 6s.",
  passiveData: [
    {
      key: "AgesofHarvestAllElementAttributeBonus",
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
        "Gain 12%/15%/18%/21%/24% additional DMG Bonus for all Attributes.",
      alwaysEnabled: true,
    },
    {
      key: "AgesofHarvestResonanceSkillDMGBonus",
      hasStacks: true,
      modifier: "ResonanceSkillDMGBonus",
      modifierByRefinement: {
        "1": 0.24,
        "2": 0.3,
        "3": 0.36,
        "4": 0.42,
        "5": 0.48,
      },
      minStacks: 0,
      maxStacks: 2,
      details:
        "When casting an Intro Skill, you gain [Yearly Essence] which increase Resonance Skill DMG by 24%/30%/36%/42%/48% for 12s. When casting a Resonance Skill, you gain [Blessings] which increase Resonance Skill DMG by 24%/30%/36%/42%/48% for 12s",
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
