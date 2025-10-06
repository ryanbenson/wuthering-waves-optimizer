const weaponInfo: WeaponInfo = {
  name: "Emerald Sentence",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/EmeraldSentence.png",
  description:
    "Bamboo, hollow yet full; People, whole yet seldom true. Bamboo speaks without deceit, acts without conceit, seeks no vanity. Few ever measure up thus.",
  type: "Sword",
  rarity: 5,
  passiveName: "When A Heart Settles",
  passiveValue: `<span>ATK is increased by <span class="param">12%/15%/18%/21%/24%</span>. Casting Echo Skill within 10s after casting Echo Skill or Basic Attack grants 1 stack of Bamboo Cleaver, which grants 30%% Heavy Attack DMG Bonus to the wielder. This effect can be triggered by Echoes of the same name once only, stacking up to 2 times, lasting for 12s. Casting Echo Skill at max stacks does not reset the duration. This effect can be triggered once every 10s and ends early if the wielder is switched off the field. Casting Intro Skill grants 20% Echo Skill DMG Bonus to all Resonators in the team for 30s. Effects of the same name cannot be stacked.</span>`,
  passiveData: [
    {
      key: "WhenAHeartSettlesATK",
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
      key: "WhenAHeartSettlesHeavy",
      hasStacks: true,
      modifier: "HeavyAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.3,
        "2": 0.375,
        "3": 0.45,
        "4": 0.525,
        "5": 0.6,
      },
      minStacks: 0,
      maxStacks: 2,
      details: `Casting Echo Skill within 10s after casting Echo Skill or Basic Attack grants 1 stack of Bamboo Cleaver, which grants <span class="param">30%/37.5%/45%/52.5%/60%</span> Heavy Attack DMG Bonus to the wielder. This effect can be triggered by Echoes of the same name once only, stacking up to 2 times, lasting for 12s. Casting Echo Skill at max stacks does not reset the duration. This effect can be triggered once every 10s and ends early if the wielder is switched off the field.`,
      alwaysEnabled: false,
    },
    {
      key: "WhenAHeartSettlesEcho",
      hasStacks: false,
      modifier: "EchoDMGBonus",
      modifierByRefinement: {
        "1": 0.2,
        "2": 0.25,
        "3": 0.3,
        "4": 0.35,
        "5": 0.4,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Casting Intro Skill grants <span class="param">20%/25%/30%/35%/40%</span> Echo Skill DMG Bonus to all Resonators in the team for 30s. Effects of the same name cannot be stacked.`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 47,
    modifier: "CritRate",
    modifierValue: 0.054,
  },
  "20": {
    attack: 122,
    modifier: "CritRate",
    modifierValue: 0.095,
  },
  "20+": {
    attack: 153,
    modifier: "CritRate",
    modifierValue: 0.095,
  },
  "40": {
    attack: 232,
    modifier: "CritRate",
    modifierValue: 0.137,
  },
  "40+": {
    attack: 264,
    modifier: "CritRate",
    modifierValue: 0.137,
  },
  "50": {
    attack: 303,
    modifier: "CritRate",
    modifierValue: 0.158,
  },
  "50+": {
    attack: 335,
    modifier: "CritRate",
    modifierValue: 0.158,
  },
  "60": {
    attack: 374,
    modifier: "CritRate",
    modifierValue: 0.179,
  },
  "60+": {
    attack: 406,
    modifier: "CritRate",
    modifierValue: 0.179,
  },
  "70": {
    attack: 445,
    modifier: "CritRate",
    modifierValue: 0.2,
  },
  "70+": {
    attack: 476,
    modifier: "CritRate",
    modifierValue: 0.2,
  },
  "80": {
    attack: 516,
    modifier: "CritRate",
    modifierValue: 0.221,
  },
  "80+": {
    attack: 547,
    modifier: "CritRate",
    modifierValue: 0.221,
  },
  "90": {
    attack: 587,
    modifier: "CritRate",
    modifierValue: 0.243,
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
