const weaponInfo: WeaponInfo = {
  name: "Bloodpact's Pledge",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/BloodpactsPledge.webp",
  description: `This weapon is a testament to the unbreakable blood pact: One shall never betray, never surrender, and fight until the last drop of blood is shed.`,
  type: "Sword",
  rarity: 5,
  passiveName: "Harmonious Vibrancy",
  passiveValue: `<span class="skilldescription">Providing Healing increases Resonance Skill DMG by <span class="param">10%/14%/18%/22%/26%</span> for <span class="param">6</span>s. When Rover: Aero casts Resonance Skill Unbound Flow, Aero DMG dealt by nearby Resonators on the field is Amplified by <span class="param">10%/14%/18%/22%/26%</span> for <span class="param">30</span>s.</span>`,
  passiveData: [
    {
      key: "BloodpactsPledgeSkillDMG",
      hasStacks: false,
      modifier: "ResonanceSkillDMGBonus",
      modifierByRefinement: {
        "1": 0.1,
        "2": 0.14,
        "3": 0.18,
        "4": 0.22,
        "5": 0.26,
      },
      details: `Providing Healing increases Resonance Skill DMG by <span class="param">10%/14%/18%/22%/26%</span> for <span class="param">6</span>s.`,
      alwaysEnabled: false,
    },
    {
      key: "BloodpactsPledgeAeroDeepen",
      hasStacks: false,
      modifier: "DMGDeepen:Aero",
      modifierByRefinement: {
        "1": 0.1,
        "2": 0.14,
        "3": 0.18,
        "4": 0.22,
        "5": 0.26,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `When Rover: Aero casts Resonance Skill Unbound Flow, Aero DMG dealt by nearby Resonators on the field is Amplified by <span class="param">10%/14%/18%/22%/26%</span> for <span class="param">30</span>s.</span>`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 47,
    modifier: "EnergyRegen",
    modifierValue: 0.086,
  },
  "20": {
    attack: 122,
    modifier: "EnergyRegen",
    modifierValue: 0.153,
  },
  "20+": {
    attack: 153,
    modifier: "EnergyRegen",
    modifierValue: 0.153,
  },
  "40": {
    attack: 232,
    modifier: "EnergyRegen",
    modifierValue: 0.22,
  },
  "40+": {
    attack: 264,
    modifier: "EnergyRegen",
    modifierValue: 0.22,
  },
  "50": {
    attack: 303,
    modifier: "EnergyRegen",
    modifierValue: 0.254,
  },
  "50+": {
    attack: 335,
    modifier: "EnergyRegen",
    modifierValue: 0.254,
  },
  "60": {
    attack: 374,
    modifier: "EnergyRegen",
    modifierValue: 0.287,
  },
  "60+": {
    attack: 406,
    modifier: "EnergyRegen",
    modifierValue: 0.287,
  },
  "70": {
    attack: 445,
    modifier: "EnergyRegen",
    modifierValue: 0.321,
  },
  "70+": {
    attack: 476,
    modifier: "EnergyRegen",
    modifierValue: 0.321,
  },
  "80": {
    attack: 516,
    modifier: "EnergyRegen",
    modifierValue: 0.355,
  },
  "80+": {
    attack: 547,
    modifier: "EnergyRegen",
    modifierValue: 0.355,
  },
  "90": {
    attack: 587,
    modifier: "EnergyRegen",
    modifierValue: 0.388,
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
