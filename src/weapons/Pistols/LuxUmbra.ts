const weaponInfo: WeaponInfo = {
  name: "Lux & Umbra",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/LuxUmbra.png",
  description:
    "From darkness she seizes power, layering sins upon herself. To hunt. To kill. To deliver a relentless and fatal blow to all evil. From the light she falls, with her vows etched in her mind. For the deceased. For the living. For her pistol's true targets.",
  type: "Pistols",
  rarity: 5,
  passiveName: "To Fire She Returns",
  passiveValue: `<span class="skilldescription">ATK is increased by <span class="param">12%/15%/18%/21%/24%</span>. Upon dealing Echo Skill DMG, gain <span class="param">24%/30%/36%/42%/48%</span> Heavy Attack DMG Amplification for 6s. Upon dealing Heavy Attack DMG, gain <span class="param">24%/30%/36%/42%/48%</span> Echo Skill DMG Amplification for 6s. DMG Amplification on each attack is capped at <span class="param">24%/30%/36%/42%/48%</span>. While both effects are active, dealing damage ignores <span class="param">8%/10%/12%/14%/16%</span> of the target's DEF.</span>`,
  passiveData: [
    {
      key: "ToFireSheReturnsATK",
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
      key: "ToFireSheReturnsDmgDeepenHeavy",
      hasStacks: false,
      modifier: "DMGDeepen:Heavy",
      modifierByRefinement: {
        "1": 0.24,
        "2": 0.3,
        "3": 0.36,
        "4": 0.42,
        "5": 0.48,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Upon dealing Echo Skill DMG, gain <span class="param">24%/30%/36%/42%/48%</span> Heavy Attack DMG Amplification for 6s. DMG Amplification on each attack is capped at <span class="param">24%/30%/36%/42%/48%</span>.`,
      alwaysEnabled: false,
    },
    {
      key: "ToFireSheReturnsDmgDeepenEcho",
      hasStacks: false,
      modifier: "DMGDeepen:Echo",
      modifierByRefinement: {
        "1": 0.24,
        "2": 0.3,
        "3": 0.36,
        "4": 0.42,
        "5": 0.48,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Upon dealing Heavy Attack DMG, gain <span class="param">24%/30%/36%/42%/48%</span> Echo Skill DMG Amplification for 6s. DMG Amplification on each attack is capped at <span class="param">24%/30%/36%/42%/48%</span>.`,
      alwaysEnabled: false,
    },
    {
      key: "ToFireSheReturnsDefIgnore",
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
      details: `While both effects are active, dealing damage ignores <span class="param">8%/10%/12%/14%/16%</span> of the target's DEF.`,
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
