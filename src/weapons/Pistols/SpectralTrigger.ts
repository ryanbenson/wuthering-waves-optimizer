const weaponInfo: WeaponInfo = {
  name: "Spectral Trigger",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/SpectralTrigger.png",
  description:
    `A neon glow gilds this cage of memory, same as always.<br>
I wander along old city streets, spilling unspoken words to shadows long gone.<br>
I wanna stay lost here, but the dream is fraying. I must wake up`,
  type: "Pistols",
  rarity: 5,
  passiveName: "Sunken Dream",
  passiveValue: `<span class="skilldescription">Increases ATK by <span class="param">12%/15%/18%/21%/24%</span>. Casting Resonance Skill grants <span class="param">20%/25%/30%/35%/40%</span> Spectro DMG Bonus to the wielder for 14s, stacking up to 2 times. Inflicting Hack - Shifting grants <span class="param">30%/37.5%/45%/52.5%/60%</span> Heavy Attack DMG Amplification to the wielder for 14s, during which Heavy Attack DMG ignores <span class="param">10%/12.5%/15%/17.5%/20%</span> of the target's DEF.</span>`,
  passiveData: [
    {
      key: "SpectralTriggerATK",
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
      key: "SpectralTriggerSpectroDMGBonus",
      hasStacks: true,
      modifier: "Spectro",
      modifierByRefinement: {
        "1": 0.2,
        "2": 0.25,
        "3": 0.3,
        "4": 0.35,
        "5": 0.4,
      },
      minStacks: 0,
      maxStacks: 2,
      details: `Casting Resonance Skill grants <span class="param">20%/25%/30%/35%/40%</span> Spectro DMG Bonus to the wielder for 14s, stacking up to 2 times.`,
      alwaysEnabled: false,
    },
    {
      key: "SpectralTriggerHeavyAttackDMGBonus",
      hasStacks: false,
      modifier: "DMGDeepen:Heavy",
      modifierByRefinement: {
        "1": 0.3,
        "2": 0.375,
        "3": 0.45,
        "4": 0.525,
        "5": 0.6,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Inflicting Hack - Shifting grants <span class="param">30%/37.5%/45%/52.5%/60%</span> Heavy Attack DMG Amplification to the wielder for 14s.`,
      alwaysEnabled: false,
    },
    {
      key: "SpectralTriggerHeavyAttackDefIgnore",
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
      details: `While both effects are active, dealing damage ignores <span class="param">10%/12.5%/15%/17.5%/20%</span> of the target's DEF.`,
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
