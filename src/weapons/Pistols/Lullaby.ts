const weaponInfo: WeaponInfo = {
  name: "Lullaby",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/Lullaby.png",
  description: "So close to crumbling, the flower gave itself to the softness of dreams. There, its thoughts froze and its hopes set, until it withered in the lovely dream cradle.\nIt waits, and waits... It waits on for a prayer, an accident, a chance to bloom again and find its peace.",
  type: "Pistols",
  rarity: 5,
  passiveName: "Dreamland Solace",
  passiveValue: "Increases Max HP by 12%/15%/18%/21%/24%. Casting Resonance Liberation restores 8/10/12/14/16 points of Concerto Energy, triggered once every 20/20/20/20/20s. All Resonators in the team gain Soothed Soul for 30/30/30/30/30s when the wielder performs healing. When Soothed Soul is active, if a Resonator in the team gains Unison or triggers Unison Response, that Resonator gains 16%/20%/24%/28%/32% ATK increase. This effect is removed when Soothed Soul ends. When the wielder heals Resonators, the active Resonator also gains 24%/30%/36%/42%/48% Echo Skill DMG Bonus for 6/6/6/6/6s. Effects of the same name do not stack.",
  passiveData: [
    {
      key: "LullabyHP",
      hasStacks: false,
      modifier: "HP",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details: `<span class="skilldescription">Increases Max HP by <span class="param">12%/15%/18%/21%/24%</span>.</span>`,
      alwaysEnabled: true,
    },
    {
      key: "LullabyATK",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.16,
        "2": 0.2,
        "3": 0.24,
        "4": 0.28,
        "5": 0.32,
      },
      details: `<span class="skilldescription">All Resonators in the team gain Soothed Soul for <span class="param">30</span>s when the wielder performs healing. When Soothed Soul is active, if a Resonator in the team gains Unison or triggers Unison Response, that Resonator gains <span class="param">16%/20%/24%/28%/32%</span> ATK increase. This effect is removed when Soothed Soul ends.</span>`,
      alwaysEnabled: false,
    },
    {
      key: "LullabyEchoDMG",
      hasStacks: false,
      modifier: "EchoDMGBonus",
      modifierByRefinement: {
        "1": 0.24,
        "2": 0.3,
        "3": 0.36,
        "4": 0.42,
        "5": 0.48,
      },
      details: `<span class="skilldescription">When the wielder heals Resonators, the active Resonator gains <span class="param">24%/30%/36%/42%/48%</span> Echo Skill DMG Bonus for <span class="param">6</span>s. Effects of the same name do not stack.</span>`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 33,
    modifier: "EnergyRegen",
    modifierValue: 0.171,
  },
  "20": {
    attack: 85,
    modifier: "EnergyRegen",
    modifierValue: 0.304,
  },
  "40": {
    attack: 163,
    modifier: "EnergyRegen",
    modifierValue: 0.438,
  },
  "50": {
    attack: 213,
    modifier: "EnergyRegen",
    modifierValue: 0.504,
  },
  "60": {
    attack: 263,
    modifier: "EnergyRegen",
    modifierValue: 0.571,
  },
  "70": {
    attack: 312,
    modifier: "EnergyRegen",
    modifierValue: 0.637,
  },
  "80": {
    attack: 362,
    modifier: "EnergyRegen",
    modifierValue: 0.704,
  },
  "90": {
    attack: 412,
    modifier: "EnergyRegen",
    modifierValue: 0.77,
  },
  "20+": {
    attack: 107,
    modifier: "EnergyRegen",
    modifierValue: 0.304,
  },
  "40+": {
    attack: 185,
    modifier: "EnergyRegen",
    modifierValue: 0.438,
  },
  "50+": {
    attack: 235,
    modifier: "EnergyRegen",
    modifierValue: 0.504,
  },
  "60+": {
    attack: 285,
    modifier: "EnergyRegen",
    modifierValue: 0.571,
  },
  "70+": {
    attack: 334,
    modifier: "EnergyRegen",
    modifierValue: 0.637,
  },
  "80+": {
    attack: 384,
    modifier: "EnergyRegen",
    modifierValue: 0.704,
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
