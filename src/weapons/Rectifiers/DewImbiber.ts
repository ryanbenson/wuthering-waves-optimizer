const weaponInfo: WeaponInfo = {
  name: "Dew Imbiber",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/DewImbiber.png",
  description: "WeaponConf_21050096_ObtainedShowDescription",
  type: "Rectifier",
  rarity: 5,
  passiveName: "Spring Wreath",
  passiveValue: "Max HP is increased by 12%/15%/18%/21%/24%. Casting Resonance Liberation restores 8/10/12/14/16 Concerto Energy. This effect is triggered once every 20s. Casting Intro Skill or Resonance Skill grants nearby Resonators in the team Kingfisher for 30s. If the wielder is on the field, Resonators with Kingfisher have their ATK increased by 20%/25%/30%/35%/40%. If the wielder is not on the field, gain Tinted Snow for 6s each time they inflict Glacio Chafe, and gain Ripples  for 6s each time they apply healing. Having Tinted Snow and Ripples simoutaneously enhances Kingfisher's effect. If the wielder has applied healing and inflicted Glacio Chafe while on the field, they gain both Tinted Snow and Ripples for 6s upon casting Outro Skill, and resets the aforementioned effects. Effects of the same name cannot be stacked.",
  passiveData: [
    {
      key: "DewImbiberMaxHP",
      hasStacks: false,
      modifier: "HP",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details: "Max HP is increased by 12%/15%/18%/21%/24%.",
      alwaysEnabled: true,
    },
    {
      key: "DewImbiberIntroSkillResonatorATKBonus",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.2,
        "2": 0.3,
        "3": 0.35,
        "4": 0.4,
        "5": 0.45,
      },
      details: "Casting Resonance Liberation restores 8/10/12/14/16 Concerto Energy. This effect is triggered once every 20s. Casting Intro Skill or Resonance Skill grants nearby Resonators in the team Kingfisher for 30s. If the wielder is on the field, Resonators with Kingfisher have their ATK increased by 20%/25%/30%/35%/40%. If the wielder is not on the field, gain Tinted Snow for 6s each time they inflict Glacio Chafe, and gain Ripples  for 6s each time they apply healing. Having Tinted Snow and Ripples simoutaneously enhances Kingfisher's effect. If the wielder has applied healing and inflicted Glacio Chafe while on the field, they gain both Tinted Snow and Ripples for 6s upon casting Outro Skill, and resets the aforementioned effects. Effects of the same name cannot be stacked.",
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
    modifierValue: 0.438,
  },
  "50": {
    attack: 213,
    modifier: "EnergyRegen",
    modifierValue: 0.504,
  },
  "60": {
    attack: 263,
    modifier: "EnergyRegen",
    modifierValue: 0.571,
  },
  "70": {
    attack: 312,
    modifier: "EnergyRegen",
    modifierValue: 0.637,
  },
  "80": {
    attack: 362,
    modifier: "EnergyRegen",
    modifierValue: 0.704,
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
    modifierValue: 0.438,
  },
  "50+": {
    attack: 235,
    modifier: "EnergyRegen",
    modifierValue: 0.504,
  },
  "60+": {
    attack: 285,
    modifier: "EnergyRegen",
    modifierValue: 0.571,
  },
  "70+": {
    attack: 334,
    modifier: "EnergyRegen",
    modifierValue: 0.637,
  },
  "80+": {
    attack: 384,
    modifier: "EnergyRegen",
    modifierValue: 0.704,
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
