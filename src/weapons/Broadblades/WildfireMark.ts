const weaponInfo: WeaponInfo = {
  name: "Wildfire Mark",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/WildfireMark.png",
  description: `The young wolf races through the wilds, shedding every shadow that once held her back. The lone wolf strides into the arena, cutting down each obstacle in her path. She seizes victory. She claims glory. She raises everything she has high above. She belongs to the arena, but even more, she belongs to herself.`,
  type: "Broadblade",
  rarity: 5,
  passiveName: `Blazing Starfire`,
  passiveValue: `Increases ATK by <span class="param">12%/15%/18%/21%/24%</span>. Performing Intro Skill or Resonance Liberation increases Resonance Liberation DMG by <span class="param">24%/30%/36%/42%/48%</span> for <span class="param">6</span>s. Dealing Heavy Attack DMG extends this effect by <span class="param">4</span>s, up to <span class="param">1</span> times. Each successful extension gives <span class="param">24%/30%/36%/42%/48%</span> Fusion DMG Bonus to all Resonators in the team for <span class="param">30</span>s. Effects of the same name cannot be stacked.`,
  passiveData: [
    {
      key: "WildfireMarkATK",
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
      key: "WildfireMarkResonanceLiberationDMG",
      hasStacks: false,
      modifier: "ResonanceLiberationDMGBonus",
      modifierByRefinement: {
        "1": 0.24,
        "2": 0.3,
        "3": 0.36,
        "4": 0.42,
        "5": 0.48,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Performing Intro Skill or Resonance Liberation increases Resonance Liberation DMG by <span class="param">24%/30%/36%/42%/48%</span> for <span class="param">6</span>s. Dealing Heavy Attack DMG extends this effect by <span class="param">4</span>s, up to <span class="param">1</span> times.`,
      alwaysEnabled: false,
    },
    {
      key: "WildfireMarkDMGBonus",
      hasStacks: false,
      modifier: "Fusion",
      modifierByRefinement: {
        "1": 0.24,
        "2": 0.3,
        "3": 0.36,
        "4": 0.42,
        "5": 0.48,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Each successful extension gives <span class="param">24%/30%/36%/42%/48%</span> Fusion DMG Bonus to all Resonators in the team for <span class="param">30</span>s. Effects of the same name cannot be stacked.`,
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
