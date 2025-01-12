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
  "Tidebreaking Courage 2 Set",
  "Empyrean Anthem 2 Set",
  "Eternal Radiance 2 Set",
  "Midnight Veil 2 Set",
  "Frosty Resolve 2 Set",
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
  "Tidebreaking Courage 5 Set",
  "Empyrean Anthem 5 Set",
  "Eternal Radiance 5 Set",
  "Midnight Veil 5 Set",
  "Frosty Resolve 5 Set",
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
  "Frosty Resolve 2 Set": {
    name: "Frosty Resolve",
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
  "Empyrean Anthem 2 Set": {
    name: "Empyrean Anthem",
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
  "Tidebreaking Courage 2 Set": {
    name: "Tidebreaking Courage",
    key: "TidebreakingCourage2Set",
    passives: [
      {
        key: "TidebreakingCourage2SetEnergyRegen",
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
  "Eternal Radiance 2 Set": {
    name: "Eternal Radiance",
    key: "EternalRadiance2Set",
    passives: [
      {
        key: "EternalRadiance2SetHP",
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
  "Midnight Veil 2 Set": {
    name: "Midnight Veil",
    key: "MidnightVeil2Set",
    passives: [
      {
        key: "MidnightVeil2SetHavoc",
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
  "Frosty Resolve 5 Set": {
    key: "FrostyResolve5Set",
    name: "Frosty Resolve",
    details: `Casting Resonance Skill grants <span class="Param">22.5%</span> <span class="Ice">Glacio</span> DMG Bonus for 15s and casting Resonance Liberation increases Resonance Skill DMG by <span class="Param">22.5%</span>, lasting for 5s. This effect stacks up to 2 times.`,
    passives: [
      {
        key: "FrostyResolve5Set5SetGlacioDMGBonus",
        modifiers: [
          {
            modifier: "Glacio",
            modifierValue: 22.5,
          },
        ],
        alwaysEnabled: false,
        details: `Casting Resonance Skill grants <span class="Param">22.5%</span> <span class="Ice">Glacio</span> DMG Bonus for 15s.`,
      },
      {
        key: "FrostyResolve5Set5SetSkillDMGBonus",
        modifiers: [
          {
            modifier: "ResonanceSkillDMGBonus",
            modifierValue: 18,
          },
        ],
        alwaysEnabled: false,
        details: `Casting Resonance Liberation increases Resonance Skill DMG by <span class="Param">18%</span>, lasting for 5s. This effect stacks up to 2 times.`,
        hasStacks: true,
        minStacks: 0,
        maxStacks: 2,
      },
    ],
  },
  "Midnight Veil 5 Set": {
    key: "MidnightVeil5Set",
    name: "Midnight Veil",
    details: `When the character uses an <span class="Highlight">Outro Skill</span>, it deals an additional <span class="Highlight">480%</span> <span class="Dark">Havoc</span> DMG and increases the next character's <span class="Dark">Havoc</span> DMG by <span class="Highlight">15%</span> for <span class="Highlight">15</span> seconds`,
    passives: [
      {
        key: "MidnightVeil5SetAttack",
        modifiers: [
          {
            modifier: "EnableAttack",
            modifierValue: "MidnightVeil",
          },
        ],
        alwaysEnabled: false,
        details: `When the character uses an <span class="Highlight">Outro Skill</span>, it deals an additional <span class="Highlight">480%</span> <span class="Dark">Havoc</span> DMG and increases the next character's <span class="Dark">Havoc</span> DMG by <span class="Highlight">15%</span> for <span class="Highlight">15</span> seconds`,
      },
    ],
  },
  "Eternal Radiance 5 Set": {
    key: "EternalRadiance5Set",
    name: "Eternal Radiance",
    details: `Inflicting enemies with Spectro Frazzle increases Crit. Rate by 20% for 15s. Attacking enemies with 10 stacks of Spectro Frazzle grants 15% Spectro DMG Bonus for 15s.`,
    passives: [
      {
        key: "EternalRadiance5SetCritRate",
        modifiers: [
          {
            modifier: "CritRate",
            modifierValue: 20,
          },
        ],
        alwaysEnabled: false,
        details: `Inflicting enemies with Spectro Frazzle increases Crit. Rate by 20% for 15s.`,
      },
      {
        key: "EternalRadiance5SetSpectro",
        modifiers: [
          {
            modifier: "Spectro",
            modifierValue: 15,
          },
        ],
        alwaysEnabled: false,
        details: `Attacking enemies with 10 stacks of Spectro Frazzle grants 15% Spectro DMG Bonus for 15s.`,
      },
    ],
  },
  "Empyrean Anthem 5 Set": {
    key: "EmpyreanAnthem5Set",
    name: "Empyrean Anthem",
    details: `Increases the DMG dealt by coordinated attacks by <span class="Highlight">80%</span>. Upon a critical hit of Coordinated Attack, increase the active Resonator's ATK by <span class="Highlight">20%</span> for 4s.`,
    passives: [
      {
        key: "EmpyreanAnthem5SetCoordinatedDMGBonus",
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
        key: "EmpyreanAnthem5SetATK",
        modifiers: [
          {
            modifier: "ATK",
            modifierValue: 20,
          },
        ],
        alwaysEnabled: false,
        details: `Upon a critical hit of Coordinated Attack, increase the active Resonator's ATK by <span class="Highlight">20%</span> for 4s.`,
      },
    ],
  },
  "Tidebreaking Courage 5 Set": {
    name: "Tidebreaking Courage",
    key: "TidebreakingCourage",
    details: `ATK is increased by <span class="Highlight">15%</span>, after Energy Regen reaches <span class="Highlight">250%</span> the current character's all attribute DMG is increased by <span class="Highlight">30%</span> for the Resonator.`,
    passives: [
      {
        key: "TidebreakingCourage5SetATK",
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
        key: "TidebreakingCourage5SetAllElementAttributeBonus",
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
