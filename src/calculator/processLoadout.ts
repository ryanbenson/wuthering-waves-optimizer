/**
 * Scores one echo loadout for the optimizer. Shared by `processor.worker.ts`
 * (every generated loadout) and `Calculator.vue` (the equipped loadout, shown
 * next to the top results), so both are scored by the exact same code.
 */
import {
  normalizeOptimizerLoadout,
  computeLoadoutFinalStats,
  buildOptimizerCalculationContext,
  computeOverrideBuffVariants,
  scoreOptimizerRotation,
  type OverrideBuffVariant,
} from "./optimizer";
import type { OptimizerRotationData } from "./rotationData";
import { getAttackData } from "../characters/characters";
import { computeSelfBuffs, computeResonanceChainsBuffs } from "./stats";
import { processAttacks } from "./attacks";
import { meetsMinStatThreshold } from "./meetsMinStatThreshold";

/** Loadout-independent buff data; compute once per optimizer run. */
export function computeRunBuffData(
  context: any,
  rotationData: OptimizerRotationData | undefined,
): {
  selfBuffsData: any;
  resonanceChainsBuffsData: any;
  overrideBuffVariants: Map<string, OverrideBuffVariant>;
} {
  return {
    resonanceChainsBuffsData: computeResonanceChainsBuffs(
      context.activeCharacterResonanceChains ?? {},
      context.chosenChar?.resonanceChains ?? [],
      context.talentData ?? {},
      context.activeStance ?? null,
    ),
    selfBuffsData: computeSelfBuffs(
      context.activeCharacterBuffs ?? {},
      context.chosenChar?.buffs ?? [],
      context.activeCharacterResonanceChains ?? {},
      context.talentData ?? {},
      context.character ?? null,
      context.activeStance ?? null,
      { havocBaneStacks: context.havocBaneStacks ?? 0 },
    ),
    overrideBuffVariants: rotationData?.overrideActions.length
      ? computeOverrideBuffVariants(rotationData.overrideActions, context)
      : new Map(),
  };
}

/**
 * Processes a single loadout and calculates its optimization target value.
 */
export function processLoadout(
  loadout: any[],
  context: any,
  minStats: any[],
  echoSetPassiveBuffs: Record<string, any>,
  mainEchoStats: Record<string, any>,
  target: string,
  damageType: string,
  rotationData: OptimizerRotationData | undefined,
  selfBuffsData: any,
  resonanceChainsBuffsData: any,
  overrideBuffVariants: Map<string, OverrideBuffVariant>,
): any | null {
  try {
    const normalizedLoadout = normalizeOptimizerLoadout(loadout);

    const loadoutStats = computeLoadoutFinalStats(
      normalizedLoadout,
      context,
      selfBuffsData,
      resonanceChainsBuffsData,
      echoSetPassiveBuffs,
      mainEchoStats,
    );
    const { finalStats, combinedEchoBuffs } = loadoutStats;

    // Check min stats
    if (minStats.length > 0) {
      for (const minStat of minStats) {
        const statValue = finalStats?.[minStat.stat];
        if (
          !meetsMinStatThreshold(statValue, minStat.minValue, minStat.stat)
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
    // No manual clone needed: normalizedLoadout is a fresh array (from
    // normalizeOptimizerLoadout) of echo objects that arrived via structured
    // clone from the generator worker, so there's no Vue reactivity/aliasing
    // to strip. postMessage will structurally clone this result on its own
    // when it's sent back to the main thread — a JSON.stringify/parse
    // round-trip here was pure duplicate work, done for every loadout that
    // passes the min-stat filter regardless of whether it survives the
    // local top-N heap. A profiled run showed this as the single largest
    // source of cross-worker lock contention in the native allocator.
    const loadoutArr = normalizedLoadout;

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

      const optimizerContext = buildOptimizerCalculationContext(
        context,
        finalStats,
        combinedEchoBuffs,
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

      const { attacks, damageAggregation } = scoreOptimizerRotation(
        rotationData,
        normalizedLoadout,
        loadoutStats,
        context,
        overrideBuffVariants,
      );
      const rotationInfo: any = {
        id: rotationData.id,
        name: rotationData.name,
        description: rotationData.description,
        duration: rotationData.duration ?? null,
        echo: rotationData.echo ?? null,
      };

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
