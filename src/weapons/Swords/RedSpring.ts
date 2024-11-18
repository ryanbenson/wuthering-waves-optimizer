const weaponInfo: WeaponInfo = {
  name: "Red Spring",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/RedSpring.png",
  description:
    "A camellia bud silently unfurls. As promised, she holds this infinite world in bloom in her palms, where fine crimson vines twine around her fingertips. The dull ache, like sand scratching against the heart, is proof of your fateful encounter.",
  type: "Sword",
  rarity: 5,
  passiveName: "Beyond the Cycle",
  passiveValue:
    `<span class="skilldescription">Increase ATK by <span class="param">12%/15%/18%/21%/24%</span>. When dealing Basic Attack DMG, the wielder gains <span class="param">10%/12.5%/15%/17.5%/20%</span> Basic Attack DMG Bonus for <span class="param">14</span>s. This effect can be triggered once per second, stacking up to <span class="param">3</span> times.<br>
When the wielder's Concerto Energy is consumed, gain <span class="param">40%/50%/60%/70%/80%</span> Basic DMG Bonus for <span class="param">10</span>. This effect can be triggered once per second and ends when the wielder is switched off the field.</span>`,
  passiveData: [
    {
      key: "BeyondtheCycleAtk",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details: "Attack power increases by 12/15/18/21/24%.",
      alwaysEnabled: true,
    },
    {
      key: "BeyondtheCycleBasicBonus",
      hasStacks: true,
      modifier: "BasicAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.10,
        "2": 0.125,
        "3": 0.15,
        "4": 0.175,
        "5": 0.2,
      },
      minStacks: 0,
      maxStacks: 3,
      details:
        "When dealing Basic Attack DMG, the wielder gains 10%/12.5%/15%/17.5%/20% Basic Attack DMG Bonus for 14s. This effect can be triggered once per second, stacking up to 3 times.",
      alwaysEnabled: false,
    },
    {
      key: "BeyondtheCycleBasicBonusOutro",
      hasStacks: false,
      modifier: "BasicAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.4,
        "2": 0.5,
        "3": 0.6,
        "4": 0.7,
        "5": 0.8,
      },
      minStacks: 0,
      maxStacks: 0,
      details:
        "When the wielder's Concerto Energy is consumed, gain 40%/50%/60%/70%/80% Basic DMG Bonus for 10. This effect can be triggered once per second and ends when the wielder is switched off the field.",
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
