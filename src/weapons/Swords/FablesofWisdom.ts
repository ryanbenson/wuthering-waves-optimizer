const weaponInfo: WeaponInfo = {
  name: "Fables of Wisdom",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/FablesofWisdom.png",
  description:
    "This weapon draws its design inspiration from the play—Fables of Wisdom. A wayfarer once carried this sword, who spun fables of wisdom, passing on insights in form of witty jests. Keen ears listened to the stories for the truth, while shallow minds heard only amusing punchlines.",
  type: "Broadblade",
  rarity: 4,
  passiveName: "Rhetoric",
  passiveValue: `<span class="skilldescription">Dealing DMG to enemies with Negative Statuses increases the wielder's ATK by <span class="param">4%/5%/6%/7%/8%</span> for <span class="param">10</span>s. This effect can be triggered 1 time per second, stackable up to <span class="param">4</span> times.</span>`,
  passiveData: [
    {
      key: "RhetoricATK",
      hasStacks: true,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.04,
        "2": 0.05,
        "3": 0.06,
        "4": 0.07,
        "5": 0.08,
      },
      maxStacks: 4,
      details: `<span class="skilldescription">Dealing DMG to enemies with Negative Statuses increases the wielder's ATK by <span class="param">4%/5%/6%/7%/8%</span> for <span class="param">10</span>s. This effect can be triggered 1 time per second, stackable up to <span class="param">4</span> times.</span>`,
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
