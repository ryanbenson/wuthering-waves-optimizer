const weaponInfo: WeaponInfo = {
  name: "Defier's Thorn",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/DefiersThorn.png",
  description:
    "The surging tides force the crown of thorns upon the knight, out of which the knight forges this sword. Unburdened by the crown, the knight waded through the roaring waves unwaveringly.",
  type: "Sword",
  rarity: 5,
  passiveName: "A Free Knight's Tarantella",
  passiveValue: `Max HP is increased by <span class="param">12%/15%/18%/21%/24%</span>. <span class="param">15</span>s after casting Intro Skill or Basic Attacks, ignores <span class="param">8%/10%/12%/14%/16%</span> of the target's DEF when dealing damage. If the target has at least 1 stack of Aero Erosion, the target's DMG taken is Amplified by <span class="param">20%/25%/30%/35%/40%</span>.`,
  passiveData: [
    {
      key: "DefiersThornHP",
      hasStacks: false,
      modifier: "HP",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details: `Max HP is increased by <span class="param">12%/15%/18%/21%/24%</span>`,
      alwaysEnabled: true,
    },
    {
      key: "DefiersThornDEFIgnore",
      hasStacks: false,
      modifier: "DEFIgnore",
      modifierByRefinement: {
        "1": 0.08,
        "2": 0.1,
        "3": 0.12,
        "4": 0.14,
        "5": 0.16,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `<span class="param">15</span>s after casting Intro Skill or Basic Attacks, ignores <span class="param">8%/10%/12%/14%/16%</span> of the target's DEF when dealing damage.`,
      alwaysEnabled: false,
    },
    {
      key: "DefiersThornAmplify",
      hasStacks: false,
      modifier: "DMGDeepen:Aero",
      modifierByRefinement: {
        "1": 0.2,
        "2": 0.25,
        "3": 0.3,
        "4": 0.35,
        "5": 0.4,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `If the target has at least 1 stack of Aero Erosion, the target's DMG taken is Amplified by <span class="param">20%/25%/30%/35%/40%</span>`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 33,
    modifier: "HP",
    modifierValue: 0.16,
  },
  "20": {
    attack: 85,
    modifier: "HP",
    modifierValue: 0.285,
  },
  "20+": {
    attack: 107,
    modifier: "HP",
    modifierValue: 0.285,
  },
  "40": {
    attack: 163,
    modifier: "HP",
    modifierValue: 0.41,
  },
  "40+": {
    attack: 185,
    modifier: "HP",
    modifierValue: 0.41,
  },
  "50": {
    attack: 213,
    modifier: "HP",
    modifierValue: 0.472,
  },
  "50+": {
    attack: 235,
    modifier: "HP",
    modifierValue: 0.472,
  },
  "60": {
    attack: 263,
    modifier: "HP",
    modifierValue: 0.534,
  },
  "60+": {
    attack: 285,
    modifier: "HP",
    modifierValue: 0.534,
  },
  "70": {
    attack: 312,
    modifier: "HP",
    modifierValue: 0.597,
  },
  "70+": {
    attack: 334,
    modifier: "HP",
    modifierValue: 0.597,
  },
  "80": {
    attack: 362,
    modifier: "HP",
    modifierValue: 0.659,
  },
  "80+": {
    attack: 384,
    modifier: "HP",
    modifierValue: 0.659,
  },
  "90": {
    attack: 412,
    modifier: "HP",
    modifierValue: 0.722,
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
