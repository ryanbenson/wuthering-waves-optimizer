export const twoSetBonuses: string[] = [
  "Freezing Frost 2 Set",
  "Molten Rift 2 Set",
  "Void Thunder 2 Set",
  "Sierra Gale 2 Set",
  "Celestial Light 2 Set",
  "Sun-sinking Eclipse 2 Set",
  "Rejuvenating Glow 2 Set",
  "Moonlit Clouds 2 Set",
  "Lingering Tunes 2 Set",
  "A Heart Of Determination 2 Set",
];
export const fiveSetBonuses: string[] = [
  "Freezing Frost 5 Set",
  "Molten Rift 5 Set",
  "Void Thunder 5 Set",
  "Sierra Gale 5 Set",
  "Celestial Light 5 Set",
  "Sun-sinking Eclipse 5 Set",
  "Rejuvenating Glow 5 Set",
  "Moonlit Clouds 5 Set",
  "Lingering Tunes 5 Set",
  "Brave the Waves 5 Set",
  "A Song of High Heavens 5 Set",
  "The Eternal Light 5 Set",
  "The Veil of Hidden Night 5 Set",
  "A Heart Of Determination 5 Set",
];

type EchoSetBonus = {
  name: string;
  key: string;
  passives: EchoSetBonusPassive[];
  details: string;
};
type EchoSetBonusPassive = {
  key: string;
  details: string;
  modifiers: EchoSetBonusModifier[];
  minStacks?: number;
  maxStacks?: number;
  alwaysEnabled: boolean;
  hasStacks?: boolean;
};
type EchoSetBonusModifier = {
  modifier: string;
  modifierValue: number | string;
};

export const setBonusEffectsOne: Record<string, EchoSetBonus> = {
  "Freezing Frost 2 Set": {
    name: "Freezing Frost",
    key: "FreezingFrost2Set",
    passives: [
      {
        key: "FreezingFrost2SetGlacio",
        details: `<span class="Ice">Glacio</span> DMG increased by <span class="Highlight">10%</span>`,
        modifiers: [
          {
            modifier: "Glacio",
            modifierValue: 10,
          },
        ],
        minStacks: 0,
        maxStacks: 0,
        alwaysEnabled: true,
      },
    ],
    details: `<span class="Ice">Glacio</span> DMG increased by <span class="Highlight">10%</span>`,
  },
  "Molten Rift 2 Set": {
    name: "Molten Rift",
    key: "MoltenRift2Set",
    passives: [
      {
        key: "MoltenRift2SetFusion",
        details: `<span class="Fire">Fusion</span> DMG increased by <span class="Highlight">10%</span>`,
        modifiers: [
          {
            modifier: "Fusion",
            modifierValue: 10,
          },
        ],
        minStacks: 0,
        maxStacks: 0,
        alwaysEnabled: true,
      },
    ],
    details: `<span class="Fire">Fusion</span> DMG increased by <span class="Highlight">10%</span>`,
  },
  "Void Thunder 2 Set": {
    name: "Void Thunder",
    key: "VoidThunder2Set",
    passives: [
      {
        key: "VoidThunder2SetElectro",
        details: `<span class="Thunder">Electro</span> DMG increased by <span class="Highlight">10%</span>`,
        modifiers: [
          {
            modifier: "Electro",
            modifierValue: 10,
          },
        ],
        minStacks: 0,
        maxStacks: 0,
        alwaysEnabled: true,
      },
    ],
    details: `<span class="Thunder">Electro</span> DMG increased by <span class="Highlight">10%</span>`,
  },
  "Sierra Gale 2 Set": {
    name: "Sierra Gale",
    key: "SierraGale2Set",
    passives: [
      {
        key: "SierraGale2SetAero",
        details: `<span class="Wind">Aero</span> DMG increased by <span class="Highlight">10%</span>`,
        modifiers: [
          {
            modifier: "Aero",
            modifierValue: 10,
          },
        ],
        minStacks: 0,
        maxStacks: 0,
        alwaysEnabled: true,
      },
    ],
    details: `<span class="Wind">Aero</span> DMG increased by <span class="Highlight">10%</span>`,
  },
  "Celestial Light 2 Set": {
    name: "Celestial Light",
    key: "CelestialLight2Set",
    passives: [
      {
        key: "CelestialLight2SetSpectro",
        details: `<span class="Light">Spectro</span> DMG increased by <span class="Highlight">10%</span>`,
        modifiers: [
          {
            modifier: "Spectro",
            modifierValue: 10,
          },
        ],
        minStacks: 0,
        maxStacks: 0,
        alwaysEnabled: true,
      },
    ],
    details: `<span class="Light">Spectro</span> DMG increased by <span class="Highlight">10%</span>`,
  },
  "Sun-sinking Eclipse 2 Set": {
    name: "Sun-sinking Eclipse",
    key: "SunSinkingEclipse2Set",
    passives: [
      {
        key: "SunSinkingEclipse2SetHavoc",
        details: `<span class="Dark">Havoc</span> DMG increased by <span class="Highlight">10%</span>`,
        modifiers: [
          {
            modifier: "Havoc",
            modifierValue: 10,
          },
        ],
        minStacks: 0,
        maxStacks: 0,
        alwaysEnabled: true,
      },
    ],
    details: `<span class="Dark">Havoc</span> DMG increased by <span class="Highlight">10%</span>`,
  },
  "Rejuvenating Glow 2 Set": {
    name: "Rejuvenating Glow",
    key: "RejuvenatingGlow2Set",
    passives: [
      {
        key: "RejuvenatingGlow2SetHealingBonus",
        details: `Healing increases by <span class="Highlight">10%</span>`,
        modifiers: [
          {
            modifier: "HealingBonus",
            modifierValue: 10,
          },
        ],
        minStacks: 0,
        maxStacks: 0,
        alwaysEnabled: true,
      },
    ],
    details: `Healing increases by <span class="Highlight">10%</span>`,
  },
  "Moonlit Clouds 2 Set": {
    name: "Moonlit Clouds",
    key: "MoonlitClouds2Set",
    passives: [
      {
        key: "MoonlitClouds2SetEnergyRegen",
        details: `Energy Regen increases by <span class="Highlight">10%</span>`,
        modifiers: [
          {
            modifier: "EnergyRegen",
            modifierValue: 10,
          },
        ],
        minStacks: 0,
        maxStacks: 0,
        alwaysEnabled: true,
      },
    ],
    details: `Energy Regen increases by <span class="Highlight">10%</span>`,
  },
  "Lingering Tunes 2 Set": {
    name: "Lingering Tunes",
    key: "LingeringTunes2Set",
    passives: [
      {
        key: "LingeringTunes2SetATK",
        details: `ATK increases by <span class="Highlight">10%</span>`,
        modifiers: [
          {
            modifier: "ATK",
            modifierValue: 10,
          },
        ],
        minStacks: 0,
        maxStacks: 0,
        alwaysEnabled: true,
      },
    ],
    details: `ATK increases by <span class="Highlight">10%</span>`,
  },
  "A Heart Of Determination 2 Set": {
    name: "A Heart Of Determination",
    key: "HeartOfDetermination2Set",
    passives: [
      {
        key: "HeartOfDetermination2SetResonanceSkillDMGBonus",
        details: `Increase Resonance Skill DMG by <span class="Highlight">12%</span>`,
        modifiers: [
          {
            modifier: "ResonanceSkillDMGBonus",
            modifierValue: 12,
          },
        ],
        minStacks: 0,
        maxStacks: 0,
        alwaysEnabled: true,
      },
    ],
    details: `Increase Resonance Skill DMG by <span class="Highlight">12%</span>`,
  },
  "A Song of High Heavens 2 Set": {
    name: "A Song of High Heavens",
    key: "SongOfHighHeavens2Set",
    passives: [
      {
        key: "SongOfHighHeavens2SetEnergyRegen",
        details: `Energy Regen increases by <span class="Highlight">10%</span>`,
        modifiers: [
          {
            modifier: "EnergyRegen",
            modifierValue: 10,
          },
        ],
        minStacks: 0,
        maxStacks: 0,
        alwaysEnabled: true,
      },
    ],
    details: `Energy Regen increases by <span class="Highlight">10%</span>`,
  },
  "Brave the Waves 2 Set": {
    name: "Brave the Waves",
    key: "BraveTheWaves2Set",
    passives: [
      {
        key: "BraveTheWaves2SetEnergyRegen",
        details: `Energy Regen increases by <span class="Highlight">10%</span>`,
        modifiers: [
          {
            modifier: "EnergyRegen",
            modifierValue: 10,
          },
        ],
        minStacks: 0,
        maxStacks: 0,
        alwaysEnabled: true,
      },
    ],
    details: `HP increases by <span class="Highlight">10%</span>`,
  },
  "The Eternal Light 2 Set": {
    name: "The Eternal Light",
    key: "TheEternalLight2Set",
    passives: [
      {
        key: "TheEternalLight2SetHP",
        details: `Increases Spectro DMG by 10%`,
        modifiers: [
          {
            modifier: "Spectro",
            modifierValue: 10,
          },
        ],
        minStacks: 0,
        maxStacks: 0,
        alwaysEnabled: true,
      },
    ],
    details: `Increases Spectro DMG by 10%`,
  },
  "The Veil of Hidden Night 2 Set": {
    name: "The Veil of Hidden Night",
    key: "TheVeilofHiddenNight2Set",
    passives: [
      {
        key: "TheVeilofHiddenNight2SetHavoc",
        details: `Increases Havoc DMG by 10%`,
        modifiers: [
          {
            modifier: "Havoc",
            modifierValue: 10,
          },
        ],
        minStacks: 0,
        maxStacks: 0,
        alwaysEnabled: true,
      },
    ],
    details: `Increases Havoc DMG by 10%`,
  },
};

export const setBonusEffectsTwo: Record<string, EchoSetBonus> = {
  ...setBonusEffectsOne,
  "Freezing Frost 5 Set": {
    key: "FreezingFrost5Set",
    name: "Freezing Frost",
    details: `Upon using Basic Attack or Heavy Attack, <span class="Ice">Glacio</span> DMG increases by <span class="Highlight">10%</span>, stacking up to three times, lasting for <span class="Highlight">15s.</span>`,
    passives: [
      {
        key: "FreezingFrost5SetGlacio",
        modifiers: [
          {
            modifier: "Glacio",
            modifierValue: 10,
          },
        ],
        maxStacks: 3,
        minStacks: 0,
        hasStacks: true,
        alwaysEnabled: false,
        details: `Upon using Basic Attack or Heavy Attack, <span class="Ice">Glacio</span> DMG increases by <span class="Highlight">10%</span>, stacking up to three times, lasting for <span class="Highlight">15s.</span>`,
      },
    ],
  },
  "Molten Rift 5 Set": {
    key: "MoltenRift5Set",
    name: "Molten Rift",
    details: `Upon using Resonance Skill, <span class="Fire">Fusion</span> DMG increases by <span class="Highlight">30%</span> for <span class="Highlight">15s.</span>`,
    passives: [
      {
        key: "MoltenRift5SetFusion",
        modifiers: [
          {
            modifier: "Fusion",
            modifierValue: 30,
          },
        ],
        alwaysEnabled: false,
        details: `Upon using Resonance Skill, <span class="Fire">Fusion</span> DMG increases by <span class="Highlight">30%</span> for <span class="Highlight">15s.</span>`,
      },
    ],
  },
  "Void Thunder 5 Set": {
    key: "VoidThunder5Set",
    name: "Void Thunder",
    details: `Upon using Heavy Attack or Resonance Skill, <span class="Thunder">Electro</span> DMG increases by <span class="Highlight">15%</span>, stacking up to <span class="Highlight">2</span> times, each stack lasting for <span class="Highlight">15s.</span>`,
    passives: [
      {
        key: "VoidThunder5SetElectro",
        modifiers: [
          {
            modifier: "Electro",
            modifierValue: 15,
          },
        ],
        maxStacks: 2,
        minStacks: 0,
        hasStacks: true,
        alwaysEnabled: false,
        details: `Upon using Heavy Attack or Resonance Skill, <span class="Thunder">Electro</span> DMG increases by <span class="Highlight">15%</span>, stacking up to <span class="Highlight">2</span> times, each stack lasting for <span class="Highlight">15s.</span>`,
      },
    ],
  },
  "Sierra Gale 5 Set": {
    key: "SierraGale5Set",
    name: "Sierra Gale",
    details: `Upon using Intro Skill, <span class="Wind">Aero</span> DMG increases by <span class="Highlight">30%</span> for <span class="Highlight">15s.</span>`,
    passives: [
      {
        key: "SierraGale5SetAero",
        modifiers: [
          {
            modifier: "Aero",
            modifierValue: 30,
          },
        ],
        alwaysEnabled: false,
        details: `Upon using Intro Skill, <span class="Wind">Aero</span> DMG increases by <span class="Highlight">30%</span> for <span class="Highlight">15s.</span>`,
      },
    ],
  },
  "Celestial Light 5 Set": {
    key: "CelestialLight5Set",
    name: "Celestial Light",
    details: `Upon using Intro Skill, <span class="Light">Spectro</span> DMG increases by <span class="Highlight">30%</span> for <span class="Highlight">15s.</span>`,
    passives: [
      {
        key: "CelestialLight5SetSpectro",
        modifiers: [
          {
            modifier: "Spectro",
            modifierValue: 30,
          },
        ],
        alwaysEnabled: false,
        details: `Upon using Intro Skill, <span class="Light">Spectro</span> DMG increases by <span class="Highlight">30%</span> for <span class="Highlight">15s.</span>`,
      },
    ],
  },
  "Sun-sinking Eclipse 5 Set": {
    key: "SunSinkingEclipse5Set",
    name: "Sun-sinking Eclipse",
    details: `Upon using Basic Attack or Heavy Attack, <span class="Dark">Havoc</span> DMG increases by <span class="Highlight">7.5%</span>, stacking up to four times for <span class="Highlight">15s.</span>`,
    passives: [
      {
        key: "SunSinkingEclipse5SetHavoc",
        modifiers: [
          {
            modifier: "Havoc",
            modifierValue: 7.5,
          },
        ],
        maxStacks: 4,
        minStacks: 0,
        hasStacks: true,
        alwaysEnabled: false,
        details: `Upon using Basic Attack or Heavy Attack, <span class="Dark">Havoc</span> DMG increases by <span class="Highlight">7.5%</span>, stacking up to four times for <span class="Highlight">15s.</span>`,
      },
    ],
  },
  "Rejuvenating Glow 5 Set": {
    key: "RejuvenatingGlow5Set",
    name: "Rejuvenating Glow",
    details: `Upon healing allies, increase ATK of the entire team by <span class="Highlight">15%</span>, lasting <span class="Highlight">30s.</span>`,
    passives: [
      {
        key: "RejuvenatingGlow5SetATK",
        modifiers: [
          {
            modifier: "ATK",
            modifierValue: 15,
          },
        ],
        alwaysEnabled: false,
        details: `Upon healing allies, increase ATK of the entire team by <span class="Highlight">15%</span>, lasting <span class="Highlight">30s.</span>`,
      },
    ],
  },
  "Moonlit Clouds 5 Set": {
    key: "MoonlitClouds5Set",
    name: "Moonlit Clouds",
    details: `Upon using Outro Skill, ATK of the next Resonator increases by <span class="Highlight">22.5%</span> for <span class="Highlight">15s.</span>`,
    passives: [],
  },
  "Lingering Tunes 5 Set": {
    key: "LingeringTunes5Set",
    name: "Lingering Tunes",
    details: `While on the field, ATK increases by <span class="Highlight">5%</span> every <span class="Highlight">1.5s</span>, stacking up to 4 times. Outro Skill DMG increases by <span class="Highlight">60%.</span>`,
    passives: [
      {
        key: "LingeringTunes5SetATK",
        modifiers: [
          {
            modifier: "ATK",
            modifierValue: 5,
          },
        ],
        maxStacks: 4,
        minStacks: 0,
        hasStacks: true,
        alwaysEnabled: false,
        details: `While on the field, ATK increases by <span class="Highlight">5%</span> every <span class="Highlight">1.5s</span>, stacking up to 4 times.`,
      },
      {
        key: "LingeringTunes5SetOutroSkillDMGBonus",
        modifiers: [
          {
            modifier: "OutroSkillDMGBonus",
            modifierValue: 60,
          },
        ],
        alwaysEnabled: true,
        details: `Outro Skill DMG increases by <span class="Highlight">60%.</span>`,
      },
    ],
  },
  "A Heart Of Determination 5 Set": {
    key: "AHeartOfDetermination5Set",
    name: "A Heart Of Determination",
    details: `For 6 seconds after using Resonance Liberation, increase <span class="Ice">Glacio</span> DMG by <span class="Highlight">30%</span>, and <span class="Highlight">Resonance Skill</span> DMG by <span class="Highlight">30%</span>.`,
    passives: [
      {
        key: "AHeartOfDetermination5Set5SetGlacioSkillDMGBonus",
        modifiers: [
          {
            modifier: "Glacio",
            modifierValue: 30,
          },
          {
            modifier: "ResonanceSkillDMGBonus",
            modifierValue: 30,
          },
        ],
        alwaysEnabled: false,
        details: `For 6 seconds after using Resonance Liberation, increase <span class="Ice">Glacio</span> DMG by <span class="Highlight">30%</span>, and <span class="Highlight">Resonance Skill</span> DMG by <span class="Highlight">30%</span>.`,
      },
    ],
  },
  "The Veil of Hidden Night 5 Set": {
    key: "TheVeilofHiddenNight5Set",
    name: "The Veil of Hidden Night",
    details: `When the character uses an <span class="Highlight">Outro Skill</span>, it deals an additional <span class="Highlight">480%</span> <span class="Dark">Havoc</span> DMG and increases the next character's <span class="Dark">Havoc</span> DMG by <span class="Highlight">15%</span> for <span class="Highlight">15</span> seconds`,
    passives: [
      {
        key: "TheVeilofHiddenNight5SetAttack",
        modifiers: [
          {
            modifier: "EnableAttack",
            modifierValue: "TheVeilofHiddenNight",
          },
        ],
        alwaysEnabled: false,
        details: `When the character uses an <span class="Highlight">Outro Skill</span>, it deals an additional <span class="Highlight">480%</span> <span class="Dark">Havoc</span> DMG and increases the next character's <span class="Dark">Havoc</span> DMG by <span class="Highlight">15%</span> for <span class="Highlight">15</span> seconds`,
      },
    ],
  },
  "The Eternal Light 5 Set": {
    key: "TheEternalLight5Set",
    name: "The Eternal Light",
    details: `When a character adds [light noise effect] to a target, the characters Crit Rate is increased by <span class="Highlight">20%</span> for <span class="Highlight">15</span> seconds. When attacking an enemy with 10 stacks of [light noise effect] the character gains <span class="Highlight">15%</span> <span class="Light">Spectro</span> DMG bonus for <span class="Highlight">15</span> seconds`,
    passives: [
      {
        key: "TheEternalLight5SetCritDMG",
        modifiers: [
          {
            modifier: "CritRate",
            modifierValue: 20,
          },
        ],
        alwaysEnabled: false,
        details: `When a character adds [light noise effect] to a target, the characters Crit Rate is increased by <span class="Highlight">20%</span> for <span class="Highlight">15</span> seconds.`,
      },
      {
        key: "TheEternalLight5SetSpectro",
        modifiers: [
          {
            modifier: "Spectro",
            modifierValue: 15,
          },
        ],
        alwaysEnabled: false,
        details: `When attacking an enemy with 10 stacks of [light noise effect] the character gains <span class="Highlight">15%</span> <span class="Light">Spectro</span> DMG bonus for <span class="Highlight">15</span> seconds`,
      },
    ],
  },
  "A Song of High Heavens 5 Set": {
    key: "ASongOfHighHeavens5Set",
    name: "A Song of High Heavens",
    details: `Increases the DMG dealt by coordinated attacks by <span class="Highlight">80%</span>, when a coordinated attack deals Crit DMG, the whole team gains <span class="Highlight">20%</span> ATK bonus.`,
    passives: [
      {
        key: "ASongOfHighHeavens5SetCoordinatedDMGBonus",
        modifiers: [
          {
            modifier: "CoordinatedDMGBonus",
            modifierValue: 80,
          },
        ],
        alwaysEnabled: false,
        details: `Increases the DMG dealt by coordinated attacks by <span class="Highlight">80%</span>.`,
      },
      {
        key: "ASongOfHighHeavens5SetATK",
        modifiers: [
          {
            modifier: "ATK",
            modifierValue: 20,
          },
        ],
        alwaysEnabled: false,
        details: `When a coordinated attack deals Crit DMG, the whole team gains <span class="Highlight">20%</span> ATK bonus.`,
      },
    ],
  },
  "Brave the Waves 5 Set": {
    name: "Brave the Waves",
    key: "BravetheWaves",
    details: `ATK is increased by <span class="Highlight">15%</span>, after Energy Regen reaches <span class="Highlight">250%</span> the current character's all attribute DMG is increased by <span class="Highlight">30%</span> for the Resonator.`,
    passives: [
      {
        key: "BravetheWaves5SetATK",
        modifiers: [
          {
            modifier: "ATK",
            modifierValue: 15,
          },
        ],
        alwaysEnabled: false,
        details: `ATK is increased by <span class="Highlight">15%</span>.`,
      },
      {
        key: "BravetheWaves5SetAllElementAttributeBonus",
        modifiers: [
          {
            modifier: "AllElementAttributeBonus",
            modifierValue: 30,
          },
        ],
        alwaysEnabled: false,
        details: `After Energy Regen reaches <span class="Highlight">250%</span> the current character's all attribute DMG is increased by <span class="Highlight">30%</span> for the Resonator.`,
      },
    ],
  },
};
