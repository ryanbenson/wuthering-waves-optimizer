const weaponInfo: WeaponInfo = {
  name: "Feather Edge",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/FeatherEdge.png",
  description:
    "A Sword awarded to Gladiators of exceptional merit. Its engravings draw inspiration from Griffrexes—natural-born hunters and the first allies Septimontians found in this land. Their bond needs no words, radiant and pure, like the blazing sun that watches over all.",
  type: "Sword",
  rarity: 4,
  passiveName: "Oath of Tide Hunters",
  passiveValue: `<span class="skilldescription">Casting Resonance Liberation increases ATK by <span class="param">7.2%/11.16%/15.12%/19.08%/23.04%</span> and grants <span class="param">10.8%/16.74%/22.68%/28.62%/34.56%</span> Resonance Liberation DMG Bonus for <span class="param">15</span>s.</span>`,
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
      key: "OathofTideHuntersLiberation",
      hasStacks: false,
      modifier: "ResonanceLiberationDMGBonus",
      modifierByRefinement: {
        "1": 0.108,
        "2": 0.1674,
        "3": 0.2268,
        "4": 0.2862,
        "5": 0.3456,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Casting Resonance Liberation grants <span class="param">10.8%/16.74%/22.68%/28.62%/34.56%</span> Resonance Liberation DMG Bonus for <span class="param">15</span>s.</span>`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 33,
    modifier: "CritRate",
    modifierValue: 0.045,
  },
  "20": {
    attack: 85,
    modifier: "CritRate",
    modifierValue: 0.079,
  },
  "20+": {
    attack: 107,
    modifier: "CritRate",
    modifierValue: 0.079,
  },
  "40": {
    attack: 163,
    modifier: "CritRate",
    modifierValue: 0.114,
  },
  "40+": {
    attack: 185,
    modifier: "CritRate",
    modifierValue: 0.114,
  },
  "50": {
    attack: 213,
    modifier: "CritRate",
    modifierValue: 0.132,
  },
  "50+": {
    attack: 235,
    modifier: "CritRate",
    modifierValue: 0.132,
  },
  "60": {
    attack: 263,
    modifier: "CritRate",
    modifierValue: 0.149,
  },
  "60+": {
    attack: 285,
    modifier: "CritRate",
    modifierValue: 0.149,
  },
  "70": {
    attack: 312,
    modifier: "CritRate",
    modifierValue: 0.167,
  },
  "70+": {
    attack: 334,
    modifier: "CritRate",
    modifierValue: 0.167,
  },
  "80": {
    attack: 362,
    modifier: "CritRate",
    modifierValue: 0.184,
  },
  "80+": {
    attack: 384,
    modifier: "CritRate",
    modifierValue: 0.184,
  },
  "90": {
    attack: 412,
    modifier: "CritRate",
    modifierValue: 0.202,
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
