const weaponInfo: WeaponInfo = {
  name: "Radiance Cleaver",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/RadianceCleaver.png",
  description: `Spacetrek Collective "Synth Armament" Series
Model: SCSA-LHRi-BB325042

Forged from compound technology that fuses Exostrider biomorphic components with Tacetite, this weapon offers two core features: frequency auto-adaptation and user binding. Its power scales directly with the wielder's Forte, growing sharper through dedicated Forte training.

The light patterns along the blade shift in response to the wielder's frequency fluctuations. It crystallizes reason into a concentrated force—a tool to cut through obstacles as well as a measure for charting the unknown. Ideal for the edge breakers who carve their path forward with unwavering resolve.`,
  type: "Broadblade",
  rarity: 5,
  passiveName: `Edge Breaker`,
  passiveValue: `<span class="skilldescription">ATK is increased by <span class="Highlight">12%/15%/18%/21%/24%</span>. Dealing damage to targets under <span class="Highlight">Tune Strain - Interfered</span> grants <span class="Param">24%/27%/30%/33%/36%</span> Resonance Liberation Bonus for 3s. Retriggering the effect resets its duration.</span>`,
  passiveData: [
    {
      key: "RadianceCleaverATK",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.15,
        "3": 0.18,
        "4": 0.21,
        "5": 0.24,
      },
      details: `Increases ATK by <span class="param">12%/15%/18%/21%/24%</span>`,
      alwaysEnabled: true,
    },
    {
      key: "RadianceCleaverLiberation",
      hasStacks: false,
      modifier: "ResonanceLiberationDMGBonus",
      modifierByRefinement: {
        "1": 0.24,
        "2": 0.27,
        "3": 0.3,
        "4": 0.33,
        "5": 0.36,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `Dealing damage to targets under <span class="Highlight">Tune Strain - Interfered</span> grants <span class="param">24%/27%/30%/33%/36%</span> Resonance Liberation Bonus for 3s. Retriggering the effect resets its duration`,
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
  "40": {
    attack: 232,
    modifier: "CritDMG",
    modifierValue: 0.275,
  },
  "50": {
    attack: 303,
    modifier: "CritDMG",
    modifierValue: 0.317,
  },
  "60": {
    attack: 374,
    modifier: "CritDMG",
    modifierValue: 0.359,
  },
  "70": {
    attack: 445,
    modifier: "CritDMG",
    modifierValue: 0.401,
  },
  "80": {
    attack: 516,
    modifier: "CritDMG",
    modifierValue: 0.443,
  },
  "90": {
    attack: 587,
    modifier: "CritDMG",
    modifierValue: 0.486,
  },
  "20+": {
    attack: 153,
    modifier: "CritDMG",
    modifierValue: 0.191,
  },
  "40+": {
    attack: 264,
    modifier: "CritDMG",
    modifierValue: 0.275,
  },
  "50+": {
    attack: 335,
    modifier: "CritDMG",
    modifierValue: 0.317,
  },
  "60+": {
    attack: 406,
    modifier: "CritDMG",
    modifierValue: 0.359,
  },
  "70+": {
    attack: 476,
    modifier: "CritDMG",
    modifierValue: 0.401,
  },
  "80+": {
    attack: 547,
    modifier: "CritDMG",
    modifierValue: 0.443,
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
