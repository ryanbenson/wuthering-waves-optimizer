const weaponInfo: WeaponInfo = {
  name: "The Last Dance",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/TheLastDance.png",
  description:
    "The radiant crystals, ever shattering and reshaping, beckon you into a treacherous dance, a gamble where life is the wager. Cortado, cortado... relentless draw each other in until all we can hear are our quivers. When the crimson finale arrives, remember, death comes for all.",
  type: "Pistols",
  rarity: 5,
  passiveName: "Silent Eulogy",
  passiveValue: `<span class="skilldescription">Increases ATK by <span class="param">12%/15%/18%/21%/24%</span>. Every time Intro Skill or Resonance Liberation is cast, Resonance Skill DMG Bonus increases by <span class="param">48%/60%/72%/84%/96%</span> for <span class="param">5</span>s.</span>`,
  passiveData: [
    {
      key: "TheLastDanceATK",
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
      key: "TheLastDanceSKillBonus",
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
      details: `Every time Intro Skill or Resonance Liberation is cast, Resonance Skill DMG Bonus increases by <span class="param">48%/60%/72%/84%/96%</span> for <span class="param">5</span>s.</span>`,
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
