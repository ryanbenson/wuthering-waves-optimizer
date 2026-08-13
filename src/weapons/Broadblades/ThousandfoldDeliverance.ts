const weaponInfo: WeaponInfo = {
  name: "Thousandfold Deliverance",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/ThousandfoldDeliverance.png",
  description: "Endless stretches the Netherworld, the long night lasts forever Myriad souls lie hushed, all sounds fade together\nWhen the chilling, golden rays illuminate the Nether gate, the sunken dreams of old shall finally reveal in the light.",
  type: "Broadblade",
  rarity: 5,
  passiveName: "Call Upon Stars and Ghosts",
  passiveValue: "All-Attribute DMG Bonus is increased by 12%/15%/18%/21%/24%. When casting Intro Skill or gaining a Shield, gain 1 stack of Nature's Order and 1 stack of Cradle of Life. This effect can be triggered via gaining a Shield once every 0.5s, stackable for up to 6/6/6/6/6 stacks, lasting for 7/7/7/7/7s.\nNature's Order: Crit. DMG is increased by 6%/7.5%/9%/10.5%/12%, up to 36%/45%/54%/63%/72%. When Nature's Order reaches 6 stacks, the Crit. Rate of Heavy Attack DMG is increased by 12%/15%/18%/21%/24%.\nCradle of Life: When casting a Heavy Attack, consume up to 2/2/2/2/2 stacks of Cradle of Life. For every 1/1/1/1/1 stack of Cradle of Life consumed, Heavy Attack DMG ignores 15%/17.5%/20%/22.5%/25% of the target's DEF, up to 30%/35%/40%/45%/50%. The effect lasts for 2/2/2/2/2s.",
  passiveData: [
    {
      key: "CallUponStarsAndGhostsAllElementAttributeBonus",
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
        "All-Attribute DMG Bonus is increased by 12%/15%/18%/21%/24%.",
      alwaysEnabled: true,
    },
    {
      key: "CallUponStarsAndGhostsNaturesOrder",
      hasStacks: true,
      modifier: "CritDMG",
      modifierByRefinement: {
        "1": 0.06,
        "2": 0.075,
        "3": 0.09,
        "4": 0.105,
        "5": 0.12,
      },
      details:
        "Nature's Order: Crit. DMG is increased by 6%/7.5%/9%/10.5%/12%, up to 36%/45%/54%/63%/72%",
      alwaysEnabled: false,
      maxStacks: 6,
    },
    {
      key: "CallUponStarsAndGhostsNaturesOrderCritRate",
      hasStacks: false,
      modifier: "CritRate",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details:
        "When Nature's Order reaches 6 stacks, the Crit. Rate of Heavy Attack DMG is increased by 12%/15%/18%/21%/24%.",
      alwaysEnabled: false,
    },
    {
      key: "CallUponStarsAndGhostsCradleOfLife",
      hasStacks: true,
      modifier: "DEFIgnore:Heavy",
      modifierByRefinement: {
        "1": 0.15,
        "2": 0.175,
        "3": 0.20,
        "4": 0.225,
        "5": 0.25,
      },
      details:
        "Cradle of Life: When casting a Heavy Attack, consume up to 2/2/2/2/2 stacks of Cradle of Life. For every 1/1/1/1/1 stack of Cradle of Life consumed, Heavy Attack DMG ignores 15%/17.5%/20%/22.5%/25% of the target's DEF, up to 30%/35%/40%/45%/50%. The effect lasts for 2/2/2/2/2s.",
      alwaysEnabled: false,
      maxStacks: 2,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 33,
    modifier: "HP",
    modifierValue: 0.161,
  },
  "20": {
    attack: 85,
    modifier: "HP",
    modifierValue: 0.285,
  },
  "40": {
    attack: 163,
    modifier: "HP",
    modifierValue: 0.41,
  },
  "50": {
    attack: 213,
    modifier: "HP",
    modifierValue: 0.473,
  },
  "60": {
    attack: 263,
    modifier: "HP",
    modifierValue: 0.535,
  },
  "70": {
    attack: 312,
    modifier: "HP",
    modifierValue: 0.597,
  },
  "80": {
    attack: 362,
    modifier: "HP",
    modifierValue: 0.66,
  },
  "90": {
    attack: 412,
    modifier: "HP",
    modifierValue: 0.722,
  },
  "20+": {
    attack: 107,
    modifier: "HP",
    modifierValue: 0.285,
  },
  "40+": {
    attack: 185,
    modifier: "HP",
    modifierValue: 0.41,
  },
  "50+": {
    attack: 235,
    modifier: "HP",
    modifierValue: 0.473,
  },
  "60+": {
    attack: 285,
    modifier: "HP",
    modifierValue: 0.535,
  },
  "70+": {
    attack: 334,
    modifier: "HP",
    modifierValue: 0.597,
  },
  "80+": {
    attack: 384,
    modifier: "HP",
    modifierValue: 0.66,
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
