// Import necessary functions and types
import { getAttackData } from "../characters/characters";
import { getCombinedEchoStats } from "../echoes/stats";
import { getSetsFromEchoes, getSetBonusEffects } from "../echoes/sets";
import {
  calcCharStats,
  computeSelfBuffs,
  computeResonanceChainsBuffs,
  computeAdditionalBaseBuffs,
  computeCritOverflowBuffs,
} from "../calculator/stats";
import { processAttacks, getCalculationContext } from "../calculator/attacks";
import { resolveRotationActionToAttackData } from "../calculator/resolveRotationAction";
import { randomString } from "../utils/strings";
import { meetsMinStatThreshold } from "./meetsMinStatThreshold";

/** Echo cost as a number (coerced). Non-numeric types must not participate in `+` with numbers (string concat bugs). */
function echoCost(echo: { type?: unknown }): number {
  const n = Number(echo?.type);
  return Number.isFinite(n) ? n : 0;
}

function echoOptimizerSignature(echo: any): string {
  if (!echo) return "";

  return [
    echo.echo ?? "",
    echo.echoSet ?? "",
    echo.type ?? "",
    echo.rank ?? "",
    echo.stat ?? "",
    echo.echoSubStatsType1 ?? "",
    echo.echoSubStatsValue1 ?? "",
    echo.echoSubStatsType2 ?? "",
    echo.echoSubStatsValue2 ?? "",
    echo.echoSubStatsType3 ?? "",
    echo.echoSubStatsValue3 ?? "",
    echo.echoSubStatsType4 ?? "",
    echo.echoSubStatsValue4 ?? "",
    echo.echoSubStatsType5 ?? "",
    echo.echoSubStatsValue5 ?? "",
  ]
    .map(String)
    .join(":");
}

export function normalizeOptimizerLoadout(loadout: any[]): any[] {
  if (!Array.isArray(loadout) || loadout.length <= 1) {
    return loadout;
  }

  const [mainEcho, ...otherEchoes] = loadout;
  return [
    mainEcho,
    ...otherEchoes
      .slice()
      .sort((a, b) =>
        echoOptimizerSignature(a).localeCompare(echoOptimizerSignature(b)),
      ),
  ];
}

export function getOptimizerLoadoutKey(loadout: any[]): string {
  const normalizedLoadout = normalizeOptimizerLoadout(loadout);
  return normalizedLoadout.map(echoOptimizerSignature).join("|");
}

export function* generateLoadouts(
  echoes: any,
  mainEchoKeys = [],
  start = 0,
  combo = [],
  cost = 0,
  usedEchoIds = new Set(),
  usedEchoes = new Set(),
): any {
  // If we have main echo keys and combo is empty, we need to start with one of those
  if (mainEchoKeys.length > 0 && combo.length === 0) {
    // Find all echoes that match the main echo keys
    // @ts-ignore
    const mainEchoCopies = echoes.filter((e) => mainEchoKeys.includes(e.echo));

    // For each copy of the main echo, start a new combination
    for (const mainEcho of mainEchoCopies) {
      // the main echo isn't guaranteed to be 4, sometimes it's an elite, so 3
      const nextCost = cost + echoCost(mainEcho);
      if (nextCost <= 12) {
        // Create a fresh usedEchoIds Set for each main echo group
        const groupUsedEchoIds = new Set([mainEcho.echoId]);
        // add the main echo to the list of echoes already used so we dont try to use
        // another copy of the same echo
        const groupUsedEchoes = new Set([mainEcho.echo]);
        yield* generateLoadouts(
          echoes,
          mainEchoKeys,
          0,
          // @ts-ignore
          [mainEcho],
          nextCost,
          groupUsedEchoIds,
          groupUsedEchoes,
        );
      }
    }
    return;
  }

  // Any non-empty loadout with ≤5 echoes and total cost ≤12 is valid (cost may be under 12 even with
  // all five slots filled; it only must not exceed the 12 budget).
  if (combo.length > 0 && combo.length <= 5 && cost <= 12) {
    yield combo;
  }

  // Stop exploring if combo already too big
  if (combo.length === 5 || cost >= 12) return;

  // If we have main echo keys and combo is empty, we've already handled the first slot
  if (mainEchoKeys.length > 0 && combo.length === 0) return;

  for (let i = start; i < echoes.length; i++) {
    const next = echoes[i];
    // Skip if already used
    if (usedEchoIds.has(next.echoId)) continue;
    // Skip if the echo has
    if (usedEchoes.has(next.echo)) continue;

    const nextCost = cost + echoCost(next);
    if (nextCost <= 12) {
      // Add to used set instead of filtering
      usedEchoIds.add(next.echoId);
      // Add the echo key instead of filtering
      usedEchoes.add(next.echo);
      // @ts-ignore
      combo.push(next); // Mutate instead of creating new array
      yield* generateLoadouts(
        echoes,
        mainEchoKeys,
        i + 1, // Can keep original index since we're not filtering
        combo,
        nextCost,
        usedEchoIds,
        usedEchoes,
      );
      combo.pop(); // Backtrack
      usedEchoIds.delete(next.echoId); // Backtrack
      usedEchoes.delete(next.echo);
    }
  }
}

// Optimizer context interface - all data needed for optimization
export interface OptimizerContext {
  // Character data
  chosenChar: any;
  character: string;
  characterLevel: string | number;
  talentData: {
    basic: number;
    skill: number;
    forte: number;
    liberation: number;
    intro: number;
  };

  // Base stats
  baseHp: number;
  baseAtk: number;
  baseDef: number;

  // Weapon data
  weaponData: {
    attack: number;
    modifier: string | null;
    modifierValue: number;
    weaponPassiveStats: Record<string, any>;
  };

  // Buffs
  charBuffsData: Record<string, any>;
  charResonanceChainsData: Record<string, any>;
  teamBuffsData: Record<string, any>;
  customBuffs: Record<string, any>;

  // Echo data
  echoStats: Record<string, any>;

  // Enemy data
  enemyLevel: number;
  enemyResist: number;
  enemyType: string;
  isSpectroFrazzleEnabled: boolean;
  spectroFrazzleStacks: number;
  isAeroErosionEnabled: boolean;
  aeroErosionStacks: number;
  isFusionBurstEnabled: boolean;
  fusionBurstStacks: number;
  isElectroFlareEnabled: boolean;
  electroFlareStacks: number;
  electroRageStacks: number;
  isGlacioChafeEnabled: boolean;
  glacioChafeStacks: number;
  havocBaneStacks: number;
  strainStacks: number;

  // Main echo
  mainEcho: string;
  mainEchoRank: number;

  // Rotations
  rotationsList: any[];

  // Computed stats (for fallback values)
  Glacio: number;
  Fusion: number;
  Electro: number;
  Aero: number;
  Spectro: number;
  Havoc: number;

  // Global data
  characters: Record<string, any>;

  // Character store data (for resonance chains and buffs config)
  activeCharacterBuffs: Record<string, any>;
  activeCharacterResonanceChains: Record<string, any>;

  // Helper function to get rotation by ID
  getRotationById: (character: string, rotationId: string) => any;

  // Progress callback (optional, for web workers)
  onProgress?: (processed: number) => void;
}

export function optimize(
  echoes: any[],
  context: OptimizerContext,
  // TODO: allowedSets is unused
  // @ts-ignore
  allowedSets: string[] = [],
  topN: number = 5,
  mainEchoKeys: string[] = [],
  minStats: any[] = [],
  echoSetPassiveBuffs: Record<string, any> = {},
  mainEchoStats: Record<string, any> = {},
  target: string = "ATK",
  damageType: string = "Average",
) {
  // Min-heap for topN results
  const heap: any[] = [];
  const seenCombinations = new Set<string>(); // Track unique combinations

  // get info on our target
  const targetElements = target.split(":");
  const [targetType, targetObject] = targetElements;
  // if it's an attack, get the attack info, the targetObject is Type|skillkey
  let attackData;
  if (targetType === "Attack") {
    const [attackType, attackKey] = targetObject.split("|");
    const attackInfo = getAttackData(context.chosenChar, attackType, attackKey);
    let actionTypeForAttackData;
    switch (attackType) {
      case "basicAttacks":
        actionTypeForAttackData = "basic";
        break;
      case "skillAttacks":
        actionTypeForAttackData = "skill";
        break;
      case "forteCircuitAttacks":
        actionTypeForAttackData = "forte";
        break;
      case "liberationAttacks":
        actionTypeForAttackData = "liberation";
        break;
      case "introAttacks":
        actionTypeForAttackData = "intro";
        break;
      case "tuneBreakAttacks":
        actionTypeForAttackData = "tuneBreak";
        break;
      case "outroAttacks":
        actionTypeForAttackData = "outro";
        break;
    }
    attackData = {
      actionType: actionTypeForAttackData,
      buffs: null,
      count: 1,
      excludeSelfBuffs: false,
      excludeTeamBuffs: false,
      excludeWeaponBuffs: false,
      key: attackKey,
      label: attackInfo.label,
      talents: attackInfo.talents,
      talent: attackInfo?.talent,
      type: attackInfo.type,
      subType: attackInfo.subType,
      element: attackInfo.element,
      attribute: attackInfo?.attribute ?? null,
      alwaysCrit: attackInfo?.alwaysCrit ?? false,
    };
    if (!attackData) {
      console.error("Could not find the attack data chosen");
      return;
    }
  }

  let rotationData;
  if (targetType === "Rotation") {
    const rotationId = targetObject;
    const rotation = context.getRotationById(context.character, rotationId);
    // TODO: this is also copy and pasted to build the rotation data
    // Refactor this out
    // console.log(rotationId, rotation, targetObject);
    const rotationInfo = {
      id: rotationId,
      name: rotation.name,
      description: rotation.description,
      duration: rotation.duration ?? null,
      echo: rotation.echo ?? null,
    };
    // @ts-ignore
    const rotationActionInfo = [];
    rotation.actions.forEach((action: any) => {
      const actionData = resolveRotationActionToAttackData(
        action,
        context.chosenChar,
        context.characterLevel,
      );
      if (actionData) {
        rotationActionInfo.push(actionData);
      }
    });
    // @ts-ignore
    rotationInfo.attacks = rotationActionInfo;
    rotationData = rotationInfo;
  }

  // get the mapping of the damage target
  // we'll use this to get the damage out of the damage calculation (Normal/Avg/Crit)
  // default to average if we didn't match anything
  let damageTargetReference;
  if (targetType === "Attack") {
    const damageTargetMap = {
      Normal: "totalDamage",
      Average: "avgDamage",
      Crit: "critDamage",
    };
    // @ts-ignore
    damageTargetReference = damageTargetMap[damageType] ?? "avgDamage";
    // @ts-ignore
    if (targetType === "Attack" && attackData.type === "Shield") {
      damageTargetReference = "shieldAmount";
    }
    // @ts-ignore
    if (targetType === "Attack" && attackData.type === "Healing") {
      damageTargetReference = "healAmount";
    }
  }
  if (targetType === "Rotation") {
    const damageTargetMap = {
      Normal: "normalDamage",
      Average: "avgDamage",
      Crit: "critDamage",
    };
    // @ts-ignore
    damageTargetReference = damageTargetMap[damageType] ?? "avgDamage";
  }

  // @ts-ignore
  for (const loadout of generateLoadouts(echoes, mainEchoKeys)) {
    const combinationKey = getOptimizerLoadoutKey(loadout);

    // Skip if we've already seen this combination
    if (seenCombinations.has(combinationKey)) {
      continue;
    }

    // TODO: implement the stats and damage/desire stat
    // calculate the total buffs from the echoes + set bonuses + main echo bonuses
    // TODO: We have the echo stats, need to add in set bonuses and main echo bonuses
    const echoStats = getCombinedEchoStats(loadout);
    // get the echo sets list
    const echoSets = getSetsFromEchoes(loadout);
    const echoSetBonuses = getSetBonusEffects(echoSets);
    const setBonusOne = echoSetBonuses?.setBonusOne ?? null;
    const setBonusTwo = echoSetBonuses?.setBonusTwo ?? null;
    //add in the main echo buff, if we have some
    const mainEchoKey = loadout[0]?.echo;
    const mainEchoBuff = mainEchoStats?.[mainEchoKey] ?? {};

    // go through these buffs, and overlap them to get a final set of buffs in one object
    // the keys will the stat keys, and the values will be the total buff value
    // and we need to add them up
    // @ts-ignore
    const setBonusOneBuffs = echoSetPassiveBuffs?.[setBonusOne] ?? {};
    // @ts-ignore
    const setBonusTwoBuffs = echoSetPassiveBuffs?.[setBonusTwo] ?? {};
    const allBuffsToAdd = [
      echoStats,
      mainEchoBuff,
      setBonusOneBuffs,
      setBonusTwoBuffs,
    ];
    const combinedEchoBuffs = {};
    allBuffsToAdd.forEach((buffs) => {
      Object.keys(buffs).forEach((key) => {
        // @ts-ignore
        if (combinedEchoBuffs[key]) {
          // @ts-ignore
          combinedEchoBuffs[key] += buffs[key];
        } else {
          // @ts-ignore
          combinedEchoBuffs[key] = buffs[key];
        }
      });
    });
    // first compute the stats without self buffs
    let finalStats = calcCharStats(
      "All", // return value
      null, // inject stats
      // ignores
      {
        ignoreEchoes: true,
      },
      combinedEchoBuffs, // echo stats
      null, // full stats
      // base stats
      {
        baseHp: context.baseHp,
        baseAtk: context.baseAtk,
        baseDef: context.baseDef,
      },
      {
        weaponAtk: context.weaponData?.attack,
        weaponModifier: context.weaponData?.modifier,
        weaponModifierValue: context.weaponData?.modifierValue,
        weaponPassiveData: context.weaponData?.weaponPassiveStats ?? {},
      },
      {}, // NO SELF BUFFS
      {}, // no resonance chains
      context.echoStats,
      context.customBuffs,
      context.teamBuffsData,
    );

    // Compute all buffs in the correct order for this loadout
    // Step 1: Compute resonance chains buffs using base stats
    const resonanceChainsBuffsData = computeResonanceChainsBuffs(
      context.activeCharacterResonanceChains ?? {},
      context.chosenChar?.resonanceChains ?? [],
      context.talentData ?? {},
    );

    // Step 2: Compute self buffs using base stats
    const selfBuffsData = computeSelfBuffs(
      context.activeCharacterBuffs ?? {},
      context.chosenChar?.buffs ?? [],
      context.activeCharacterResonanceChains ?? {},
      context.talentData ?? {},
      context.character ?? null,
    );

    // Step 3: Calculate intermediate stats with resonance chains and self buffs
    let intermediateStats = calcCharStats(
      "All",
      null,
      {
        ignoreEchoes: true,
      },
      combinedEchoBuffs,
      null,
      {
        baseHp: context.baseHp,
        baseAtk: context.baseAtk,
        baseDef: context.baseDef,
      },
      {
        weaponAtk: context.weaponData?.attack,
        weaponModifier: context.weaponData?.modifier,
        weaponModifierValue: context.weaponData?.modifierValue,
        weaponPassiveData: context.weaponData?.weaponPassiveStats ?? {},
      },
      selfBuffsData,
      resonanceChainsBuffsData,
      context.echoStats,
      context.customBuffs,
      context.teamBuffsData,
    );

    // Step 4: Compute AdditionalBase buffs using intermediate stats
    const additionalBaseBuffsData = computeAdditionalBaseBuffs(
      context.activeCharacterBuffs ?? {},
      context.chosenChar?.buffs ?? [],
      context.activeCharacterResonanceChains ?? {},
      context.character ?? null,
      intermediateStats.energyRegen,
      intermediateStats.totalCritRate,
    );

    // Step 5: Compute CritOverflow buffs using intermediate stats
    const critOverflowBuffsData = computeCritOverflowBuffs(
      context.activeCharacterBuffs ?? {},
      context.chosenChar?.buffs ?? [],
      context.activeCharacterResonanceChains ?? {},
      context.chosenChar?.resonanceChains ?? [],
      intermediateStats.totalCritRate,
    );

    // Step 6: Merge AdditionalBase and CritOverflow into self buffs
    const mergedSelfBuffs = {
      ...selfBuffsData,
      CritRate:
        (selfBuffsData?.CritRate || 0) +
        (additionalBaseBuffsData?.CritRate || 0),
      CritDMG:
        (selfBuffsData?.CritDMG || 0) +
        (additionalBaseBuffsData?.CritDMG || 0) +
        (critOverflowBuffsData?.CritDMG || 0),
      ATK: (selfBuffsData?.ATK || 0) + (additionalBaseBuffsData?.ATK || 0),
      ATK_FLAT:
        (selfBuffsData?.ATK_FLAT || 0) +
        (additionalBaseBuffsData?.ATK_FLAT || 0),
    };

    // Step 7: Compute final stats with all buffs
    finalStats = calcCharStats(
      "All",
      null,
      {
        ignoreEchoes: true,
      },
      combinedEchoBuffs,
      null,
      {
        baseHp: context.baseHp,
        baseAtk: context.baseAtk,
        baseDef: context.baseDef,
      },
      {
        weaponAtk: context.weaponData?.attack,
        weaponModifier: context.weaponData?.modifier,
        weaponModifierValue: context.weaponData?.modifierValue,
        weaponPassiveData: context.weaponData?.weaponPassiveStats ?? {},
      },
      mergedSelfBuffs,
      resonanceChainsBuffsData,
      context.echoStats,
      context.customBuffs,
      context.teamBuffsData,
    );

    // re-calculate the "total" stats
    const weaponAtk = context.weaponData?.attack;
    finalStats.totalAtk =
      (context.baseAtk + weaponAtk) * (1 + finalStats.attackPercent / 100) +
      finalStats.attackFlat;
    finalStats.totalHp =
      context.baseHp * (1 + finalStats.hpPercent / 100) + finalStats.hpFlat;
    finalStats.totalDef =
      context.baseDef * (1 + finalStats.defPercent / 100) + finalStats.defFlat;
    finalStats.totalCritRate = finalStats.critRate / 100;
    finalStats.totalCritDMG = finalStats.critDMG / 100;
    finalStats.DefIgnore = finalStats.defIgnore / 100;

    // if we have some min stats, check them before we add them to the list of usable loadouts
    let isMeetingMinRequirements = true;
    if (minStats.length > 0) {
      for (const minStat of minStats) {
        const statValue = finalStats?.[minStat.stat];
        if (!meetsMinStatThreshold(statValue, minStat.minValue)) {
          isMeetingMinRequirements = false;
          break;
        }
      }
    }
    // drop this loadout if it didnt meet the min requirements
    if (!isMeetingMinRequirements) {
      continue;
    }

    seenCombinations.add(combinationKey);

    let targetValue = 0;
    let resultContext: any = {
      finalStats,
      targetType,
      targetObject,
    };
    const loadoutArr = JSON.parse(
      JSON.stringify(normalizeOptimizerLoadout(loadout)),
    );
    if (targetType === "Stat") {
      // get the stat wer'e looking for from our final stats
      targetValue = finalStats?.[targetObject] ?? 0;
    } else if (targetType === "Attack") {
      // TODO: We need to pass in the stats we have on-hand from the loadout
      // and not use the stats that the current user has
      // INFO: It works as it is right now, and the damages match, which is good
      // Build context from optimizer's finalStats
      const optimizerContext = getCalculationContext(
        context.chosenChar,
        combinedEchoBuffs, // use combinedEchoBuffs instead of echoStats
        context.teamBuffsData,
        context.talentData,
        context.isSpectroFrazzleEnabled,
        context.spectroFrazzleStacks,
        context.isAeroErosionEnabled,
        context.aeroErosionStacks,
        context.isFusionBurstEnabled,
        context.fusionBurstStacks,
        context.isElectroFlareEnabled,
        context.electroFlareStacks,
        context.electroRageStacks,
        context.isGlacioChafeEnabled,
        context.glacioChafeStacks,
        context.characterLevel,
        context.mainEcho,
        context.mainEchoRank,
        context.rotationsList,
        context.charResonanceChainsData,
        context.charBuffsData,
        context.baseHp,
        context.baseAtk,
        context.baseDef,
        context.weaponData,
        context.customBuffs,
        finalStats.glacio ?? context.Glacio,
        finalStats.fusion ?? context.Fusion,
        finalStats.electro ?? context.Electro,
        finalStats.aero ?? context.Aero,
        finalStats.spectro ?? context.Spectro,
        finalStats.havoc ?? context.Havoc,
        finalStats.totalDef,
        finalStats.totalHp,
        finalStats.energyRegen,
        finalStats.totalAtk,
        finalStats.basicAttackDMGBonus,
        finalStats.heavyAttackDMGBonus,
        finalStats.resonanceSkillDMGBonus,
        finalStats.introSkillDMGBonus,
        finalStats.outroSkillDMGBonus,
        finalStats.resonanceLiberationDMGBonus,
        finalStats.echoDMGBonus,
        finalStats.healingBonus,
        finalStats.shieldBonus,
        finalStats.totalCritRate,
        finalStats.totalCritDMG,
        finalStats.DefIgnore,
        context.havocBaneStacks,
        finalStats.resistReduction,
        finalStats.totalDeepenEffect,
        context.enemyLevel,
        context.enemyResist,
        context.characters,
        context.character,
        context.enemyType,
        context.strainStacks,
      );
      const attacks = processAttacks(
        [attackData], // attacks list, just the one since we're just doing 1 attack to optimize
        optimizerContext,
        null, // talentType = null since it will be figured out dynamically
        false, // hasNoTalentType = no, unless it's outro (TODO)
        true, // dynamicTalentType = yes, this will figure out the talent data for us
        false, // excludeDisabledAttacks = no, unless we need to (TODO)
        finalStats, // give our stats, it will use this instead of the global state
        combinedEchoBuffs, // provide the echoes so we can exclude them if needed
      );
      targetValue = attacks?.[0]?.damage?.[damageTargetReference] ?? 0;
      resultContext.attacks = attacks;
      // console.log(
      //   targetValue,
      //   attacks,
      //   JSON.parse(JSON.stringify(loadout)),
      //   finalStats,
      // );
      // console.log("==============================");
    } else if (targetType === "Rotation") {
      // TODO: This is a copy and paste of the original rotations processing
      // We should abstract this out

      const rotationInfo = {
        // @ts-ignore
        id: rotationData.id,
        // @ts-ignore
        name: rotationData.name,
        // @ts-ignore
        description: rotationData.description,
        // @ts-ignore
        duration: rotationData.duration ?? null,
        // @ts-ignore
        echo: rotationData.echo ?? null,
      };
      // @ts-ignore
      // console.log("optimize:", rotationData.attacks, context.talentData);
      // Build context from optimizer's finalStats
      const optimizerContext = getCalculationContext(
        context.chosenChar,
        combinedEchoBuffs, // use combinedEchoBuffs instead of echoStats
        context.teamBuffsData,
        context.talentData,
        context.isSpectroFrazzleEnabled,
        context.spectroFrazzleStacks,
        context.isAeroErosionEnabled,
        context.aeroErosionStacks,
        context.isFusionBurstEnabled,
        context.fusionBurstStacks,
        context.isElectroFlareEnabled,
        context.electroFlareStacks,
        context.electroRageStacks,
        context.isGlacioChafeEnabled,
        context.glacioChafeStacks,
        context.characterLevel,
        context.mainEcho,
        context.mainEchoRank,
        context.rotationsList,
        context.charResonanceChainsData,
        context.charBuffsData,
        context.baseHp,
        context.baseAtk,
        context.baseDef,
        context.weaponData,
        context.customBuffs,
        finalStats.glacio ?? context.Glacio,
        finalStats.fusion ?? context.Fusion,
        finalStats.electro ?? context.Electro,
        finalStats.aero ?? context.Aero,
        finalStats.spectro ?? context.Spectro,
        finalStats.havoc ?? context.Havoc,
        finalStats.totalDef,
        finalStats.totalHp,
        finalStats.energyRegen,
        finalStats.totalAtk,
        finalStats.basicAttackDMGBonus,
        finalStats.heavyAttackDMGBonus,
        finalStats.resonanceSkillDMGBonus,
        finalStats.introSkillDMGBonus,
        finalStats.outroSkillDMGBonus,
        finalStats.resonanceLiberationDMGBonus,
        finalStats.echoDMGBonus,
        finalStats.healingBonus,
        finalStats.shieldBonus,
        finalStats.totalCritRate,
        finalStats.totalCritDMG,
        finalStats.DefIgnore,
        context.havocBaneStacks,
        finalStats.resistReduction,
        finalStats.totalDeepenEffect,
        context.enemyLevel,
        context.enemyResist,
        context.characters,
        context.character,
        context.enemyType,
        context.strainStacks,
      );
      const attacks = processAttacks(
        // @ts-ignore
        rotationData.attacks, // process all attacks in this rotations
        optimizerContext,
        null, // talentType = null since it will be figured out dynamically
        false, // hasNoTalentType = no, unless it's outro (TODO)
        true, // dynamicTalentType = yes, this will figure out the talent data for us
        false, // excludeDisabledAttacks = no, unless we need to (TODO)
        finalStats, // give our stats, it will use this instead of the global state
        combinedEchoBuffs, // provide the echoes so we can exclude them if needed
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
        if (
          attack.type === "ElementalEffect" &&
          attack?.damage?.damage !== undefined &&
          attack?.damage?.totalDamage === undefined
        ) {
          const v = attack.damage.damage;
          damageAggregation.normalDamage =
            (damageAggregation.normalDamage || 0) + v;
          damageAggregation.avgDamage =
            (damageAggregation.avgDamage || 0) + v;
          damageAggregation.critDamage =
            (damageAggregation.critDamage || 0) + v;
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
      // @ts-ignore
      rotationInfo.attacks = attacks;
      // @ts-ignore
      rotationInfo.damageAggregation = damageAggregation;
      targetValue =
        // @ts-ignore
        rotationInfo.damageAggregation?.[damageTargetReference] ?? 0;
      resultContext.attacks = rotationInfo;
      // console.log(rotationInfo);
    }
    // Call progress callback if provided
    if (context.onProgress) {
      context.onProgress(seenCombinations.size);
    }

    if (heap.length < topN) {
      heap.push({
        loadout: loadoutArr,
        targetValue,
        context: resultContext,
        id: randomString(),
      });
      heap.sort((a, b) => a.targetValue - b.targetValue); // min at index 0
    } else if (targetValue > heap[0].targetValue) {
      heap[0] = {
        loadout: loadoutArr,
        targetValue,
        context: resultContext,
        id: randomString(),
      };
      heap.sort((a, b) => a.targetValue - b.targetValue);
    }
  }

  return heap.sort((a, b) => b.targetValue - a.targetValue); // descending
}
