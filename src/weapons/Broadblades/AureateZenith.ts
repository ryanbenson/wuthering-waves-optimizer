const weaponInfo: WeaponInfo = {
  name: "Aureate Zenith",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/AureateZenith.png",
  description: `A Broadblade awarded to Gladiators of exceptional merit. Its engravings draw inspiration from Griffrexes—natural-born hunters and the first allies Septimontians found in this land. Their bond needs no words, radiant and pure, like the blazing sun that watches over all.`,
  type: "Broadblade",
  rarity: 4,
  passiveName: `Oath of Tide Hunters`,
  passiveValue: `<span class="skilldescription">Casting Resonance Liberation increases ATK by <span class="param">7.2%/11.16%/15.12%/19.08%/23.04%</span> and grants <span class="param">10.8%/16.74%/22.68%/28.62%/34.56%</span> Heavy Attack DMG Bonus for <span class="param">15</span>s.</span>`,
  passiveData: [
    {
      key: "OathofTideHuntersATK",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.072,
        "2": 0.1116,
        "3": 0.1512,
        "4": 0.1908,
        "5": 0.2304,
      },
      details: `Casting Resonance Liberation increases ATK by <span class="param">7.2%/11.16%/15.12%/19.08%/23.04%</span> for <span class="param">15</span>s.</span>`,
      alwaysEnabled: false,
    },
    {
      key: "OathofTideHuntersATKHeavy",
      hasStacks: false,
      modifier: "HeavyAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.108,
        "2": 0.1674,
        "3": 0.2268,
        "4": 0.2862,
        "5": 0.3456,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Casting Resonance Liberation grants <span class="param">10.8%/16.74%/22.68%/28.62%/34.56%</span> Heavy Attack DMG Bonus for <span class="param">15</span>s.</span>`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 33,
    modifier: "CritDMG",
    modifierValue: 0.09,
  },
  "20": {
    attack: 85,
    modifier: "CritDMG",
    modifierValue: 0.159,
  },
  "20+": {
    attack: 107,
    modifier: "CritDMG",
    modifierValue: 0.159,
  },
  "40": {
    attack: 163,
    modifier: "CritDMG",
    modifierValue: 0.229,
  },
  "40+": {
    attack: 185,
    modifier: "CritDMG",
    modifierValue: 0.229,
  },
  "50": {
    attack: 213,
    modifier: "CritDMG",
    modifierValue: 0.264,
  },
  "50+": {
    attack: 235,
    modifier: "CritDMG",
    modifierValue: 0.264,
  },
  "60": {
    attack: 263,
    modifier: "CritDMG",
    modifierValue: 0.299,
  },
  "60+": {
    attack: 285,
    modifier: "CritDMG",
    modifierValue: 0.299,
  },
  "70": {
    attack: 312,
    modifier: "CritDMG",
    modifierValue: 0.334,
  },
  "70+": {
    attack: 334,
    modifier: "CritDMG",
    modifierValue: 0.334,
  },
  "80": {
    attack: 362,
    modifier: "CritDMG",
    modifierValue: 0.369,
  },
  "80+": {
    attack: 384,
    modifier: "CritDMG",
    modifierValue: 0.369,
  },
  "90": {
    attack: 412,
    modifier: "CritDMG",
    modifierValue: 0.405,
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
