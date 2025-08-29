const weaponInfo: WeaponInfo = {
  name: "Thunderflare Dominion",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/ThunderflareDominion.png",
  description: `Thunder shall purge her pain and weakness. From the crucible of blood and sand, the Sun rises. Not dimmed by dust, but ablaze in her full radiance.`,
  type: "Broadblade",
  rarity: 5,
  passiveName: `Thunderblaze Eminence`,
  passiveValue: `<span class="skilldescription">Increases ATK by <span class="param">12%/15%/18%/21%/24%</span>. Casting Intro Skill or Resonance Skill increases Heavy Attack DMG by <span class="param">20%/25%/30%/35%/40%</span> for <span class="param">15</span>s. Obtaining Shield allows Heavy Attack DMG to ignore <span class="param">7.2%/8.4%/9.6%/10.8%/12%</span> of the target's DEF for <span class="param">7</span>s, stacking up to <span class="param">5</span> times. This effect is triggered once every 0.5s</span>`,
  passiveData: [
    {
      key: "ThunderblazeEminenceATK",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details: `Increases ATK by <span class="param">12%/15%/18%/21%/24%</span>`,
      alwaysEnabled: true,
    },
    {
      key: "ThunderblazeEminenceHeavy",
      hasStacks: false,
      modifier: "HeavyAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.2,
        "2": 0.25,
        "3": 0.3,
        "4": 0.35,
        "5": 0.4,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Casting Intro Skill or Resonance Skill increases Heavy Attack DMG by <span class="param">20%/25%/30%/35%/40%</span> for <span class="param">15</span>s.`,
      alwaysEnabled: false,
    },
    {
      key: "ThunderblazeEminenceDefIgnore",
      hasStacks: true,
      modifier: "DEFIgnore:Heavy",
      modifierByRefinement: {
        "1": 0.072,
        "2": 0.084,
        "3": 0.096,
        "4": 0.108,
        "5": 0.12,
      },
      minStacks: 0,
      maxStacks: 5,
      details: `Obtaining Shield allows Heavy Attack DMG to ignore <span class="param">7.2%/8.4%/9.6%/10.8%/12%</span> of the target's DEF for <span class="param">7</span>s, stacking up to <span class="param">5</span> times. This effect is triggered once every 0.5s</span>`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 54,
    modifier: "CritRate",
    modifierValue: 0.027,
  },
  "20": {
    attack: 140,
    modifier: "CritRate",
    modifierValue: 0.047,
  },
  "20+": {
    attack: 176,
    modifier: "CritRate",
    modifierValue: 0.047,
  },
  "40": {
    attack: 267,
    modifier: "CritRate",
    modifierValue: 0.068,
  },
  "40+": {
    attack: 303,
    modifier: "CritRate",
    modifierValue: 0.068,
  },
  "50": {
    attack: 348,
    modifier: "CritRate",
    modifierValue: 0.079,
  },
  "50+": {
    attack: 384,
    modifier: "CritRate",
    modifierValue: 0.079,
  },
  "60": {
    attack: 430,
    modifier: "CritRate",
    modifierValue: 0.089,
  },
  "60+": {
    attack: 466,
    modifier: "CritRate",
    modifierValue: 0.089,
  },
  "70": {
    attack: 511,
    modifier: "CritRate",
    modifierValue: 0.1,
  },
  "70+": {
    attack: 547,
    modifier: "CritRate",
    modifierValue: 0.1,
  },
  "80": {
    attack: 593,
    modifier: "CritRate",
    modifierValue: 0.11,
  },
  "80+": {
    attack: 629,
    modifier: "CritRate",
    modifierValue: 0.11,
  },
  "90": {
    attack: 675,
    modifier: "CritRate",
    modifierValue: 0.121,
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
