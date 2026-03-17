const weaponInfo: WeaponInfo = {
  name: "Solsworn Ciphers",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/SolswornCiphers.png",
  description:
    `Sunlight gathers. The answer is made plain.<br>
What must be done awaits. The Rein is in your hand.<br>
Step forward, toward the sunlit end.`,
  type: "Gauntlets",
  rarity: 5,
  passiveName: "Sunward",
  passiveValue: `<div>Increases ATK by <span class="Highlight">12%/15%/18%/21%/24%</span>. Casting Intro Skill or Echo Skill grants <span class="Highlight">32%/40%/48%/56%/64%</span> Echo Skill DMG Amplification for <span" class="Highlight">15</span>s. When dealing Echo Skill DMG, Aero DMG ignores <span class="Highlight">10%/12.5%/15%/17.5%/20%</span> of the target's DEF for <span class="Highlight">6</span>s.</div>`,
  passiveData: [
    {
      key: "SolswornCiphersATK",
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
      details: `Increases ATK by <span class="Highlight">12%/15%/18%/21%/24%</span>.`,
      alwaysEnabled: true,
    },
    {
      key: "SolswornCiphersDmgDeepen",
      hasStacks: false,
      modifier: "DMGDeepen:Echo",
      modifierByRefinement: {
        "1": 0.32,
        "2": 0.4,
        "3": 0.48,
        "4": 0.56,
        "5": 0.64,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Casting Intro Skill or Echo Skill grants <span class="Highlight">32%/40%/48%/56%/64%</span> Echo Skill DMG Amplification for <span" class="Highlight">15</span>s.`,
      alwaysEnabled: false,
    },
    {
      key: "SolswornCiphersDefIgnore",
      hasStacks: false,
      modifier: "DEFIgnore",
      modifierByRefinement: {
        "1": 0.1,
        "2": 0.125,
        "3": 0.15,
        "4": 0.175,
        "5": 0.2,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `When dealing Echo Skill DMG, Aero DMG ignores <span class="Highlight">10%/12.5%/15%/17.5%/20%</span> of the target's DEF for <span class="Highlight">6</span>s.`,
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
