const weaponInfo: WeaponInfo = {
  name: "Freeze Frame",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/FreezeFrame.png",
  description: `I remember the sunset spilling down, birds and insects threading their small songs through the greenhouse.<br>
I remember the quiet nights, my lone steps echoing the crescent moon's curve.<br>
I am my own freeze frame. I am my own afterimage.`,
  type: "Rectifier",
  rarity: 5,
  passiveName: "Light's Offering",
  passiveValue: `Increases ATK by <span class="param">12%/15%/18%/21%/24%</span>. Inflicting Glacio Chafe on the target grants the wielder <span class="param">30%/37.5%/45%/52.5%/60%</span> Glacio DMG Bonus for 12s and increases the ATK of all Resonators in the team by <span class="param">24%/30%/36%/42%/48%</span> for 30s. Effects of the same name cannot be stacked.`,
  passiveData: [
    {
      key: "FreezeFrameATK",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `ATK is increased by <span class="param">12%/15%/18%/21%/24%</span>`,
      alwaysEnabled: true,
    },
    {
      key: "FreezeFrameGlacioChafeDMGBonus",
      hasStacks: false,
      modifier: "Glacio",
      modifierByRefinement: {
        "1": 0.3,
        "2": 0.4,
        "3": 0.45,
        "4": 0.525,
        "5": 0.6,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Inflicting Glacio Chafe on the target grants the wielder <span class="param">30%/37.5%/45%/52.5%/60%</span> Glacio DMG Bonus for 12s`,
      alwaysEnabled: false,
    },
    {
      key: "FreezeFrameResonatorsATKBonus",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.24,
        "2": 0.3,
        "3": 0.36,
        "4": 0.42,
        "5": 0.48,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Inflicting Glacio Chafe on the target increases the ATK of all Resonators in the team by <span class="param">24%/30%/36%/42%/48%</span> for 30s. Effects of the same name cannot be stacked.`,
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
