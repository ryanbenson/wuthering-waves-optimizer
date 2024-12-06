const weaponInfo: WeaponInfo = {
  name: "The Pretentious Waltz",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/ThePretentiousWaltz.webp",
  description: `The design of the weapon is inspired by the play "The Pretentious Waltz". Waltz is a dance of form rather than substance. The grand symphony conceals the conspiracy and whispers in the ears, and the flying hems cover the quietly exchanged documents and letters - tacitly understood, like the tacit understanding of the dance steps under the feet, everything flows quietly, like the silent harmony of the musical instrument.`,
  type: "Rectifier",
  rarity: 4,
  passiveName: "Rhetoric",
  passiveValue: `When dealing damage to an enemy with <span class="Highlight">[Abnormal Effect]</span>, increase your attack by <span class="Highlight">4%/5%/6%/7%/8%</span> for <span class="Highlight">10</span> seconds. This effect can be triggered once per second and can be stacked up to <span class="Highlight">4</span> times.`,
  passiveData: [
    {
      key: "AugmentATK",
      hasStacks: true,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.04,
        "2": 0.05,
        "3": 0.06,
        "4": 0.07,
        "5": 0.08,
      },
      minStacks: 0,
      maxStacks: 4,
      details: `When dealing damage to an enemy with <span class="Highlight">[Abnormal Effect]</span>, increase your attack by <span class="Highlight">4%/5%/6%/7%/8%</span> for <span class="Highlight">10</span> seconds. This effect can be triggered once per second and can be stacked up to <span class="Highlight">4</span> times.`,
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
