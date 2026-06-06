const weaponInfo: WeaponInfo = {
  name: "Skull Thrasher",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/SkullThrasher.png",
  description:
    `Because death is a reality that cannot be undone, there's no reason to hesitate.<br>
She pulls the trigger, shattering this haunting reverie.`,
  type: "Pistol",
  rarity: 5,
  passiveName: "Wakeful Loner",
  passiveValue: `<span class="skilldescription">Increases ATK by <span class="param">12%/15%/18%/21%/24%</span>. Casting Intro Skill grants <span class="param">24%/30%/36%/42%/48%</span> Basic Attack DMG Bonus to the wielder for 14s. Inflicting Hack - Shifting grants <span class="param">12%/15%/18%/21%/24%</span> Basic Attack DMG Bonus to the wielder for 14s, and increases the ATK of Resonators in the team by <span class="param">24%/30%/36%/42%/48%</span> for 30s. Effects of the same name do not stack.</span>`,
  passiveData: [
    {
      key: "SkullThrasherATK",
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
      details: `Increases ATK by <span class="param">12%/15%/18%/21%/24%</span>`,
      alwaysEnabled: true,
    },
    {
      key: "SkullThrasherIntroSkillBonus",
      hasStacks: false,
      modifier: "BasicAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.24,
        "2": 0.3,
        "3": 0.36,
        "4": 0.42,
        "5": 0.48,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Casting Intro Skill grants <span class="param">24%/30%/36%/42%/48%</span> Basic Attack DMG Bonus to the wielder for 14s.`,
      alwaysEnabled: false,
    },
    {
      key: "SkullThrasherHackShiftingBonus",
      hasStacks: false,
      modifier: "BasicAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Inflicting Hack - Shifting grants <span class="param">12%/15%/18%/21%/24%</span> Basic Attack DMG Bonus to the wielder for 14s`,
      alwaysEnabled: false,
    },
    {
      key: "SkullThrasherHackShiftingATKBonus",
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
      details: `Inflicting Hack - Shifting increases the ATK of Resonators in the team by <span class="param">24%/30%/36%/42%/48%</span> for 30s. Effects of the same name do not stack.`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 40,
    modifier: "CritDMG",
    modifierValue: 0.16,
  },
  "20": {
    attack: 104,
    modifier: "CritDMG",
    modifierValue: 0.284,
  },
  "20+": {
    attack: 130,
    modifier: "CritDMG",
    modifierValue: 0.284,
  },
  "40": {
    attack: 198,
    modifier: "CritDMG",
    modifierValue: 0.408,
  },
  "40+": {
    attack: 224,
    modifier: "CritDMG",
    modifierValue: 0.408,
  },
  "50": {
    attack: 258,
    modifier: "CritDMG",
    modifierValue: 0.471,
  },
  "50+": {
    attack: 285,
    modifier: "CritDMG",
    modifierValue: 0.471,
  },
  "60": {
    attack: 318,
    modifier: "CritDMG",
    modifierValue: 0.533,
  },
  "60+": {
    attack: 345,
    modifier: "CritDMG",
    modifierValue: 0.533,
  },
  "70": {
    attack: 379,
    modifier: "CritDMG",
    modifierValue: 0.595,
  },
  "70+": {
    attack: 405,
    modifier: "CritDMG",
    modifierValue: 0.595,
  },
  "80": {
    attack: 439,
    modifier: "CritDMG",
    modifierValue: 0.657,
  },
  "80+": {
    attack: 466,
    modifier: "CritDMG",
    modifierValue: 0.657,
  },
  "90": {
    attack: 500,
    modifier: "CritDMG",
    modifierValue: 0.72,
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
