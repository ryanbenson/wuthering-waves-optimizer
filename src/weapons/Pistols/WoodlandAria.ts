const weaponInfo: WeaponInfo = {
  name: "Woodland Aria",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/WoodlandAria.png",
  description:
    "All things exist within the lines of poetry. Every sound has its meters and rhymes. The forest's melodies ascend in spirals toward the moon's silvered grace, harmonized by the nightingales' chorus. When the final note falls and vanishes into the silent earth, a flawless chord echoes endlessly in the depths of this boundless realm.",
  type: "Pistols",
  rarity: 5,
  passiveName: "Lingering Summer Tune",
  passiveValue: `<span class="skilldescription">ATK is increased by <span class="param">12%/15%/18%/21%/24%</span>. Inflicting Aero Erosion on the target gives <span class="param">24%/30%/36%/42%/48%</span> Aero DMG Bonus for <span class="param">10</span>s. Hitting targets with Aero Erosion reduces their Aero RES by <span class="param">10%/11.5%/13%/14.5%/16%</span> for <span class="param">20</span>s. Effects of the same name cannot be stacked.</span>`,
  passiveData: [
    {
      key: "WoodlandAriaATK",
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
      key: "WoodlandAriaAero",
      hasStacks: false,
      modifier: "Aero",
      modifierByRefinement: {
        "1": 0.24,
        "2": 0.3,
        "3": 0.36,
        "4": 0.42,
        "5": 0.48,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Inflicting Aero Erosion on the target gives <span class="param">24%/30%/36%/42%/48%</span> Aero DMG Bonus for <span class="param">10</span>s`,
      alwaysEnabled: false,
    },
    {
      key: "WoodlandAriaAeroShred",
      hasStacks: false,
      modifier: "ResistShred:Aero",
      modifierByRefinement: {
        "1": 0.1,
        "2": 0.115,
        "3": 0.13,
        "4": 0.145,
        "5": 0.16,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Hitting targets with Aero Erosion reduces their Aero RES by <span class="param">10%/11.5%/13%/14.5%/16%</span> for <span class="param">20</span>s. Effects of the same name cannot be stacked.`,
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
