const weaponInfo: WeaponInfo = {
  name: "Lethean Elegy",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/LetheanElegy.png",
  description: `I am not there. I do not die.
I shall be death's companion—with euphoric delights I drown my fear, with the coming days I trade for the past.`,
  type: "Rectifier",
  rarity: 5,
  passiveName: "Underworld Requiem",
  passiveValue: `ATK is increased by 12%. Within 12s after dealing Echo Skill DMG, gain 32% Resonance Skill DMG Bonus and 32% Echo Skill DMG Amplification, and ignore 8% of the target's DEF when dealing damage.`,
  passiveData: [
    {
      key: "LetheanElegyATK",
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
      key: "LetheanElegySkillDMGBonus",
      hasStacks: false,
      modifier: "ResonanceSkillDMGBonus",
      modifierByRefinement: {
        "1": 0.32,
        "2": 0.4,
        "3": 0.48,
        "4": 0.56,
        "5": 0.64,
      },
      minStacks: 0,
      maxStacks: 0,
      details: ` Within 12s after dealing Echo Skill DMG, gain <span class="param">32%/40%/48%/56%/64%</span> Resonance Skill DMG Bonus`,
      alwaysEnabled: false,
    },
    {
      key: "LetheanElegyEchoDMGAmplification",
      hasStacks: false,
      modifier: "DMGDeepen:Echo",
      modifierByRefinement: {
        "1": 0.32,
        "2": 0.4,
        "3": 0.48,
        "4": 0.56,
        "5": 0.64,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Within 12s after dealing Echo Skill DMG, gain <span class="param">32%/40%/48%/56%/64%</span> Echo Skill DMG Amplification`,
      alwaysEnabled: false,
    },
    {
      key: "LetheanElegyDefIgnore",
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
      details: `Within 12s after dealing Echo Skill DMG, ignore <span class="param">8%/10%/12%/14%/16%</span> of the target's DEF when dealing damage.`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 47,
    modifier: "CritDMG",
    modifierValue: 0.108,
  },
  "20": {
    attack: 122,
    modifier: "CritDMG",
    modifierValue: 0.191,
  },
  "40": {
    attack: 232,
    modifier: "CritDMG",
    modifierValue: 0.275,
  },
  "50": {
    attack: 303,
    modifier: "CritDMG",
    modifierValue: 0.317,
  },
  "60": {
    attack: 374,
    modifier: "CritDMG",
    modifierValue: 0.359,
  },
  "70": {
    attack: 445,
    modifier: "CritDMG",
    modifierValue: 0.401,
  },
  "80": {
    attack: 516,
    modifier: "CritDMG",
    modifierValue: 0.443,
  },
  "90": {
    attack: 587,
    modifier: "CritDMG",
    modifierValue: 0.486,
  },
  "20+": {
    attack: 153,
    modifier: "CritDMG",
    modifierValue: 0.191,
  },
  "40+": {
    attack: 264,
    modifier: "CritDMG",
    modifierValue: 0.275,
  },
  "50+": {
    attack: 335,
    modifier: "CritDMG",
    modifierValue: 0.317,
  },
  "60+": {
    attack: 406,
    modifier: "CritDMG",
    modifierValue: 0.359,
  },
  "70+": {
    attack: 476,
    modifier: "CritDMG",
    modifierValue: 0.401,
  },
  "80+": {
    attack: 547,
    modifier: "CritDMG",
    modifierValue: 0.443,
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
