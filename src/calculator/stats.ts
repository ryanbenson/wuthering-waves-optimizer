export const getInitStats = (providedFullStats: any = {}) => {
  let stats = {
    attackPercent: 0,
    hpPercent: 0,
    defPercent: 0,
    attackFlat: 0,
    hpFlat: 0,
    defFlat: 0,
    critRate: 5,
    critDMG: 150,
    dmgBonus: 0,
    energyRegen: 1,
    healingBonus: 0,
    shieldBonus: 0,
    basicAttackDMGBonus: 0,
    heavyAttackDMGBonus: 0,
    resonanceSkillDMGBonus: 0,
    introSkillDMGBonus: 0,
    outroSkillDMGBonus: 0,
    resonanceLiberationDMGBonus: 0,
    echoDMGBonus: 0,
    glacio: 0,
    fusion: 0,
    electro: 0,
    aero: 0,
    spectro: 0,
    havoc: 0,
    defIgnore: 0,
    bonusSpecificSkillDMGBonus: 0,
    totalDeepenEffect: 0,
    resistReduction: 0,
    coordinatedDmgBonus: 0,
  };

  if (providedFullStats) {
    stats = { ...stats, ...providedFullStats };
  }
  return stats;
};

export const addEchoBuffs = (
  source: any,
  target: any,
  returnCopy: boolean = false,
) => {
  // we make a clone to make sure we don't mutate the original
  // mostly used in the optimizer so we can have a constant base, and then layer on the echo buffs
  // without messing up the original state of stats
  if (returnCopy) {
    target = JSON.parse(JSON.stringify(target));
  }
  if (source) {
    target.attackPercent += source?.ATK ? source.ATK : 0;
    target.hpPercent += source?.HP ? source.HP : 0;
    target.defPercent += source?.DEF ? source.DEF : 0;
    target.attackFlat += source?.ATK_FLAT ?? 0;
    target.hpFlat += source?.HP_FLAT ?? 0;
    target.defFlat += source?.DEF_FLAT ?? 0;
    target.critRate += source?.CritRate ? source.CritRate : 0;
    target.critDMG += source?.CritDMG ? source.CritDMG : 0;
    target.energyRegen += source?.EnergyRegen ? source.EnergyRegen / 100 : 0;
    target.healingBonus += source?.HealingBonus ? source.HealingBonus / 100 : 0;
    target.basicAttackDMGBonus += source?.BasicAttackDMGBonus
      ? source.BasicAttackDMGBonus
      : 0;
    target.heavyAttackDMGBonus += source?.HeavyAttackDMGBonus
      ? source.HeavyAttackDMGBonus
      : 0;
    target.resonanceSkillDMGBonus += source?.ResonanceSkillDMGBonus
      ? source.ResonanceSkillDMGBonus
      : 0;
    target.resonanceLiberationDMGBonus += source?.ResonanceLiberationDMGBonus
      ? source.ResonanceLiberationDMGBonus
      : 0;
    target.echoDMGBonus += source?.EchoDMGBonus ? source.EchoDMGBonus : 0;
    target.outroSkillDMGBonus += source?.OutroSkillDMGBonus
      ? source.OutroSkillDMGBonus
      : 0;
    target.glacio += source?.Glacio ? source.Glacio : 0;
    target.fusion += source?.Fusion ? source.Fusion : 0;
    target.electro += source?.Electro ? source.Electro : 0;
    target.aero += source?.Aero ? source.Aero : 0;
    target.spectro += source?.Spectro ? source.Spectro : 0;
    target.havoc += source?.Havoc ? source.Havoc : 0;
    target.defIgnore += source?.DEFIgnore ? source.DEFIgnor : 0;
    target.bonusSpecificSkillDMGBonus += source?.BonusSpecificSkillDMGBonus
      ? source.BonusSpecificSkillDMGBonus
      : 0;
    target.totalDeepenEffect += source?.TotalDeepenEffect
      ? source.TotalDeepenEffect
      : 0;
    target.resistReduction += source?.ResistReduction
      ? source.ResistReduction
      : 0;
    target.coordinatedDmgBonus += source?.CoordinatedDMGBonus
      ? source.CoordinatedDMGBonus
      : 0;
    target.dmgBonus += source?.DMGBonus ? source.DMGBonus : 0;

    if (source?.AllAttributeBonus) {
      const allAttributeBonus = source.AllAttributeBonus;
      target.basicAttackDMGBonus += allAttributeBonus;
      target.heavyAttackDMGBonus += allAttributeBonus;
      target.resonanceSkillDMGBonus += allAttributeBonus;
      target.resonanceLiberationDMGBonus += allAttributeBonus;
      target.introSkillDMGBonus += allAttributeBonus;
      target.outroSkillDMGBonus += allAttributeBonus;
    }
    if (source?.AllElementAttributeBonus) {
      const allElementAttributeBonus = source.AllElementAttributeBonus;
      target.glacio += allElementAttributeBonus;
      target.fusion += allElementAttributeBonus;
      target.electro += allElementAttributeBonus;
      target.aero += allElementAttributeBonus;
      target.spectro += allElementAttributeBonus;
      target.havoc += allElementAttributeBonus;
    }
  }
  if (returnCopy) {
    return target;
  }
};

export const addBuffs = (source: any, target: any) => {
  if (source) {
    target.attackPercent += source?.ATK ? source.ATK * 100 : 0;
    target.hpPercent += source?.HP ? source.HP * 100 : 0;
    target.defPercent += source?.DEF ? source.DEF * 100 : 0;
    target.attackFlat += source?.ATK_FLAT ?? 0;
    target.hpFlat += source?.HP_FLAT ?? 0;
    target.defFlat += source?.DEF_FLAT ?? 0;
    target.critRate += source?.CritRate ? source.CritRate * 100 : 0;
    target.critDMG += source?.CritDMG ? source.CritDMG * 100 : 0;
    target.energyRegen += source?.EnergyRegen ? source.EnergyRegen : 0;
    target.healingBonus += source?.HealingBonus ? source.HealingBonus : 0;
    target.shieldBonus += source?.ShieldBonus ? source.ShieldBonus : 0;
    target.basicAttackDMGBonus += source?.BasicAttackDMGBonus
      ? source.BasicAttackDMGBonus * 100
      : 0;
    target.heavyAttackDMGBonus += source?.HeavyAttackDMGBonus
      ? source.HeavyAttackDMGBonus * 100
      : 0;
    target.resonanceSkillDMGBonus += source?.ResonanceSkillDMGBonus
      ? source.ResonanceSkillDMGBonus * 100
      : 0;
    target.introSkillDMGBonus += source?.IntroSkillDMGBonus
      ? source.IntroSkillDMGBonus * 100
      : 0;
    target.outroSkillDMGBonus += source?.OutroSkillDMGBonus
      ? source.OutroSkillDMGBonus * 100
      : 0;
    target.resonanceLiberationDMGBonus += source?.ResonanceLiberationDMGBonus
      ? source.ResonanceLiberationDMGBonus * 100
      : 0;
    target.echoDMGBonus += source?.EchoDMGBonus ? source.EchoDMGBonus * 100 : 0;
    target.glacio += source?.Glacio ? source.Glacio * 100 : 0;
    target.fusion += source?.Fusion ? source.Fusion * 100 : 0;
    target.electro += source?.Electro ? source.Electro * 100 : 0;
    target.aero += source?.Aero ? source.Aero * 100 : 0;
    target.spectro += source?.Spectro ? source.Spectro * 100 : 0;
    target.havoc += source?.Havoc ? source.Havoc * 100 : 0;
    target.defIgnore += source?.DEFIgnore ? source.DEFIgnore * 100 : 0;
    target.bonusSpecificSkillDMGBonus += source?.BonusSpecificSkillDMGBonus
      ? source.BonusSpecificSkillDMGBonus * 100
      : 0;
    target.totalDeepenEffect += source?.DMGDeepen ? source.DMGDeepen : 0;
    target.resistReduction += source?.ResistReduction
      ? source.ResistReduction * 100
      : 0;

    if (source?.AllAttributeBonus) {
      const allAttributeBonus = source.AllAttributeBonus * 100;
      target.basicAttackDMGBonus += allAttributeBonus;
      target.heavyAttackDMGBonus += allAttributeBonus;
      target.resonanceSkillDMGBonus += allAttributeBonus;
      target.resonanceLiberationDMGBonus += allAttributeBonus;
      target.introSkillDMGBonus += allAttributeBonus;
      target.outroSkillDMGBonus += allAttributeBonus;
    }
    if (source?.AllElementAttributeBonus) {
      const allElementAttributeBonus = source.AllElementAttributeBonus * 100;
      target.glacio += allElementAttributeBonus;
      target.fusion += allElementAttributeBonus;
      target.electro += allElementAttributeBonus;
      target.aero += allElementAttributeBonus;
      target.spectro += allElementAttributeBonus;
      target.havoc += allElementAttributeBonus;
    }
    if (source?.AllResonanceDMG) {
      const allResonanceDMG = source.AllResonanceDMG * 100;
      target.resonanceSkillDMGBonus += allResonanceDMG;
      target.resonanceLiberationDMGBonus += allResonanceDMG;
    }
  }
};

export const getElementDmgBonusByType = (
  element: string,
  providedStats: any,
  stats: any,
): number => {
  let val = 0;
  switch (element) {
    case "Glacio":
      val = providedStats?.glacio ?? stats.Glacio;
      break;
    case "Fusion":
      val = providedStats?.fusion ?? stats.Fusion;
      break;
    case "Electro":
      val = providedStats?.electro ?? stats.Electro;
      break;
    case "Aero":
      val = providedStats?.aero ?? stats.Aero;
      break;
    case "Spectro":
      val = providedStats?.spectro ?? stats.Spectro;
      break;
    case "Havoc":
      val = providedStats?.havoc ?? stats.Havoc;
      break;
  }

  return val / 100;
};

export const getDamageValByAttr = (
  attribute: string = "attack",
  providedStats: any,
  stats: any,
): number => {
  switch (attribute) {
    case "defense":
      return providedStats?.totalDef ?? stats.totalDef;
    case "hp":
      return providedStats?.totalHp ?? stats.totalHp;
    case "EnergyRegen":
      // we store the ER in decimal form, but for calculating damages based on ER
      // it uses the full amount (1.5 => 150%)
      const decimalEnergy = providedStats?.energyRegen ?? stats.energyRegen;
      const intEnergy = decimalEnergy * 100;
      return intEnergy;
    case "attack":
    default:
      return providedStats?.totalAtk ?? stats.totalAtk;
  }
};

export const getDamageTypeBonusByType = (
  type: string,
  providedStats: any,
  stats: any,
) => {
  let val = 0;
  switch (type) {
    case "Basic":
      val = providedStats?.basicAttackDMGBonus ?? stats.BasicAttackDMGBonus;
      break;
    case "Heavy":
      val = providedStats?.heavyAttackDMGBonus ?? stats.HeavyAttackDMGBonus;
      break;
    case "Skill":
      val =
        providedStats?.resonanceSkillDMGBonus ?? stats.ResonanceSkillDMGBonus;
      break;
    case "Intro":
      val = providedStats?.introSkillDMGBonus ?? stats.IntroSkillDMGBonus;
      break;
    case "Outro":
      val = providedStats?.outroSkillDMGBonus ?? stats.OutroSkillDMGBonus;
      break;
    case "Liberation":
      val =
        providedStats?.resonanceLiberationDMGBonus ??
        stats.ResonanceLiberationDMGBonus;
      break;
    case "Echo":
      val = providedStats?.echoDmgBonus ?? stats.EchoDMGBonus;
      break;
    // do not divide this by 100
    case "Healing":
      return providedStats?.healingBonus ?? stats.healingBonus;
    case "Shield":
      return providedStats?.shieldBonus ?? stats.shieldBonus;
  }

  return val / 100;
};

export const calcCharStats = (
  returnValue: any = false,
  injectStats: any = null,
  ignoreBuffs: any = {}, // e.g. {ignoreTeamBuffs: true}
  injectEchoStats: any = null,
  providedFullStats: any = null,
  characterStats: any = {},
  weaponData: any = {},
  charBuffsData: any = {},
  charResonanceChainsData: any = {},
  echoStats: any = {},
  customBuffs: any = {},
  teamBuffsData: any = {},
): any => {
  const { ignoreTeamBuffs, ignoreWeaponBuffs, ignoreEchoes } = ignoreBuffs;
  let stats = getInitStats(providedFullStats);
  let { baseHp = 0, baseAtk = 0, baseDef = 0 } = characterStats;
  let weaponAtk = 0;

  let weaponModifier: string | null = null;
  let weaponModifierValue: number = 0;
  let weaponPassiveData = {};

  if (charBuffsData && !providedFullStats) {
    addBuffs(charBuffsData, stats);
  }

  if (injectStats) {
    addBuffs(injectStats, stats);
  }

  if (charResonanceChainsData && !providedFullStats) {
    addBuffs(charResonanceChainsData, stats);
  }

  if (weaponData) {
    weaponAtk = weaponData.weaponAtk;
    weaponModifier = weaponData.weaponModifier;
    weaponModifierValue = weaponData.weaponModifierValue;
    weaponPassiveData = weaponData.weaponPassiveData ?? {};

    weaponPassiveData = Object.fromEntries(
      Object.entries(weaponPassiveData).filter(([_, v]) => v != null),
    );

    if (!ignoreWeaponBuffs && !providedFullStats) {
      addBuffs(weaponPassiveData, stats);
    }

    if (!providedFullStats) {
      switch (weaponModifier) {
        case "ATK":
          stats.attackPercent += weaponModifierValue * 100;
          break;
        case "HP":
          stats.hpPercent += weaponModifierValue * 100;
          break;
        case "DEF":
          stats.defPercent += weaponModifierValue * 100;
          break;
        case "CritRate":
          stats.critRate += weaponModifierValue * 100;
          break;
        case "CritDMG":
          stats.critDMG += weaponModifierValue * 100;
          break;
        case "EnergyRegen":
          stats.energyRegen += weaponModifierValue;
          break;
        case "HealingBonus":
          stats.healingBonus += weaponModifierValue;
          break;
      }
    }
  }

  if (echoStats && !ignoreEchoes && !providedFullStats) {
    addEchoBuffs(echoStats, stats);
  }

  if (injectEchoStats && !providedFullStats) {
    addEchoBuffs(injectEchoStats, stats);
  }

  if (customBuffs && !providedFullStats) {
    addBuffs(customBuffs, stats);
  }

  if (teamBuffsData && !ignoreTeamBuffs && !providedFullStats) {
    addBuffs(teamBuffsData, stats);
  }

  if (returnValue) {
    switch (returnValue) {
      case "All":
        const returnedStats: any = { ...stats };
        returnedStats.totalAtk =
          (baseAtk + weaponAtk) * (1 + stats.attackPercent / 100) +
          stats.attackFlat;
        returnedStats.totalHp =
          baseHp * (1 + stats.hpPercent / 100) + stats.hpFlat;
        returnedStats.totalDef =
          baseDef * (1 + stats.defPercent / 100) + stats.defFlat;
        returnedStats.totalCritRate = stats.critRate / 100;
        returnedStats.totalCritDMG = stats.critDMG / 100;
        returnedStats.DefIgnore = stats.defIgnore / 100;
        return returnedStats;
      case "HP":
        return baseHp * (1 + stats.hpPercent / 100) + stats.hpFlat;
      case "DEF":
        return baseDef * (1 + stats.defPercent / 100) + stats.defFlat;
      case "ATK":
      default:
        return (
          (baseAtk + weaponAtk) * (1 + stats.attackPercent / 100) +
          stats.attackFlat
        );
    }
  }
  const returnedStats: any = { ...stats };
  returnedStats.totalAtk =
    (baseAtk + weaponAtk) * (1 + stats.attackPercent / 100) + stats.attackFlat;
  returnedStats.totalHp = baseHp * (1 + stats.hpPercent / 100) + stats.hpFlat;
  returnedStats.totalDef =
    baseDef * (1 + stats.defPercent / 100) + stats.defFlat;
  returnedStats.totalCritRate = stats.critRate / 100;
  returnedStats.totalCritDMG = stats.critDMG / 100;
  returnedStats.DefIgnore = stats.defIgnore / 100;
  return returnedStats;
};

export const computeSelfBuffs = (
  buffsConfig: any = null,
  buffsCharInfo: any = null,
  resonanceChainsConfig: any = null,
  talentData: any = {},
  character: string = "",
): any => {
  // find the buff in our char data
  if (!buffsCharInfo || buffsCharInfo.length <= 0) {
    return;
  }
  const data: any = {
    EnableAttack: [],
    specificTalentBuffs: {},
  };

  const modifySpecificTalents: any = [];
  // go through each buffsConfig, make sure it's enabled, then compute the buff
  const entries = Object.entries(buffsConfig) as [string, any][];
  for (const [key, buffData] of entries) {
    // skip if it's not enabled
    if (!buffData?.isEnabled) {
      continue;
    }
    const buffFromCharacter = buffsCharInfo.find(
      (buffItem: any) => buffItem.key === key,
    );
    const buff = JSON.parse(JSON.stringify(buffFromCharacter));
    if (!buff) {
      continue;
    }

    const modifiersData = buff?.modifiers ?? [];
    let modifiers = JSON.parse(JSON.stringify(modifiersData));
    // character specifics modifications
    // If Lupa has s3 enabled, the ResistShred:Fusion buffs from InherentSkillApplauseofVictory & InherentSkillApplauseofVictoryFullFusionTeam are already taken care of
    if (
      character === "Lupa" &&
      (key === "InherentSkillApplauseofVictory" ||
        key === "InherentSkillApplauseofVictoryFullFusionTeam")
    ) {
      if (
        resonanceChainsConfig?.SequenceNode3WolflameHowlsinHerWakeIgnoreFusion
          ?.isEnabled
      ) {
        continue;
      }
    }
    // if Jiyan has ForteCircuitQingloongatWar2 enabled, ignore ForteCircuitQingloongatWar1
    // they're both self buffs, no resonance chains
    if (character === "Jiyan" && key === "ForteCircuitQingloongatWar1") {
      if (buffsConfig?.ForteCircuitQingloongatWar2?.isEnabled) {
        continue;
      }
    }
    // on Brant, if this is TheatricalMoment, check if MyMoment, if so, ignore this buff
    if (character === "Brant" && key === "TheatricalMoment") {
      if (buffsConfig?.MyMoment?.isEnabled) {
        continue;
      }
    }
    // on Augusta, we change modifiers
    // this only applies to CrownofWills on Augusta
    if (character === "Augusta" && key === "CrownofWills") {
      // Check if resonance chain buffs are enabled and apply their effects
      const sequenceNode1 =
        resonanceChainsConfig?.SequenceNode1StainedinScorchedEarth;
      const sequenceNode2 =
        resonanceChainsConfig?.SequenceNode2CleansedinCrimsonWar;

      // Apply SequenceNode1 effects if enabled
      if (sequenceNode1?.isEnabled) {
        // Add CritDMG modifier if not already present
        const hasCritDMG = modifiers.some(
          (mod: any) => mod.modifier === "CritDMG",
        );
        if (!hasCritDMG) {
          modifiers.push({
            modifier: "CritDMG",
            modifierValue: 0.15,
          });
        }
      }

      // Apply SequenceNode2 effects if enabled
      if (sequenceNode2?.isEnabled) {
        // Add CritDMG modifier if not already present
        const hasCritDMG = modifiers.some(
          (mod: any) => mod.modifier === "CritRate",
        );
        if (!hasCritDMG) {
          modifiers.push({
            modifier: "CritRate",
            modifierValue: 0.2,
          });
        }
      }
    }

    // this only applies to Afterflame on Galbrena
    if (character === "Galbrena" && key === "Afterflame") {
      // Check if resonance chain buffs are enabled and apply their effects
      const sequenceNode1 =
        resonanceChainsConfig?.SequenceNode1HeartofDefianceEverAblaze;
      const sequenceNode6 =
        resonanceChainsConfig?.SequenceNode6IRemainWhoIamEternalMyFlame;

      // Apply SequenceNode1 effects if enabled
      if (sequenceNode1?.isEnabled) {
        // Add CritDMG modifier if not already present
        const hasCritDMG = modifiers.some(
          (mod: any) => mod.modifier === "CritDMG",
        );
        if (!hasCritDMG) {
          modifiers.push({
            modifier: "CritDMG",
            modifySpecificTalents: [
              "BasicAttackSeraphicExecutionStage1DMG",
              "BasicAttackSeraphicExecutionStage2DMG",
              "BasicAttackSeraphicExecutionStage3DMG",
              "BasicAttackSeraphicExecutionStage4DMG",
              "BasicAttackSeraphicExecutionStage5DMG",
              "HeavyAttackFlamewingVerdictStage1DMG",
              "HeavyAttackFlamewingVerdictStage2DMG",
              "HeavyAttackFlamewingVerdictStage3DMG",
              "MidairAttackHellsentBarragePlungingAttackDMG",
              "MidairAttackHellsentBarrageSustainedFireDMG",
              "ResonanceSkillRavageDMG",
              "DodgeCounterPurgatoryScourgeDMG",
            ],
            modifierValue: 0.02,
          });
        }
      }

      // Apply sequenceNode6 effects if enabled
      if (sequenceNode6?.isEnabled) {
        // Add CritDMG modifier if not already present
        const DMGDeepen = modifiers.some(
          (mod: any) => mod.modifier === "DMGDeepen",
        );
        if (!DMGDeepen) {
          modifiers.push({
            modifier: "DMGDeepen",
            modifySpecificTalents: [
              "BasicAttackSeraphicExecutionStage1DMG",
              "BasicAttackSeraphicExecutionStage2DMG",
              "BasicAttackSeraphicExecutionStage3DMG",
              "BasicAttackSeraphicExecutionStage4DMG",
              "BasicAttackSeraphicExecutionStage5DMG",
              "HeavyAttackFlamewingVerdictStage1DMG",
              "HeavyAttackFlamewingVerdictStage2DMG",
              "HeavyAttackFlamewingVerdictStage3DMG",
              "MidairAttackHellsentBarragePlungingAttackDMG",
              "MidairAttackHellsentBarrageSustainedFireDMG",
              "ResonanceSkillRavageDMG",
              "DodgeCounterPurgatoryScourgeDMG",
            ],
            modifierValue: 0.00875,
          });
        }
      }
    }

    // this only applies to BurningDrive on Galbrena
    if (character === "Galbrena" && key === "BurningDrive") {
      const sequenceNode2 =
        resonanceChainsConfig?.SequenceNode2HellboundDiveofFireandAbyss;

      // Apply SequenceNode1 effects if enabled
      if (sequenceNode2?.isEnabled) {
        // Add CritDMG modifier if not already present
        const hasAtk = modifiers.some((mod: any) => mod.modifier === "ATK");
        // it should replace the existing buff, so we check if it does exist
        if (hasAtk) {
          modifiers.push({
            modifier: "ATK",
            // .7 from res chain + 0.2 from original buff
            // wording says 350%, but it's a multiplier against 20%, so 20%*350%
            // not additive
            modifierValue: 0.7,
          });
        }
      }
    }

    // this only applies to BamboosShade on Qiuyuan
    if (character === "Qiuyuan" && key === "BamboosShade") {
      const sequenceNode2 =
        resonanceChainsConfig?.SequenceNode2OBladeIWhoTeachNoMore;

      // Apply SequenceNode2 effects if enabled
      if (sequenceNode2?.isEnabled) {
        const hasEchoAmplify = modifiers.some(
          (mod: any) => mod.modifier === "DMGDeepen:Echo",
        );
        if (!hasEchoAmplify) {
          modifiers.push({
            modifier: "DMGDeepen:Echo",
            modifierValue: 0.3,
          });
        }
      }
    }
    // Buling SequenceNode6AlmightyForumLordofThunderSpell replaces ThunderSpellHeavenEarthMind
    if (character === "Buling" && key === "ThunderSpellHeavenEarthMind") {
      if (
        resonanceChainsConfig?.SequenceNode6AlmightyForumLordofThunderSpell
          ?.isEnabled
      ) {
        // overwrite the modifiers
        modifiers = [
          {
            modifier: "ResonanceSkillDMGBonus",
            modifierValue: 0.5,
          },
        ];
      }
    }
    if (buff.hasStacks) {
      if (buffData?.stacks <= 0) {
        continue;
      }
      const stacks = buffData?.stacks ?? 0;
      modifiers.forEach((modifierItem: any) => {
        if (modifierItem?.modifySpecificTalents) {
          // update modifier value with the value * stacks
          modifierItem.modifierValueCalculated =
            modifierItem.modifierValue * stacks;
          modifySpecificTalents.push(modifierItem);
        } else if (modifierItem.modifier === "Talent") {
          const talentRef =
            talentData?.[modifierItem.modifierValueTalentRef] ?? "10";
          const talentVal = modifierItem.modifierValue[talentRef];
          data[`${modifierItem.modifierTalentKey}:talentModifierMultiplyAdd`] =
            talentVal * stacks;
        } else if (modifierItem.modifier === "EnableAttack") {
          data.EnableAttack.push(...modifierItem.modifierValue);
        } else {
          const totalValue = modifierItem.modifierValue * stacks;
          data[modifierItem.modifier] =
            (data[modifierItem.modifier] || 0) + totalValue;
        }
      });
    } else {
      modifiers.forEach((modifierItem: any) => {
        if (modifierItem?.modifySpecificTalents) {
          // add our calculated value
          modifierItem.modifierValueCalculated = modifierItem.modifierValue;
          modifySpecificTalents.push(modifierItem);
        } else if (modifierItem.modifier === "Talent") {
          // this is the rare case where the modifier value needs a reference to another talent level
          // specifically Jinhsi incandescence buff scales off of her forte talent
          const talentRef =
            talentData?.[modifierItem.modifierValueTalentRef] ?? "10";
          const talentVal = modifierItem.modifierValue[talentRef];
          data[`${modifierItem.modifierTalentKey}:talentModifierMultiplyAdd`] =
            talentVal;
        } else if (modifierItem.modifier === "talentModifierMultiply") {
          // for buffs that apply talentModifierMultiply to the calcs
          if (!data.talentModifierMultiply) {
            data.talentModifierMultiply = [];
          }
          data.talentModifierMultiply.push(modifierItem);
        } else if (modifierItem.modifier === "EnableAttack") {
          data.EnableAttack.push(...modifierItem.modifierValue);
        } else {
          data[modifierItem.modifier] =
            (data[modifierItem.modifier] || 0) + modifierItem.modifierValue;
        }
      });
    }
  }
  modifySpecificTalents.forEach((item: any) => {
    const talents = item?.modifySpecificTalents ?? [];
    const { modifier, modifierValue, modifierValueCalculated } = item;
    talents.forEach((talent: string) => {
      let modifierStr = "";
      // not everything will have a modifier, so append the : and modifier if we have it
      if (modifier) {
        modifierStr = `:${modifier}`;
      }
      data.specificTalentBuffs[`${talent}${modifierStr}`] =
        (data.specificTalentBuffs[`${talent}${modifierStr}`] || 0) +
        (modifierValueCalculated || modifierValue);
    });
  });
  // final adjustments where needed before surfacing this up

  if (character === "Lupa" && data.specificTalentBuffs) {
    if (
      resonanceChainsConfig?.SequenceNode6TotheBrightestFlamingStar?.isEnabled
    ) {
      // copy the same buffs for NowheretoRunDMG from the other intro
      const atk = data.specificTalentBuffs?.[`TryFocusingEhDMG:ATK`];
      const fusion = data?.specificTalentBuffs?.[`TryFocusingEhDMG:Fusion`];
      const resistReduction =
        data?.specificTalentBuffs?.[`TryFocusingEhDMG:ResistShred:Fusion`];
      data.specificTalentBuffs["NowheretoRunDMG:ATK"] = atk || 0;
      data.specificTalentBuffs["NowheretoRunDMG:Fusion"] = fusion || 0;
      data.specificTalentBuffs["NowheretoRunDMG:ResistShred:Fusion"] =
        resistReduction || 0;
    }
  }
  return data;
};

// Separate function to calculate ONLY AdditionalBase modifiers
// These modifiers depend on final stats (like CritRate), so they need to be calculated
// after resonance chains and self buffs have been applied
export const computeAdditionalBaseBuffs = (
  buffsConfig: any = null,
  buffsCharInfo: any = null,
  resonanceChainsConfig: any = null,
  character: string = "",
  energyRegen: number = 0,
  critRate: number = 0,
): any => {
  if (!buffsCharInfo || buffsCharInfo.length <= 0) {
    return {};
  }
  const data: any = {};

  const entries = Object.entries(buffsConfig) as [string, any][];
  for (const [key, buffData] of entries) {
    if (!buffData?.isEnabled) {
      continue;
    }
    const buffFromCharacter = buffsCharInfo.find(
      (buffItem: any) => buffItem.key === key,
    );
    const buff = JSON.parse(JSON.stringify(buffFromCharacter));
    if (!buff) {
      continue;
    }

    const modifiersData = buff?.modifiers ?? [];
    let modifiers = JSON.parse(JSON.stringify(modifiersData));

    // Calculate adjusted CritRate that includes non-AdditionalBase modifiers (like SequenceNode2)
    // This is needed because AdditionalBase modifiers depend on the final CritRate including these buffs
    let adjustedCritRate = critRate;
    let adjustedEnergyRegen = energyRegen;

    // Apply character-specific modifications (like Augusta's SequenceNode2 adding CritRate)
    if (character === "Augusta" && key === "CrownofWills") {
      const sequenceNode2 =
        resonanceChainsConfig?.SequenceNode2CleansedinCrimsonWar;

      if (sequenceNode2?.isEnabled) {
        // SequenceNode2 adds 20% CritRate per stack
        const stacks = buff.hasStacks ? (buffData?.stacks ?? 1) : 1;
        adjustedCritRate = critRate + 0.2 * stacks;
      }
    }

    // Process only AdditionalBase modifiers
    if (buff.hasStacks) {
      if (buffData?.stacks <= 0) {
        continue;
      }
      const stacks = buffData?.stacks ?? 0;
      modifiers.forEach((modifierItem: any) => {
        if (modifierItem.modifier.includes("AdditionalBase")) {
          let base = 0;
          let currentAmount = 0;
          switch (modifierItem.modifierBasedOn) {
            case "EnergyRegen":
              base = modifierItem?.minStatValue ?? 0;
              currentAmount = adjustedEnergyRegen;
              break;
            case "CritRate":
              base = modifierItem?.minStatValue ?? 0.05;
              currentAmount = adjustedCritRate;
              break;
            default:
              base = modifierItem?.minStatValue ?? 0;
              break;
          }
          const additionalAmount = currentAmount * 100 - base * 100;
          const steps = Math.floor(
            additionalAmount / modifierItem.modifierStep,
          );
          let buffValue = steps * modifierItem.modifierValue * stacks;
          if (buffValue > modifierItem.maximumValue) {
            buffValue = modifierItem.maximumValue;
          }
          if (buffValue < 0) {
            buffValue = 0;
          }
          switch (modifierItem.modifierTargetAttr) {
            case "CritRate":
              data["CritRate"] = (data["CritRate"] || 0) + buffValue;
              break;
            case "CritDMG":
              data["CritDMG"] = (data["CritDMG"] || 0) + buffValue;
              break;
            case "ATK":
              data["ATK"] = (data["ATK"] || 0) + buffValue;
              break;
            case "ATK_FLAT":
              data["ATK_FLAT"] = (data["ATK_FLAT"] || 0) + buffValue;
              break;
          }
        }
      });
    } else {
      modifiers.forEach((modifierItem: any) => {
        if (modifierItem.modifier.includes("AdditionalBase")) {
          let base = 0;
          let currentAmount = 0;
          switch (modifierItem.modifierBasedOn) {
            case "EnergyRegen":
              base = modifierItem?.minStatValue ?? 0;
              currentAmount = adjustedEnergyRegen;
              break;
            case "CritRate":
              base = modifierItem?.minStatValue ?? 0.05;
              currentAmount = adjustedCritRate;
              break;
            default:
              base = modifierItem?.minStatValue ?? 0;
              break;
          }
          const additionalAmount = currentAmount * 100 - base * 100;
          const steps = Math.floor(
            additionalAmount / modifierItem.modifierStep,
          );
          let buffValue = steps * modifierItem.modifierValue;
          if (buffValue > modifierItem.maximumValue) {
            buffValue = modifierItem.maximumValue;
          }
          if (buffValue < 0) {
            buffValue = 0;
          }
          switch (modifierItem.modifierTargetAttr) {
            case "CritRate":
              data["CritRate"] = (data["CritRate"] || 0) + buffValue;
              break;
            case "CritDMG":
              data["CritDMG"] = (data["CritDMG"] || 0) + buffValue;
              break;
            case "ATK":
              data["ATK"] = (data["ATK"] || 0) + buffValue;
              break;
            case "ATK_FLAT":
              data["ATK_FLAT"] = (data["ATK_FLAT"] || 0) + buffValue;
              break;
          }
        }
      });
    }
  }
  return data;
};

// Separate function to calculate ONLY CritOverflow modifiers
// These modifiers convert excess CritRate into CritDMG
export const computeCritOverflowBuffs = (
  buffsConfig: any = null,
  buffsCharInfo: any = null,
  resonanceChainsConfig: any = null,
  resonanceChainsCharInfo: any = null,
  critRate: number = 0,
): any => {
  const data: any = {};

  // Helper function to process CritOverflow modifiers from a buff
  const processCritOverflowModifiers = (
    modifiers: any[],
    hasStacks: boolean,
    stacks: number = 0,
  ) => {
    modifiers.forEach((modifierItem: any) => {
      if (modifierItem.modifier === "CritOverflow") {
        if (critRate > modifierItem.overflowMin) {
          const { modifierValue, overflowStep, overflowMin, overflowMax } =
            modifierItem;
          const overflowAmount = Math.max(0, critRate - overflowMin);
          const overflowSteps = Math.floor(overflowAmount / overflowStep);
          const overflowBonus = Math.min(
            overflowSteps * modifierValue * (hasStacks ? stacks : 1),
            overflowMax,
          );
          data["CritDMG"] = (data["CritDMG"] || 0) + overflowBonus;
        }
      }
    });
  };

  // Check regular buffs
  if (
    buffsConfig &&
    buffsCharInfo &&
    Array.isArray(buffsCharInfo) &&
    buffsCharInfo.length > 0
  ) {
    const entries = Object.entries(buffsConfig) as [string, any][];
    for (const [key, buffData] of entries) {
      if (!buffData?.isEnabled) {
        continue;
      }
      const buffFromCharacter = buffsCharInfo.find(
        (buffItem: any) => buffItem.key === key,
      );
      const buff = JSON.parse(JSON.stringify(buffFromCharacter));
      if (!buff) {
        continue;
      }

      const modifiersData = buff?.modifiers ?? [];
      const modifiers = JSON.parse(JSON.stringify(modifiersData));

      if (buff.hasStacks) {
        if (buffData?.stacks <= 0) {
          continue;
        }
        processCritOverflowModifiers(modifiers, true, buffData?.stacks ?? 0);
      } else {
        processCritOverflowModifiers(modifiers, false);
      }
    }
  }

  // Check resonance chains
  if (
    resonanceChainsConfig &&
    resonanceChainsCharInfo &&
    Array.isArray(resonanceChainsCharInfo) &&
    resonanceChainsCharInfo.length > 0
  ) {
    const entries = Object.entries(resonanceChainsConfig) as [string, any][];
    for (const [key, chainData] of entries) {
      if (!chainData?.isEnabled) {
        continue;
      }
      const chainFromCharacter = resonanceChainsCharInfo.find(
        (chainItem: any) => chainItem.key === key,
      );
      const chain = JSON.parse(JSON.stringify(chainFromCharacter));
      if (!chain) {
        continue;
      }

      const modifiersData = chain?.modifiers ?? [];
      const modifiers = JSON.parse(JSON.stringify(modifiersData));

      if (chain.hasStacks) {
        if (chainData?.stacks <= 0) {
          continue;
        }
        processCritOverflowModifiers(modifiers, true, chainData?.stacks ?? 0);
      } else {
        processCritOverflowModifiers(modifiers, false);
      }
    }
  }

  return data;
};

export const computeResonanceChainsBuffs = (
  buffsConfig: any = null,
  buffsCharInfo: any = null,
  talentData: any = {},
): any => {
  // find the buff in our char data
  if (!buffsCharInfo || buffsCharInfo.length <= 0) {
    return;
  }
  const data: any = {
    EnableAttack: [],
    specificTalentBuffs: {},
  };

  const modifySpecificTalents: any = [];
  // go through each buffsConfig, make sure it's enabled, then compute the buff
  const entries = Object.entries(buffsConfig) as [string, any][];
  for (const [key, buffData] of entries) {
    // skip if it's not enabled
    if (!buffData?.isEnabled) {
      continue;
    }
    const buffFromCharacter = buffsCharInfo.find(
      (buffItem: any) => buffItem.key === key,
    );
    const buff = JSON.parse(JSON.stringify(buffFromCharacter));
    if (!buff) {
      continue;
    }

    const modifiersData = buff?.modifiers ?? [];
    let modifiers = JSON.parse(JSON.stringify(modifiersData));

    if (buff.hasStacks) {
      if (buffData?.stacks <= 0) {
        continue;
      }
      const stacks = buffData?.stacks ?? 0;
      modifiers.forEach((modifierItem: any) => {
        if (modifierItem?.modifySpecificTalents) {
          // update modifier value with the value * stacks
          modifierItem.modifierValueCalculated =
            modifierItem.modifierValue * stacks;
          modifySpecificTalents.push(modifierItem);
        } else if (modifierItem.modifier === "Talent") {
          const talentRef =
            talentData?.[modifierItem.modifierValueTalentRef] ?? "10";
          const talentVal = modifierItem.modifierValue[talentRef];
          data[`${modifierItem.modifierTalentKey}:talentModifierMultiplyAdd`] =
            talentVal * stacks;
        } else if (modifierItem.modifier === "EnableAttack") {
          data.EnableAttack.push(...modifierItem.modifierValue);
        } else {
          const totalValue = modifierItem.modifierValue * stacks;
          data[modifierItem.modifier] =
            (data[modifierItem.modifier] || 0) + totalValue;
        }
      });
    } else {
      modifiers.forEach((modifierItem: any) => {
        if (modifierItem?.modifySpecificTalents) {
          // add our calculated value
          modifierItem.modifierValueCalculated = modifierItem.modifierValue;
          modifySpecificTalents.push(modifierItem);
        } else if (modifierItem.modifier === "Talent") {
          // this is the rare case where the modifier value needs a reference to another talent level
          // specifically Jinhsi incandescence buff scales off of her forte talent
          const talentRef =
            talentData?.[modifierItem.modifierValueTalentRef] ?? "10";
          const talentVal = modifierItem.modifierValue[talentRef];
          data[`${modifierItem.modifierTalentKey}:talentModifierMultiplyAdd`] =
            talentVal;
        } else if (modifierItem.modifier === "talentModifierMultiply") {
          // for buffs that apply talentModifierMultiply to the calcs
          if (!data.talentModifierMultiply) {
            data.talentModifierMultiply = [];
          }
          data.talentModifierMultiply.push(modifierItem);
        } else if (modifierItem.modifier === "EnableAttack") {
          data.EnableAttack.push(...modifierItem.modifierValue);
        } else {
          data[modifierItem.modifier] =
            (data[modifierItem.modifier] || 0) + modifierItem.modifierValue;
        }
      });
    }
  }
  modifySpecificTalents.forEach((item: any) => {
    const talents = item?.modifySpecificTalents ?? [];
    const { modifier, modifierValue, modifierValueCalculated } = item;
    talents.forEach((talent: string) => {
      let modifierStr = "";
      // not everything will have a modifier, so append the : and modifier if we have it
      if (modifier) {
        modifierStr = `:${modifier}`;
      }
      data.specificTalentBuffs[`${talent}${modifierStr}`] =
        (data.specificTalentBuffs[`${talent}${modifierStr}`] || 0) +
        (modifierValueCalculated || modifierValue);
    });
  });
  return data;
};

// Pure function to calculate all stats with full context
// This function is designed to work in web workers - no Vue dependencies, all state passed as parameters
// Returns both final stats and breakdown data for UI
export const calculateAllStats = (context: {
  // Character base stats
  baseHp: number;
  baseAtk: number;
  baseDef: number;

  // Weapon data
  weaponAtk: number;
  weaponModifier: string | null;
  weaponModifierValue: number;
  weaponPassiveData: any;

  // Buff configurations (enabled state)
  buffsConfig: any;
  resonanceChainsConfig: any;
  customBuffs: any;
  teamBuffsData: any;
  echoStats: any;

  // Character data (definitions)
  buffsCharInfo: any[];
  resonanceChainsCharInfo: any[];

  // Character metadata
  character: string;
  talentData: any;

  // Options
  ignoreBuffs?: {
    ignoreTeamBuffs?: boolean;
    ignoreWeaponBuffs?: boolean;
    ignoreEchoes?: boolean;
  };
}): {
  finalStats: any;
  selfBuffsData: any;
  resonanceChainsBuffsData: any;
  additionalBaseBuffsData: any;
  critOverflowBuffsData: any;
} => {
  const {
    baseHp,
    baseAtk,
    baseDef,
    weaponAtk,
    weaponModifier,
    weaponModifierValue,
    weaponPassiveData,
    buffsConfig,
    resonanceChainsConfig,
    customBuffs,
    teamBuffsData,
    echoStats,
    buffsCharInfo,
    resonanceChainsCharInfo,
    character,
    talentData,
    ignoreBuffs = {},
  } = context;

  // Step 1: Compute resonance chains buffs (no longer needs base stats)
  const resonanceChainsBuffsData =
    computeResonanceChainsBuffs(
      resonanceChainsConfig ?? {},
      resonanceChainsCharInfo ?? [],
      talentData ?? {},
    ) || {};

  // Step 2: Compute self buffs (no longer needs base stats)
  const selfBuffsData =
    computeSelfBuffs(
      buffsConfig ?? {},
      buffsCharInfo ?? [],
      resonanceChainsConfig ?? {},
      talentData ?? {},
      character ?? "",
    ) || {};

  // Step 3: Calculate intermediate stats with resonance chains and self buffs
  // This internally calculates base stats, then applies resonance chains and self buffs
  const intermediateStats = calcCharStats(
    "All",
    null,
    ignoreBuffs,
    null,
    null,
    { baseHp, baseAtk, baseDef },
    {
      weaponAtk,
      weaponModifier,
      weaponModifierValue,
      weaponPassiveData,
    },
    selfBuffsData,
    resonanceChainsBuffsData,
    echoStats,
    customBuffs,
    teamBuffsData,
  );

  // Step 4: Compute AdditionalBase buffs using intermediate stats
  const additionalBaseBuffsData = computeAdditionalBaseBuffs(
    buffsConfig ?? {},
    buffsCharInfo ?? [],
    resonanceChainsConfig ?? {},
    character ?? "",
    intermediateStats.energyRegen,
    intermediateStats.totalCritRate,
  );

  // Step 5: Compute CritOverflow buffs using intermediate stats
  const critOverflowBuffsData = computeCritOverflowBuffs(
    buffsConfig ?? {},
    buffsCharInfo ?? [],
    resonanceChainsConfig ?? {},
    resonanceChainsCharInfo ?? [],
    intermediateStats.totalCritRate,
  );

  // Step 6: Merge AdditionalBase and CritOverflow into self buffs
  const mergedSelfBuffs = {
    ...selfBuffsData,
    CritRate:
      (selfBuffsData?.CritRate || 0) + (additionalBaseBuffsData?.CritRate || 0),
    CritDMG:
      (selfBuffsData?.CritDMG || 0) +
      (additionalBaseBuffsData?.CritDMG || 0) +
      (critOverflowBuffsData?.CritDMG || 0),
    ATK: (selfBuffsData?.ATK || 0) + (additionalBaseBuffsData?.ATK || 0),
    ATK_FLAT:
      (selfBuffsData?.ATK_FLAT || 0) + (additionalBaseBuffsData?.ATK_FLAT || 0),
  };

  // Step 7: Calculate final stats with all buffs
  const finalStats = calcCharStats(
    "All",
    null,
    ignoreBuffs,
    null,
    null,
    { baseHp, baseAtk, baseDef },
    {
      weaponAtk,
      weaponModifier,
      weaponModifierValue,
      weaponPassiveData,
    },
    mergedSelfBuffs,
    resonanceChainsBuffsData,
    echoStats,
    customBuffs,
    teamBuffsData,
  );

  // Merge AdditionalBase and CritOverflow into breakdown for UI
  const mergedSelfBuffsForBreakdown = {
    ...selfBuffsData,
    ...additionalBaseBuffsData,
    CritDMG:
      (selfBuffsData?.CritDMG || 0) +
      (additionalBaseBuffsData?.CritDMG || 0) +
      (critOverflowBuffsData?.CritDMG || 0),
  };

  return {
    finalStats,
    selfBuffsData: mergedSelfBuffsForBreakdown,
    resonanceChainsBuffsData,
    additionalBaseBuffsData,
    critOverflowBuffsData,
  };
};
