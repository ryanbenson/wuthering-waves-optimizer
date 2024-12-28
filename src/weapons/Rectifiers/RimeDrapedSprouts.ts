const weaponInfo: WeaponInfo = {
  name: "Rime-Draped Sprouts",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/RimeDrapedSprouts.png",
  description:
    "An artist's seal adorned with rimed sprouts. It is stamped on numerous paintings that capture mountains and ravines in expressive, mesmerizing strokes. The tender sprouts symbolize the perpetual blossoming of artistic marvels.",
  type: "Rectifier",
  rarity: 5,
  passiveName: "Scenery outside the scenery",
  passiveValue: `<span class="skilldescription">Increase ATK by <span class="param">12%/15%/18%/21%/24%</span>. While the wielder is on the field, using Resonance Skill grants <span class="param">12%/15%/18%/21%/24%</span> Basic Attack DMG Bonus, stacking up to <span class="param">3</span> times for <span class="param">6</span>s. At <span class="param">3</span> stacks or above, casting Outro Skill consumes all stacks of this effect and grants the wielder <span class="param">52%/65%/78%/91%/104%</span> Basic Attack DMG Bonus for <span class="param">27</span>s, effective when the wielder is off the field.</span>`,
  passiveData: [
    {
      key: "RimeDrapedSproutsATK",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details: `Increase ATK by <span class="param">12%/15%/18%/21%/24%</span>.`,
      alwaysEnabled: true,
    },
    {
      key: "RimeDrapedSproutsBasicAtkBonus1",
      hasStacks: true,
      modifier: "BasicAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      minStacks: 0,
      maxStacks: 3,
      details: `While the wielder is on the field, using Resonance Skill grants <span class="param">12%/15%/18%/21%/24%</span> Basic Attack DMG Bonus, stacking up to <span class="param">3</span> times for <span class="param">6</span>s.`,
      alwaysEnabled: false,
    },
    {
      key: "RimeDrapedSproutsBasicAtkBonus2",
      hasStacks: false,
      modifier: "BasicAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.52,
        "2": 0.65,
        "3": 0.78,
        "4": 0.91,
        "5": 0.104,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `At <span class="param">3</span> stacks or above, casting Outro Skill consumes all stacks of this effect and grants the wielder <span class="param">52%/65%/78%/91%/104%</span> Basic Attack DMG Bonus for <span class="param">27</span>s, effective when the wielder is off the field.`,
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
