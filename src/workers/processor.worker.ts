/**
 * Processor Worker
 *
 * This web worker processes batches of echo loadouts, calculating stats and damage
 * for each loadout to determine optimization target values (ATK, damage, rotations, etc.).
 * Multiple processor workers run in parallel to maximize throughput.
 *
 * Architecture:
 * - Runs in separate threads to parallelize computation
 * - Receives batches of loadouts from the main thread
 * - Calculates stats, buffs, and damage for each loadout
 * - Returns results back to main thread for heap management
 * - Does NOT filter duplicates (main thread handles that)
 *
 * Message Flow:
 * 1. Main thread sends "init" -> Worker responds with "ready"
 * 2. Main thread sends "process" with batch, context, and optimization parameters
 * 3. Worker processes all loadouts in batch and sends "result" with array of results
 * 4. Worker sends "error" if batch processing fails
 *
 * Processing Steps (for each loadout):
 * 1. Extract echo IDs and create combination key
 * 2. Calculate echo stats and set bonuses
 * 3. Compute character stats with echo buffs
 * 4. Calculate buffs (self, resonance chains, additional base, crit overflow)
 * 5. Calculate final stats
 * 6. Check minimum stat requirements (if any)
 * 7. Calculate target value based on target type:
 *    - Stat: Direct stat value
 *    - Attack: Single attack damage (Normal/Average/Crit)
 *    - Rotation: Aggregated damage from rotation sequence
 * 8. Return result object with loadout, targetValue, and context
 *
 * Performance Notes:
 * - All loadouts in a batch are processed sequentially (no async/await)
 * - Errors in individual loadouts don't stop batch processing
 * - Results are only sent for valid loadouts (null results are filtered)
 * - Context is pre-serialized by main thread (no functions, plain objects)
 */

import { OptimizerContext } from "../calculator/optimizer";
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

/**
 * Message sent from main thread to processor worker
 */
interface ProcessorMessage {
  type: "init" | "process" | "stop";
  data?: {
    batch: any[]; // Array of loadout combinations to process
    batchId: number; // Unique ID for this batch
    context: Omit<OptimizerContext, "getRotationById" | "onProgress">; // Serialized context (no functions)
    minStats: any[]; // Minimum stat requirements
    echoSetPassiveBuffs: Record<string, any>; // Set bonus passive buffs
    mainEchoStats: Record<string, any>; // Main echo stats
    target: string; // Optimization target (e.g., "Stat:ATK", "Attack:basicAttacks|attack1", "Rotation:rotationId")
    damageType: string; // Damage type for attack/rotation targets ("Normal", "Average", "Crit")
    rotationData?: any; // Pre-processed rotation data (for Rotation target type)
  };
}

/**
 * Message sent from processor worker to main thread
 */
interface ProcessorResponse {
  type: "result" | "error" | "ready";
  batchId?: number; // Batch ID this response corresponds to
  results?: any[]; // Array of processed results (only for "result" type)
  processed?: number; // Number of loadouts processed in this batch
  error?: string; // Error message (only for "error" type)
}

/**
 * Processes a single loadout and calculates its optimization target value.
 *
 * This function is extracted from the original optimize function to enable
 * parallel processing in web workers. It performs the full stat calculation
 * and damage computation pipeline for a single loadout.
 *
 * @param loadout - Array of echo objects representing the loadout combination
 * @param context - Serialized optimizer context (character, stats, buffs, etc.)
 * @param allowedSets - Allowed echo sets (currently unused)
 * @param topN - Number of top results to keep (for filtering)
 * @param mainEchoKeys - Main echo keys for validation
 * @param minStats - Minimum stat requirements array
 * @param echoSetPassiveBuffs - Set bonus passive buffs object
 * @param mainEchoStats - Main echo stats object
 * @param target - Optimization target string (format: "Type:Object")
 * @param damageType - Damage type for attack/rotation targets ("Normal", "Average", "Crit")
 * @param rotationData - Pre-processed rotation data (for Rotation target type)
 * @returns Result object with loadout, targetValue, and context, or null if loadout doesn't meet requirements
 *
 * @throws Error if processing fails (caught by batch processor)
 */
function processLoadout(
  loadout: any[],
  context: any, // Using any to match the serialized context type
  minStats: any[],
  echoSetPassiveBuffs: Record<string, any>,
  mainEchoStats: Record<string, any>,
  target: string,
  damageType: string,
  rotationData?: any, // Pre-processed rotation data for Rotation target type
): any | null {
  try {
    // Create a unique key for this combination
    const echoIds = loadout.map((echo) => echo.echoId);
    echoIds.sort();

    // Don't filter duplicates here - the main thread will handle that
    // We still track it for reporting purposes

    // Calculate echo stats and set bonuses
    const echoStats = getCombinedEchoStats(loadout);
    const echoSets = getSetsFromEchoes(loadout);
    const echoSetBonuses = getSetBonusEffects(echoSets);
    const setBonusOne = echoSetBonuses?.setBonusOne ?? null;
    const setBonusTwo = echoSetBonuses?.setBonusTwo ?? null;
    const mainEchoKey = loadout[0]?.echo;
    const mainEchoBuff = mainEchoStats?.[mainEchoKey] ?? {};

    const setBonusOneBuffs =
      setBonusOne && echoSetPassiveBuffs?.[setBonusOne]
        ? echoSetPassiveBuffs[setBonusOne]
        : {};
    const setBonusTwoBuffs =
      setBonusTwo && echoSetPassiveBuffs?.[setBonusTwo]
        ? echoSetPassiveBuffs[setBonusTwo]
        : {};
    const allBuffsToAdd = [
      echoStats,
      mainEchoBuff,
      setBonusOneBuffs,
      setBonusTwoBuffs,
    ];
    const combinedEchoBuffs: any = {};
    allBuffsToAdd.forEach((buffs) => {
      Object.keys(buffs).forEach((key) => {
        if (combinedEchoBuffs[key]) {
          combinedEchoBuffs[key] += buffs[key];
        } else {
          combinedEchoBuffs[key] = buffs[key];
        }
      });
    });

    // Compute stats
    let finalStats = calcCharStats(
      "All",
      null,
      { ignoreEchoes: true },
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
      {},
      {},
      context.echoStats,
      context.customBuffs,
      context.teamBuffsData,
    );

    // Compute buffs in correct order
    const resonanceChainsBuffsData = computeResonanceChainsBuffs(
      context.activeCharacterResonanceChains ?? {},
      context.chosenChar?.resonanceChains ?? [],
      context.talentData ?? {},
    );

    const selfBuffsData = computeSelfBuffs(
      context.activeCharacterBuffs ?? {},
      context.chosenChar?.buffs ?? [],
      context.activeCharacterResonanceChains ?? {},
      context.talentData ?? {},
      context.character ?? null,
    );

    let intermediateStats = calcCharStats(
      "All",
      null,
      { ignoreEchoes: true },
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

    const additionalBaseBuffsData = computeAdditionalBaseBuffs(
      context.activeCharacterBuffs ?? {},
      context.chosenChar?.buffs ?? [],
      context.activeCharacterResonanceChains ?? {},
      context.character ?? null,
      intermediateStats.energyRegen,
      intermediateStats.totalCritRate,
    );

    // Step 4b: Compute AdditionalBase buffs using intermediate stats (resonance chains)
    let additionalBaseBuffsDataFromResonanceChains = {
      CritRate: 0,
      CritDMG: 0,
      ATK: 0,
      ATK_FLAT: 0,
    };
    // ignore Augusta, as her additional based buffs for resonance chains are handled in self buffs
    // applying this for her will double the buffs
    if (context.character !== "Augusta") {
      additionalBaseBuffsDataFromResonanceChains = computeAdditionalBaseBuffs(
        context.activeCharacterResonanceChains ?? {},
        context.chosenChar.resonanceChains ?? [],
        context.activeCharacterResonanceChains ?? {},
        context.character ?? "",
        intermediateStats.energyRegen,
        intermediateStats.totalCritRate,
      );
    }

    const critOverflowBuffsData = computeCritOverflowBuffs(
      context.activeCharacterBuffs ?? {},
      context.chosenChar?.buffs ?? [],
      context.activeCharacterResonanceChains ?? {},
      context.chosenChar?.resonanceChains ?? [],
      intermediateStats.totalCritRate,
    );

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

    // merge the specificTalentBuffs together
    mergedSelfBuffs.specificTalentBuffs = Object.assign(
      {},
      selfBuffsData?.specificTalentBuffs ?? {},
      additionalBaseBuffsData?.specificTalentBuffs ?? {},
    );
    // Step 6b: Merge AdditionalBase and CritOverflow into self buffs (self buffs)
    // ignore augusta though, otherwise it doubles up her buffs
    let mergedResonanceChainsBuffsData = { ...resonanceChainsBuffsData };
    if (context.character !== "Augusta") {
      mergedResonanceChainsBuffsData = {
        ...resonanceChainsBuffsData,
        CritRate:
          (resonanceChainsBuffsData?.CritRate || 0) +
          (additionalBaseBuffsDataFromResonanceChains?.CritRate || 0),
        CritDMG:
          (resonanceChainsBuffsData?.CritDMG || 0) +
          (additionalBaseBuffsDataFromResonanceChains?.CritDMG || 0) +
          (critOverflowBuffsData?.CritDMG || 0),
        ATK:
          (resonanceChainsBuffsData?.ATK || 0) +
          (additionalBaseBuffsDataFromResonanceChains?.ATK || 0),
        ATK_FLAT:
          (resonanceChainsBuffsData?.ATK_FLAT || 0) +
          (additionalBaseBuffsDataFromResonanceChains?.ATK_FLAT || 0),
      };
    }

    finalStats = calcCharStats(
      "All",
      null,
      { ignoreEchoes: true },
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
      mergedResonanceChainsBuffsData,
      context.echoStats,
      context.customBuffs,
      context.teamBuffsData,
    );

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

    // Check min stats
    if (minStats.length > 0) {
      for (const minStat of minStats) {
        const statValue = finalStats?.[minStat.stat];
        const desiredValue = Number(minStat.minValue) / 100;
        if (
          statValue === undefined ||
          statValue === null ||
          statValue < desiredValue
        ) {
          return null; // Doesn't meet requirements
        }
      }
    }

    // Calculate target value
    const targetElements = target.split(":");
    const [targetType, targetObject] = targetElements;

    let targetValue = 0;
    const resultContext: any = {
      finalStats,
      targetType,
      targetObject,
    };
    const loadoutArr = JSON.parse(JSON.stringify(loadout));

    if (targetType === "Stat") {
      targetValue = finalStats?.[targetObject] ?? 0;
      targetValue =
        typeof targetValue === "number"
          ? targetValue
          : Number(targetValue) || 0;
    } else if (targetType === "Attack") {
      const [attackType, attackKey] = targetObject.split("|");
      const attackInfo = getAttackData(
        context.chosenChar,
        attackType,
        attackKey,
      );

      if (!attackInfo) {
        return null;
      }

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
      const attackData = {
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

      const damageTargetMap = {
        Normal: "totalDamage",
        Average: "avgDamage",
        Crit: "critDamage",
      };
      const damageTargetReference =
        damageTargetMap[damageType as keyof typeof damageTargetMap] ??
        "avgDamage";

      const optimizerContext = getCalculationContext(
        context.chosenChar,
        combinedEchoBuffs,
        context.teamBuffsData,
        context.talentData,
        context.isSpectroFrazzleEnabled,
        context.spectroFrazzleStacks,
        context.isAeroErosionEnabled,
        context.aeroErosionStacks,
        context.isFusionBurstEnabled,
        context.fusionBurstStacks,
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
        [attackData],
        optimizerContext,
        null,
        false,
        true,
        false,
        finalStats,
        combinedEchoBuffs,
      );
      targetValue = attacks?.[0]?.damage?.[damageTargetReference] ?? 0;
      targetValue =
        typeof targetValue === "number"
          ? targetValue
          : Number(targetValue) || 0;
      resultContext.attacks = attacks;
    } else if (targetType === "Rotation") {
      // Rotation processing
      if (!rotationData) {
        return null;
      }

      const rotationInfo: any = {
        id: rotationData.id,
        name: rotationData.name,
        description: rotationData.description,
        duration: rotationData.duration ?? null,
        echo: rotationData.echo ?? null,
      };

      // Build context from optimizer's finalStats
      const optimizerContext = getCalculationContext(
        context.chosenChar,
        combinedEchoBuffs,
        context.teamBuffsData,
        context.talentData,
        context.isSpectroFrazzleEnabled,
        context.spectroFrazzleStacks,
        context.isAeroErosionEnabled,
        context.aeroErosionStacks,
        context.isFusionBurstEnabled,
        context.fusionBurstStacks,
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
        rotationData.attacks, // process all attacks in this rotation
        optimizerContext,
        null, // talentType = null since it will be figured out dynamically
        false, // hasNoTalentType = no, unless it's outro (TODO)
        true, // dynamicTalentType = yes, this will figure out the talent data for us
        false, // excludeDisabledAttacks = no, unless we need to (TODO)
        finalStats, // give our stats, it will use this instead of the global state
        combinedEchoBuffs, // provide the echoes so we can exclude them if needed
      );

      // Aggregate damage from all attacks
      const damageAggregation = {
        normalDamage: null,
        avgDamage: null,
        critDamage: null,
        healing: null,
        shield: null,
      };

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

      const damageTargetMap = {
        Normal: "normalDamage",
        Average: "avgDamage",
        Crit: "critDamage",
      };
      const damageTargetReference =
        damageTargetMap[damageType as keyof typeof damageTargetMap] ??
        "avgDamage";

      // @ts-ignore
      targetValue = damageAggregation[damageTargetReference] ?? 0;

      // Ensure targetValue is a number
      targetValue =
        typeof targetValue === "number"
          ? targetValue
          : Number(targetValue) || 0;
      rotationInfo.attacks = attacks;
      rotationInfo.damageAggregation = damageAggregation;
      resultContext.rotation = rotationInfo;
    } else {
      return null;
    }

    // Ensure targetValue is a number before returning
    const finalTargetValue =
      typeof targetValue === "number" ? targetValue : Number(targetValue) || 0;

    return {
      loadout: loadoutArr,
      targetValue: finalTargetValue,
      context: resultContext,
    };
  } catch (error: any) {
    console.error("Error in processLoadout:", error);
    console.error("Loadout:", loadout);
    console.error(
      "Context keys:",
      context ? Object.keys(context) : "context is null",
    );
    throw error; // Re-throw to be caught by the batch processor
  }
}

self.onmessage = (e: MessageEvent<ProcessorMessage>) => {
  try {
    const { type, data } = e.data;

    if (type === "init") {
      self.postMessage({ type: "ready" } as ProcessorResponse);
      return;
    }

    if (type === "process" && data) {
      const {
        batch,
        batchId,
        context,
        minStats,
        echoSetPassiveBuffs,
        mainEchoStats,
        target,
        damageType,
        rotationData,
      } = data;

      if (!batch || !Array.isArray(batch) || batch.length === 0) {
        console.error("Processor worker: Invalid batch received", {
          batch,
          batchId,
        });
        self.postMessage({
          type: "error",
          batchId,
          error: "Invalid batch data",
          processed: 0,
        } as ProcessorResponse);
        return;
      }

      if (!context) {
        console.error("Processor worker: Missing context", { batchId });
        self.postMessage({
          type: "error",
          batchId,
          error: "Missing context",
          processed: 0,
        } as ProcessorResponse);
        return;
      }

      try {
        // Don't filter duplicates in workers - main thread will handle that
        // Workers process all loadouts and send all results back
        const results: any[] = [];
        let errorCount = 0;
        let nullCount = 0;

        for (let i = 0; i < batch.length; i++) {
          const loadout = batch[i];
          try {
            const result = processLoadout(
              loadout,
              context,
              minStats,
              echoSetPassiveBuffs,
              mainEchoStats,
              target,
              damageType,
              rotationData, // Pass rotation data for Rotation target type
            );

            if (result) {
              results.push(result);
            } else {
              nullCount++;
            }
          } catch (loadoutError: any) {
            errorCount++;
            console.error(
              `Error processing loadout ${i} in batch ${batchId}:`,
              loadoutError,
            );
            console.error("Loadout:", loadout);
            // Continue processing other loadouts
          }
        }

        // Only log errors
        if (errorCount > 0) {
          console.error(
            `Processor worker: Batch ${batchId} had ${errorCount} errors out of ${batch.length} loadouts`,
          );
        }

        self.postMessage({
          type: "result",
          batchId,
          results,
          processed: batch.length,
        } as ProcessorResponse);
      } catch (error: any) {
        console.error("Fatal error in processor worker:", error);
        self.postMessage({
          type: "error",
          batchId,
          error: error?.message || "Unknown error",
        } as ProcessorResponse);
      }
    } else {
      console.warn("Processor worker: Unknown message type:", type);
    }
  } catch (error: any) {
    console.error("Fatal error in processor worker message handler:", error);
    self.postMessage({
      type: "error",
      error: error?.message || "Unknown error in message handler",
    } as ProcessorResponse);
  }
};
