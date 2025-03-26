const weaponInfo: WeaponInfo = {
  name: "Whispers of Sirens",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/WhispersofSirens.webp",
  description: `From the sea, some see stars, some catch the moon, and some hear countless whispers and murmurs. Those murmurs seep into her venom, flowing through every winding river. In the end, the murmurs envelope, like the bell of a jellyfish, like the sea.`,
  type: "Rectifier",
  rarity: 5,
  passiveName: "From the Deep",
  passiveValue: `<span class="skilldescription">Increases ATK by <span class="param">12%/15%/18%/21%/24%</span>. Casting Echo Skill within <span class="param">10</span>s after casting Intro Skill or Basic Attacks grants <span class="param">1</span> of Gentle Dream. Echoes with the same name can only trigger this effect once, stacking up to <span class="param">2</span> times, lasting for <span class="param">10</span>s. When reaching 2 stacks, casting Echo Skill no longer resets the duration of this effect. This effect activates up to once per 10s. Switching to another Resonator ends this effect early.<br>
With <span class="param">1</span> stack: Grants <span class="param">40%/50%/60%/70%/80%</span> Basic Attack DMG Bonus.<br>
With <span class="param">2</span> stacks: Ignores <span class="param">12%/15%/18%/21%/24%</span> of the target's Havoc RES.</span>`,
  passiveData: [
    {
      key: "WhispersofSirensATK",
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
      details: `Increases ATK by <span class="param">12%/15%/18%/21%/24%</span>`,
      alwaysEnabled: true,
    },
    {
      key: "WhispersofSirensBasicAttackDMG",
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
      details: `Casting Echo Skill within <span class="param">10</span>s after casting Intro Skill or Basic Attacks grants <span class="param">1</span> of Gentle Dream. Echoes with the same name can only trigger this effect once, stacking up to <span class="param">2</span> times, lasting for <span class="param">10</span>s. When reaching 2 stacks, casting Echo Skill no longer resets the duration of this effect. This effect activates up to once per 10s. Switching to another Resonator ends this effect early.<br>With <span class="param">1</span> stack: Grants <span class="param">40%/50%/60%/70%/80%</span> Basic Attack DMG Bonus.`,
      alwaysEnabled: false,
    },
    {
      key: "WhispersofSirensHavocShred",
      hasStacks: false,
      modifier: "ResistShred:Havoc",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Casting Echo Skill within <span class="param">10</span>s after casting Intro Skill or Basic Attacks grants <span class="param">1</span> of Gentle Dream. Echoes with the same name can only trigger this effect once, stacking up to <span class="param">2</span> times, lasting for <span class="param">10</span>s. When reaching 2 stacks, casting Echo Skill no longer resets the duration of this effect. This effect activates up to once per 10s. Switching to another Resonator ends this effect early.<br>With <span class="param">2</span> stacks: Ignores <span class="param">12%/15%/18%/21%/24%</span> of the target's Havoc RES.`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 40,
    modifier: "CritDMG",
    modifierValue: 0.16,
  },
  "20": {
    attack: 104,
    modifier: "CritDMG",
    modifierValue: 0.284,
  },
  "20+": {
    attack: 130,
    modifier: "CritDMG",
    modifierValue: 0.284,
  },
  "40": {
    attack: 198,
    modifier: "CritDMG",
    modifierValue: 0.408,
  },
  "40+": {
    attack: 224,
    modifier: "CritDMG",
    modifierValue: 0.408,
  },
  "50": {
    attack: 258,
    modifier: "CritDMG",
    modifierValue: 0.471,
  },
  "50+": {
    attack: 285,
    modifier: "CritDMG",
    modifierValue: 0.471,
  },
  "60": {
    attack: 318,
    modifier: "CritDMG",
    modifierValue: 0.533,
  },
  "60+": {
    attack: 345,
    modifier: "CritDMG",
    modifierValue: 0.533,
  },
  "70": {
    attack: 379,
    modifier: "CritDMG",
    modifierValue: 0.595,
  },
  "70+": {
    attack: 405,
    modifier: "CritDMG",
    modifierValue: 0.595,
  },
  "80": {
    attack: 439,
    modifier: "CritDMG",
    modifierValue: 0.657,
  },
  "80+": {
    attack: 466,
    modifier: "CritDMG",
    modifierValue: 0.657,
  },
  "90": {
    attack: 500,
    modifier: "CritDMG",
    modifierValue: 0.72,
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
