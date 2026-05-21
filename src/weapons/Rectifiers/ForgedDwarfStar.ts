const weaponInfo: WeaponInfo = {
  name: "Forged Dwarf Star",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/ForgedDwarfStar.png",
  description:
    `Dream dissolves like foam, leaving only a silent white dwarf.<br>
Yet the light that once swept the cosmos remains.<br>
She waits in quiescence until her borrowed light finds its way back to the main sequence star.`,
  type: "Rectifier",
  rarity: 5,
  passiveName: "Homebuilder's Anthem",
  passiveValue:
    `Increases ATK by <span class="param">12%/15%/18%/21%/24%</span>. After the wielder inflicts Fusion Burst or Tune Strain - Shifting on the target, their Resonance Liberation DMG Bonus is increased by <span class="param">36%/45%/54%/63%/72%</span> for 5s. While this effect lasts, after Resonators in the team inflict Fusion Burst or Tune Strain - Shifting, their ATK is increased by <span class="param">24%/30%/36%/42%/48%</span> for 15s. Effects of the same name cannot be stacked.`,
  passiveData: [
    {
      key: "ForgedDwarfStarATK",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details:
        `Increase ATK by <span class="param">12%/15%/18%/21%/24%.</span>`,
      alwaysEnabled: true,
    },
    {
      key: "ForgedDwarfStarResonanceLiberationDMGBonus",
      hasStacks: false,
      modifier: "ResonanceLiberationDMGBonus",
      modifierByRefinement: {
        "1": 0.36,
        "2": 0.45,
        "3": 0.54,
        "4": 0.63,
        "5": 0.72,
      },
      minStacks: 0,
      maxStacks: 0,
      details:
        `After the wielder inflicts Fusion Burst or Tune Strain - Shifting on the target, their Resonance Liberation DMG Bonus is increased by <span class="param">36%/45%/54%/63%/72%</span> for 5s.`,
      alwaysEnabled: false,
    },
    {
      key: "ForgedDwarfStarATKBonus",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.24,
        "2": 0.3,
        "3": 0.36,
        "4": 0.42,
        "5": 0.48,
      },
      minStacks: 0,
      maxStacks: 0,
      details:
        `While this effect lasts, after Resonators in the team inflict Fusion Burst or Tune Strain - Shifting, their ATK is increased by <span class="param">24%/30%/36%/42%/48%</span> for 15s. Effects of the same name cannot be stacked.`,
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
