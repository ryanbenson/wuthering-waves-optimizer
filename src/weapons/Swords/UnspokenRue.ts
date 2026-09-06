const weaponInfo: WeaponInfo = {
  name: "Unspoken Rue",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/UnspokenRue.png",
  description: "With this canopy, she sheltered all life and sealed the Evil Miasma. The Blight Rain ceased, the Miasmic Thunder fell silent, and a deep darkness lies trapped upon the canopy's surface. Beneath it linger the shadows of no return, always walking by her side.",
  type: "Sword",
  rarity: 5,
  passiveName: "Locked Thunder, Trapped Rain",
  passiveValue: "ATK is increased by 12%/15%/18%/21%/24%. Upon obtaining Unison, grants 30%/37.5%/45%/52.5%/60% Electro DMG Bonus for 30/30/30/30/30s.\nUpon obtaining Unison, grants the Binding Mind effect and removes Yearning Mind: Resonators in the team gain 24%/30%/36%/42%/48% Electro DMG Bonus for 30/30/30/30/30s. Effects of the same name cannot stack.\nWhen the wielder consumes Concerto Energy, grants the Yearning Mind effect and removes Binding Mind: the wielder additionally gains 40%/50%/60%/70%/80% Electro DMG Bonus for 14/14/14/14/14s. Switching to another Resonator ends this effect early.",
  passiveData: [
    {
      key: "UnspokenRueAtk",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details: "ATK is increased by 12/15/18/21/24%.",
      alwaysEnabled: true,
    },
    {
      key: "UnspokenRueElectro",
      hasStacks: false,
      modifier: "Electro",
      modifierByRefinement: {
        "1": 0.3,
        "2": 0.375,
        "3": 0.45,
        "4": 0.525,
        "5": 0.6,
      },
      details: "Upon obtaining Unison, grants 30%/37.5%/45%/52.5%/60% Electro DMG Bonus for 30/30/30/30/30s",
      alwaysEnabled: false,
    },
    {
      key: "UnspokenRueElectro2",
      hasStacks: false,
      modifier: "Electro",
      modifierByRefinement: {
        "1": 0.24,
        "2": 0.3,
        "3": 0.36,
        "4": 0.42,
        "5": 0.48,
      },
      details: "Upon obtaining Unison, grants the Binding Mind effect and removes Yearning Mind: Resonators in the team gain 24%/30%/36%/42%/48% Electro DMG Bonus for 30/30/30/30/30s. Effects of the same name cannot stack.",
      alwaysEnabled: false,
    },
    {
      key: "UnspokenRueElectro3",
      hasStacks: false,
      modifier: "Electro",
      modifierByRefinement: {
        "1": 0.4,
        "2": 0.5,
        "3": 0.6,
        "4": 0.7,
        "5": 0.8,
      },
      details: "When the wielder consumes Concerto Energy, grants the Yearning Mind effect and removes Binding Mind: the wielder additionally gains 40%/50%/60%/70%/80% Electro DMG Bonus for 14/14/14/14/14s. Switching to another Resonator ends this effect early.",
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
