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

import { type OverrideBuffVariant } from "../calculator/optimizer";
import type { OptimizerRotationData } from "../calculator/rotationData";
import { computeRunBuffData, processLoadout } from "../calculator/processLoadout";

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
          ...computeRunBuffData(context, rotationData),
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
