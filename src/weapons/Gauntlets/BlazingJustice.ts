const weaponInfo: WeaponInfo = {
  name: "Blazing Justice",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/BlazingJustice.png",
  description:
    "It heralds justice, precise and inexorable as a clock's toll. All sins are cleansed in flame, dissipating like night beneath the dawn's gaze.",
  type: "Gauntlets",
  rarity: 5,
  passiveName: "Darkness Breaker",
  passiveValue: `<span class="skilldescription">Increases ATK by <span class="param">12%/15%/18%/21%/24%</span>. Casting Resonance Liberation grants the following effects: Dealing damage ignores <span class="param">8%/10%/12%/14%/16%</span> of the target's DEF and Amplifies Spectro Frazzle DMG dealt by <span class="param">50%/62.5%/75%/87.5%/100%</span> for <span class="param">6</span>s. Retriggering the effect resets its duration.</span>`,
  passiveData: [
    {
      key: "BlazingJusticeATK",
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
      details: `Increases ATK by <span class="param">12%/15%/18%/21%/24%</span>.`,
      alwaysEnabled: true,
    },
    {
      key: "BlazingJusticeDefIgnore",
      hasStacks: false,
      modifier: "DEFIgnore",
      modifierByRefinement: {
        "1": 0.08,
        "2": 0.1,
        "3": 0.12,
        "4": 0.14,
        "5": 0.16,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Casting Resonance Liberation grants the following effects: Dealing damage ignores 8%/10%/12%/14%/16% of the target's DEF for 6s.`,
      alwaysEnabled: false,
    },
    {
      key: "BlazingJusticeSpectroFrazzle",
      hasStacks: false,
      modifier: "DMGDeepen:SpectroFrazzle",
      modifierByRefinement: {
        "1": 0.5,
        "2": 0.625,
        "3": 0.75,
        "4": 0.875,
        "5": 1,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Casting Resonance Liberation grants the following effects: Amplifies Spectro Frazzle DMG dealt by 50%/62.5%/75%/87.5%/100% for 6s`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 47,
    modifier: "CritDMG",
    modifierValue: 0.108,
  },
  "20": {
    attack: 122,
    modifier: "CritDMG",
    modifierValue: 0.191,
  },
  "20+": {
    attack: 153,
    modifier: "CritDMG",
    modifierValue: 0.191,
  },
  "40": {
    attack: 232,
    modifier: "CritDMG",
    modifierValue: 0.275,
  },
  "40+": {
    attack: 264,
    modifier: "CritDMG",
    modifierValue: 0.275,
  },
  "50": {
    attack: 303,
    modifier: "CritDMG",
    modifierValue: 0.317,
  },
  "50+": {
    attack: 335,
    modifier: "CritDMG",
    modifierValue: 0.317,
  },
  "60": {
    attack: 374,
    modifier: "CritDMG",
    modifierValue: 0.359,
  },
  "60+": {
    attack: 406,
    modifier: "CritDMG",
    modifierValue: 0.359,
  },
  "70": {
    attack: 445,
    modifier: "CritDMG",
    modifierValue: 0.401,
  },
  "70+": {
    attack: 476,
    modifier: "CritDMG",
    modifierValue: 0.401,
  },
  "80": {
    attack: 516,
    modifier: "CritDMG",
    modifierValue: 0.443,
  },
  "80+": {
    attack: 547,
    modifier: "CritDMG",
    modifierValue: 0.443,
  },
  "90": {
    attack: 587,
    modifier: "CritDMG",
    modifierValue: 0.486,
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
