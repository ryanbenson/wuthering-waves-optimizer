const weaponInfo: WeaponInfo = {
  name: "Carlotta Signature",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/CarlottaSignature.png",
  description:
    "An ascending crescendo. These pistols unleash bullets with the force of thunder, tearing through the heavens like a symphony of destruction.",
  type: "Pistols",
  rarity: 4,
  passiveName: "TBD",
  passiveValue:
    "Attack Power increases by 12%(24%). When casting Intro Skill or Resonance Liberation, the wielder resonance skill damage increases by 48%(96%), lasting for 5s.",
  passiveData: [
    {
      key: "CarlottaSigATK",
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
      details: "Attack Power increases by by 12%/15%/18%/21%/24%.",
      alwaysEnabled: true,
    },
    {
      key: "CarlottaSigSKillBonus",
      hasStacks: false,
      modifier: "ResonanceSkillDMGBonus",
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
        "When casting Intro Skill or Resonance Liberation, the wielder resonance skill damage increases by 48%/60%/72%/84%/96%, lasting for 5s. Repeated activation refreshes the duration.",
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
