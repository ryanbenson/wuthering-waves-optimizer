const weaponInfo: WeaponInfo = {
  name: "Phasic Homogenizer",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/PhasicHomogenizer.png",
  description: `Spacetrek Collective "Synth Armament" Series
Model: SCSA-LHRi-PSTL325052

Forged from compound technology that fuses Exostrider biomorphic components with Tactite, this weapon offers two core features: frequency auto-adaptation and user binding. Its power scales directly with the wielder's Forte, growing sharper through dedicated Forte training.

Projectile and rifling are spectrally tuned to unleash a potent frequency disturbance on impact, exposing and shattering a target's weak points. It serves as both a benchmark of precision and a weapon that pierces with unwavering focus. Ideal for insight bearers who act with deliberate caution and perceive what others overlook.`,
  type: "Pistols",
  rarity: 5,
  passiveName: "Insight Bearer",
  passiveValue: `<span class="skilldescription">ATK is increased by <span class="param">12%/15%/18%/21%/24%</span>. After a Resonator in the team casts a <span class="Highlight">Tune Break</span> skill, it grants <span class="param">20%/22.5%/25%/27.5%/30%</span> <span class="Highlight">All-Attribute DMG Bonus</span> to the wielder for 14s.</span>`,
  passiveData: [
    {
      key: "PhasicHomogenizerATK",
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
      key: "PhasicHomogenizerAllAttribute",
      hasStacks: false,
      modifier: "AllElementAttributeBonus",
      modifierByRefinement: {
        "1": 0.2,
        "2": 0.225,
        "3": 0.25,
        "4": 0.275,
        "5": 0.3,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `After a Resonator in the team casts a <span class="Highlight">Tune Break</span> skill, it grants <span class="param">20%/22.5%/25%/27.5%/30%</span> <span class="Highlight">All-Attribute DMG Bonus</span> to the wielder for 14s.`,
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
