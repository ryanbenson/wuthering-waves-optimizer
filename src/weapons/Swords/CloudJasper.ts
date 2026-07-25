const weaponInfo: WeaponInfo = {
  name: "Cloud Jasper",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/CloudJasper.png",
  description: "Mist drifts through the clouds, still water blue as the sky above; thin shadows slant across, and petals scatter down.\nMay I carry this jade blade into the dust of the world, cleanse this tarnished age, and cut down every evil.",
  type: "Sword",
  rarity: 5,
  passiveName: "Evil's Scourge",
  passiveValue: "Increases ATK by 12%/15%/18%/21%/24%. After applying Tune Strain - Shifting, gain 11.2%/14%/16.8%/19.6%/22.4% Aero DMG Bonus, lasting 2/2/2/2/2s, stacking up to 5/5/5/5/5 times. This effect can trigger once every 0.5/0.5/0.5/0.5/0.5s. Upon reaching the max stack limit, gain the following effects:\n- This Aero DMG Bonus effect's duration is extended to 15/15/15/15/15s.\n- While the effect persists, Aero DMG ignores 10%/12.5%/15%/17.5%/20% of the target's DEF.",
  passiveData: [
    {
      key: "CloudJasperATK",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details: "Increases ATK by 12%/15%/18%/21%/24%.",
      alwaysEnabled: true,
    },
    {
      key: "CloudJasperAeroDMGBonus",
      hasStacks: true,
      modifier: "Aero",
      modifierByRefinement: {
        "1": 0.112,
        "2": 0.14,
        "3": 0.168,
        "4": 0.196,
        "5": 0.224,
      },
      details: "After applying Tune Strain - Shifting, gain 11.2%/14%/16.8%/19.6%/22.4% Aero DMG Bonus, lasting 2/2/2/2/2s, stacking up to 5/5/5/5/5 times. This effect can trigger once every 0.5/0.5/0.5/0.5/0.5s.",
      alwaysEnabled: false,
      maxStacks: 5,
    },
    {
      key: "CloudJasperDefIgnore",
      hasStacks: false,
      modifier: "DEFIgnore:Aero",
      modifierByRefinement: {
        "1": 0.10,
        "2": 0.125,
        "3": 0.15,
        "4": 0.175,
        "5": 0.20,
      },
      details: "Upon reaching the max stack limit, gain the following effects:\n- This Aero DMG Bonus effect's duration is extended to 15/15/15/15/15s.\n- While the effect persists, Aero DMG ignores 10%/12.5%/15%/17.5%/20% of the target's DEF.",
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
  "40": {
    attack: 198,
    modifier: "CritRate",
    modifierValue: 0.204,
  },
  "50": {
    attack: 258,
    modifier: "CritRate",
    modifierValue: 0.236,
  },
  "60": {
    attack: 318,
    modifier: "CritRate",
    modifierValue: 0.267,
  },
  "70": {
    attack: 379,
    modifier: "CritRate",
    modifierValue: 0.298,
  },
  "80": {
    attack: 439,
    modifier: "CritRate",
    modifierValue: 0.329,
  },
  "90": {
    attack: 500,
    modifier: "CritRate",
    modifierValue: 0.36,
  },
  "20+": {
    attack: 130,
    modifier: "CritRate",
    modifierValue: 0.142,
  },
  "40+": {
    attack: 224,
    modifier: "CritRate",
    modifierValue: 0.204,
  },
  "50+": {
    attack: 285,
    modifier: "CritRate",
    modifierValue: 0.236,
  },
  "60+": {
    attack: 345,
    modifier: "CritRate",
    modifierValue: 0.267,
  },
  "70+": {
    attack: 405,
    modifier: "CritRate",
    modifierValue: 0.298,
  },
  "80+": {
    attack: 466,
    modifier: "CritRate",
    modifierValue: 0.329,
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
