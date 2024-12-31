const weaponInfo: WeaponInfo = {
  name: "Waltz in Masquerade",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/CalloftheAbyss.png",
  description:
    "Held by the keepers of this land, this scepter was once a symbol of dominion over its people and the architectural marvels they achieved. However, it has long lost its luster, and its grandeur blends into the ripples of the pipe organ melodies of Rinascita.",
  type: "Rectifier",
  rarity: 4,
  passiveName: "Pole of the Celestial Dome",
  passiveValue: `Casting Resonance Liberation increases the Resonator's Healing Bonus by <span class="param">16%/20%/24%/28%/32%</span> for <span class="param">15</span>s.`,
  passiveData: [
    {
      key: "PoleoftheCelestialDomeHealingBonus",
      hasStacks: false,
      modifier: "HealingBonus",
      modifierByRefinement: {
        "1": 0.16,
        "2": 0.2,
        "3": 0.24,
        "4": 0.28,
        "5": 0.32,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Casting Resonance Liberation increases the Resonator's Healing Bonus by <span class="param">16%/20%/24%/28%/32%</span> for <span class="param">15</span>s.`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 27,
    modifier: "EnergyRegen",
    modifierValue: 0.115,
  },
  "20": {
    attack: 70,
    modifier: "EnergyRegen",
    modifierValue: 0.204,
  },
  "20+": {
    attack: 88,
    modifier: "EnergyRegen",
    modifierValue: 0.204,
  },
  "40": {
    attack: 133,
    modifier: "EnergyRegen",
    modifierValue: 0.294,
  },
  "40+": {
    attack: 151,
    modifier: "EnergyRegen",
    modifierValue: 0.294,
  },
  "50": {
    attack: 174,
    modifier: "EnergyRegen",
    modifierValue: 0.339,
  },
  "50+": {
    attack: 192,
    modifier: "EnergyRegen",
    modifierValue: 0.339,
  },
  "60": {
    attack: 215,
    modifier: "EnergyRegen",
    modifierValue: 0.383,
  },
  "60+": {
    attack: 233,
    modifier: "EnergyRegen",
    modifierValue: 0.383,
  },
  "70": {
    attack: 255,
    modifier: "EnergyRegen",
    modifierValue: 0.428,
  },
  "70+": {
    attack: 273,
    modifier: "EnergyRegen",
    modifierValue: 0.428,
  },
  "80": {
    attack: 296,
    modifier: "EnergyRegen",
    modifierValue: 0.473,
  },
  "80+": {
    attack: 314,
    modifier: "EnergyRegen",
    modifierValue: 0.473,
  },
  "90": {
    attack: 337,
    modifier: "EnergyRegen",
    modifierValue: 0.518,
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
