const weaponInfo: WeaponInfo = {
  name: "Somnoire Anchor",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/SomnoireAnchor.png",
  description:
    "An anchor once used by Ivory Gatekeeper to stablize the Somnoire. However, it now looks different ever since Ivory Gatekeeper transformed into a white cat... ",
  type: "Sword",
  rarity: 4,
  passiveName: "Meow!",
  passiveValue:
    `<span class="skilldescription">Gain <span class="param">1</span> stack of Hiss when dealing damage to the target, with <span class="param">1</span> stack generated every <span class="param">1</span>s. 
Hiss: each stack increases the wielder's ATK by <span class="param">2%/2.5%/3%/3.5%/4%</span> for <span class="param">3</span>s, stacking up to <span class="param">10</span> times. Switching off the wielder clears all stacks. Gaining <span class="param">10</span> stacks increases the wielder's Crit. Rate by <span class="param">6%/7.5%/9%/10.5%/12%</span>.</span>`,
  passiveData: [
    {
      key: "MeowATK",
      hasStacks: true,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.02,
        "2": 0.025,
        "3": 0.03,
        "4": 0.035,
        "5": 0.04,
      },
      minStacks: 0,
      maxStacks: 10,
      details:
        `Gain <span class="param">1</span> stack of Hiss when dealing damage to the target, with <span class="param">1</span> stack generated every <span class="param">1</span>s. 
Hiss: each stack increases the wielder's ATK by <span class="param">2%/2.5%/3%/3.5%/4%</span> for <span class="param">3</span>s, stacking up to <span class="param">10</span> times. Switching off the wielder clears all stacks.`,
      alwaysEnabled: false,
    },
    {
      key: "MeowCR",
      hasStacks: false,
      modifier: "CritRate",
      modifierByRefinement: {
        "1": 0.06,
        "2": 0.075,
        "3": 0.09,
        "4": 0.105,
        "5": 0.12,
      },
      minStacks: 0,
      maxStacks: 0,
      details:
        `Gaining <span class="param">10</span> stacks increases the wielder's Crit. Rate by <span class="param">6%/7.5%/9%/10.5%/12%</span>.</span>`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
    "1": {
        attack: 37,
        modifier: "ATK",
        modifierValue: 0.04,  // 4.0%
    },
    "20": {
        attack: 96,
        modifier: "ATK",
        modifierValue: 0.071,  // 7.1%
    },
    "20+": {
        attack: 120,
        modifier: "ATK",
        modifierValue: 0.071,  // 7.1%
    },
    "40": {
        attack: 183,
        modifier: "ATK",
        modifierValue: 0.103,  // 10.3%
    },
    "40+": {
        attack: 207,
        modifier: "ATK",
        modifierValue: 0.103,  // 10.3%
    },
    "50": {
        attack: 239,
        modifier: "ATK",
        modifierValue: 0.119,  // 11.9%
    },
    "50+": {
        attack: 263,
        modifier: "ATK",
        modifierValue: 0.119,  // 11.9%
    },
    "60": {
        attack: 294,
        modifier: "ATK",
        modifierValue: 0.134,  // 13.4%
    },
    "60+": {
        attack: 319,
        modifier: "ATK",
        modifierValue: 0.134,  // 13.4%
    },
    "70": {
        attack: 350,
        modifier: "ATK",
        modifierValue: 0.150,  // 15.0%
    },
    "70+": {
        attack: 375,
        modifier: "ATK",
        modifierValue: 0.150,  // 15.0%
    },
    "80": {
        attack: 406,
        modifier: "ATK",
        modifierValue: 0.166,  // 16.6%
    },
    "80+": {
        attack: 431,
        modifier: "ATK",
        modifierValue: 0.166,  // 16.6%
    },
    "90": {
        attack: 462,
        modifier: "ATK",
        modifierValue: 0.182,  // 18.2%
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
