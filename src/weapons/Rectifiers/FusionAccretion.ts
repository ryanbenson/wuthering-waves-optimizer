const weaponInfo: WeaponInfo = {
  name: "Fusion Accretion",
  description:
    "A prototype weapon designed by the Black Shores for elite combatants. This rectifier takes its name from the devastating might of a blazar—a galactic nucleus whose blinding radiance pierces the cosmos, shining unmistakably across billions of light years.",
  type: "Rectifier",
  rarity: 4,
  passiveName: "Intergalactic Gaze",
  passiveValue: `<span class="skilldescription">Casting the Resonance Skill grants <span class="param">6/7/8/9/10</span> Resonance Energy and increases ATK by <span class="param">10%/12.5%/15%/17.5%/20%</span>, lasting for <span class="param">16</span>s. This effect can be triggered once every <span class="param">20</span>s.</span>`,
  passiveData: [
    {
      key: "FusionAccretionATK",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.1,
        "2": 0.125,
        "3": 0.15,
        "4": 0.175,
        "5": 0.2,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `<span class="skilldescription">Casting the Resonance Skill grants <span class="param">6/7/8/9/10</span> Resonance Energy and increases ATK by <span class="param">10%/12.5%/15%/17.5%/20%</span>, lasting for <span class="param">16</span>s. This effect can be triggered once every <span class="param">20</span>s.</span>`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 37,
    modifier: "ATK",
    modifierValue: 0.04,
  },
  "20": {
    attack: 96,
    modifier: "ATK",
    modifierValue: 0.071,
  },
  "20+": {
    attack: 120,
    modifier: "ATK",
    modifierValue: 0.071,
  },
  "40": {
    attack: 183,
    modifier: "ATK",
    modifierValue: 0.103,
  },
  "40+": {
    attack: 207,
    modifier: "ATK",
    modifierValue: 0.103,
  },
  "50": {
    attack: 239,
    modifier: "ATK",
    modifierValue: 0.119,
  },
  "50+": {
    attack: 263,
    modifier: "ATK",
    modifierValue: 0.119,
  },
  "60": {
    attack: 294,
    modifier: "ATK",
    modifierValue: 0.134,
  },
  "60+": {
    attack: 319,
    modifier: "ATK",
    modifierValue: 0.134,
  },
  "70": {
    attack: 350,
    modifier: "ATK",
    modifierValue: 0.15,
  },
  "70+": {
    attack: 375,
    modifier: "ATK",
    modifierValue: 0.15,
  },
  "80": {
    attack: 406,
    modifier: "ATK",
    modifierValue: 0.166,
  },
  "80+": {
    attack: 431,
    modifier: "ATK",
    modifierValue: 0.166,
  },
  "90": {
    attack: 462,
    modifier: "ATK",
    modifierValue: 0.182,
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
