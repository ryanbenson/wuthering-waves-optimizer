/**
 * Processor Worker
 *
 * This web worker processes batches of echo loadouts, calculating stats and damage
 * for each loadout to determine optimization target values (ATK, damage, rotations, etc.).
 * Multiple processor workers run in parallel to maximize throughput.
 *
 * Architecture:
 * - Runs in separate threads to parallelize computation
 * - Receives static optimizer config once on "init"
 * - Receives batches of loadouts from the main thread via slim "process" messages
 * - Keeps a local top-N heap and only returns candidates still retained in it at batch end
 * - Main thread merges candidates into the global top-N heap
 *
 * Message Flow:
 * 1. Main thread sends "init" with context and optimization parameters -> Worker responds with "ready"
 * 2. Main thread sends "process" with { batch, batchId } only
 * 3. Worker processes loadouts, updates local top-N, sends "result" with newly retained candidates
 * 4. Worker sends "error" if batch processing fails
 *
 * Processing Steps (for each loadout):
 * 1. Normalize non-main echo ordering
 * 2. Calculate echo stats and set bonuses
 * 3. Compute character stats with echo buffs
 * 4. Calculate buffs (self, resonance chains, additional base, crit overflow)
 * 5. Calculate final stats
 * 6. Check minimum stat requirements (if any)
 * 7. Calculate target value based on target type
 * 8. Try insert into local top-N heap; post only inserts still in the heap at batch end
 *
 * Performance Notes:
 * - Static context is cloned once at init, not per batch
 * - Only top-N candidates still retained this batch are posted back
 * - Errors in individual loadouts don't stop batch processing
 */

import {
  normalizeOptimizerLoadout,
  computeLoadoutFinalStats,
  buildOptimizerCalculationContext,
  computeOverrideBuffVariants,
  scoreOptimizerRotation,
  type OverrideBuffVariant,
} from "../calculator/optimizer";
import type { OptimizerRotationData } from "../calculator/rotationData";
import { getAttackData } from "../characters/characters";
import { computeSelfBuffs, computeResonanceChainsBuffs } from "../calculator/stats";
import { processAttacks } from "../calculator/attacks";
import { meetsMinStatThreshold } from "../calculator/meetsMinStatThreshold";

/**
 * Static config stored after init (sent once per optimization run)
 */
interface ProcessorConfig {
  context: any;
  minStats: any[];
  echoSetPassiveBuffs: Record<string, any>;
  mainEchoStats: Record<string, any>;
  target: string;
  damageType: string;
  rotationData?: OptimizerRotationData;
  topN: number;
  /** Loadout-independent; computed once on init */
  selfBuffsData: any;
  /** Loadout-independent; computed once on init */
  resonanceChainsBuffsData: any;
  /** Loadout-independent; computed once on init, one entry per rotationData.overrideActions */
  overrideBuffVariants: Map<string, OverrideBuffVariant>;
}

/**
 * Message sent from main thread to processor worker
 */
interface ProcessorMessage {
  type: "init" | "process" | "stop";
  data?: {
    batch?: any[];
    batchId?: number;
    context?: any;
    minStats?: any[];
    echoSetPassiveBuffs?: Record<string, any>;
    mainEchoStats?: Record<string, any>;
    target?: string;
    damageType?: string;
    rotationData?: any;
    topN?: number;
  };
}

/**
 * Message sent from processor worker to main thread
 */
interface ProcessorResponse {
  type: "result" | "error" | "ready";
  batchId?: number;
  results?: any[];
  processed?: number;
  error?: string;
}

let processorConfig: ProcessorConfig | null = null;
/** Local min-heap of top-N results (index 0 = worst / minimum targetValue) */
let localHeap: any[] = [];

function tryInsertLocalHeap(result: any, topN: number): boolean {
  const targetValue = result.targetValue;
  if (typeof targetValue !== "number" || !Number.isFinite(targetValue)) {
    return false;
  }

  if (localHeap.length < topN) {
    localHeap.push(result);
    if (localHeap.length === topN) {
      localHeap.sort((a, b) => a.targetValue - b.targetValue);
    }
    return true;
  }

  if (targetValue <= localHeap[0].targetValue) {
    return false;
  }

  localHeap[0] = result;
  // Bubble down to restore min-heap property
  let idx = 0;
  while (true) {
    const left = 2 * idx + 1;
    const right = 2 * idx + 2;
    let smallest = idx;

    if (
      left < localHeap.length &&
      localHeap[left].targetValue < localHeap[smallest].targetValue
    ) {
      smallest = left;
    }
    if (
      right < localHeap.length &&
      localHeap[right].targetValue < localHeap[smallest].targetValue
    ) {
      smallest = right;
    }

    if (smallest === idx) break;

    [localHeap[idx], localHeap[smallest]] = [
      localHeap[smallest],
      localHeap[idx],
    ];
    idx = smallest;
  }
  return true;
}

/**
 * Processes a single loadout and calculates its optimization target value.
 */
function processLoadout(
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

self.onmessage = (e: MessageEvent<ProcessorMessage>) => {
  try {
    const { type, data } = e.data;

    if (type === "init") {
      localHeap = [];
      if (data?.context) {
        const context = data.context;
        const rotationData: OptimizerRotationData | undefined = data.rotationData ?? undefined;
        processorConfig = {
          context,
          minStats: Array.isArray(data.minStats) ? data.minStats : [],
          echoSetPassiveBuffs: data.echoSetPassiveBuffs ?? {},
          mainEchoStats: data.mainEchoStats ?? {},
          target: data.target ?? "",
          damageType: data.damageType ?? "Average",
          rotationData,
          topN: typeof data.topN === "number" && data.topN > 0 ? data.topN : 5,
          // Echo-independent buffs — compute once per run
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
      } else {
        processorConfig = null;
      }
      self.postMessage({ type: "ready" } as ProcessorResponse);
      return;
    }

    if (type === "stop") {
      processorConfig = null;
      localHeap = [];
      return;
    }

    if (type === "process" && data) {
      const { batch, batchId } = data;

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

      if (!processorConfig) {
        console.error("Processor worker: Missing config (init not called)", {
          batchId,
        });
        self.postMessage({
          type: "error",
          batchId,
          error: "Missing processor config",
          processed: 0,
        } as ProcessorResponse);
        return;
      }

      const {
        context,
        minStats,
        echoSetPassiveBuffs,
        mainEchoStats,
        target,
        damageType,
        rotationData,
        topN,
        selfBuffsData,
        resonanceChainsBuffsData,
        overrideBuffVariants,
      } = processorConfig;

      try {
        // Track inserts this batch; only post those still in the local heap at batch end
        // (avoids shipping soon-evicted candidates and re-cloning unchanged heap members)
        const enteredThisBatch = new Set<any>();
        let errorCount = 0;

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
              rotationData,
              selfBuffsData,
              resonanceChainsBuffsData,
              overrideBuffVariants,
            );

            if (result && tryInsertLocalHeap(result, topN)) {
              enteredThisBatch.add(result);
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

        const candidates = localHeap.filter((result) =>
          enteredThisBatch.has(result),
        );

        // Only log errors
        if (errorCount > 0) {
          console.error(
            `Processor worker: Batch ${batchId} had ${errorCount} errors out of ${batch.length} loadouts`,
          );
        }

        self.postMessage({
          type: "result",
          batchId,
          results: candidates,
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
