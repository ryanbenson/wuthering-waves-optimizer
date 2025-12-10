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
) => {
  const { ignoreTeamBuffs, ignoreWeaponBuffs, ignoreEchoes } = ignoreBuffs;
  let stats = getInitStats(providedFullStats);
  let { baseHp = 0, baseAtk = 0, baseDef = 0 } = characterStats;
  let weaponAtk = 0;

  let weaponModifier = null;
  let weaponModifierValue = 0;
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
        const returnedStats = { ...stats };
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
  const returnedStats = { ...stats };
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
