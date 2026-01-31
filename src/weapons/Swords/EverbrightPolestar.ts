const weaponInfo: WeaponInfo = {
  name: "Everbright Polestar",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/EverbrightPolestar.png",
  description:
    `As you drift across the hushed sea of stars, stardust scatters beside you as time crumbles in your wake. All that remains is the unyielding loneliness, warped, diluted, and remade into the plumes of your wings.
The universe sends you on a tribulation of silence, yet you travel on, repaying in radiance.`,
  type: "Sword",
  rarity: 5,
  passiveName: "Starchaser",
  passiveValue:
    `<span class="skilldescription">Increases All-Attribute DMG Bonus by 12%. When inflicting Tune Rupture - Shifting or Fusion Burst, the wielder's Resonance Liberation DMG ignores 32% DEF and 10% Fusion RES on targets for 8s.</span>`,
  passiveData: [
    {
      key: "EverbrightPolestarAllElementAttributeBonus",
      hasStacks: false,
      modifier: "AllElementAttributeBonus",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details:
        "Increases All-Attribute DMG Bonus by 12%/15%/18%/21%/24%.",
      alwaysEnabled: true,
    },
    {
      key: "EverbrightPolestarDefIgnore",
      hasStacks: false,
      modifier: "DEFIgnore:Liberation",
      modifierByRefinement: {
        "1": 0.32,
        "2": 0.4,
        "3": 0.48,
        "4": 0.56,
        "5": 0.64,
      },
      minStacks: 0,
      maxStacks: 0,
      details:
        "When inflicting Tune Rupture - Shifting or Fusion Burst, the wielder's Resonance Liberation DMG ignores 32%/40%/48%/56%/64% DEF for 8s.",
      alwaysEnabled: false,
    },
    {
      key: "EverbrightPolestarResistShred",
      hasStacks: false,
      modifier: "ResistShred:Fusion:Liberation",
      modifierByRefinement: {
        "1": 0.1,
        "2": 0.15,
        "3": 0.2,
        "4": 0.25,
        "5": 0.3,
      },
      minStacks: 0,
      maxStacks: 0,
      details:
        "When inflicting Tune Rupture - Shifting or Fusion Burst, the wielder's Resonance Liberation DMG ignores 10%/15%/20%/25%/30% Fusion RES on targets for 8s.",
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
    "1": {
      attack: 47,
      modifier: "CritRate",
      modifierValue: 0.054,  // 5.4%
    },
    "20": {
      attack: 122,
      modifier: "CritRate",
      modifierValue: 0.095,  // 9.5%
    },
    "20+": {
      attack: 153,
      modifier: "CritRate",
      modifierValue: 0.095,  // 9.5%
    },
    "40": {
      attack: 232,
      modifier: "CritRate",
      modifierValue: 0.137,  // 13.7%
    },
    "40+": {
      attack: 264,
      modifier: "CritRate",
      modifierValue: 0.137,  // 13.7%
    },
    "50": {
      attack: 303,
      modifier: "CritRate",
      modifierValue: 0.158,  // 15.8%
    },
    "50+": {
      attack: 335,
      modifier: "CritRate",
      modifierValue: 0.158,  // 15.8%
    },
    "60": {
      attack: 374,
      modifier: "CritRate",
      modifierValue: 0.179,  // 17.9%
    },
    "60+": {
      attack: 406,
      modifier: "CritRate",
      modifierValue: 0.179,  // 17.9%
    },
    "70": {
      attack: 445,
      modifier: "CritRate",
      modifierValue: 0.200,  // 20.0%
    },
    "70+": {
      attack: 476,
      modifier: "CritRate",
      modifierValue: 0.200,  // 20.0%
    },
    "80": {
      attack: 516,
      modifier: "CritRate",
      modifierValue: 0.221,  // 22.1%
    },
    "80+": {
      attack: 547,
      modifier: "CritRate",
      modifierValue: 0.221,  // 22.1%
    },
    "90": {
      attack: 587,
      modifier: "CritRate",
      modifierValue: 0.243,  // 24.3%
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
