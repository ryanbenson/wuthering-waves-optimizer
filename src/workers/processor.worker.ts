// Processor Worker - Processes batches of loadouts
import { OptimizerContext } from "../calculator/optimizer";
import { getAttackData } from "../characters/characters";
import { getEchoData } from "../echoes";
import { echoSetAttacks } from "../echoes/stats";
import { utilityAttacks } from "../buffs";
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

// Message types
interface ProcessorMessage {
  type: "init" | "process" | "stop";
  data?: {
    batch: any[];
    batchId: number;
    context: Omit<OptimizerContext, "getRotationById" | "onProgress">; // Remove functions
    allowedSets: string[];
    topN: number;
    mainEchoKeys: string[];
    minStats: any[];
    echoSetPassiveBuffs: Record<string, any>;
    mainEchoStats: Record<string, any>;
    target: string;
    damageType: string;
    rotationData?: any; // Pre-processed rotation data
  };
}

interface ProcessorResponse {
  type: "result" | "error" | "ready";
  batchId?: number;
  results?: any[];
  processed?: number;
  error?: string;
  newCombinations?: string[]; // Array of new combination keys seen in this batch
}

// Helper function to process a single loadout (extracted from optimize function)
function processLoadout(
  loadout: any[],
  context: any, // Using any to match the serialized context type
  allowedSets: string[],
  topN: number,
  mainEchoKeys: string[],
  minStats: any[],
  echoSetPassiveBuffs: Record<string, any>,
  mainEchoStats: Record<string, any>,
  target: string,
  damageType: string,
  seenCombinations: Set<string>, // Not used for filtering, just for tracking
  newSeenCombinations?: Set<string>, // Optional: track new combinations for this batch
  rotationData?: any, // Pre-processed rotation data for Rotation target type
): any | null {
  try {
    // Create a unique key for this combination
    const echoIds = loadout.map((echo) => echo.echoId);
    echoIds.sort();
    const combinationKey = echoIds.join("|");

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
      resonanceChainsBuffsData,
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

    // Note: We don't add to seenCombinations here since it's shared across workers
    // The main thread will handle adding to the global seenCombinations Set
    // But we track it in newSeenCombinations if provided
    if (newSeenCombinations) {
      newSeenCombinations.add(combinationKey);
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
      console.log("Processor worker initialized");
      self.postMessage({ type: "ready" } as ProcessorResponse);
      return;
    }

    if (type === "process" && data) {
      const {
        batch,
        batchId,
        context,
        allowedSets,
        topN,
        mainEchoKeys,
        minStats,
        echoSetPassiveBuffs,
        mainEchoStats,
        target,
        damageType,
        rotationData,
        seenCombinations: seenCombinationsArray, // Array of already-seen combination keys
      } = data as any; // Use any to allow seenCombinations which is added dynamically

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

        // Debug: Log first loadout structure
        if (batch.length > 0 && batchId === 0) {
          const firstLoadout = batch[0];
          console.log(
            `Processor worker batch ${batchId}: First loadout structure:`,
            {
              isArray: Array.isArray(firstLoadout),
              length: Array.isArray(firstLoadout) ? firstLoadout.length : "N/A",
              firstEcho:
                Array.isArray(firstLoadout) && firstLoadout.length > 0
                  ? {
                      echoId: firstLoadout[0]?.echoId,
                      echo: firstLoadout[0]?.echo,
                      type: firstLoadout[0]?.type,
                    }
                  : "N/A",
            },
          );
        }

        for (let i = 0; i < batch.length; i++) {
          const loadout = batch[i];
          try {
            const result = processLoadout(
              loadout,
              context,
              allowedSets,
              topN,
              mainEchoKeys,
              minStats,
              echoSetPassiveBuffs,
              mainEchoStats,
              target,
              damageType,
              new Set<string>(), // Not used for filtering
              undefined, // Don't track new combinations in worker
              rotationData, // Pass rotation data for Rotation target type
            );

            if (result) {
              results.push(result);
            } else {
              nullCount++;
            }

            // Log progress every 5000 loadouts to reduce noise
            if ((i + 1) % 5000 === 0) {
              console.log(
                `Processor worker: Processed ${i + 1}/${batch.length} loadouts in batch ${batchId}, ${results.length} results so far`,
              );
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

        // Only log if there are errors or all results are null
        if (errorCount > 0) {
          console.error(
            `Processor worker: Batch ${batchId} had ${errorCount} errors out of ${batch.length} loadouts`,
          );
        }

        if (nullCount === batch.length && batch.length > 0) {
          // Log first loadout to see why it's being filtered
          const firstLoadout = batch[0];
          console.log(
            "First loadout in batch:",
            JSON.stringify(firstLoadout, null, 2),
          );
          console.log("Context for first loadout:", {
            chosenChar: context.chosenChar,
            target,
            damageType,
            minStats,
            mainEchoKeys,
            allowedSets,
          });
          try {
            const testResult = processLoadout(
              firstLoadout,
              context,
              allowedSets,
              topN,
              mainEchoKeys,
              minStats,
              echoSetPassiveBuffs,
              mainEchoStats,
              target,
              damageType,
              new Set<string>(), // Fresh set for testing
              undefined, // No newSeenCombinations for test
              rotationData, // Pass rotation data for test
            );
            console.log("Test result for first loadout:", testResult);
            if (!testResult) {
              console.log(
                "First loadout returned null - check logs above for reason",
              );
            }
          } catch (testError: any) {
            console.error("Error in test processing:", testError);
          }
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
