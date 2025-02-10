const weaponInfo: WeaponInfo = {
  name: "Ocean's Gift",
  image: "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/OceansGift.png",
  description:
    ` To fishers, the sea is their field of harvest. Harvest means hope. `,
  type: "Rectifier",
  rarity: 4,
  passiveName: "Fish Catch",
  passiveValue:
    `<span class="skilldescription">Dealing DMG to enemies with Spectro Frazzle increases the wielder's Spectro DMG by <span class="param">6%/7%/8%/9%/10%</span>, gaining 1 stack per second for 6s, stacking up to 4 times.</span>`,
  passiveData: [
    {
      key: "OceansGiftSpectro",
      hasStacks: true,
      modifier: "Spectro",
      modifierByRefinement: {
        "1": 0.06,
        "2": 0.07,
        "3": 0.08,
        "4": 0.09,
        "5": 0.1,
      },
      minStacks: 0,
      maxStacks: 4,
      details:
        `Dealing DMG to enemies with Spectro Frazzle increases the wielder's Spectro DMG by <span class="param">6%/7%/8%/9%/10%</span>, gaining 1 stack per second for 6s, stacking up to 4 times.`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 37,
    modifier: "ATK",
    modifierValue: 0.04,
  },
  "20": {
    attack: 96,
    modifier: "ATK",
    modifierValue: 0.071,
  },
  "20+": {
    attack: 120,
    modifier: "ATK",
    modifierValue: 0.071,
  },
  "40": {
    attack: 183,
    modifier: "ATK",
    modifierValue: 0.103,
  },
  "40+": {
    attack: 207,
    modifier: "ATK",
    modifierValue: 0.103,
  },
  "50": {
    attack: 239,
    modifier: "ATK",
    modifierValue: 0.119,
  },
  "50+": {
    attack: 263,
    modifier: "ATK",
    modifierValue: 0.119,
  },
  "60": {
    attack: 294,
    modifier: "ATK",
    modifierValue: 0.134,
  },
  "60+": {
    attack: 319,
    modifier: "ATK",
    modifierValue: 0.134,
  },
  "70": {
    attack: 350,
    modifier: "ATK",
    modifierValue: 0.15,
  },
  "70+": {
    attack: 375,
    modifier: "ATK",
    modifierValue: 0.15,
  },
  "80": {
    attack: 406,
    modifier: "ATK",
    modifierValue: 0.166,
  },
  "80+": {
    attack: 431,
    modifier: "ATK",
    modifierValue: 0.166,
  },
  "90": {
    attack: 462,
    modifier: "ATK",
    modifierValue: 0.182,
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
