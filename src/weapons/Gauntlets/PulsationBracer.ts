const weaponInfo: WeaponInfo = {
  name: "Pulsation Bracer",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/PulsationBracer.png",
  description: `Spacetrek Collective "Synth Armament" Series
Model: SCSA-LHRi-GNTL522152

Forged from compound technology that fuses Exostrider biomorphic components with Tactite, this weapon offers two core features: frequency auto-adaptation and user binding. Its power scales directly with the wielder's Forte, growing sharper through dedicated Forte training.

The armor's spectrum shifts as it restores kinetic energy. The Pulsation Bracer predicts the wearer's stance to amplify the stored reactive torque and release it in a single, instantaneous surge—a decisive force delivered at the critical moment. Ideal for the barrier breachers who advance with steady resolve and stand unshaken under pressure.`,
  type: "Pistols",
  rarity: 5,
  passiveName: "Barrier Breacher",
  passiveValue: `<span class="skilldescription">ATK is increased by <span class="param">12%/15%/18%/21%/24%</span>. Dealing damage to targets under <span class="Highlight">Tune Strain - Interfered</span> grants <span class="param">6%/6.7%/7.5%/8.2%/9%</span> Basic Attack DMG Bonus for 3s, stacking up to 4 times. This effect can be triggered 1 time every 0.5s. Retriggering the effect resets its duration.</span>`,
  passiveData: [
    {
      key: "PulsationBracerATK",
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
      key: "PulsationBracerBasic",
      hasStacks: true,
      modifier: "BasicAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.06,
        "2": 0.067,
        "3": 0.075,
        "4": 0.082,
        "5": 0.09,
      },
      minStacks: 0,
      maxStacks: 4,
      details: `Dealing damage to targets under <span class="Highlight">Tune Strain - Interfered</span> grants <span class="param">6%/6.7%/7.5%/8.2%/9%</span> Basic Attack DMG Bonus for 3s, stacking up to 4 times. This effect can be triggered 1 time every 0.5s. Retriggering the effect resets its duration.`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 47,
    modifier: "CritRate",
    modifierValue: 0.054,
  },
  "20": {
    attack: 122,
    modifier: "CritRate",
    modifierValue: 0.095,
  },
  "40": {
    attack: 232,
    modifier: "CritRate",
    modifierValue: 0.137,
  },
  "50": {
    attack: 303,
    modifier: "CritRate",
    modifierValue: 0.158,
  },
  "60": {
    attack: 374,
    modifier: "CritRate",
    modifierValue: 0.179,
  },
  "70": {
    attack: 445,
    modifier: "CritRate",
    modifierValue: 0.2,
  },
  "80": {
    attack: 516,
    modifier: "CritRate",
    modifierValue: 0.221,
  },
  "90": {
    attack: 587,
    modifier: "CritRate",
    modifierValue: 0.243,
  },
  "20+": {
    attack: 153,
    modifier: "CritRate",
    modifierValue: 0.095,
  },
  "40+": {
    attack: 264,
    modifier: "CritRate",
    modifierValue: 0.137,
  },
  "50+": {
    attack: 335,
    modifier: "CritRate",
    modifierValue: 0.158,
  },
  "60+": {
    attack: 406,
    modifier: "CritRate",
    modifierValue: 0.179,
  },
  "70+": {
    attack: 476,
    modifier: "CritRate",
    modifierValue: 0.2,
  },
  "80+": {
    attack: 547,
    modifier: "CritRate",
    modifierValue: 0.221,
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
