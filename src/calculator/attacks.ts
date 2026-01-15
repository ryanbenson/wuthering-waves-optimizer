import {
  calcCharStats,
  getElementDmgBonusByType,
  getDamageValByAttr,
  getDamageTypeBonusByType,
} from "./stats.ts";

import {
  calcFixedDamage,
  calcMidnightVeilDMG,
  getSpectroFrazzleDamage,
  getAeroErosionDamage,
  calcHeal,
  calcDamage,
  calcShield,
  getSpectroFrazzleModifierByLevelByStacks,
  getAeroErosionModifierByLevelByStacks,
  calcTuneBreak,
} from "./calculator.ts";

import { getOriginalForteFromAttackKey } from "../characters/characters.ts";

import { getEchoData } from "../echoes";

export const processAttacks = (
  attacks: any,
  context: CalculationContext,
  talentType: any = null,
  hasNoTalentLevel: boolean = false,
  dynamicTalentType: boolean = false,
  excludeDisabledAttacks: boolean = true, // e.g. ones that are unlocked through chains should be hidden by default
  providedStats: any = null, // use this set of base stats instead of the global stats
  providedEchoStats: any = null, // use this set of echo stats instead of the global echo stats
) => {
  return (
    (attacks ?? [])
      .map((attack: any) => {
        let isEnabled = true;
        let originalIsEnabled = true; // used for rotations. we show them, but disable them, so isEnabled is overwritten
        // if this attack requires a resonance chain to be unlocked, verify it's enabled
        const requiresResonanceChain = attack?.requiresResonanceChain ?? false;
        if (requiresResonanceChain) {
          const resonanceChainsEnabledAttacks =
            context.buffs.charResonanceChainsData?.EnableAttack ?? [];
          const charBuffsEnabledAttacks =
            context.buffs.charBuffsData?.EnableAttack ?? [];
          // merge all possible enabled attack arrays together
          const enabledAttacks: any[] = []
            .concat(resonanceChainsEnabledAttacks)
            .concat(charBuffsEnabledAttacks);
          const isAttackEnabled = enabledAttacks.includes(
            attack.requiresResonanceChain,
          );
          // flag this attack as enabled or not based on the resonance chain
          isEnabled = isAttackEnabled;
          originalIsEnabled = isEnabled;
        }
        if (!excludeDisabledAttacks) {
          isEnabled = true;
        }
        let talent;
        let providedTalent;
        if (hasNoTalentLevel) {
          talent = attack.talent;
        } else if (dynamicTalentType) {
          let talent;
          switch (attack.actionType) {
            case "basic":
              talent = attack.talents[context.character.talentData.basic];
              break;
            case "skill":
              talent = attack.talents[context.character.talentData.skill];
              break;
            case "forteCircuit":
              talent = attack.talents[context.character.talentData.forte];
              break;
            case "liberation":
              talent = attack.talents[context.character.talentData.liberation];
              break;
            case "intro":
              talent = attack.talents[context.character.talentData.intro];
              break;
            case "tuneBreak":
              // outro has no talent tree. it only has 1 value (e.g. 20.00%)
              talent = attack.talent;
              break;
            case "outro":
              // outro has no talent tree. it only has 1 value (e.g. 20.00%)
              talent = attack.talent;
              break;
            case "utilityAttacks":
              // outro has no talent tree. it only has 1 value (e.g. 20.00%)
              talent = attack.talent;
              break;
            case "echoAttacks":
              // TODO: Get the correct talent level for echo attacks
              talent = attack.talents[attack?.actionMainEchoRank ?? "5"];
              providedTalent = talent;
              break;
          }
        } else {
          talent = attack.talents[talentType];
        }
        const hitCount = attack?.count ?? 1;
        let attackType = attack.type;
        // is there an attack type override? if so, update it
        const attackTypeOverrideResChain =
          context.buffs.charResonanceChainsData?.specificTalentBuffs?.[
            `${attack.key}:talentTypeOverride`
          ] ?? null;
        const attackTypeOverrideSelfBuff =
          context.buffs.charBuffsData?.specificTalentBuffs?.[
            `${attack.key}:talentTypeOverride`
          ] ?? null;
        if (attackTypeOverrideResChain) {
          attackType = attackTypeOverrideResChain;
        }
        if (attackTypeOverrideSelfBuff) {
          attackType = attackTypeOverrideSelfBuff;
        }
        return {
          id: attack.id ?? attack.key,
          key: attack.key,
          label: attack.label,
          talent,
          damage: calculateAttackDamage(
            attack,
            context,
            talentType,
            hasNoTalentLevel,
            dynamicTalentType,
            hitCount,
            providedStats, // pass along the provided stats, if we have them
            providedEchoStats, // pass along the provided echo stats, if we have them
            providedTalent, // pass in a specific talent string
          ),
          isEnabled,
          originalIsEnabled,
          requiresResonanceChain,
          type: attackType,
          count: attack.count,
          alwaysCrit: attack.alwaysCrit ?? false,
          mainEcho: attack.actionMainEcho ?? null,
          mainEchoRank: attack.actionMainEchoRank ?? null,
        };
      })
      // remove any attacks that are not enabled
      .filter((attack: any) => attack.isEnabled)
  );
};

export const calculateAttackDamage = (
  attack: any,
  context: CalculationContext,
  talentType: any = null,
  hasNoTalentLevel: boolean = false,
  hasDynamicTalent: boolean = false,
  count: number = 1,
  providedFullStats: any = null, // use this as our stats data, otherwise default to the global stats, this should exclude personal buffs, weapon buffs, chain buffs, custom buffs, team buffs. The only things to use are attack-level buffs
  providedEchoStats: any = null, // use this as our echo buffs instead of the global echo buffs
  providedTalent: any = null, // use this talent string if provided, mostly used for echo attacks in, rotations
) => {
  const { excludeTeamBuffs, excludeWeaponBuffs, excludeEchoes } = attack;
  let statsWithoutTeamBuffs = null;
  if (excludeTeamBuffs || excludeWeaponBuffs || excludeEchoes) {
    statsWithoutTeamBuffs = calcCharStats(
      "All",
      null,
      {
        ignoreTeamBuffs: excludeTeamBuffs,
        ignoreWeaponBuffs: excludeWeaponBuffs,
        ignoreEchoes: excludeEchoes,
      },
      providedEchoStats ?? context.equipment.echoStats,
      null,
      {
        baseHp: context.character.baseStats.baseHp,
        baseAtk: context.character.baseStats.baseAtk,
        baseDef: context.character.baseStats.baseDef,
      },
      {
        weaponAtk: context.equipment.weapon.attack,
        weaponModifier: context.equipment.weapon.modifier,
        weaponModifierValue: context.equipment.weapon.modifierValue,
        weaponPassiveData: context.equipment.weapon.weaponPassiveStats ?? {},
      },
      context.buffs.charBuffsData,
      context.buffs.charResonanceChainsData,
      context.equipment.echoStats,
      context.buffs.customBuffs,
      context.buffs.teamBuffsData,
    );
  }
  let attackType = attack.type;
  const selfBuffs = JSON.parse(
    JSON.stringify(context.buffs.charBuffsData ?? {}),
  );
  /**
   * check if there are any buffs that buff another buff
   * look through the object of charResonanceChainsData for any ${attack.key}:MultiplySelfBuffs
   * and apply them to the selfBuffs object. it will be in specificTalentBuffs
   * { specificTalentBuffs: { PoeticEssenceSkillDMG:MultiplySelfBuff: 2 } }
   */
  const resonanceChainsKeys = Object.keys(
    context.buffs.charResonanceChainsData?.specificTalentBuffs ?? {},
  );
  const resonanceChainsKeysWithMultiply = resonanceChainsKeys.filter(
    (key: string) => key.includes("MultiplySelfBuff"),
  );
  if (resonanceChainsKeysWithMultiply.length > 0) {
    resonanceChainsKeysWithMultiply.forEach((key: string) => {
      const buffValue =
        context.buffs.charResonanceChainsData?.specificTalentBuffs?.[key];
      const buffReferenceKey = key.split(":")[0]; // e.g. PoeticEssenceSkillDMG
      // // check if the buffReferenceKey is in the selfBuffs object
      if (selfBuffs?.specificTalentBuffs?.[buffReferenceKey]) {
        // multiply the buff value by the buffValue
        selfBuffs.specificTalentBuffs[buffReferenceKey] *= buffValue;
      }
    });
  }

  // apply any buff changes
  // is there an attack type override? if so, update it
  const attackTypeOverrideResChain =
    context.buffs.charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:talentTypeOverride`
    ] ?? null;
  const attackTypeOverrideSelfBuff =
    selfBuffs?.specificTalentBuffs?.[`${attack.key}:talentTypeOverride`] ??
    null;
  if (attackTypeOverrideResChain) {
    attackType = attackTypeOverrideResChain;
  }
  if (attackTypeOverrideSelfBuff) {
    attackType = attackTypeOverrideSelfBuff;
  }
  // an attack can have its own element override
  const attackElement =
    attack?.element ?? context.character.chosenChar?.basic?.element;
  const stats = statsWithoutTeamBuffs ?? providedFullStats ?? context.stats;
  let elementalDmgBonusDecimal = getElementDmgBonusByType(
    attackElement,
    stats,
    {
      Glacio: context.stats.Glacio,
      Fusion: context.stats.Fusion,
      Electro: context.stats.Electro,
      Aero: context.stats.Aero,
      Spectro: context.stats.Spectro,
      Havoc: context.stats.Havoc,
    },
  );
  const atkDefHpVal = getDamageValByAttr(attack?.attribute, stats, {
    totalDef: context.stats.totalDef,
    totalHp: context.stats.totalHp,
    energyRegen: context.stats.energyRegen,
    totalAtk: context.stats.totalAtk,
  });
  let totalSkillDmgBonus = getDamageTypeBonusByType(attackType, stats, {
    BasicAttackDMGBonus: context.stats.BasicAttackDMGBonus,
    HeavyAttackDMGBonus: context.stats.HeavyAttackDMGBonus,
    ResonanceSkillDMGBonus: context.stats.ResonanceSkillDMGBonus,
    IntroSkillDMGBonus: context.stats.IntroSkillDMGBonus,
    OutroSkillDMGBonus: context.stats.OutroSkillDMGBonus,
    ResonanceLiberationDMGBonus: context.stats.ResonanceLiberationDMGBonus,
    EchoDMGBonus: context.stats.EchoDMGBonus,
    healingBonus: context.stats.healingBonus,
    shieldBonus: context.stats.shieldBonus,
  });
  let talent;
  let talentTree = attack?.talents;

  // see if we have a talent modifier replacement to override the talent value
  const talentModifierReplace =
    context.buffs.charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:talentReplace`
    ] ?? null;
  if (talentModifierReplace) {
    talentTree = talentModifierReplace;
  }

  if (hasNoTalentLevel) {
    talent = attack.talent;
  } else if (providedTalent) {
    talent = providedTalent;
  } else if (hasDynamicTalent) {
    switch (attack.actionType) {
      case "basic":
        talent = talentTree[context.character.talentData.basic];
        break;
      case "skill":
        talent = talentTree[context.character.talentData.skill];
        break;
      case "forteCircuit":
      case "forte":
        talent = talentTree[context.character.talentData.forte];
        break;
      case "liberation":
        talent = talentTree[context.character.talentData.liberation];
        break;
      case "intro":
        talent = talentTree[context.character.talentData.intro];
        break;
      case "tuneBreak":
        // tune break have no talent tree, just a single value
        talent = attack.talent;
        break;
      case "outro":
        // outros have no talent tree, just a single value
        talent = attack.talent;
        break;
      case "utilityAttacks":
        // utility have no talent tree, just a single value
        talent = attack.talent;
        break;
      case "echoSetAttacks":
        // echo set attacks have no talent tree, just a single value
        talent = attack.talent;
        break;
      case "echoAttacks":
        // TODO: Get the correct talent level for echo attacks
        talent = attack.talents["5"];
        break;
    }
  } else {
    talent = talentTree[talentType];
  }
  /**
   * If the attack is fixed (attack.isFixed === true)
   * return the value we got from the talent directly
   * this is used for attacks that do a fixed amount of damage
   */
  if (attack.isFixed) {
    return calcFixedDamage(talent, count);
  }
  const talentModifierAdd = selfBuffs?.[attack.key] ?? 0;
  // TODO: Is this used anywhere?
  const talentModifierAddFromResonanceChains =
    context.buffs.charResonanceChainsData?.[attack.key] ?? 0;
  // flat adding to the base multiplier for a specific attack
  const talentModifierAddFromResonanceChainsAdd =
    context.buffs.charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:talentModifierMultiplyAdd`
    ] ?? 0;
  const talentModifierAddFromSelfBuffs =
    selfBuffs?.[`${attack.key}:talentModifierMultiplyAdd`] ?? 0;
  const attackBuffsTalentModifierAdd = attack?.buffs?.talentModifierAdd ?? 0;
  const totalTalentModifierAdd =
    talentModifierAdd +
    talentModifierAddFromResonanceChains +
    talentModifierAddFromResonanceChainsAdd +
    talentModifierAddFromSelfBuffs +
    attackBuffsTalentModifierAdd;

  const specificSkillDmgFromResonanceChains =
    context.buffs.charResonanceChainsData?.specificTalentBuffs?.[attack.key] ??
    0;
  // apply echo based coordianted dmg bonus (both echo set and main echo)
  // as well as custom buffs for coordinated attacks
  let coordinatedEchoDmgBonus = 0;
  let coordinatedDmgBonusCustomBuffs = 0;
  // get the coordinated dmg bonus from provided stats, but ignore custom buffs
  // if we have provided stats
  if (attack?.subType === "Coordinated") {
    coordinatedEchoDmgBonus =
      providedFullStats?.coordinatedDmgBonus ||
      (providedEchoStats ?? context.equipment.echoStats)?.CoordinatedDMGBonus ||
      0;
    if (!providedFullStats) {
      coordinatedDmgBonusCustomBuffs =
        context.buffs.customBuffs?.CoordinatedDMGBonus ?? 0;
    }
  }
  // there are bonuses that are based on Max HP, Max ATK, Max DEF
  // we end up with DMG Bonus %, so we also / 100 in the end
  const specificSkillDmgFromResonanceChainsBasedOnMaxHp =
    context.buffs.charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:DMGBonus:MaxHP`
    ] ?? 0;
  const specificSkillDmgFromResonanceChainsBasedOnMaxAtk =
    context.buffs.charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:DMGBonus:MaxAtk`
    ] ?? 0;
  const specificSkillDmgFromResonanceChainsBasedOnMaxDef =
    context.buffs.charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:DMGBonus:MaxDef`
    ] ?? 0;
  const specificSkillDmgFromResonanceChainsBasedOnMaxHpVal =
    (context.stats.totalHp * specificSkillDmgFromResonanceChainsBasedOnMaxHp) /
    100;
  const specificSkillDmgFromResonanceChainsBasedOnMaxAtkVal =
    (context.stats.totalAtk *
      specificSkillDmgFromResonanceChainsBasedOnMaxAtk) /
    100;
  const specificSkillDmgFromResonanceChainsBasedOnMaxDefVal =
    (context.stats.totalDef *
      specificSkillDmgFromResonanceChainsBasedOnMaxDef) /
    100;
  // end max buff handlers
  const specificSkillDmgFromCharBuffs =
    selfBuffs?.specificTalentBuffs?.[attack.key] ?? 0;
  const specificSkillDmgFromCharBuffsDmgBonus =
    selfBuffs?.specificTalentBuffs?.[`${attack.key}:DMGBonus`] ?? 0;
  const specificSkillDmgFromCharBuffsWithElement =
    selfBuffs?.specificTalentBuffs?.[`${attack.key}:${attackElement}`] ?? 0;
  const specificSkillDmgFromEchoes =
    (providedEchoStats ?? context.equipment.echoStats)?.specificTalentBuffs?.[
      attack.key
    ] ?? 0;
  const genericSkillDmgBonusResChain =
    context.buffs.charResonanceChainsData?.DMGBonus ?? 0;
  const genericSkillDmgBonusSelfBuff = selfBuffs?.DMGBonus ?? 0;
  let genericSkillDmgBonusWeaponBuff =
    context.equipment.weapon.weaponPassiveStats?.DMGBonus ?? 0;
  if (excludeWeaponBuffs) {
    genericSkillDmgBonusWeaponBuff = 0;
  }
  let genericSkillDmgBonusEchoBuff =
    providedFullStats?.dmgBonus ||
    (providedEchoStats ?? context.equipment.echoStats)?.DMGBonus ||
    0;
  let genericSkillDmgBonusTeamEchoBuff =
    context.buffs.teamBuffsData?.DMGBonus ?? 0;
  if (excludeTeamBuffs) {
    genericSkillDmgBonusTeamEchoBuff = 0;
  }
  const extraDefIgnoreResonanceChain =
    context.buffs.charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:DEFIgnore`
    ] ?? 0;
  const extraDefIgnoreCharBuff =
    selfBuffs?.specificTalentBuffs?.[`${attack.key}:DEFIgnore`] ?? 0;
  let extraDefIgnoreCustomBuffs = context.buffs.customBuffs?.DefIgnore ?? 0;
  const attackBuffsDefIgnore = attack?.buffs?.DefIgnore ?? 0;
  let weaponDefIgnoreSpecificDmgType =
    context.equipment.weapon.weaponPassiveStats?.[`DEFIgnore:${attack.type}`] ??
    0;
  if (excludeWeaponBuffs) {
    weaponDefIgnoreSpecificDmgType = 0;
  }
  const specificSkillExtraCritRate =
    context.buffs.charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:CritRate`
    ] ?? 0;
  let echoSpecificAttackTypeCritRate = 0;
  if (providedEchoStats) {
    echoSpecificAttackTypeCritRate =
      providedEchoStats?.[`CritRate:${attack.type}`] ?? 0;
  } else {
    echoSpecificAttackTypeCritRate =
      context.equipment.echoStats?.[`CritRate:${attack.type}`] ?? 0;
  }
  // need to divide by 100 since the echo data is flul numbers
  // but we're injecting it to the calcs which is decimal based
  echoSpecificAttackTypeCritRate = echoSpecificAttackTypeCritRate / 100;
  const specificSkillExtraCritDMG =
    context.buffs.charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:CritDMG`
    ] ?? 0;
  const selfBuffsSpecificSkillExtraCritDMG =
    selfBuffs.specificTalentBuffs?.[`${attack.key}:CritDMG`] ?? 0;
  const baseCritRate =
    providedFullStats?.totalCritRate || context.stats.totalCritRate;
  let instanceDmgCritRate =
    baseCritRate + specificSkillExtraCritRate + echoSpecificAttackTypeCritRate;
  if (excludeTeamBuffs) {
    instanceDmgCritRate = statsWithoutTeamBuffs?.totalCritRate ?? 0;
    instanceDmgCritRate += specificSkillExtraCritRate;
  }
  const baseCritDamage =
    providedFullStats?.totalCritDMG || context.stats.totalCritDMG;
  let instanceDmgCritDMG =
    baseCritDamage +
    specificSkillExtraCritDMG +
    selfBuffsSpecificSkillExtraCritDMG;
  if (excludeTeamBuffs) {
    instanceDmgCritDMG = statsWithoutTeamBuffs?.totalCritDMG ?? 0;
    instanceDmgCritDMG += specificSkillExtraCritDMG;
  }
  const talentModifierMultiply =
    context.buffs.charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:talentModifierMultiply`
    ] ?? 0;
  const talentModifierMultiplySelfBuff =
    selfBuffs?.specificTalentBuffs?.[`${attack.key}:talentModifierMultiply`] ??
    0;
  const talentModifierMultiplyAttackBuff =
    attack?.buffs?.talentModifierMultiply ?? 0;
  const currentDefIgnore =
    providedFullStats?.DefIgnore || context.stats.DefIgnore || 0;
  const totalDefIgnore =
    currentDefIgnore +
    extraDefIgnoreResonanceChain +
    extraDefIgnoreCharBuff +
    extraDefIgnoreCustomBuffs +
    attackBuffsDefIgnore +
    weaponDefIgnoreSpecificDmgType;
  // Def Reduction
  // Havoc bane reduces def for stack * 2%
  const havocBaneStacksNum = context.enemy.havocBane.havocBaneStacks ?? 0;
  const havocBaneDefReduction = havocBaneStacksNum * 0.02;
  const attackDefReduction = attack?.buffs?.DefReduction ?? 0;
  const customBuffDefReduction = context.buffs.customBuffs?.DefReduction ?? 0;
  const totalDefReduction =
    havocBaneDefReduction + attackDefReduction + customBuffDefReduction;
  // apply specific ForteBased buff
  const originalForte = getOriginalForteFromAttackKey(
    context.character.chosenChar,
    attack.key,
  );
  let totalForteBasedDmgBuff =
    (providedEchoStats ?? context.equipment.echoStats)?.[
      `ForteBased:${originalForte}:${attack.type}`
    ] ?? 0;
  let specificSkillDmg =
    specificSkillDmgFromResonanceChains +
    specificSkillDmgFromCharBuffs +
    specificSkillDmgFromCharBuffsDmgBonus +
    specificSkillDmgFromCharBuffsWithElement +
    genericSkillDmgBonusResChain +
    genericSkillDmgBonusSelfBuff +
    genericSkillDmgBonusWeaponBuff +
    genericSkillDmgBonusTeamEchoBuff +
    specificSkillDmgFromEchoes +
    specificSkillDmgFromResonanceChainsBasedOnMaxHpVal +
    specificSkillDmgFromResonanceChainsBasedOnMaxAtkVal +
    specificSkillDmgFromResonanceChainsBasedOnMaxDefVal +
    // echo buffs are in full integers, need to divide since everything else is decimal
    // TODO: when refactoring echoes, move to decimals
    coordinatedEchoDmgBonus / 100 +
    genericSkillDmgBonusEchoBuff / 100 +
    coordinatedDmgBonusCustomBuffs +
    totalForteBasedDmgBuff / 100;

  // Resist Shred:
  let teamBuffResistShredForCharElement =
    context.buffs.teamBuffsData?.[`ResistShred:${attackElement}`] ?? 0;
  let selfBuffResistShredForCharElement =
    selfBuffs?.[`ResistShred:${attackElement}`] ?? 0;
  let selfBuffResistShredForCharElementSpecificAttack =
    selfBuffs?.specificTalentBuffs?.[
      `${attack.key}:ResistShred:${attackElement}`
    ] ?? 0;
  let weaponBuffResistShredForCharElement =
    context.equipment.weapon.weaponPassiveStats?.[
      `ResistShred:${attackElement}`
    ] ?? 0;
  if (excludeWeaponBuffs) {
    weaponBuffResistShredForCharElement = 0;
  }
  if (excludeTeamBuffs) {
    teamBuffResistShredForCharElement = 0;
  }

  const resonanceChainResistShredForCharElement =
    context.buffs.charResonanceChainsData?.[`ResistShred:${attackElement}`] ??
    0;
  const baseResistReduction =
    providedFullStats?.resistReduction || context.stats.ResistReduction || 0;
  let customResistReduction = context.buffs.customBuffs?.ResistShred ?? 0;
  const actionBuffResistReduction = attack.buffs?.ResistShred ?? 0;
  const totalResistReduction =
    baseResistReduction +
    teamBuffResistShredForCharElement +
    resonanceChainResistShredForCharElement +
    selfBuffResistShredForCharElement +
    selfBuffResistShredForCharElementSpecificAttack +
    weaponBuffResistShredForCharElement +
    actionBuffResistReduction +
    customResistReduction;

  // damage deepen:
  let baseTotalDeepenEffect =
    providedFullStats?.totalDeepenEffect ||
    context.stats.TotalDeepenEffect ||
    0;
  // so far damage deepen is from team buffs, add more later if needed
  // get element first, then any skill specific ones next, then add together
  // NOTE: all outro attacks cannot use the DMGDeepen:element|attackType
  // as they expire before the outro attacks occur. so ignore these
  // for outro attacks
  // self subtype dmg deepen
  let selfBuffDmgDeepenForSubType =
    context.buffs.charBuffsData?.[`DMGDeepen:${attack.subType}`] ?? 0;
  let selfBuffDmgDeepenForType =
    context.buffs.charBuffsData?.[`DMGDeepen:${attackType}`] ?? 0;
  let selfBuffDmgDeepenForElement =
    context.buffs.charBuffsData?.[`DMGDeepen:${attackElement}`] ?? 0;
  let teamBuffDmgDeepenForCharElement =
    context.buffs.teamBuffsData?.[`DMGDeepen:${attackElement}`] ?? 0;
  let teamBuffDmgDeepenForAttackType =
    context.buffs.teamBuffsData?.[`DMGDeepen:${attackType}`] ?? 0;
  let teamBuffDmgDeepenForSubType =
    context.buffs.teamBuffsData?.[`DMGDeepen:${attack.subType}`] ?? 0;
  const selfBuffSpecificAttackGenericDmgDeepen =
    selfBuffs?.specificTalentBuffs?.[`${attack.key}:DMGDeepen`] ?? 0;
  const resonanceChainBuffSpecificAttackGenericDmgDeepen =
    context.buffs.charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:DMGDeepen`
    ] ?? 0;
  if (excludeTeamBuffs) {
    baseTotalDeepenEffect = statsWithoutTeamBuffs?.totalDeepenEffect ?? 0;
    teamBuffDmgDeepenForCharElement = 0;
    teamBuffDmgDeepenForAttackType = 0;
    teamBuffDmgDeepenForSubType = 0;
  }
  // outro and utility attacks lose dmg deepen for specific elements and attack types
  // because they're off-field, but keep global ones like Verina
  if (attackType === "Outro" || attackType === "Utility") {
    teamBuffDmgDeepenForCharElement = 0;
    teamBuffDmgDeepenForAttackType = 0;
  }
  let attackLevelDmgDeepen = attack.buffs?.DMGDeepen ?? 0;
  // DO NOT RESET THIS WITH providedStats, it's not properly handled in calcCharStats yet
  // it's because this is DamageAmplify, not DMGDeepen
  // TODO: Fix this.
  const customDamageDeepen = context.buffs.customBuffs?.DamageAmplify ?? 0;
  let resonanceChainDmgDeepenForAttackType =
    context.buffs.charResonanceChainsData?.[`DMGDeepen:${attackType}`] ?? 0;
  let resonanceChainDmgDeepenForAttackSubType =
    context.buffs.charResonanceChainsData?.[`DMGDeepen:${attack.subType}`] ?? 0;
  let weaponBuffDmgDeepenElement =
    context.equipment.weapon.weaponPassiveStats?.[
      `DMGDeepen:${attackElement}`
    ] ?? 0;
  let weaponBuffDmgDeepenSubType =
    context.equipment.weapon.weaponPassiveStats?.[
      `DMGDeepen:${attack.subType}`
    ] ?? 0;
  let weaponBuffDmgDeepenType =
    context.equipment.weapon.weaponPassiveStats?.[`DMGDeepen:${attackType}`] ??
    0;
  if (excludeWeaponBuffs) {
    weaponBuffDmgDeepenElement = 0;
    weaponBuffDmgDeepenSubType = 0;
    weaponBuffDmgDeepenType = 0;
  }
  const totalDmgDeepen =
    baseTotalDeepenEffect +
    teamBuffDmgDeepenForCharElement +
    teamBuffDmgDeepenForAttackType +
    attackLevelDmgDeepen +
    teamBuffDmgDeepenForSubType +
    selfBuffSpecificAttackGenericDmgDeepen +
    resonanceChainBuffSpecificAttackGenericDmgDeepen +
    resonanceChainDmgDeepenForAttackType +
    resonanceChainDmgDeepenForAttackSubType +
    weaponBuffDmgDeepenElement +
    weaponBuffDmgDeepenSubType +
    customDamageDeepen +
    selfBuffDmgDeepenForSubType +
    selfBuffDmgDeepenForType +
    weaponBuffDmgDeepenType +
    selfBuffDmgDeepenForElement;
  let totalTalentModifierMultiply =
    talentModifierMultiply +
    talentModifierMultiplySelfBuff +
    talentModifierMultiplyAttackBuff;
  // grab any special multipliers, and then multiply the previous total by that
  const talentModifierSpecialMultiplyResChains =
    context.buffs.charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:talentModifierSpecialMultiply`
    ] ?? 0;
  let totalTalentModifierSpecialMultiply =
    talentModifierSpecialMultiplyResChains;
  // check for any modifiers that change the individual instance of atk/hp/def
  // re-calculate the base for this specific instance of damage
  let modifyBaseAtk =
    selfBuffs?.specificTalentBuffs?.[`${attack.key}:ATK`] ?? 0;
  let modifyBaseAtkResChain =
    context.buffs.charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:ATK`
    ] ?? 0;
  modifyBaseAtk += modifyBaseAtkResChain;
  let modifyBaseHp = selfBuffs?.specificTalentBuffs?.[`${attack.key}:HP`] ?? 0;
  let modifyBaseDef =
    selfBuffs?.specificTalentBuffs?.[`${attack.key}:DEF`] ?? 0;
  let modifyBaseAtkFlat =
    selfBuffs?.specificTalentBuffs?.[`${attack.key}:ATK_FLAT`] ?? 0;
  let modifyBaseHpFlat =
    selfBuffs?.specificTalentBuffs?.[`${attack.key}:HP_FLAT`] ?? 0;
  let modifyBaseDefFlat =
    selfBuffs?.specificTalentBuffs?.[`${attack.key}:DEF_FLAT`] ?? 0;
  // if there are any attack-level buffs for atk, hp, or def (% or flat, update them)
  if (attack?.buffs) {
    modifyBaseAtk += attack.buffs?.ATK ?? 0;
    modifyBaseHp += attack.buffs?.HP ?? 0;
    modifyBaseDef += attack.buffs?.DEF ?? 0;
    modifyBaseAtkFlat += attack.buffs?.ATK_FLAT ?? 0;
    modifyBaseHpFlat += attack.buffs?.HP_FLAT ?? 0;
    modifyBaseDefFlat += attack.buffs?.DEF_FLAT ?? 0;
  }
  let finalAtkDefHpVal = atkDefHpVal;
  // TODO: NEED TO VERIFY THIS WORKS, AND WHO THIS APPLIES TO
  if (modifyBaseAtk || modifyBaseAtkFlat) {
    finalAtkDefHpVal = calcCharStats(
      "ATK",
      {
        ATK: modifyBaseAtk,
        ATK_FLAT: modifyBaseAtkFlat,
      },
      {
        ignoreTeamBuffs: excludeTeamBuffs,
        ignoreWeaponBuffs: excludeWeaponBuffs,
        ignoreEchoes: excludeEchoes,
      },
      providedEchoStats,
      excludeEchoes ? null : providedFullStats,
      {
        baseHp: context.character.baseStats.baseHp,
        baseAtk: context.character.baseStats.baseAtk,
        baseDef: context.character.baseStats.baseDef,
      },
      {
        weaponAtk: context.equipment.weapon.attack,
        weaponModifier: context.equipment.weapon.modifier,
        weaponModifierValue: context.equipment.weapon.modifierValue,
        weaponPassiveData: context.equipment.weapon.weaponPassiveStats ?? {},
      },
      context.buffs.charBuffsData,
      context.buffs.charResonanceChainsData,
      context.equipment.echoStats,
      context.buffs.customBuffs,
      context.buffs.teamBuffsData,
    );
  }
  // TODO: NEED TO VERIFY THIS WORKS, AND WHO THIS APPLIES TO
  if (modifyBaseHp || modifyBaseHpFlat) {
    finalAtkDefHpVal = calcCharStats(
      "HP",
      {
        HP: modifyBaseHp,
        HP_FLAT: modifyBaseHpFlat,
      },
      {
        ignoreTeamBuffs: excludeTeamBuffs,
        ignoreWeaponBuffs: excludeWeaponBuffs,
        ignoreEchoes: excludeEchoes,
      },
      providedEchoStats,
      excludeEchoes ? null : providedFullStats,
      {
        baseHp: context.character.baseStats.baseHp,
        baseAtk: context.character.baseStats.baseAtk,
        baseDef: context.character.baseStats.baseDef,
      },
      {
        weaponAtk: context.equipment.weapon.attack,
        weaponModifier: context.equipment.weapon.modifier,
        weaponModifierValue: context.equipment.weapon.modifierValue,
        weaponPassiveData: context.equipment.weapon.weaponPassiveStats ?? {},
      },
      context.buffs.charBuffsData,
      context.buffs.charResonanceChainsData,
      context.equipment.echoStats,
      context.buffs.customBuffs,
      context.buffs.teamBuffsData,
    );
  }
  // TODO: NEED TO VERIFY THIS WORKS, AND WHO THIS APPLIES TO
  if (modifyBaseDef || modifyBaseDefFlat) {
    finalAtkDefHpVal = calcCharStats(
      "DEF",
      {
        DEF: modifyBaseDef,
        DEF_FLAT: modifyBaseDefFlat,
      },
      {
        ignoreTeamBuffs: excludeTeamBuffs,
        ignoreWeaponBuffs: excludeWeaponBuffs,
        ignoreEchoes: excludeEchoes,
      },
      providedEchoStats,
      excludeEchoes ? null : providedFullStats,
      {
        baseHp: context.character.baseStats.baseHp,
        baseAtk: context.character.baseStats.baseAtk,
        baseDef: context.character.baseStats.baseDef,
      },
      {
        weaponAtk: context.equipment.weapon.attack,
        weaponModifier: context.equipment.weapon.modifier,
        weaponModifierValue: context.equipment.weapon.modifierValue,
        weaponPassiveData: context.equipment.weapon.weaponPassiveStats ?? {},
      },
      context.buffs.charBuffsData,
      context.buffs.charResonanceChainsData,
      context.equipment.echoStats,
      context.buffs.customBuffs,
      context.buffs.teamBuffsData,
    );
  }

  // special calc for MidnightVeilDMG
  if (attack.key === "InherentSkillSuperAttractiveMagicBox") {
    return calcMidnightVeilDMG();
  }

  // special calc for MidnightVeilDMG
  if (attack.type === "TuneBreak") {
    let talent = attack.talent;
    let enemyResistVal = 0;
    let resistReduction = 0;
    let baseTuneBreakBoost = 0;
    // Lynae, and others, have special Tune Break type attacks that have talents leveled off of their forte
    // also, normal tune break doesn't get affected by resist or resist reduction
    // but the special attacks do element based dmg, so they do
    if (
      attack.key === "TuneRuptureResponseSpectralAnalysisDMG" ||
      attack.key === "TuneRuptureResponseParticleJetDMG"
    ) {
      talent = attack.talents[context.character.talentData?.forte];
      enemyResistVal = context.enemy.enemyResist;
      resistReduction = totalResistReduction;
    }
    // get any custom base character tune break boost
    baseTuneBreakBoost =
      context.character.chosenChar?.basic?.tuneBreakBoost ?? 0;
    const tuneBreakBoostSelf = selfBuffs?.tuneBreakBoost ?? 0;
    const tuneBreakBoostTeam = context.buffs.teamBuffsData?.tuneBreakBoost ?? 0;
    const totalTuneBreakBoost =
      baseTuneBreakBoost + tuneBreakBoostSelf + tuneBreakBoostTeam;
    const tuneBreakDmgBonus = context.buffs.customBuffs?.TuneBreakDMGBonus ?? 0;
    return calcTuneBreak(
      talent,
      String(context.character.characterLevel),
      context.enemy.enemyLevel,
      enemyResistVal,
      context.enemy.enemyType,
      resistReduction,
      totalDefIgnore,
      totalTuneBreakBoost, // tuneBreakBoost
      totalTalentModifierMultiply,
      tuneBreakDmgBonus, // tune break bonusDmg (e.g. Hyvatia's 100% bonus)
      count,
    );
  }

  // set the multiplier hard set here
  // talentModifierMultiplySetValue
  const talentModifierMultiplySet =
    context.buffs.charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:talentModifierMultiplySetValue`
    ] ?? null;
  if (talentModifierMultiplySet) {
    totalTalentModifierMultiply = talentModifierMultiplySet;
  }

  if (
    attackType === "ElementalEffect" &&
    attack?.subType === "SpectroFrazzle"
  ) {
    let totalSpectroFrazzleDeepen = 0;
    // get any SpectroFrazzle dmg deepen/amplify
    // comes from weapon buffs, team buffs, and personal buffs (e.g. Phoebe)
    let spectroFrazzleDeepenWeaponBuffs =
      context.equipment.weapon.weaponPassiveStats?.[
        "DMGDeepen:SpectroFrazzle"
      ] ?? 0;
    if (excludeWeaponBuffs) {
      spectroFrazzleDeepenWeaponBuffs = 0;
    }
    let spectroFrazzleDeepenTeamBuffs =
      context.buffs.teamBuffsData?.["DMGDeepen:SpectroFrazzle"] ?? 0;
    if (excludeTeamBuffs) {
      spectroFrazzleDeepenTeamBuffs = 0;
    }
    const spectroFrazzleDeepenSelfBuffs =
      selfBuffs?.["DMGDeepen:SpectroFrazzle"] ?? 0;
    const spectroFrazzleDeepenResonanceChains =
      context.buffs.charResonanceChainsData?.["DMGDeepen:SpectroFrazzle"] ?? 0;
    totalSpectroFrazzleDeepen =
      spectroFrazzleDeepenWeaponBuffs +
      spectroFrazzleDeepenTeamBuffs +
      spectroFrazzleDeepenSelfBuffs +
      spectroFrazzleDeepenResonanceChains;
    if (attack?.subType === "SpectroFrazzle") {
      const elementalEffectDmg = getSpectroFrazzleDamage(
        attack.talent,
        attack?.stacks ?? 0,
        String(context.character.characterLevel),
        context.enemy.enemyLevel,
        context.enemy.enemyResist,
        totalResistReduction,
        totalDefIgnore,
        totalSpectroFrazzleDeepen,
      );
      return elementalEffectDmg;
    }
  }

  if (attackType === "ElementalEffect" && attack?.subType === "AeroErosion") {
    let totalAeroErosionDeepen = 0;
    // get any SpectroFrazzle dmg deepen/amplify
    // comes from weapon buffs, team buffs, and personal buffs (e.g. Phoebe)
    let aeroErosionDeepenWeaponBuffs =
      context.equipment.weapon.weaponPassiveStats?.["DMGDeepen:AeroErosion"] ??
      0;
    if (excludeWeaponBuffs) {
      aeroErosionDeepenWeaponBuffs = 0;
    }
    let aeroErosionDeepenTeamBuffs =
      context.buffs.teamBuffsData?.["DMGDeepen:AeroErosion"] ?? 0;
    if (excludeTeamBuffs) {
      aeroErosionDeepenTeamBuffs = 0;
    }
    const aeroErosionDeepenSelfBuffs =
      selfBuffs?.["DMGDeepen:AeroErosion"] ?? 0;
    const specificAeroErosionDeepenSelfBuffs =
      selfBuffs?.specificTalentBuffs?.["AeroErosion:DMGDeepen:AeroErosion"] ??
      0;
    const aeroErosionDeepenResonanceChains =
      context.buffs.charResonanceChainsData?.["DMGDeepen:AeroErosion"] ?? 0;
    totalAeroErosionDeepen =
      aeroErosionDeepenWeaponBuffs +
      aeroErosionDeepenTeamBuffs +
      aeroErosionDeepenSelfBuffs +
      aeroErosionDeepenResonanceChains +
      specificAeroErosionDeepenSelfBuffs;
    const elementalEffectDmg = getAeroErosionDamage(
      attack.talent,
      attack?.stacks ?? 0,
      String(context.character.characterLevel),
      context.enemy.enemyLevel,
      context.enemy.enemyResist,
      totalResistReduction,
      0, // TODO: AeroErosion does not use DefIgnore?
      totalAeroErosionDeepen,
    );
    return elementalEffectDmg;
  }

  if (attackType === "Healing") {
    // apply any attack-level healing bonuses
    if (attack?.buffs) {
      totalSkillDmgBonus += attack.buffs?.HealingBonus ?? 0;
    }
    const specificSkillHealingBonus =
      context.buffs.charResonanceChainsData?.specificTalentBuffs?.[
        `${attack.key}:HealingBonus`
      ] ?? 0;
    const specificSkillHealingBonusSelfBuff =
      selfBuffs?.specificTalentBuffs?.[`${attack.key}:HealingBonus`] ?? 0;
    totalSkillDmgBonus += specificSkillHealingBonus;
    // overwrite the specific skill buff to avoid generic dmg bonuses affecting healing
    const specificSkillDmg =
      specificSkillDmgFromResonanceChains +
      specificSkillDmgFromCharBuffs +
      specificSkillDmgFromEchoes +
      specificSkillHealingBonusSelfBuff +
      specificSkillDmgFromResonanceChainsBasedOnMaxHpVal +
      specificSkillDmgFromResonanceChainsBasedOnMaxAtkVal +
      specificSkillDmgFromResonanceChainsBasedOnMaxDefVal;
    const h = calcHeal(
      talent,
      finalAtkDefHpVal,
      totalSkillDmgBonus, // char stat of healing bonus
      specificSkillDmg, // any buffs for the skill
      totalTalentModifierAdd,
      totalTalentModifierMultiply,
      count,
    );
    return h;
  }

  if (attackType === "Shield") {
    // overwrite the specific skill buff to avoid generic dmg bonuses affecting shield
    const specificSkillDmg =
      specificSkillDmgFromResonanceChains +
      specificSkillDmgFromCharBuffs +
      specificSkillDmgFromEchoes +
      specificSkillDmgFromResonanceChainsBasedOnMaxHpVal +
      specificSkillDmgFromResonanceChainsBasedOnMaxAtkVal +
      specificSkillDmgFromResonanceChainsBasedOnMaxDefVal;
    const h = calcShield(
      talent,
      finalAtkDefHpVal,
      totalSkillDmgBonus, // char stat of shield bonus
      specificSkillDmg, // any buffs for the skill
      totalTalentModifierAdd,
      totalTalentModifierMultiply,
      count,
    );
    return h;
  }

  let totalInstanceDmgBuff = 0;
  // apply any generic attack-level buffs (e.g. CR, CD)
  if (attack?.buffs) {
    instanceDmgCritRate += attack.buffs?.CritRate ?? 0;
    instanceDmgCritDMG += attack.buffs?.CritDMG ?? 0;

    // get any element and attack type buffs too
    let attackTypeAttackBuff = 0;
    switch (attackType) {
      case "Basic":
        attackTypeAttackBuff = attack.buffs?.BasicAttackDMGBonus ?? 0;
        break;
      case "Heavy":
        attackTypeAttackBuff = attack.buffs?.HeavyAttackDMGBonus ?? 0;
        break;
      case "Skill":
        attackTypeAttackBuff = attack.buffs?.ResonanceSkillDMGBonus ?? 0;
        break;
      case "Liberation":
        attackTypeAttackBuff = attack.buffs?.ResonanceLiberationDMGBonus ?? 0;
        break;
      case "Echo":
        attackTypeAttackBuff = attack.buffs?.EchoDMGBonus ?? 0;
        break;
    }

    // get any element and attack type buffs too (e.g. Glacio)
    const instanceElementBuff = attack.buffs?.[attackElement] ?? 0;
    totalInstanceDmgBuff = attackTypeAttackBuff + instanceElementBuff;
  }
  // sometimes an attack will always crit, if so, make that instance have max CR
  if (attack?.alwaysCrit) {
    instanceDmgCritRate = 1;
  }

  let additiveMultiplierStacks = 0;
  let additiveMultiplierPercent = 0;
  // special additive handler for HeavySlashNightfallDMG
  if (attack.key === "HeavySlashNightfallDMG") {
    let { isEnabled, stacks } =
      context.global.characters?.[context.character.characterKey]?.buffs
        ?.HeavySlashNightfallBlazeStacks ?? {};
    // only apply these if it's enabled
    if (isEnabled) {
      if (!stacks) {
        stacks = 0;
      }
      additiveMultiplierStacks = stacks;
      const forteLevel =
        context.global.characters?.[context.character.characterKey]?.talents
          ?.forte ?? 10;
      const buffsList = context.character.chosenChar?.buffs ?? [];
      const foundBuff = buffsList.find(
        (buff: any) => buff.key === "HeavySlashNightfallBlazeStacks",
      );
      const modifierPercent =
        foundBuff?.modifiers?.[0]?.modifierValue?.[forteLevel] ?? 0;
      additiveMultiplierPercent = modifierPercent;
    }
  }
  let totalSpecialMultiplier = 0;
  let resonanceChainAttackSpecialMultiplierAttack =
    context.buffs.charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:specialMultiplier`
    ] ?? 0;
  let resonanceChainAttackSpecialMultiplier =
    context.buffs.charResonanceChainsData?.specialMultiplier ?? 0;
  let selfBuffAttackSpecialMultiplier =
    context.buffs.charBuffsData?.specificTalentBuffs?.[
      `${attack.key}:specialMultiplier`
    ] ?? 0;
  let customBuffAttackSpecialMultiplier =
    context.buffs.customBuffs?.SpecialMultiplier ?? 0;
  let actionBuffAttackSpecialMultiplier = attack?.buffs?.SpecialMultiplier ?? 0;
  // special case for CoreofCollapseDMG (requires 1+ havoc bane stacks) to get 100% specialMultiplier
  let coreofCollapseDMGSpecialMultiplier = 0;
  if (attack.key === "CoreofCollapseDMG") {
    if (Number(context.enemy.havocBane.havocBaneStacks) > 0) {
      coreofCollapseDMGSpecialMultiplier = 1;
    }
  }
  totalSpecialMultiplier +=
    resonanceChainAttackSpecialMultiplier +
    resonanceChainAttackSpecialMultiplierAttack +
    selfBuffAttackSpecialMultiplier +
    actionBuffAttackSpecialMultiplier +
    customBuffAttackSpecialMultiplier +
    coreofCollapseDMGSpecialMultiplier;
  // console.table({
  //   attack: attack.key,
  //   attackType,
  //   attackElement,
  //   talent,
  //   finalAtkDefHpVal,
  //   totalDefIgnore,
  //   totalSkillDmgBonus,
  //   specificSkillDmg,
  //   elementalDmgBonusDecimal,
  //   totalInstanceDmgBuff,
  //   totalDmgDeepen,
  //   totalResistReduction,
  //   instanceDmgCritRate,
  //   instanceDmgCritDMG,
  //   totalTalentModifierAdd,
  //   totalTalentModifierMultiply,
  //   totalTalentModifierSpecialMultiply,
  //   count,
  // });
  return calcDamage(
    String(context.character.characterLevel),
    context.enemy.enemyLevel,
    context.enemy.enemyResist,
    talent,
    finalAtkDefHpVal,
    totalDefIgnore,
    totalSkillDmgBonus,
    specificSkillDmg,
    elementalDmgBonusDecimal + totalInstanceDmgBuff,
    totalDmgDeepen,
    totalResistReduction,
    instanceDmgCritRate,
    instanceDmgCritDMG,
    totalTalentModifierAdd,
    totalTalentModifierMultiply,
    totalTalentModifierSpecialMultiply,
    count,
    attack.key,
    additiveMultiplierStacks,
    additiveMultiplierPercent,
    totalSpecialMultiplier,
    totalDefReduction,
  );
};

export const calcDamages = (context: CalculationContext) => {
  if (!context.character.chosenChar) return;

  // clone the list of attacks so it doesn't mutate the base character data
  // this makes it where we dont have to manage the list of attacks,
  // and the rotations list has its own list of echo set attacks to choose from
  const echoSetAttacks: any[] = [];
  // TODO: Makes this scalable and more maintainable
  // can wait for another echo set attack, so okay for now
  const hasEchoOutroAttack =
    context.equipment.echoStats?.EnableAttack === "MidnightVeil";
  const echoOutroAttackSetIndex = echoSetAttacks.findIndex(
    (attack) => attack.key === "MidnightVeilDMG",
  );
  if (echoOutroAttackSetIndex < 0 && hasEchoOutroAttack) {
    echoSetAttacks.push({
      key: "MidnightVeilDMG",
      label: "The Veil of Hidden Night DMG",
      talent: "480%",
      type: "Outro",
      element: "Havoc",
    });
  }

  // similar principle applies to utility attacks (e.g. Roccia passive)
  const utilityAttacks: any[] = [];
  // TODO: Makes this scalable and more maintainable
  let utilityAttacksFromTeamBuffs =
    context.buffs.teamBuffsData?.EnableAttack ?? [];
  // TODO: Exclude the attack if using exclude from team buffs
  const hasUtilityAttack = utilityAttacksFromTeamBuffs.includes(
    "InherentSkillSuperAttractiveMagicBox",
  );
  const alreadyHasUtilityAttackConfigured = utilityAttacks.findIndex(
    (attack) => attack.key === "InherentSkillSuperAttractiveMagicBox",
  );
  if (alreadyHasUtilityAttackConfigured < 0 && hasUtilityAttack) {
    utilityAttacks.push({
      key: "InherentSkillSuperAttractiveMagicBox",
      label: "Magic Box DMG",
      talent: "100%",
      type: "Utility",
      element: "Havoc",
    });
  }

  const allDamagesData: any = {
    basicAttacks: processAttacks(
      context.character.chosenChar.basicAttacks?.attacks,
      context,
      context.character.talentData.basic,
      false,
      false,
      true,
    ),
    skillAttacks: processAttacks(
      context.character.chosenChar.skillAttacks?.attacks,
      context,
      context.character.talentData.skill,
      false,
      false,
      true,
    ),
    liberationAttacks: processAttacks(
      context.character.chosenChar.liberationAttacks?.attacks,
      context,
      context.character.talentData.liberation,
      false,
      false,
      true,
    ),
    forteCircuitAttacks: processAttacks(
      context.character.chosenChar.forteCircuitAttacks?.attacks,
      context,
      context.character.talentData.forte,
      false,
      false,
      true,
    ),
    introAttacks: processAttacks(
      context.character.chosenChar.introAttacks?.attacks,
      context,
      context.character.talentData.intro,
      false,
      false,
      true,
    ),
    outroAttacks: processAttacks(
      context.character.chosenChar.outroAttacks?.attacks,
      context,
      context.character.talentData.intro, // TODO: What is this?
      true, // has no talent level
      false,
      true,
    ),
    tuneBreakAttacks: processAttacks(
      context.character.chosenChar.tuneBreakAttacks?.attacks,
      context,
      null, // tuneBreak doesn't use talentType
      true,
      false,
      true,
    ),
    echoSetAttacks: processAttacks(
      echoSetAttacks,
      context,
      context.character.talentData.intro, // TODO: What is this?
      true, // has no talent level
      false,
      true,
    ),
    utilityAttacks: processAttacks(
      utilityAttacks,
      context,
      context.character.talentData.intro, // TODO: What is this?
      true, // has no talent level
      false,
      true,
    ),
  };

  const elementalReactionsAttacks: any[] = [];
  // add any elemental effects
  if (
    context.enemy.spectroFrazzle.isSpectroFrazzleEnabled &&
    context.enemy.spectroFrazzle.spectroFrazzleStacks > 0
  ) {
    // get the MV based on stacks and character level
    const spectroFrazzleMv = getSpectroFrazzleModifierByLevelByStacks(
      String(context.character.characterLevel),
      context.enemy.spectroFrazzle.spectroFrazzleStacks,
    );
    if (spectroFrazzleMv) {
      const spectroFrazzleAttack = {
        key: "ElementalEffectSpectroFrazzle",
        label: "Spectro Frazzle",
        talent: spectroFrazzleMv,
        type: "ElementalEffect",
        element: "Spectro",
        subType: "SpectroFrazzle",
        stacks: context.enemy.spectroFrazzle.spectroFrazzleStacks,
      };
      // @ts-ignore
      elementalReactionsAttacks.push(spectroFrazzleAttack);
    }
  }
  if (
    context.enemy.aeroErosion.isAeroErosionEnabled &&
    context.enemy.aeroErosion.aeroErosionStacks > 0
  ) {
    // get the MV based on stacks and character level
    const aeroErosionMv = getAeroErosionModifierByLevelByStacks(
      String(context.character.characterLevel),
      context.enemy.aeroErosion.aeroErosionStacks,
    );
    if (aeroErosionMv) {
      // @ts-ignore
      const aeroErosionAttack = {
        key: "ElementalEffectAeroErosion",
        label: "Aero Erosion",
        talent: aeroErosionMv,
        type: "ElementalEffect",
        element: "Aero",
        subType: "AeroErosion",
        stacks: context.enemy.aeroErosion.aeroErosionStacks,
      };
      // @ts-ignore
      elementalReactionsAttacks.push(aeroErosionAttack);
    }
  }
  if (elementalReactionsAttacks.length > 0) {
    allDamagesData.elementalReactions = processAttacks(
      elementalReactionsAttacks,
      context,
      context.character.talentData.intro,
      true, // has no talent level
      false,
      true,
    );
  }
  let chosenEcho;
  if (context.equipment.mainEcho) {
    chosenEcho = getEchoData(context.equipment.mainEcho);
    const echoDmg = processAttacks(
      chosenEcho?.actions,
      context,
      context.equipment.mainEchoRank,
      false,
      false,
      true,
    );
    allDamagesData.echoAttacks = echoDmg;
  }

  if (context.rotationsList?.length) {
    const rotationData: any = [];
    context.rotationsList.forEach((rotation: any) => {
      const rotationInfo: any = {
        id: rotation.id,
        name: rotation.name,
        description: rotation.description,
        duration: rotation.duration ?? null,
        mainEcho: rotation.echo ?? null,
        mainEchoRank: rotation.echoRank ?? null,
      };
      const attacks = processAttacks(
        rotation.attacks,
        context,
        null,
        false,
        true,
        false,
      );
      // capture all damages
      const damageAggregation = {
        normalDamage: null,
        avgDamage: null,
        critDamage: null,
        healing: null,
        shield: null,
      };
      // go through all attacks and update our aggregation
      attacks.forEach((attack: any) => {
        if (attack?.originalIsEnabled === false) {
          return;
        }
        if (attack?.damage?.totalDamage !== undefined) {
          damageAggregation.normalDamage =
            (damageAggregation.normalDamage || 0) + attack?.damage?.totalDamage;
        }

        if (attack?.damage?.avgDamage !== undefined) {
          damageAggregation.avgDamage =
            (damageAggregation.avgDamage || 0) + attack?.damage?.avgDamage;
        }

        if (attack?.damage?.critDamage !== undefined) {
          damageAggregation.critDamage =
            (damageAggregation.critDamage || 0) + attack?.damage?.critDamage;
        }

        if (
          attack.type === "Healing" &&
          attack?.damage?.healAmount !== undefined
        ) {
          damageAggregation.healing =
            (damageAggregation.healing || 0) + attack?.damage?.healAmount;
        }

        if (
          attack.type === "Shield" &&
          attack?.damage?.shieldAmount !== undefined
        ) {
          damageAggregation.shield =
            (damageAggregation.shield || 0) + attack?.damage?.shieldAmount;
        }
      });
      rotationInfo.attacks = attacks;
      rotationInfo.mainEcho = rotation.mainEcho ?? null;
      rotationInfo.mainEchoRank = rotation.mainEchoRank ?? null;
      rotationInfo.damageAggregation = damageAggregation;
      rotationData.push(rotationInfo);
    });
    allDamagesData.rotations = rotationData;
  }

  return allDamagesData;
};

// In a new file: calculator/context.ts

interface CalculationContext {
  // Character base data
  character: {
    chosenChar: any;
    characterKey: string;
    characterLevel: string | number;
    baseStats: {
      baseHp: number;
      baseAtk: number;
      baseDef: number;
    };
    talentData: {
      basic: number;
      skill: number;
      forte: number;
      liberation: number;
      intro: number;
    };
  };

  // Equipment & Echoes
  equipment: {
    weapon: {
      attack: number;
      modifier: string | null;
      modifierValue: number;
      weaponPassiveStats: Record<string, any>;
    };
    echoStats: Record<string, any>;
    mainEcho: string;
    mainEchoRank: number;
  };

  // Buffs (grouped by source)
  buffs: {
    charBuffsData: Record<string, any>; // charBuffsData
    charResonanceChainsData: Record<string, any>; // charResonanceChainsData
    teamBuffsData: Record<string, any>; // teamBuffsData
    customBuffs: Record<string, any>; // customBuffs
  };

  // Computed stats (from calculateAllStats)
  stats: {
    totalAtk: number;
    totalHp: number;
    totalDef: number;
    totalCritRate: number;
    totalCritDMG: number;
    energyRegen: number;
    Glacio: number;
    Fusion: number;
    Electro: number;
    Aero: number;
    Spectro: number;
    Havoc: number;
    BasicAttackDMGBonus: number;
    HeavyAttackDMGBonus: number;
    ResonanceSkillDMGBonus: number;
    IntroSkillDMGBonus: number;
    OutroSkillDMGBonus: number;
    ResonanceLiberationDMGBonus: number;
    EchoDMGBonus: number;
    healingBonus: number;
    shieldBonus: number;
    DefIgnore: number;
    ResistReduction: number;
    TotalDeepenEffect: number;
  };

  // Enemy data
  enemy: {
    enemyLevel: number;
    enemyResist: number;
    enemyType: string;
    spectroFrazzle: {
      isSpectroFrazzleEnabled: boolean;
      spectroFrazzleStacks: number;
    };
    aeroErosion: {
      isAeroErosionEnabled: boolean;
      aeroErosionStacks: number;
    };
    havocBane: {
      havocBaneStacks: number;
    };
  };

  // Rotations
  rotationsList: any[];

  // Global data (for special cases)
  global: {
    characters: Record<string, any>;
  };
}
export const getCalculationContext = (
  chosenChar: any = {},
  echoStats: any = {},
  teamBuffsData: any = {},
  talentData: any = {},
  isSpectroFrazzleEnabled: any = false,
  spectroFrazzleStacks: any = 0,
  isAeroErosionEnabled: any = false,
  aeroErosionStacks: any = 0,
  characterLevel: any = 0,
  mainEcho: any = {},
  mainEchoRank: any = 5,
  rotationsList: any = [],
  charResonanceChainsData: any = {},
  charBuffsData: any = {},
  // additional state data needed for processAttacks
  baseHp: any = 0,
  baseAtk: any = 0,
  baseDef: any = 0,
  weaponData: any = {},
  customBuffs: any = {},
  Glacio: any = 0,
  Fusion: any = 0,
  Electro: any = 0,
  Aero: any = 0,
  Spectro: any = 0,
  Havoc: any = 0,
  totalDef: any = 0,
  totalHp: any = 0,
  energyRegen: any = 0,
  totalAtk: any = 0,
  BasicAttackDMGBonus: any = 0,
  HeavyAttackDMGBonus: any = 0,
  ResonanceSkillDMGBonus: any = 0,
  IntroSkillDMGBonus: any = 0,
  OutroSkillDMGBonus: any = 0,
  ResonanceLiberationDMGBonus: any = 0,
  EchoDMGBonus: any = 0,
  healingBonus: any = 0,
  shieldBonus: any = 0,
  totalCritRate: any = 0,
  totalCritDMG: any = 0,
  DefIgnore: any = 0,
  havocBaneStacks: any = 0,
  ResistReduction: any = 0,
  TotalDeepenEffect: any = 0,
  enemyLevel: any = 0,
  enemyResist: any = 0,
  characters: any = {},
  character: any = "",
  enemyType: string = "",
): CalculationContext => {
  return {
    character: {
      chosenChar,
      characterKey: character,
      characterLevel,
      baseStats: {
        baseHp,
        baseAtk,
        baseDef,
      },
      talentData: {
        basic: talentData.basic,
        skill: talentData.skill,
        forte: talentData.forte,
        liberation: talentData.liberation,
        intro: talentData.intro,
      },
    },

    // Equipment & Echoes
    equipment: {
      weapon: {
        attack: weaponData?.attack,
        modifier: weaponData?.modifier ?? null,
        modifierValue: weaponData?.modifierValue,
        weaponPassiveStats: weaponData?.weaponPassiveStats ?? {},
      },
      echoStats,
      mainEcho,
      mainEchoRank,
    },

    // Buffs (grouped by source)
    buffs: {
      charBuffsData, // charBuffsData
      charResonanceChainsData, // charResonanceChainsData
      teamBuffsData, // teamBuffsData
      customBuffs, // customBuffs
    },

    // Computed stats (from calculateAllStats)
    stats: {
      totalAtk,
      totalHp,
      totalDef,
      totalCritRate,
      totalCritDMG,
      energyRegen,
      Glacio,
      Fusion,
      Electro,
      Aero,
      Spectro,
      Havoc,
      BasicAttackDMGBonus,
      HeavyAttackDMGBonus,
      ResonanceSkillDMGBonus,
      IntroSkillDMGBonus,
      OutroSkillDMGBonus,
      ResonanceLiberationDMGBonus,
      EchoDMGBonus,
      healingBonus,
      shieldBonus,
      DefIgnore,
      ResistReduction,
      TotalDeepenEffect,
    },

    // Enemy data
    enemy: {
      enemyLevel,
      enemyResist,
      enemyType,
      spectroFrazzle: {
        isSpectroFrazzleEnabled,
        spectroFrazzleStacks,
      },
      aeroErosion: {
        isAeroErosionEnabled,
        aeroErosionStacks,
      },
      havocBane: {
        havocBaneStacks,
      },
    },

    // Rotations
    rotationsList,

    // Global data (for special cases)
    global: {
      characters,
    },
  };
};
