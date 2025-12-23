const weaponInfo: WeaponInfo = {
  name: "Boson Astrolabe",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/BosonAstrolabe.png",
  description: `Spacetrek Collective "Synth Armament" Series
Model: SCSA-LHRi-RCTF325062

Forged from compound technology that fuses Exostrider biomorphic components with Tactite, this weapon offers two core features: frequency auto-adaptation and user binding. Its power scales directly with the wielder's Forte, growing sharper through dedicated Forte training.

Composed of a spectral ring-lens and layered glass plates, the device captures even the faintest frequency shifts. Like a guiding star that leads the seekers through a sea of tangled thoughts, it maps possibilities before they take shape. Ideal for the path observers who perceive the world a step ahead.`,
  type: "Pistols",
  rarity: 5,
  passiveName: "Path Observer",
  passiveValue: `<span class="skilldescription">ATK is increased by <span class="param">12%/15%/18%/21%/24%</span>. After a Resonator in the team casts a <span class="Highlight">Tune Break</span> skill, it grants a <span class="param">12%/13.5%/15%/16.5%/18%</span> ATK increase and <span class="Param">12%/13.5%/15%/16.5%/18%</span> Basic Attack DMG Bonus to the wielder for 14s.</span>`,
  passiveData: [
    {
      key: "BosonAstrolabeATK",
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
      key: "BosonAstrolabeATK2",
      hasStacks: false,
      modifier: "ATK",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.135,
        "3": 0.15,
        "4": 0.165,
        "5": 0.18,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `After a Resonator in the team casts a <span class="Highlight">Tune Break</span> skill, it grants a <span class="param">12%/13.5%/15%/16.5%/18%</span> ATK increase to the wielder for 14s.`,
      alwaysEnabled: false,
    },
    {
      key: "BosonAstrolabeBasic",
      hasStacks: false,
      modifier: "BasicAttackDMGBonus",
      modifierByRefinement: {
        "1": 0.12,
        "2": 0.135,
        "3": 0.15,
        "4": 0.165,
        "5": 0.18,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `After a Resonator in the team casts a <span class="Highlight">Tune Break</span> skill, it grants a <span class="param">12%/13.5%/15%/16.5%/18%</span> Basic Attack DMG Bonus to the wielder for 14s.`,
      alwaysEnabled: false,
    },
  ],
};

const weaponData: WeaponData = {
  "1": {
    attack: 42,
    modifier: "EnergyRegen",
    modifierValue: 0.086,
  },
  "20": {
    attack: 137,
    modifier: "EnergyRegen",
    modifierValue: 0.153,
  },
  "20+": {
    attack: 163,
    modifier: "EnergyRegen",
    modifierValue: 0.153,
  },
  "40": {
    attack: 236,
    modifier: "EnergyRegen",
    modifierValue: 0.22,
  },
  "40+": {
    attack: 262,
    modifier: "EnergyRegen",
    modifierValue: 0.22,
  },
  "50": {
    attack: 299,
    modifier: "EnergyRegen",
    modifierValue: 0.254,
  },
  "50+": {
    attack: 326,
    modifier: "EnergyRegen",
    modifierValue: 0.254,
  },
  "60": {
    attack: 363,
    modifier: "EnergyRegen",
    modifierValue: 0.287,
  },
  "60+": {
    attack: 390,
    modifier: "EnergyRegen",
    modifierValue: 0.287,
  },
  "70": {
    attack: 426,
    modifier: "EnergyRegen",
    modifierValue: 0.321,
  },
  "70+": {
    attack: 452,
    modifier: "EnergyRegen",
    modifierValue: 0.321,
  },
  "80": {
    attack: 490,
    modifier: "EnergyRegen",
    modifierValue: 0.355,
  },
  "80+": {
    attack: 517,
    modifier: "EnergyRegen",
    modifierValue: 0.355,
  },
  "90": {
    attack: 525,
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
