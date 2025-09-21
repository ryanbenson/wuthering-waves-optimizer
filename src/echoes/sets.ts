import { EchoObject, echoSetLabelMap, getEchoSetLabelByType } from "./stats";

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
  "Gusts of Welkin 2 Set",
  "Windward Pilgrimage 2 Set",
  "Flaming Clawprint 2 Set",
];
export const threeSetBonuses: string[] = [
  "Crown of Valor 3 Set",
  "Dream of the Lost 3 Set",
  "Law of Harmony 3 Set",
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
  "Gusts of Welkin 5 Set",
  "Windward Pilgrimage 5 Set",
  "Flaming Clawprint 5 Set",
];

// Function to convert a list of echo set keys (e.g. MidnightVeil)
// to their corresponding set bonus effects
// may need to use getEchoSetLabelByType to convert keys to labels
// it should provide the matching data from setBonusEffectsTwo
// it can match the top level property which will match the name of the set bonus (e.g. Midnight Veil 2 Set)
export function getSetBonusEffectsFromListOfSetKeys(
  echoSetKeys: (string | null)[],
): EchoSetBonus[] {
  const echoSets = echoSetKeys.map((key) =>
    key ? getEchoSetLabelByType(key) : null,
  );
  // go through each echoSets,
  // look at setBonusEffectsTwo keys
  // do a match (ignore the 2 Set, 3 Set, 5 Set part)
  // if found, add it to the list and return the full list
  const setBonuses: EchoSetBonus[] = [];
  echoSets.forEach((set) => {
    if (set) {
      const matchingBonus = Object.keys(setBonusEffectsTwo).filter((bonus) =>
        bonus.startsWith(set),
      );
      if (matchingBonus.length > 0) {
        // for each matching bonus, get the full object value from setBonusEffectsTwo
        // and add that to the setBonuses array
        matchingBonus.forEach((bonus) => {
          setBonuses.push(setBonusEffectsTwo[bonus]);
        });
      }
    }
  });
  return setBonuses;
}

export function getSetLabelByKey(setKey: string): string | null {
  const entries = Object.entries(setBonusEffectsTwo);
  for (const [setLabel, setData] of entries) {
    if (setData.key === setKey) {
      return setLabel;
    }
  }
  return null;
}

export function getSetsFromEchoes(echoes: EchoObject[]): string[] {
  const sets: string[] = [];
  echoes.forEach((echo) => {
    if (echo) {
      sets.push(echo.echoSet);
    }
  });
  return sets;
}

type SetBonusEffects = {
  setBonusOne: string | null;
  setBonusTwo: string | null;
};
export const getSetBonusEffects = (
  echoSets: (string | null)[],
): SetBonusEffects => {
  // Filter out nulls and create a count map for each value
  const counts: Record<string, number> = echoSets
    .filter((v) => v !== null)
    .reduce((acc: Record<string, number>, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

  // Create lookup sets from your constants for which bonuses exist
  const has2SetBonus = new Set(
    twoSetBonuses
      .map((bonus) => {
        const match = bonus.match(/^(.+) 2 Set$/);
        return match
          ? Object.keys(echoSetLabelMap).find(
              (key) => getEchoSetLabelByType(key) === match[1],
            )
          : null;
      })
      .filter(Boolean),
  );

  const has3SetBonus = new Set(
    threeSetBonuses
      .map((bonus) => {
        const match = bonus.match(/^(.+) 3 Set$/);
        return match
          ? Object.keys(echoSetLabelMap).find(
              (key) => getEchoSetLabelByType(key) === match[1],
            )
          : null;
      })
      .filter(Boolean),
  );

  const has5SetBonus = new Set(
    fiveSetBonuses
      .map((bonus) => {
        const match = bonus.match(/^(.+) 5 Set$/);
        return match
          ? Object.keys(echoSetLabelMap).find(
              (key) => getEchoSetLabelByType(key) === match[1],
            )
          : null;
      })
      .filter(Boolean),
  );

  // Get all possible bonuses for each set
  const availableBonuses = [];

  for (const [setType, count] of Object.entries(counts)) {
    const setLabel = getEchoSetLabelByType(setType);

    // Add bonuses based on count and what bonuses exist for this set
    if (count >= 5 && has5SetBonus.has(setType)) {
      availableBonuses.push({
        bonus: `${setLabel} 5 Set`,
        priority: 3,
        setType,
      });
    }
    if (count >= 3 && has3SetBonus.has(setType)) {
      availableBonuses.push({
        bonus: `${setLabel} 3 Set`,
        priority: 2,
        setType,
      });
    }
    if (count >= 2 && has2SetBonus.has(setType)) {
      availableBonuses.push({
        bonus: `${setLabel} 2 Set`,
        priority: 1,
        setType,
      });
    }
  }

  // Separate 2-set bonuses from higher-tier bonuses
  const twoSetBonusesFound = availableBonuses.filter((b) =>
    b.bonus.includes("2 Set"),
  );
  const higherTierBonuses = availableBonuses.filter(
    (b) => b.bonus.includes("3 Set") || b.bonus.includes("5 Set"),
  );

  // Sort each group by set type for consistency
  twoSetBonusesFound.sort((a, b) => a.setType.localeCompare(b.setType));
  higherTierBonuses.sort((a, b) => {
    // Priority: 5-set > 3-set, then by set type
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return a.setType.localeCompare(b.setType);
  });

  // Select bonuses following game rules
  let setBonusOneVal = null;
  let setBonusTwoVal = null;

  // setBonusOne: Always a 2-set bonus (pick the first available)
  if (twoSetBonusesFound.length > 0) {
    setBonusOneVal = twoSetBonusesFound[0].bonus;
  }

  // setBonusTwo: Can be 2-set, 3-set, or 5-set
  // Priority: higher-tier bonuses first, then remaining 2-set bonuses
  const usedSetTypes = setBonusOneVal
    ? new Set([twoSetBonusesFound[0].setType])
    : new Set();

  // First try higher-tier bonuses
  for (const { bonus, setType } of higherTierBonuses) {
    if (
      !usedSetTypes.has(setType) ||
      setBonusOneVal?.includes(getEchoSetLabelByType(setType))
    ) {
      setBonusTwoVal = bonus;
      break;
    }
  }

  // If no higher-tier bonus found, try remaining 2-set bonuses
  if (!setBonusTwoVal) {
    for (const { bonus, setType } of twoSetBonusesFound.slice(1)) {
      if (!usedSetTypes.has(setType)) {
        setBonusTwoVal = bonus;
        break;
      }
    }
  }

  // Update the store
  return {
    setBonusOne: setBonusOneVal,
    setBonusTwo: setBonusTwoVal,
  };
};

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
  "Gusts of Welkin 2 Set": {
    name: "Gusts of Welkin",
    key: "GustsofWelkin2Set",
    passives: [
      {
        key: "GustsofWelkin2Set",
        details: `Increases Aero DMG by 10%`,
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
    details: `Increases Aero DMG by 10%`,
  },
  "Windward Pilgrimage 2 Set": {
    name: "Windward Pilgrimage",
    key: "WindwardPilgrimage2Set",
    passives: [
      {
        key: "WindwardPilgrimage2Set",
        details: `Aero DMG + 10%`,
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
    details: `Aero DMG + 10%`,
  },
  "Flaming Clawprint 2 Set": {
    name: "Flaming Clawprint",
    key: "FlamingClawprint2Set",
    passives: [
      {
        key: "FlamingClawprint2Set",
        details: `Fusion DMG + 10%`,
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
    details: `Fusion DMG + 10%`,
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
    details: `Increase the Resonator's Coordinated Attack DMG by 80%. Upon a critical hit of Coordinated Attack, increase the active Resonator's ATK by <span class="Highlight">20%</span> for 4s.`,
    passives: [
      {
        key: "EmpyreanAnthem5SetCoordinatedDMGBonus",
        modifiers: [
          {
            modifier: "CoordinatedDMGBonus",
            modifierValue: 80,
          },
        ],
        alwaysEnabled: true,
        details: `Increase the Resonator's Coordinated Attack DMG by 80%.`,
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
  "Gusts of Welkin 5 Set": {
    name: "Gusts of Welkin",
    key: "GustsofWelkin",
    details: `Inflicting Aero Erosion upon enemies increases Aero DMG for all Resonators in the team by 15%, and for the Resonator triggering this effect by an additional 15%, lasting for 20s.`,
    passives: [
      {
        key: "GustsofWelkin5SetAeroAll",
        modifiers: [
          {
            modifier: "Aero",
            modifierValue: 15,
          },
        ],
        alwaysEnabled: false,
        details: `Inflicting Aero Erosion upon enemies increases Aero DMG for all Resonators in the team by 15%.`,
      },
      {
        key: "GustsofWelkin5SetAeroSelf",
        modifiers: [
          {
            modifier: "Aero",
            modifierValue: 15,
          },
        ],
        alwaysEnabled: false,
        details: `And for the Resonator triggering this effect by an additional 15%, lasting for 20s.`,
      },
    ],
  },
  "Windward Pilgrimage 5 Set": {
    name: "Windward Pilgrimage",
    key: "WindwardPilgrimage",
    details: `Hitting a target with Aero Erosion increases Crit. Rate by 10% and grants 30% Aero DMG Bonus, lasting for 10s.`,
    passives: [
      {
        key: "WindwardPilgrimage5SetCritRate",
        modifiers: [
          {
            modifier: "CritRate",
            modifierValue: 10,
          },
        ],
        alwaysEnabled: false,
        details: `Hitting a target with Aero Erosion increases Crit. Rate by 10% for 10s`,
      },
      {
        key: "WindwardPilgrimage5SetAero",
        modifiers: [
          {
            modifier: "Aero",
            modifierValue: 30,
          },
        ],
        alwaysEnabled: false,
        details: `Hitting a target with Aero Erosion grants 30% Aero DMG Bonus, lasting for 10s.`,
      },
    ],
  },
  "Flaming Clawprint 5 Set": {
    name: "Flaming Clawprint",
    key: "FlamingClawprint",
    details: `Casting Resonance Liberation increases Fusion DMG of Resonators in the team by 15% and the caster's Resonance Liberation DMG by 20%, lasting for 35s.`,
    passives: [
      {
        key: "FlamingClawprintFusion",
        modifiers: [
          {
            modifier: "Fusion",
            modifierValue: 15,
          },
        ],
        alwaysEnabled: false,
        details: `Casting Resonance Liberation increases Fusion DMG of Resonators in the team by 15%, lasting for 35s.`,
      },
      {
        key: "FlamingClawprintLiberation",
        modifiers: [
          {
            modifier: "ResonanceLiberationDMGBonus",
            modifierValue: 20,
          },
        ],
        alwaysEnabled: false,
        details: `Casting Resonance Liberation increases the caster's Resonance Liberation DMG by 20%, lasting for 35s.`,
      },
    ],
  },
  "Dream of the Lost 3 Set": {
    name: "Dream of the Lost",
    key: "DreamoftheLost",
    details: `Holding 0 Resonance Energy increases Crit. Rate by 20% and grants 35% Echo Skill DMG Bonus.`,
    passives: [
      {
        key: "DreamoftheLostCritRateEchoSkill",
        modifiers: [
          {
            modifier: "CritRate",
            modifierValue: 20,
          },
          {
            modifier: "EchoDMGBonus",
            modifierValue: 35,
          },
        ],
        alwaysEnabled: false,
        details: `Holding 0 Resonance Energy increases Crit. Rate by 20% and grants 35% Echo Skill DMG Bonus.`,
      },
    ],
  },
  "Crown of Valor 3 Set": {
    name: "Crown of Valor",
    key: "CrownofValor",
    details: `Upon gaining a Shield, increase the Resonator's ATK by 6% and Crit. DMG by 4% for 4s. This effect can be triggered once every 0.5s and stacks up to 5 times.`,
    passives: [
      {
        key: "CrownofValorATKCD",
        modifiers: [
          {
            modifier: "ATK",
            modifierValue: 6,
          },
          {
            modifier: "CritDMG",
            modifierValue: 4,
          },
        ],
        alwaysEnabled: false,
        hasStacks: true,
        minStacks: 0,
        maxStacks: 5,
        details: `Upon gaining a Shield, increase the Resonator's ATK by 6% and Crit. DMG by 4% for 4s. This effect can be triggered once every 0.5s and stacks up to 5 times.`,
      },
    ],
  },
  "Law of Harmony 3 Set": {
    name: "Law of Harmony",
    key: "LawofHarmony",
    details: `Casting Echo Skill grants 30% Heavy Attack DMG Bonus to the caster for 4s.</br>Additionally, all Resonators in the team gain 4% Echo Skill DMG Bonus for 30s, stacking up to 4 times. Echoes of the same name can only trigger this effect once. The record of Echo triggering this effect is cleared along with this effect. At 4 stacks, casting Echo Skill again resets the duration of this effect.`,
    passives: [
      {
        key: "LawofHarmonyHeavy",
        modifiers: [
          {
            modifier: "HeavyAttackDMGBonus",
            modifierValue: 30,
          },
        ],
        alwaysEnabled: false,
        details: `Casting Echo Skill grants 30% Heavy Attack DMG Bonus to the caster for 4s.`,
      },
      {
        key: "LawofHarmonyEchoSkill",
        modifiers: [
          {
            modifier: "EchoDMGBonus",
            modifierValue: 4,
          },
        ],
        alwaysEnabled: false,
        hasStacks: true,
        minStacks: 0,
        maxStacks: 4,
        details: `Additionally, all Resonators in the team gain 4% Echo Skill DMG Bonus for 30s, stacking up to 4 times. Echoes of the same name can only trigger this effect once. The record of Echo triggering this effect is cleared along with this effect. At 4 stacks, casting Echo Skill again resets the duration of this effect.`,
      },
    ],
  },
};
