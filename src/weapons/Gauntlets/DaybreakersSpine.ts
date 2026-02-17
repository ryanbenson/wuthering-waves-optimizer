const weaponInfo: WeaponInfo = {
  name: "Daybreaker's Spine",
  image:
    "https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/DaybreakersSpine.png",
  description:
    `Those are not ridges of the mountains, but the spine of the earth, carrying the night. They protrude from the abdomen of darkness. From the incision spills the light of new life.
Your shadow was nailed to the dying night. With the breaking dawn, your flesh shall rise.
Let it knock open every door of denial.`,
  type: "Gauntlets",
  rarity: 5,
  passiveName: "Suturing Dayline",
  passiveValue: `<div>Increases ATK by <span class="Highlight" class="font-bold">12%/15%/18%/21%/24%</span>. After dealing Basic Attack DMG, the wielder gains <span class="Highlight" class="font-bold">20%/25%/30%/35%/40%</span> Spectro DMG Bonus for <span class="font-bold">4</span>s. Each time after the wielder inflicts Tune Strain - Shifting on the target, they gain <span class="Highlight" class="font-bold">20%/25%/30%/35%/40%</span> Basic Attack DMG Amplification and their Basic Attack DMG ignores <span class="Highlight" class="font-bold">10%/12.5%/15%/17.5%/20%</span> of the target's DEF for <span class="font-bold">6</span>s.</div>`,
  passiveData: [
    {
      key: "DaybreakersSpineATK",
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
      details: `Increases ATK by <span class="param">12%/15%/18%/21%/24%</span>.`,
      alwaysEnabled: true,
    },
    {
      key: "DaybreakersSpineSpectro",
      hasStacks: false,
      modifier: "Spectro",
      modifierByRefinement: {
        "1": 0.2,
        "2": 0.25,
        "3": 0.3,
        "4": 0.35,
        "5": 0.4,
      },
      minStacks: 0,
      maxStacks: 0,
      details: `After dealing Basic Attack DMG, the wielder gains <span class="Highlight" class="font-bold">20%/25%/30%/35%/40%</span> Spectro DMG Bonus for <span class="font-bold">4</span>s.`,
      alwaysEnabled: false,
    },
    {
      key: "DaybreakersSpineBasicDeepen",
      hasStacks: true,
      modifier: "DMGDeepen:Basic",
      modifierByRefinement: {
        "1": 0.2,
        "2": 0.25,
        "3": 0.3,
        "4": 0.35,
        "5": 0.4,
      },
      minStacks: 0,
      maxStacks: 5,
      details: `Each time after the wielder inflicts Tune Strain - Shifting on the target, they gain <span class="Highlight" class="font-bold">20%/25%/30%/35%/40%</span> Basic Attack DMG Amplification for <span class="font-bold">6</span>s.`,
      alwaysEnabled: false,
    },
    {
      key: "DaybreakersSpineDefIgnore",
      hasStacks: true,
      modifier: "DEFIgnore:Basic",
      modifierByRefinement: {
        "1": 0.1,
        "2": 0.125,
        "3": 0.15,
        "4": 0.175,
        "5": 0.2,
      },
      minStacks: 0,
      maxStacks: 5,
      details: `Each time after the wielder inflicts Tune Strain - Shifting on the target, their Basic Attack DMG ignores <span class="Highlight" class="font-bold">10%/12.5%/15%/17.5%/20%</span> of the target's DEF for <span class="font-bold">6</span>s.`,
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
