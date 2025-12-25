const weaponInfo: WeaponInfo = {
  name: "Spectrum Blaster",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/SpectrumBlaster.png",
  description: `Prismatic light dances at her fingertips, arcs of color carving radiant trails.
Every rushing hue converges upon her aim, and at last, she reaches a sky where nothing lies beyond her sight.`,
  type: "Pistols",
  rarity: 5,
  passiveName: "Attendance Exemption Protocol",
  passiveValue: `<span class="skilldescription">ATK is increased by <span class="param">12%/15%/18%/21%/24%</span>. Casting <span class="highlight">Intro Skill</span> or dealing <span class="highlight">Basic Attack</span> DMG to targets increases the wielder's <span class="highlight">Basic Attack</span> DMG by <span class="highlight">36%/45%/54%/63%/72%</span> for 4s. Each time the wielder inflicts <span class="highlight">Tune Rupture - Shifting</span> or <span class="highlight">Tune Strain - Shifting</span> during Basic Attacks, all DMG dealt by Resonators in the team is increased by <span class="highlight">8%/10%/12%/14%/16%</span> for 30s, up to 3 stacks. Effects of the same name cannot be stacked.</span>`,
  passiveData: [
    {
      key: "SpectrumBlasterATK",
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
      key: "SpectrumBlasterBasic",
      hasStacks: false,
      modifier: "BasicAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.36,
        "2": 0.45,
        "3": 0.54,
        "4": 0.63,
        "5": 0.72,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Casting <span class="highlight">Intro Skill</span> or dealing <span class="highlight">Basic Attack</span> DMG to targets increases the wielder's <span class="highlight">Basic Attack</span> DMG by <span class="highlight">36%/45%/54%/63%/72%</span> for 4s.`,
      alwaysEnabled: false,
    },
    {
      key: "SpectrumBlasterAllDMG",
      hasStacks: true,
      modifier: "AllElementAttributeBonus",
      modifierByRefinement: {
        "1": 0.08,
        "2": 0.1,
        "3": 0.12,
        "4": 0.14,
        "5": 0.16,
      },
      minStacks: 0,
      maxStacks: 3,
      details: `Each time the wielder inflicts <span class="highlight">Tune Rupture - Shifting</span> or <span class="highlight">Tune Strain - Shifting</span> during Basic Attacks, all DMG dealt by Resonators in the team is increased by <span class="highlight">8%/10%/12%/14%/16%</span> for 30s, up to 3 stacks. Effects of the same name cannot be stacked.`,
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
  "40": {
    attack: 232,
    modifier: "CritRate",
    modifierValue: 0.137,
  },
  "50": {
    attack: 303,
    modifier: "CritRate",
    modifierValue: 0.158,
  },
  "60": {
    attack: 374,
    modifier: "CritRate",
    modifierValue: 0.179,
  },
  "70": {
    attack: 445,
    modifier: "CritRate",
    modifierValue: 0.2,
  },
  "80": {
    attack: 516,
    modifier: "CritRate",
    modifierValue: 0.221,
  },
  "90": {
    attack: 587,
    modifier: "CritRate",
    modifierValue: 0.243,
  },
  "20+": {
    attack: 153,
    modifier: "CritRate",
    modifierValue: 0.095,
  },
  "40+": {
    attack: 264,
    modifier: "CritRate",
    modifierValue: 0.137,
  },
  "50+": {
    attack: 335,
    modifier: "CritRate",
    modifierValue: 0.158,
  },
  "60+": {
    attack: 406,
    modifier: "CritRate",
    modifierValue: 0.179,
  },
  "70+": {
    attack: 476,
    modifier: "CritRate",
    modifierValue: 0.2,
  },
  "80+": {
    attack: 547,
    modifier: "CritRate",
    modifierValue: 0.221,
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
