const weaponInfo: WeaponInfo = {
  name: "Moongazer's Sigil",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/MoongazersSigil.png",
  description:
    "By what means do all things endure? By light and heat, by matter and word, by the mechanics of converging chances, by the soft dissolution into silence, by a moment that mimics the eternal... All things rise and fall in endless rhythm, each bearing its meaning. As for hers, it lies here within her grasp.",
  type: "Gauntlets",
  rarity: 5,
  passiveName: "Plenilune Radiance",
  passiveValue: `<span class="skilldescription">Increases ATK by <span class="param">12%/15%/18%/21%/24%</span>. Casting Intro Skill or Resonance Liberation increases Resonance Liberation DMG by <span class="param">20%/25%/30%/35%/40%</span> for <span class="param">15</span>s. Obtaining Shield allows Resonance Liberation DMG to ignore <span class="param">7.2%/8.4%/9.6%/10.8%/12%</span> of the target's DEF for <span class="param">7</span>s, stacking up to <span class="param">5</span> times. This effect is triggered once every 0.5s. Upon casting Intro Skill, this effect reaches max stacks immediately, lasting for 3s.</span>`,
  passiveData: [
    {
      key: "PleniluneRadianceATK",
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
      details: `Increases ATK by <span class="param">12%/15%/18%/21%/24%</span>.`,
      alwaysEnabled: true,
    },
    {
      key: "PleniluneRadianceResLibBonus",
      hasStacks: false,
      modifier: "ResonanceLiberationDMGBonus",
      modifierByRefinement: {
        "1": 0.2,
        "2": 0.25,
        "3": 0.3,
        "4": 0.35,
        "5": 0.4,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Casting Intro Skill or Resonance Liberation increases Resonance Liberation DMG by <span class="param">20%/25%/30%/35%/40%</span> for <span class="param">15</span>s.`,
      alwaysEnabled: false,
    },
    {
      key: "BlazingJusticeDefIgnore",
      hasStacks: true,
      modifier: "DEFIgnore:Liberation",
      modifierByRefinement: {
        "1": 0.072,
        "2": 0.084,
        "3": 0.096,
        "4": 0.108,
        "5": 0.12,
      },
      minStacks: 0,
      maxStacks: 5,
      details: `Obtaining Shield allows Resonance Liberation DMG to ignore <span class="param">7.2%/8.4%/9.6%/10.8%/12%</span> of the target's DEF for <span class="param">7</span>s, stacking up to <span class="param">5</span> times. This effect is triggered once every 0.5s. Upon casting Intro Skill, this effect reaches max stacks immediately, lasting for 3s.</span>`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 40,
    modifier: "CritRate",
    modifierValue: 0.08,
  },
  "20": {
    attack: 104,
    modifier: "CritRate",
    modifierValue: 0.142,
  },
  "20+": {
    attack: 130,
    modifier: "CritRate",
    modifierValue: 0.142,
  },
  "40": {
    attack: 198,
    modifier: "CritRate",
    modifierValue: 0.204,
  },
  "40+": {
    attack: 224,
    modifier: "CritRate",
    modifierValue: 0.204,
  },
  "50": {
    attack: 258,
    modifier: "CritRate",
    modifierValue: 0.235,
  },
  "50+": {
    attack: 285,
    modifier: "CritRate",
    modifierValue: 0.235,
  },
  "60": {
    attack: 318,
    modifier: "CritRate",
    modifierValue: 0.266,
  },
  "60+": {
    attack: 345,
    modifier: "CritRate",
    modifierValue: 0.266,
  },
  "70": {
    attack: 379,
    modifier: "CritRate",
    modifierValue: 0.297,
  },
  "70+": {
    attack: 405,
    modifier: "CritRate",
    modifierValue: 0.297,
  },
  "80": {
    attack: 439,
    modifier: "CritRate",
    modifierValue: 0.328,
  },
  "80+": {
    attack: 466,
    modifier: "CritRate",
    modifierValue: 0.328,
  },
  "90": {
    attack: 500,
    modifier: "CritRate",
    modifierValue: 0.36,
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
