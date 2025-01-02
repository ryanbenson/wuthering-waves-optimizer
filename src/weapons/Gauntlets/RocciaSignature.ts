const weaponInfo: WeaponInfo = {
  name: "Roccia Signature",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/RocciaSignature.png",
  description: "TBD",
  type: "Gauntlets",
  rarity: 5,
  passiveName: "Fool's Song",
  passiveValue:
    `Increases Energy Regen by <span class="Param">12.8%/16%/19.2%/22.4%/25.6%</span>. When casting Basic Attack or Intro Skill, the wielder’s <span class="Highlight">Heavy Attack</span> damage increases by <span class="Param">48%/60%/72%/84%/96%</span>, lasting for 3s.`,
  passiveData: [
    {
      key: "RocciaSignatureATK",
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
      details: "Attack Power increases by 12%/15%/18%/21%/24%.",
      alwaysEnabled: true,
    },
    {
      key: "RocciaSignatureResonanceHeavyDMGBonus",
      hasStacks: false,
      modifier: "HeavyAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.48,
        "2": 0.6,
        "3": 0.72,
        "4": 0.84,
        "5": 0.96,
      },
      minStacks: 0,
      maxStacks: 0,
      details:
        `When casting Basic Attack or Intro Skill, the wielder’s <span class="Highlight">Heavy Attack</span> damage increases by <span class="Param">48%/60%/72%/84%/96%</span>, lasting for 3s.`,
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
  "20+": {
    attack: 153,
    modifier: "CritRate",
    modifierValue: 0.095,
  },
  "40": {
    attack: 232,
    modifier: "CritRate",
    modifierValue: 0.137,
  },
  "40+": {
    attack: 264,
    modifier: "CritRate",
    modifierValue: 0.137,
  },
  "50": {
    attack: 303,
    modifier: "CritRate",
    modifierValue: 0.158,
  },
  "50+": {
    attack: 335,
    modifier: "CritRate",
    modifierValue: 0.158,
  },
  "60": {
    attack: 374,
    modifier: "CritRate",
    modifierValue: 0.179,
  },
  "60+": {
    attack: 406,
    modifier: "CritRate",
    modifierValue: 0.179,
  },
  "70": {
    attack: 445,
    modifier: "CritRate",
    modifierValue: 0.2,
  },
  "70+": {
    attack: 476,
    modifier: "CritRate",
    modifierValue: 0.2,
  },
  "80": {
    attack: 516,
    modifier: "CritRate",
    modifierValue: 0.221,
  },
  "80+": {
    attack: 547,
    modifier: "CritRate",
    modifierValue: 0.221,
  },
  "90": {
    attack: 587,
    modifier: "CritRate",
    modifierValue: 0.243,
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
