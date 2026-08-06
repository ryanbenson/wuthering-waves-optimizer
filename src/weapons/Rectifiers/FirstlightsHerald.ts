const weaponInfo: WeaponInfo = {
  name: "Firstlight's Herald",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/FirstlightsHerald.png",
  description: `Dawn's glow my paper, morning dew my ink, with brush in hand, a scroll of ceaseless landscapes I paint.<br>
So the legend goes: when the divine bird lowers its gaze, the mountains hush and the rivers still.<br>
Yet, when it raises its head again to loose a piercing cry, the slumbering sun shall rise from beyond the sea of clouds.`,
  type: "Rectifier",
  rarity: 5,
  passiveName: "Spring Wreath",
  passiveValue: "Increases Max HP by 12%. Casting Resonance Liberation restores 8 points of Concerto Energy, triggered once every 20s. Inflicting Glacio Chafe grants Snow Taint for 6s. Applying healing grants Ripples for 6s. If the wielder has done both while on the field, the next Outro Skill grants both effects for 6s. When the wielder has both Snow Taint and Ripples, the ATK of all nearby Resonators in the team is increased by 20%. Effects of the same name do not stack.",
  passiveData: [
    {
      key: "FirstlightsHeraldMaxHP",
      hasStacks: false,
      modifier: "HP",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details: "Increases Max HP by <span style='color:#ffd12f;'>12%/15%/18%/21%/24%</span>.",
      alwaysEnabled: true,
    },
    {
      key: "FirstlightsHeraldIntroSkillResonatorATKBonus",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.2,
        "2": 0.3,
        "3": 0.35,
        "4": 0.4,
        "5": 0.45,
      },
      details: "Inflicting Glacio Chafe grants Snow Taint for 6s. Applying healing grants Ripples for 6s. If the wielder has done both while on the field, the next Outro Skill grants both effects for 6s. When the wielder has both Snow Taint and Ripples, the ATK of all nearby Resonators in the team is increased by 20%/30%/35%/40%/45%. Effects of the same name do not stack.",
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
