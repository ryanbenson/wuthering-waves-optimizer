const weaponInfo: WeaponInfo = {
  name: "Radiant Dawn",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/RadiantDawn.png",
  description: `A Rectifier awarded to Gladiators of exceptional merit. Its engravings draw inspiration from Griffrexes—natural-born hunters and the first allies Septimontians found in this land. Their bond needs no words, radiant and pure, like the blazing sun that watches over all.`,
  type: "Rectifier",
  rarity: 4,
  passiveName: `Oath of Tide Hunters`,
  passiveValue: `<span class="skilldescription">Casting Resonance Skill increases ATK by <span class="param">9%/13.95%/18.9%/23.85%/28.8%</span> and grants <span class="param">9%/13.95%/18.9%/23.85%/28.8%</span> Basic Attack DMG Bonus for <span class="param">10</span>s.</span>`,
  passiveData: [
    {
      key: "OathofTideHuntersATK",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.09,
        "2": 0.1395,
        "3": 0.189,
        "4": 0.2385,
        "5": 0.288,
      },
      details: `Casting Resonance Skill increases ATK by <span class="param">9%/13.95%/18.9%/23.85%/28.8%</span> for <span class="param">15</span>s.</span>`,
      alwaysEnabled: false,
    },
    {
      key: "OathofTideHuntersBasic",
      hasStacks: false,
      modifier: "BasicAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.09,
        "2": 0.1395,
        "3": 0.189,
        "4": 0.2385,
        "5": 0.288,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Casting Resonance Skill grants <span class="param">9%/13.95%/18.9%/23.85%/28.8%</span> Basic Attack DMG Bonus for <span class="param">10</span>s.`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 33,
    modifier: "CritDMG",
    modifierValue: 0.09,
  },
  "20": {
    attack: 85,
    modifier: "CritDMG",
    modifierValue: 0.159,
  },
  "20+": {
    attack: 107,
    modifier: "CritDMG",
    modifierValue: 0.159,
  },
  "40": {
    attack: 163,
    modifier: "CritDMG",
    modifierValue: 0.229,
  },
  "40+": {
    attack: 185,
    modifier: "CritDMG",
    modifierValue: 0.229,
  },
  "50": {
    attack: 213,
    modifier: "CritDMG",
    modifierValue: 0.264,
  },
  "50+": {
    attack: 235,
    modifier: "CritDMG",
    modifierValue: 0.264,
  },
  "60": {
    attack: 263,
    modifier: "CritDMG",
    modifierValue: 0.299,
  },
  "60+": {
    attack: 285,
    modifier: "CritDMG",
    modifierValue: 0.299,
  },
  "70": {
    attack: 312,
    modifier: "CritDMG",
    modifierValue: 0.334,
  },
  "70+": {
    attack: 334,
    modifier: "CritDMG",
    modifierValue: 0.334,
  },
  "80": {
    attack: 362,
    modifier: "CritDMG",
    modifierValue: 0.369,
  },
  "80+": {
    attack: 384,
    modifier: "CritDMG",
    modifierValue: 0.369,
  },
  "90": {
    attack: 412,
    modifier: "CritDMG",
    modifierValue: 0.405,
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
