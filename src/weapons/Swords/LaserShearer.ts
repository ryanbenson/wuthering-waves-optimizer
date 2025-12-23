const weaponInfo: WeaponInfo = {
  name: "Laser Shearer",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/LaserShearer.png",
  description: `Spacetrek Collective "Synth Armament" Series
Model: SCSA-LHRi-SWD201052

Forged from compound technology that fuses Exostrider biomorphic components with Tactite, this weapon offers two core features: frequency auto-adaptation and user binding. Its power scales directly with the wielder's Forte, growing sharper through dedicated Forte training.

The light patterns along the blade shift in response to the wielder's frequency fluctuations. Each strike expresses a refined intuition, a "razor" that cuts away unnecessary possibilities. Ideal for the signal catchers who discern the greater picture from the smallest details and make sound judgments.`,
  type: "Pistols",
  rarity: 5,
  passiveName: "Signal Catcher",
  passiveValue: `<span class="skilldescription">ATK is increased by <span class="param">12%/15%/18%/21%/24%</span>. Dealing damage to targets under <span class="Highlight">Tune Strain - Interfered</span> grants <span class="Param">24%/27%/30%/33%/36%</span> Resonance Skill Bonus for 3s. Retriggering the effect resets its duration.</span>`,
  passiveData: [
    {
      key: "LaserShearerATK",
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
      key: "LaserShearerSkill",
      hasStacks: false,
      modifier: "ResonanceSkillDMGBonus",
      modifierByRefinement: {
        "1": 0.24,
        "2": 0.27,
        "3": 0.3,
        "4": 0.33,
        "5": 0.36,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Dealing damage to targets under <span class="Highlight">Tune Strain - Interfered</span> grants <span class="Param">24%/27%/30%/33%/36%</span> Resonance Skill Bonus for 3s. Retriggering the effect resets its duration.`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 47,
    modifier: "EnergyRegen",
    modifierValue: 0.086,
  },
  "20": {
    attack: 122,
    modifier: "EnergyRegen",
    modifierValue: 0.153,
  },
  "20+": {
    attack: 153,
    modifier: "EnergyRegen",
    modifierValue: 0.153,
  },
  "40": {
    attack: 232,
    modifier: "EnergyRegen",
    modifierValue: 0.22,
  },
  "40+": {
    attack: 264,
    modifier: "EnergyRegen",
    modifierValue: 0.22,
  },
  "50": {
    attack: 303,
    modifier: "EnergyRegen",
    modifierValue: 0.254,
  },
  "50+": {
    attack: 335,
    modifier: "EnergyRegen",
    modifierValue: 0.254,
  },
  "60": {
    attack: 374,
    modifier: "EnergyRegen",
    modifierValue: 0.287,
  },
  "60+": {
    attack: 406,
    modifier: "EnergyRegen",
    modifierValue: 0.287,
  },
  "70": {
    attack: 445,
    modifier: "EnergyRegen",
    modifierValue: 0.321,
  },
  "70+": {
    attack: 476,
    modifier: "EnergyRegen",
    modifierValue: 0.321,
  },
  "80": {
    attack: 516,
    modifier: "EnergyRegen",
    modifierValue: 0.355,
  },
  "80+": {
    attack: 547,
    modifier: "EnergyRegen",
    modifierValue: 0.355,
  },
  "90": {
    attack: 587,
    modifier: "EnergyRegen",
    modifierValue: 0.388,
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
