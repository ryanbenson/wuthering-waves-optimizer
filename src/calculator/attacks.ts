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
  talentType: any,
  hasNoTalentLevel: boolean = false,
  dynamicTalentType: boolean = false,
  excludeDisabledAttacks: boolean = true, // e.g. ones that are unlocked through chains should be hidden by default
  providedStats: any = null, // use this set of base stats instead of the global stats
  providedEchoStats: any = null, // use this set of echo stats instead of the global echo stats
  // all of the "state" data
  charResonanceChainsData: any = {},
  charBuffsData: any = {},
  talentData: any = {},
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
            charResonanceChainsData?.EnableAttack ?? [];
          const charBuffsEnabledAttacks = charBuffsData?.EnableAttack ?? [];
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
              talent = attack.talents[talentData.basic];
              break;
            case "skill":
              talent = attack.talents[talentData.skill];
              break;
            case "forteCircuit":
              talent = attack.talents[talentData.forte];
              break;
            case "liberation":
              talent = attack.talents[talentData.liberation];
              break;
            case "intro":
              talent = attack.talents[talentData.intro];
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
          charResonanceChainsData?.specificTalentBuffs?.[
            `${attack.key}:talentTypeOverride`
          ] ?? null;
        const attackTypeOverrideSelfBuff =
          charBuffsData?.specificTalentBuffs?.[
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
  talentType: any,
  hasNoTalentLevel: boolean = false,
  hasDynamicTalent: boolean = false,
  count: number = 1,
  providedFullStats: any = null, // use this as our stats data, otherwise default to the global stats, this should exclude personal buffs, weapon buffs, chain buffs, custom buffs, team buffs. The only things to use are attack-level buffs
  providedEchoStats: any = null, // use this as our echo buffs instead of the global echo buffs
  providedTalent: any = null, // use this talent string if provided, mostly used for echo attacks in, rotations
  // state data
  baseHp: any = 0,
  baseAtk: any = 0,
  baseDef: any = 0,
  weaponData: any = {},
  charBuffsData: any = {},
  charResonanceChainsData: any = {},
  echoStats: any = {},
  customBuffs: any = {},
  teamBuffsData: any = {},
  chosenChar: any = {},
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
  talentData: any = {},
  totalCritRate: any = 0,
  totalCritDMG: any = 0,
  DefIgnore: any = 0,
  havocBaneStacks: any = 0,
  ResistReduction: any = 0,
  TotalDeepenEffect: any = 0,
  characterLevel: any = 0,
  enemyLevel: any = 0,
  enemyResist: any = 0,
  characters: any = {},
  character: any = "",
  enemyType: string = "",
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
      providedEchoStats,
      null,
      {
        baseHp: baseHp,
        baseAtk: baseAtk,
        baseDef: baseDef,
      },
      {
        weaponAtk: weaponData?.attack,
        weaponModifier: weaponData?.modifier,
        weaponModifierValue: weaponData?.modifierValue,
        weaponPassiveData: weaponData?.weaponPassiveStats ?? {},
      },
      charBuffsData,
      charResonanceChainsData,
      echoStats,
      customBuffs,
      teamBuffsData,
    );
  }
  let attackType = attack.type;
  const selfBuffs = JSON.parse(JSON.stringify(charBuffsData ?? {}));
  /**
   * check if there are any buffs that buff another buff
   * look through the object of charResonanceChainsData for any ${attack.key}:MultiplySelfBuffs
   * and apply them to the selfBuffs object. it will be in specificTalentBuffs
   * { specificTalentBuffs: { PoeticEssenceSkillDMG:MultiplySelfBuff: 2 } }
   */
  const resonanceChainsKeys = Object.keys(
    charResonanceChainsData?.specificTalentBuffs ?? {},
  );
  const resonanceChainsKeysWithMultiply = resonanceChainsKeys.filter(
    (key: string) => key.includes("MultiplySelfBuff"),
  );
  if (resonanceChainsKeysWithMultiply.length > 0) {
    resonanceChainsKeysWithMultiply.forEach((key: string) => {
      const buffValue = charResonanceChainsData?.specificTalentBuffs?.[key];
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
    charResonanceChainsData?.specificTalentBuffs?.[
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
  const attackElement = attack?.element ?? chosenChar?.basic?.element;
  let elementalDmgBonusDecimal = getElementDmgBonusByType(
    attackElement,
    statsWithoutTeamBuffs ?? providedFullStats,
    {
      Glacio: Glacio,
      Fusion: Fusion,
      Electro: Electro,
      Aero: Aero,
      Spectro: Spectro,
      Havoc: Havoc,
    },
  );
  const atkDefHpVal = getDamageValByAttr(
    attack?.attribute,
    statsWithoutTeamBuffs ?? providedFullStats,
    {
      totalDef: totalDef,
      totalHp: totalHp,
      energyRegen: energyRegen,
      totalAtk: totalAtk,
    },
  );
  let totalSkillDmgBonus = getDamageTypeBonusByType(
    attackType,
    statsWithoutTeamBuffs ?? providedFullStats,
    {
      BasicAttackDMGBonus: BasicAttackDMGBonus,
      HeavyAttackDMGBonus: HeavyAttackDMGBonus,
      ResonanceSkillDMGBonus: ResonanceSkillDMGBonus,
      IntroSkillDMGBonus: IntroSkillDMGBonus,
      OutroSkillDMGBonus: OutroSkillDMGBonus,
      ResonanceLiberationDMGBonus: ResonanceLiberationDMGBonus,
      EchoDMGBonus: EchoDMGBonus,
      healingBonus: healingBonus,
      shieldBonus: shieldBonus,
    },
  );
  let talent;
  let talentTree = attack?.talents;

  // see if we have a talent modifier replacement to override the talent value
  const talentModifierReplace =
    charResonanceChainsData?.specificTalentBuffs?.[
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
        talent = talentTree[talentData.basic];
        break;
      case "skill":
        talent = talentTree[talentData.skill];
        break;
      case "forteCircuit":
      case "forte":
        talent = talentTree[talentData.forte];
        break;
      case "liberation":
        talent = talentTree[talentData.liberation];
        break;
      case "intro":
        talent = talentTree[talentData.intro];
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
    charResonanceChainsData?.[attack.key] ?? 0;
  // flat adding to the base multiplier for a specific attack
  const talentModifierAddFromResonanceChainsAdd =
    charResonanceChainsData?.specificTalentBuffs?.[
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
    charResonanceChainsData?.specificTalentBuffs?.[attack.key] ?? 0;
  // apply echo based coordianted dmg bonus (both echo set and main echo)
  // as well as custom buffs for coordinated attacks
  let coordinatedEchoDmgBonus = 0;
  let coordinatedDmgBonusCustomBuffs = 0;
  // get the coordinated dmg bonus from provided stats, but ignore custom buffs
  // if we have provided stats
  if (attack?.subType === "Coordinated") {
    coordinatedEchoDmgBonus =
      providedFullStats?.coordinatedDmgBonus ||
      echoStats?.CoordinatedDMGBonus ||
      0;
    if (!providedFullStats) {
      coordinatedDmgBonusCustomBuffs = customBuffs?.CoordinatedDMGBonus ?? 0;
    }
  }
  // there are bonuses that are based on Max HP, Max ATK, Max DEF
  // we end up with DMG Bonus %, so we also / 100 in the end
  const specificSkillDmgFromResonanceChainsBasedOnMaxHp =
    charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:DMGBonus:MaxHP`
    ] ?? 0;
  const specificSkillDmgFromResonanceChainsBasedOnMaxAtk =
    charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:DMGBonus:MaxAtk`
    ] ?? 0;
  const specificSkillDmgFromResonanceChainsBasedOnMaxDef =
    charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:DMGBonus:MaxDef`
    ] ?? 0;
  const specificSkillDmgFromResonanceChainsBasedOnMaxHpVal =
    (totalHp * specificSkillDmgFromResonanceChainsBasedOnMaxHp) / 100;
  const specificSkillDmgFromResonanceChainsBasedOnMaxAtkVal =
    (totalAtk * specificSkillDmgFromResonanceChainsBasedOnMaxAtk) / 100;
  const specificSkillDmgFromResonanceChainsBasedOnMaxDefVal =
    (totalDef * specificSkillDmgFromResonanceChainsBasedOnMaxDef) / 100;
  // end max buff handlers
  const specificSkillDmgFromCharBuffs =
    selfBuffs?.specificTalentBuffs?.[attack.key] ?? 0;
  const specificSkillDmgFromCharBuffsDmgBonus =
    selfBuffs?.specificTalentBuffs?.[`${attack.key}:DMGBonus`] ?? 0;
  const specificSkillDmgFromCharBuffsWithElement =
    selfBuffs?.specificTalentBuffs?.[`${attack.key}:${attackElement}`] ?? 0;
  const specificSkillDmgFromEchoes =
    echoStats?.specificTalentBuffs?.[attack.key] ?? 0;
  const genericSkillDmgBonusResChain = charResonanceChainsData?.DMGBonus ?? 0;
  const genericSkillDmgBonusSelfBuff = selfBuffs?.DMGBonus ?? 0;
  let genericSkillDmgBonusWeaponBuff =
    weaponData?.weaponPassiveStats?.DMGBonus ?? 0;
  if (excludeWeaponBuffs) {
    genericSkillDmgBonusWeaponBuff = 0;
  }
  let genericSkillDmgBonusEchoBuff =
    providedFullStats?.dmgBonus || echoStats?.DMGBonus || 0;
  let genericSkillDmgBonusTeamEchoBuff = teamBuffsData?.DMGBonus ?? 0;
  if (excludeTeamBuffs) {
    genericSkillDmgBonusTeamEchoBuff = 0;
  }
  const extraDefIgnoreResonanceChain =
    charResonanceChainsData?.specificTalentBuffs?.[`${attack.key}:DEFIgnore`] ??
    0;
  const extraDefIgnoreCharBuff =
    selfBuffs?.specificTalentBuffs?.[`${attack.key}:DEFIgnore`] ?? 0;
  let extraDefIgnoreCustomBuffs = customBuffs?.DefIgnore ?? 0;
  if (providedFullStats) {
    extraDefIgnoreCustomBuffs = 0;
  }
  const attackBuffsDefIgnore = attack?.buffs?.DefIgnore ?? 0;
  let weaponDefIgnoreSpecificDmgType =
    weaponData?.weaponPassiveStats?.[`DEFIgnore:${attack.type}`] ?? 0;
  if (excludeWeaponBuffs) {
    weaponDefIgnoreSpecificDmgType = 0;
  }
  const specificSkillExtraCritRate =
    charResonanceChainsData?.specificTalentBuffs?.[`${attack.key}:CritRate`] ??
    0;
  let echoSpecificAttackTypeCritRate = 0;
  if (providedEchoStats) {
    echoSpecificAttackTypeCritRate =
      providedEchoStats?.[`CritRate:${attack.type}`] ?? 0;
  } else {
    echoSpecificAttackTypeCritRate =
      echoStats?.[`CritRate:${attack.type}`] ?? 0;
  }
  // need to divide by 100 since the echo data is flul numbers
  // but we're injecting it to the calcs which is decimal based
  echoSpecificAttackTypeCritRate = echoSpecificAttackTypeCritRate / 100;
  const specificSkillExtraCritDMG =
    charResonanceChainsData?.specificTalentBuffs?.[`${attack.key}:CritDMG`] ??
    0;
  const selfBuffsSpecificSkillExtraCritDMG =
    selfBuffs.specificTalentBuffs?.[`${attack.key}:CritDMG`] ?? 0;
  const baseCritRate = providedFullStats?.totalCritRate || totalCritRate;
  let instanceDmgCritRate =
    baseCritRate + specificSkillExtraCritRate + echoSpecificAttackTypeCritRate;
  if (excludeTeamBuffs) {
    instanceDmgCritRate = statsWithoutTeamBuffs?.totalCritRate ?? 0;
    instanceDmgCritRate += specificSkillExtraCritRate;
  }
  const baseCritDamage = providedFullStats?.totalCritDMG || totalCritDMG;
  let instanceDmgCritDMG =
    baseCritDamage +
    specificSkillExtraCritDMG +
    selfBuffsSpecificSkillExtraCritDMG;
  if (excludeTeamBuffs) {
    instanceDmgCritDMG = statsWithoutTeamBuffs?.totalCritDMG ?? 0;
    instanceDmgCritDMG += specificSkillExtraCritDMG;
  }
  const talentModifierMultiply =
    charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:talentModifierMultiply`
    ] ?? 0;
  const talentModifierMultiplySelfBuff =
    selfBuffs?.specificTalentBuffs?.[`${attack.key}:talentModifierMultiply`] ??
    0;
  const talentModifierMultiplyAttackBuff =
    attack?.buffs?.talentModifierMultiply ?? 0;
  const currentDefIgnore = providedFullStats?.DefIgnore || DefIgnore || 0;
  const totalDefIgnore =
    currentDefIgnore +
    extraDefIgnoreResonanceChain +
    extraDefIgnoreCharBuff +
    extraDefIgnoreCustomBuffs +
    attackBuffsDefIgnore +
    weaponDefIgnoreSpecificDmgType;
  // Def Reduction
  // Havoc bane reduces def for stack * 2%
  const havocBaneStacksNum = havocBaneStacks ?? 0;
  const havocBaneDefReduction = havocBaneStacksNum * 0.02;
  const attackDefReduction = attack?.buffs?.DefReduction ?? 0;
  const customBuffDefReduction = customBuffs?.DefReduction ?? 0;
  const totalDefReduction =
    havocBaneDefReduction + attackDefReduction + customBuffDefReduction;
  // apply specific ForteBased buff
  const originalForte = getOriginalForteFromAttackKey(
    chosenChar.value,
    attack.key,
  );
  let totalForteBasedDmgBuff =
    echoStats?.value?.[`ForteBased:${originalForte}:${attack.type}`] ?? 0;
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
    totalForteBasedDmgBuff;

  // Resist Shred:
  let teamBuffResistShredForCharElement =
    teamBuffsData?.[`ResistShred:${attackElement}`] ?? 0;
  let selfBuffResistShredForCharElement =
    selfBuffs?.[`ResistShred:${attackElement}`] ?? 0;
  let selfBuffResistShredForCharElementSpecificAttack =
    selfBuffs?.specificTalentBuffs?.[
      `${attack.key}:ResistShred:${attackElement}`
    ] ?? 0;
  let weaponBuffResistShredForCharElement =
    weaponData?.weaponPassiveStats?.[`ResistShred:${attackElement}`] ?? 0;
  if (excludeWeaponBuffs) {
    weaponBuffResistShredForCharElement = 0;
  }
  if (excludeTeamBuffs) {
    teamBuffResistShredForCharElement = 0;
  }

  const resonanceChainResistShredForCharElement =
    charResonanceChainsData?.[`ResistShred:${attackElement}`] ?? 0;
  const baseResistReduction =
    providedFullStats?.resistReduction || ResistReduction || 0;
  let customResistReduction = customBuffs?.ResistShred ?? 0;
  if (providedFullStats) {
    customResistReduction = 0;
  }
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
    providedFullStats?.totalDeepenEffect || TotalDeepenEffect || 0;
  // so far damage deepen is from team buffs, add more later if needed
  // get element first, then any skill specific ones next, then add together
  // NOTE: all outro attacks cannot use the DMGDeepen:element|attackType
  // as they expire before the outro attacks occur. so ignore these
  // for outro attacks
  // self subtype dmg deepen
  let selfBuffDmgDeepenForSubType =
    charBuffsData?.[`DMGDeepen:${attack.subType}`] ?? 0;
  let selfBuffDmgDeepenForType =
    charBuffsData?.[`DMGDeepen:${attackType}`] ?? 0;
  let selfBuffDmgDeepenForElement =
    charBuffsData?.[`DMGDeepen:${attackElement}`] ?? 0;
  let teamBuffDmgDeepenForCharElement =
    teamBuffsData?.[`DMGDeepen:${attackElement}`] ?? 0;
  let teamBuffDmgDeepenForAttackType =
    teamBuffsData?.[`DMGDeepen:${attackType}`] ?? 0;
  let teamBuffDmgDeepenForSubType =
    teamBuffsData?.[`DMGDeepen:${attack.subType}`] ?? 0;
  const selfBuffSpecificAttackGenericDmgDeepen =
    selfBuffs?.specificTalentBuffs?.[`${attack.key}:DMGDeepen`] ?? 0;
  const resonanceChainBuffSpecificAttackGenericDmgDeepen =
    charResonanceChainsData?.specificTalentBuffs?.[`${attack.key}:DMGDeepen`] ??
    0;
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
  const customDamageDeepen = customBuffs?.DamageAmplify ?? 0;
  let resonanceChainDmgDeepenForAttackType =
    charResonanceChainsData?.[`DMGDeepen:${attackType}`] ?? 0;
  let resonanceChainDmgDeepenForAttackSubType =
    charResonanceChainsData?.[`DMGDeepen:${attack.subType}`] ?? 0;
  let weaponBuffDmgDeepenElement =
    weaponData?.weaponPassiveStats?.[`DMGDeepen:${attackElement}`] ?? 0;
  let weaponBuffDmgDeepenSubType =
    weaponData?.weaponPassiveStats?.[`DMGDeepen:${attack.subType}`] ?? 0;
  let weaponBuffDmgDeepenType =
    weaponData?.weaponPassiveStats?.[`DMGDeepen:${attackType}`] ?? 0;
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
    charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:talentModifierSpecialMultiply`
    ] ?? 0;
  let totalTalentModifierSpecialMultiply =
    talentModifierSpecialMultiplyResChains;
  // check for any modifiers that change the individual instance of atk/hp/def
  // re-calculate the base for this specific instance of damage
  let modifyBaseAtk =
    selfBuffs?.specificTalentBuffs?.[`${attack.key}:ATK`] ?? 0;
  let modifyBaseAtkResChain =
    charResonanceChainsData?.specificTalentBuffs?.[`${attack.key}:ATK`] ?? 0;
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
        baseHp: baseHp,
        baseAtk: baseAtk,
        baseDef: baseDef,
      },
      {
        weaponAtk: weaponData?.attack,
        weaponModifier: weaponData?.modifier,
        weaponModifierValue: weaponData?.modifierValue,
        weaponPassiveData: weaponData?.weaponPassiveStats ?? {},
      },
      charBuffsData,
      charResonanceChainsData,
      echoStats,
      customBuffs,
      teamBuffsData,
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
        baseHp: baseHp,
        baseAtk: baseAtk,
        baseDef: baseDef,
      },
      {
        weaponAtk: weaponData?.attack,
        weaponModifier: weaponData?.modifier,
        weaponModifierValue: weaponData?.modifierValue,
        weaponPassiveData: weaponData?.weaponPassiveStats ?? {},
      },
      charBuffsData,
      charResonanceChainsData,
      echoStats,
      customBuffs,
      teamBuffsData,
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
        baseHp: baseHp,
        baseAtk: baseAtk,
        baseDef: baseDef,
      },
      {
        weaponAtk: weaponData?.attack,
        weaponModifier: weaponData?.modifier,
        weaponModifierValue: weaponData?.modifierValue,
        weaponPassiveData: weaponData?.weaponPassiveStats ?? {},
      },
      charBuffsData,
      charResonanceChainsData,
      echoStats,
      customBuffs,
      teamBuffsData,
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
    if (attack.key === "TuneRuptureResponseSpectralAnalysisDMG") {
      talent = attack.talents[talentData?.forte];
      enemyResistVal = enemyResist.value;
      resistReduction = totalResistReduction;
    }
    // get any custom base character tune break boost
    baseTuneBreakBoost = chosenChar.value?.basic?.tuneBreakBoost ?? 0;
    const tuneBreakBoostSelf = selfBuffs?.tuneBreakBoost ?? 0;
    const tuneBreakBoostTeam = teamBuffsData.value?.tuneBreakBoost ?? 0;
    const totalTuneBreakBoost =
      baseTuneBreakBoost + tuneBreakBoostSelf + tuneBreakBoostTeam;
    const tuneBreakDmgBonus = customBuffs.value?.TuneBreakDMGBonus ?? 0;
    return calcTuneBreak(
      talent,
      characterLevel.value,
      enemyLevel.value,
      enemyResistVal,
      enemyType.value,
      resistReduction,
      totalDefIgnore,
      totalTuneBreakBoost, // tuneBreakBoost
      tuneBreakDmgBonus, // tune break bonusDmg (e.g. Hyvatia's 100% bonus)
      count,
    );
  }

  // set the multiplier hard set here
  // talentModifierMultiplySetValue
  const talentModifierMultiplySet =
    charResonanceChainsData?.specificTalentBuffs?.[
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
      weaponData?.weaponPassiveStats?.["DMGDeepen:SpectroFrazzle"] ?? 0;
    if (excludeWeaponBuffs) {
      spectroFrazzleDeepenWeaponBuffs = 0;
    }
    let spectroFrazzleDeepenTeamBuffs =
      teamBuffsData?.["DMGDeepen:SpectroFrazzle"] ?? 0;
    if (excludeTeamBuffs) {
      spectroFrazzleDeepenTeamBuffs = 0;
    }
    const spectroFrazzleDeepenSelfBuffs =
      selfBuffs?.["DMGDeepen:SpectroFrazzle"] ?? 0;
    const spectroFrazzleDeepenResonanceChains =
      charResonanceChainsData?.["DMGDeepen:SpectroFrazzle"] ?? 0;
    totalSpectroFrazzleDeepen =
      spectroFrazzleDeepenWeaponBuffs +
      spectroFrazzleDeepenTeamBuffs +
      spectroFrazzleDeepenSelfBuffs +
      spectroFrazzleDeepenResonanceChains;
    if (attack?.subType === "SpectroFrazzle") {
      const elementalEffectDmg = getSpectroFrazzleDamage(
        attack.talent,
        attack?.stacks ?? 0,
        characterLevel,
        enemyLevel,
        enemyResist,
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
      weaponData?.weaponPassiveStats?.["DMGDeepen:AeroErosion"] ?? 0;
    if (excludeWeaponBuffs) {
      aeroErosionDeepenWeaponBuffs = 0;
    }
    let aeroErosionDeepenTeamBuffs =
      teamBuffsData?.["DMGDeepen:AeroErosion"] ?? 0;
    if (excludeTeamBuffs) {
      aeroErosionDeepenTeamBuffs = 0;
    }
    const aeroErosionDeepenSelfBuffs =
      selfBuffs?.["DMGDeepen:AeroErosion"] ?? 0;
    const specificAeroErosionDeepenSelfBuffs =
      selfBuffs?.specificTalentBuffs?.["AeroErosion:DMGDeepen:AeroErosion"] ??
      0;
    const aeroErosionDeepenResonanceChains =
      charResonanceChainsData?.["DMGDeepen:AeroErosion"] ?? 0;
    totalAeroErosionDeepen =
      aeroErosionDeepenWeaponBuffs +
      aeroErosionDeepenTeamBuffs +
      aeroErosionDeepenSelfBuffs +
      aeroErosionDeepenResonanceChains +
      specificAeroErosionDeepenSelfBuffs;
    const elementalEffectDmg = getAeroErosionDamage(
      attack.talent,
      attack?.stacks ?? 0,
      characterLevel,
      enemyLevel,
      enemyResist,
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
      charResonanceChainsData?.specificTalentBuffs?.[
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
      characters?.[character]?.buffs?.HeavySlashNightfallBlazeStacks ?? {};
    // only apply these if it's enabled
    if (isEnabled) {
      if (!stacks) {
        stacks = 0;
      }
      additiveMultiplierStacks = stacks;
      const forteLevel = characters?.[character]?.talents?.forte ?? 10;
      const buffsList = chosenChar?.buffs ?? [];
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
    charResonanceChainsData?.specificTalentBuffs?.[
      `${attack.key}:specialMultiplier`
    ] ?? 0;
  let resonanceChainAttackSpecialMultiplier =
    charResonanceChainsData?.specialMultiplier ?? 0;
  let selfBuffAttackSpecialMultiplier =
    charBuffsData?.specificTalentBuffs?.[`${attack.key}:specialMultiplier`] ??
    0;
  let customBuffAttackSpecialMultiplier = customBuffs?.SpecialMultiplier ?? 0;
  let actionBuffAttackSpecialMultiplier = attack?.buffs?.SpecialMultiplier ?? 0;
  // special case for CoreofCollapseDMG (requires 1+ havoc bane stacks) to get 100% specialMultiplier
  let coreofCollapseDMGSpecialMultiplier = 0;
  if (attack.key === "CoreofCollapseDMG") {
    if (Number(havocBaneStacks) > 0) {
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
    characterLevel,
    enemyLevel,
    enemyResist,
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

export const calcDamages = (
  chosenChar: any = {},
  echoStats: any = {},
  teamBuffsData: any = {},
  talentData: any = {},
  isSpectroFrazzleEnabled: any = false,
  spectroFrazzleStacks: any = 0,
  isMissingSpectroData: any = false,
  isAeroErosionEnabled: any = false,
  aeroErosionStacks: any = 0,
  isMissingAeroErosionData: any = false,
  characterLevel: any = 0,
  mainEcho: any = {},
  mainEchoRank: any = 5,
  rotationsList: any = [],
  charResonanceChainsData: any = {},
  charBuffsData: any = {},
) => {
  if (!chosenChar) return;

  // clone the list of attacks so it doesn't mutate the base character data
  // this makes it where we dont have to manage the list of attacks,
  // and the rotations list has its own list of echo set attacks to choose from
  const echoSetAttacks: any[] = [];
  // TODO: Makes this scalable and more maintainable
  // can wait for another echo set attack, so okay for now
  const hasEchoOutroAttack = echoStats?.EnableAttack === "MidnightVeil";
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
  let utilityAttacksFromTeamBuffs = teamBuffsData?.EnableAttack ?? [];
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
      chosenChar.basicAttacks?.attacks,
      talentData.basic,
      false,
      false,
      true,
      {},
      {},
      charResonanceChainsData.value,
      charBuffsData.value,
      talentData.value,
    ),
    skillAttacks: processAttacks(
      chosenChar.skillAttacks?.attacks,
      talentData.skill,
      false,
      false,
      true,
      {},
      {},
      charResonanceChainsData.value,
      charBuffsData.value,
      talentData.value,
    ),
    liberationAttacks: processAttacks(
      chosenChar.liberationAttacks?.attacks,
      talentData.liberation,
      false,
      false,
      true,
      {},
      {},
      charResonanceChainsData.value,
      charBuffsData.value,
      talentData.value,
    ),
    forteCircuitAttacks: processAttacks(
      chosenChar.forteCircuitAttacks?.attacks,
      talentData.forte,
      false,
      false,
      true,
      {},
      {},
      charResonanceChainsData.value,
      charBuffsData.value,
      talentData.value,
    ),
    introAttacks: processAttacks(
      chosenChar.introAttacks?.attacks,
      talentData.intro,
      false,
      false,
      true,
      {},
      {},
      charResonanceChainsData.value,
      charBuffsData.value,
      talentData.value,
    ),
    outroAttacks: processAttacks(
      chosenChar.outroAttacks?.attacks,
      talentData.intro, // TODO: What is this?
      true, // has no talent level
      false,
      true,
      {},
      {},
      charResonanceChainsData.value,
      charBuffsData.value,
      talentData.value,
    ),
    tuneBreakAttacks: processAttacks(
      chosenChar.tuneBreakAttacks?.attacks,
      talentData.tuneBreak,
      true,
      false,
      true,
      {},
      {},
      charResonanceChainsData.value,
      charBuffsData.value,
      talentData.value,
    ),
    echoSetAttacks: processAttacks(
      echoSetAttacks,
      talentData.intro, // TODO: What is this?
      true, // has no talent level
      false,
      true,
      {},
      {},
      charResonanceChainsData.value,
      charBuffsData.value,
      talentData.value,
    ),
    utilityAttacks: processAttacks(
      utilityAttacks,
      talentData.intro, // TODO: What is this?
      true, // has no talent level
      false,
      true,
      {},
      {},
      charResonanceChainsData.value,
      charBuffsData.value,
      talentData.value,
    ),
  };

  const elementalReactionsAttacks = [];
  // add any elemental effects
  if (isSpectroFrazzleEnabled && spectroFrazzleStacks > 0) {
    isMissingSpectroData = false;
    // get the MV based on stacks and character level
    const spectroFrazzleMv = getSpectroFrazzleModifierByLevelByStacks(
      characterLevel,
      spectroFrazzleStacks,
    );
    // TODO: this needs to surface to the app
    if (!spectroFrazzleMv) {
      isMissingSpectroData = true;
    }
    if (spectroFrazzleMv) {
      const spectroFrazzleAttack = {
        key: "ElementalEffectSpectroFrazzle",
        label: "Spectro Frazzle",
        talent: spectroFrazzleMv,
        type: "ElementalEffect",
        element: "Spectro",
        subType: "SpectroFrazzle",
        stacks: spectroFrazzleStacks,
      };
      elementalReactionsAttacks.push(spectroFrazzleAttack);
    }
  }
  if (isAeroErosionEnabled && aeroErosionStacks > 0) {
    isMissingAeroErosionData = false;
    // get the MV based on stacks and character level
    const aeroErosionMv = getAeroErosionModifierByLevelByStacks(
      characterLevel,
      aeroErosionStacks,
    );
    // TODO: this needs to surface to the app
    if (!aeroErosionMv) {
      isMissingAeroErosionData = true;
    }
    if (aeroErosionMv) {
      const aeroErosionAttack = {
        key: "ElementalEffectAeroErosion",
        label: "Aero Erosion",
        talent: aeroErosionMv,
        type: "ElementalEffect",
        element: "Aero",
        subType: "AeroErosion",
        stacks: aeroErosionStacks,
      };
      elementalReactionsAttacks.push(aeroErosionAttack);
    }
  }
  if (elementalReactionsAttacks.length > 0) {
    allDamagesData.elementalReactions = processAttacks(
      elementalReactionsAttacks,
      talentData.intro,
      true, // has no talent level
      false,
      true,
      {},
      {},
      charResonanceChainsData.value,
      charBuffsData.value,
      talentData.value,
    );
  }
  let chosenEcho;
  if (mainEcho) {
    chosenEcho = getEchoData(mainEcho);
    const echoDmg = processAttacks(
      chosenEcho?.actions,
      mainEchoRank,
      false,
      false,
      true,
      {},
      {},
      charResonanceChainsData.value,
      charBuffsData.value,
      talentData.value,
    );
    allDamagesData.echoAttacks = echoDmg;
  }

  if (rotationsList?.length) {
    const rotationData: any = [];
    rotationsList.forEach((rotation: any) => {
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
        null,
        false,
        true,
        false,
        {},
        {},
        charResonanceChainsData.value,
        charBuffsData.value,
        talentData.value,
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
