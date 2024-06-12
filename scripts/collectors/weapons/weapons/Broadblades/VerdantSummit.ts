const weaponInfo: WeaponInfo = {
  name: "Verdant Summit",
  description:
    "The ancient mountain stands tall, its peak reaching towards the sky. A river flows for thousands of years, forming the blade of a powerful weapon. As it is unsheathed, a powerful dragon's roar echoes through the heavens and earth, causing the sea to churn. This awe-inspiring weapon strikes fear in all who witness its might.",
  type: "Broadblade",
  rarity: 5,
  passiveName: "Swordsworn",
  passiveValue:
    "Increases the DMG Bonus of all Resonance Attributes by 12%/15%/18%/21%/24%. Every time Intro Skill or Resonance Liberation is cast, increases Heavy Attack DMG Bonus by 24%/30%/36%/42%/48%, stacking up to 2 time(s). This effect lasts for 14s.",
};

const weaponData: WeaponData = {
  "1": {
    attack: 47,
    modifier: "Crit. DMG",
    modifierValue: 0.10800000000000001,
  },
  "20": {
    attack: 122,
    modifier: "Crit. DMG",
    modifierValue: 0.191,
  },
  "40": {
    attack: 232,
    modifier: "Crit. DMG",
    modifierValue: 0.275,
  },
  "50": {
    attack: 303,
    modifier: "Crit. DMG",
    modifierValue: 0.317,
  },
  "60": {
    attack: 374,
    modifier: "Crit. DMG",
    modifierValue: 0.359,
  },
  "70": {
    attack: 445,
    modifier: "Crit. DMG",
    modifierValue: 0.401,
  },
  "80": {
    attack: 516,
    modifier: "Crit. DMG",
    modifierValue: 0.44299999999999995,
  },
  "90": {
    attack: 587,
    modifier: "Crit. DMG",
    modifierValue: 0.486,
  },
  "20+": {
    attack: 153,
    modifier: "Crit. DMG",
    modifierValue: 0.191,
  },
  "40+": {
    attack: 264,
    modifier: "Crit. DMG",
    modifierValue: 0.275,
  },
  "50+": {
    attack: 335,
    modifier: "Crit. DMG",
    modifierValue: 0.317,
  },
  "60+": {
    attack: 406,
    modifier: "Crit. DMG",
    modifierValue: 0.359,
  },
  "70+": {
    attack: 476,
    modifier: "Crit. DMG",
    modifierValue: 0.401,
  },
  "80+": {
    attack: 547,
    modifier: "Crit. DMG",
    modifierValue: 0.44299999999999995,
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
