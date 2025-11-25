const weaponInfo: WeaponInfo = {
  name: "Kumokiri",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/Kumokiri.png",
  description: `A crimson thread emerges in the void, as if binding the structures of all things onto a single thread. At her fingertips, the endless season is drawn taut, snipped, and rewoven, until the scattered path at last converges once more upon this timeline.`,
  type: "Broadblade",
  rarity: 5,
  passiveName: `Thread of Fate`,
  passiveValue: `<span class="skilldescription">ATK is increased by <span class="Highlight">12%/15%/18%/21%/24%</span>. When the wielder casts Intro Skill or inflicts Negative Status, they gain <span class="Highlight">8%/10%/12%/14%/16%</span> Resonance Liberation DMG Bonus, stacking up to <span class="Highlight">3</span> times for 15s.<br>
At max stacks, when Resonators in the team inflict Negative Status, grants <span class="Highlight">24%/30%/36%/42%/48%</span> All-Attribute DMG Bonus for 15s. Effects of the same name cannot be stacked.</span>`,
  passiveData: [
    {
      key: "ThreadofFateATK",
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
      key: "ThreadofFateLiberation",
      hasStacks: true,
      modifier: "ResonanceLiberationDMGBonus",
      modifierByRefinement: {
        "1": 0.08,
        "2": 0.1,
        "3": 0.12,
        "4": 0.14,
        "5": 0.16,
      },
      minStacks: 0,
      maxStacks: 3,
      details: `When the wielder casts Intro Skill or inflicts Negative Status, they gain <span class="Highlight">8%/10%/12%/14%/16%</span> Resonance Liberation DMG Bonus, stacking up to <span class="Highlight">3</span> times for 15s.`,
      alwaysEnabled: false,
    },
    {
      key: "ThreadofFateAllAttribute",
      hasStacks: false,
      modifier: "AllElementAttributeBonus",
      modifierByRefinement: {
        "1": 0.24,
        "2": 0.3,
        "3": 0.36,
        "4": 0.42,
        "5": 0.48,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `At max stacks, when Resonators in the team inflict Negative Status, grants <span class="Highlight">24%/30%/36%/42%/48%</span> All-Attribute DMG Bonus for 15s. Effects of the same name cannot be stacked.`,
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
  "40": {
    attack: 198,
    modifier: "CritRate",
    modifierValue: 0.204,
  },
  "50": {
    attack: 258,
    modifier: "CritRate",
    modifierValue: 0.235,
  },
  "60": {
    attack: 318,
    modifier: "CritRate",
    modifierValue: 0.266,
  },
  "70": {
    attack: 379,
    modifier: "CritRate",
    modifierValue: 0.297,
  },
  "80": {
    attack: 439,
    modifier: "CritRate",
    modifierValue: 0.328,
  },
  "90": {
    attack: 500,
    modifier: "CritRate",
    modifierValue: 0.36,
  },
  "20+": {
    attack: 130,
    modifier: "CritRate",
    modifierValue: 0.142,
  },
  "40+": {
    attack: 224,
    modifier: "CritRate",
    modifierValue: 0.204,
  },
  "50+": {
    attack: 285,
    modifier: "CritRate",
    modifierValue: 0.235,
  },
  "60+": {
    attack: 345,
    modifier: "CritRate",
    modifierValue: 0.266,
  },
  "70+": {
    attack: 405,
    modifier: "CritRate",
    modifierValue: 0.297,
  },
  "80+": {
    attack: 466,
    modifier: "CritRate",
    modifierValue: 0.328,
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
