/**
 * Runs one optimizer search: spawns the generator and processor workers, feeds
 * batches between them with backpressure, and merges their candidates into a
 * global top-N. Extracted from Calculator.vue so Team Rotations' team optimizer
 * (ADR 0052) can run it once per character. Plain TS, no Vue: the caller owns
 * its own state and updates it from the callbacks.
 */
import {
  getOptimizerLoadoutHash,
  splitOptimizerWorkerCount,
} from "../calculator/optimizer";
import { randomString } from "../utils/strings";

export interface OptimizerRunInput {
  echoes: any[];
  context: any;
  topN: number;
  mainEchoKeys: string[];
  minStats: any[];
  echoSetPassiveBuffs: Record<string, any>;
  mainEchoStats: Record<string, any>;
  target: string;
  damageType: string;
  rotationData?: any;
  loadoutFormat?: string;
  /** Total worker budget, resolved by the caller from Settings → Preferences. */
  workerCount: number;
  /** Team optimizer: return each candidate without its per-attack breakdown, so
   *  a deep top-N stays cheap to send between threads. */
  slimResults?: boolean;
  /** Team optimizer: skip any loadout missing one of these set bonuses. */
  requiredSetBonusLabels?: string[];
}

export interface OptimizerRunResult {
  results: any[];
  totalProcessed: number;
  generatedCount: number;
}

export interface OptimizerRunCallbacks {
  onProcessed?: (totalProcessed: number) => void;
  onGenerated?: (totalGenerated: number) => void;
  /** Throttled best-so-far. Only fires once the top-N has filled. */
  onLiveBest?: (best: any) => void;
  /** Every generator shard finished. */
  onSearchComplete?: (info: { totalGenerated: number }) => void;
  /** The last generator shard ended on an error. */
  onGeneratorFailed?: () => void;
  /** The echoes could not be sent to a generator, so the run was torn down. */
  onAborted?: () => void;
  /** Fires exactly once when the workers are torn down, however the run ended. */
  onCleanedUp?: () => void;
  onFinished: (result: OptimizerRunResult) => void;
}

export interface OptimizerRunHandle {
  cancel: () => void;
}

// Helper function to serialize echoes array (only include needed properties)
export const serializeEchoes = (echoes: any[]): any[] => {
  if (!Array.isArray(echoes)) {
    return [];
  }
  return echoes
    .filter((echo) => echo && typeof echo === "object")
    .map((echo) => {
      // Only include the properties we actually need for optimization
      // Use null/undefined checks to ensure we don't pass non-serializable values
      return {
        echoId: echo.echoId ?? null,
        echo: echo.echo ?? null,
        echoSet: echo.echoSet ?? null,
        echoSubStatsType1: echo.echoSubStatsType1 ?? null,
        echoSubStatsType2: echo.echoSubStatsType2 ?? null,
        echoSubStatsType3: echo.echoSubStatsType3 ?? null,
        echoSubStatsType4: echo.echoSubStatsType4 ?? null,
        echoSubStatsType5: echo.echoSubStatsType5 ?? null,
        echoSubStatsValue1:
          typeof echo.echoSubStatsValue1 === "number"
            ? echo.echoSubStatsValue1
            : null,
        echoSubStatsValue2:
          typeof echo.echoSubStatsValue2 === "number"
            ? echo.echoSubStatsValue2
            : null,
        echoSubStatsValue3:
          typeof echo.echoSubStatsValue3 === "number"
            ? echo.echoSubStatsValue3
            : null,
        echoSubStatsValue4:
          typeof echo.echoSubStatsValue4 === "number"
            ? echo.echoSubStatsValue4
            : null,
        echoSubStatsValue5:
          typeof echo.echoSubStatsValue5 === "number"
            ? echo.echoSubStatsValue5
            : null,
        rank:
          echo.rank != null && echo.rank !== ""
            ? (() => {
                const n = Number(echo.rank);
                return Number.isFinite(n) ? n : null;
              })()
            : null,
        stat: echo.stat ?? null,
        type:
          echo.type != null && echo.type !== ""
            ? (() => {
                const n = Number(echo.type);
                return Number.isFinite(n) ? n : null;
              })()
            : null,
      };
    });
};

// Helper function to create a serializable context (removes functions and ensures all data is plain)
export const createSerializableContext = (context: any): any => {
  try {
    // Deep clone using JSON to ensure everything is serializable
    // This will remove functions, Vue reactive proxies, circular references, etc.
    const serializable = JSON.parse(
      JSON.stringify(context, (_key, value) => {
        // Skip functions
        if (typeof value === "function") {
          return undefined;
        }
        // Ensure we're not passing Vue reactive proxies or other non-serializable objects
        return value;
      }),
    );
    return serializable;
  } catch (error) {
    console.error("Error serializing context:", error);
    // Fallback: manually create a plain object
    return {
      chosenChar: JSON.parse(JSON.stringify(context.chosenChar)),
      character: context.character,
      characterLevel: context.characterLevel,
      talentData: { ...context.talentData },
      baseHp: context.baseHp,
      baseAtk: context.baseAtk,
      baseDef: context.baseDef,
      weaponData: JSON.parse(JSON.stringify(context.weaponData)),
      charBuffsData: JSON.parse(JSON.stringify(context.charBuffsData)),
      charResonanceChainsData: JSON.parse(
        JSON.stringify(context.charResonanceChainsData),
      ),
      teamBuffsData: JSON.parse(JSON.stringify(context.teamBuffsData)),
      customBuffs: JSON.parse(JSON.stringify(context.customBuffs)),
      echoStats: JSON.parse(JSON.stringify(context.echoStats)),
      enemyLevel: context.enemyLevel,
      enemyResist: context.enemyResist,
      enemyType: context.enemyType,
      strainStacks: context.strainStacks,
      isSpectroFrazzleEnabled: context.isSpectroFrazzleEnabled,
      spectroFrazzleStacks: context.spectroFrazzleStacks,
      isAeroErosionEnabled: context.isAeroErosionEnabled,
      aeroErosionStacks: context.aeroErosionStacks,
      havocBaneStacks: context.havocBaneStacks,
      isFusionBurstEnabled: context.isFusionBurstEnabled,
      fusionBurstStacks: context.fusionBurstStacks,
      isElectroFlareEnabled: context.isElectroFlareEnabled,
      electroFlareStacks: context.electroFlareStacks,
      electroRageStacks: context.electroRageStacks,
      isGlacioChafeEnabled: context.isGlacioChafeEnabled,
      glacioChafeStacks: context.glacioChafeStacks,
      mainEcho: context.mainEcho,
      mainEchoRank: context.mainEchoRank,
      rotationsList: JSON.parse(JSON.stringify(context.rotationsList)),
      Glacio: context.Glacio,
      Fusion: context.Fusion,
      Electro: context.Electro,
      Aero: context.Aero,
      Spectro: context.Spectro,
      Havoc: context.Havoc,
      characters: JSON.parse(JSON.stringify(context.characters)),
      activeCharacterBuffs: JSON.parse(
        JSON.stringify(context.activeCharacterBuffs),
      ),
      activeCharacterResonanceChains: JSON.parse(
        JSON.stringify(context.activeCharacterResonanceChains),
      ),
    };
  }
};

/** Starts a run. Tear it down early with the returned `cancel`. */
export function runOptimizerWorkers(
  input: OptimizerRunInput,
  callbacks: OptimizerRunCallbacks,
): OptimizerRunHandle {
  const {
    echoes,
    context,
    topN,
    mainEchoKeys,
    minStats,
    echoSetPassiveBuffs,
    mainEchoStats,
    target,
    damageType,
    rotationData = null,
    loadoutFormat = "Any",
    workerCount,
    slimResults = false,
    requiredSetBonusLabels = [],
  } = input;

  // Worker count is user-configurable (Settings → Preferences), split between
  // generator shards (a few, at most) and processor workers (the bulk).
  const { generatorCount, processorCount } =
    splitOptimizerWorkerCount(workerCount);
  const batchSize =
    navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 8
      ? 5000
      : 2000; // Larger batches on powerful devices
  // Cap queued batches so generation cannot outrun processing into multi-GB heap
  const maxQueuedBatches = processorCount * 2;

  // Create workers
  const generatorWorkers: Worker[] = [];
  for (let i = 0; i < generatorCount; i++) {
    generatorWorkers.push(
      new Worker(
        new URL("./generator.worker.ts", import.meta.url),
        { type: "module" },
      ),
    );
  }

  const processorWorkers: Worker[] = [];
  for (let i = 0; i < processorCount; i++) {
    const worker = new Worker(
      new URL("./processor.worker.ts", import.meta.url),
      { type: "module" },
    );
    processorWorkers.push(worker);
  }

  // State management
  const heap: any[] = [];
  // Throttles how often the workspace's live "best found so far" ref is
  // written — the heap itself merges on every batch, but redrawing the
  // UI that often is unnecessary churn (see docs on liveBestResult).
  let lastLiveBestUpdateMs = 0;
  let liveBest: any = null;
  const workQueue: Array<{ batch: any[]; batchId: number }> = [];
  let batchIdCounter = 0;
  let totalProcessed = 0;
  const workerBusy = new Map<Worker, boolean>();
  /** Per-shard total generated (as last reported by that shard) and done flag */
  const generatorShardTotal = new Map<Worker, number>();
  const generatorShardDone = new Map<Worker, boolean>();
  /** True while a given shard is waiting for a "continue" after posting a batch */
  const generatorShardAwaitingContinue = new Map<Worker, boolean>();
  const generatorAllDone = () =>
    generatorWorkers.every((w) => generatorShardDone.get(w) === true);
  const totalGenerated = () => {
    let sum = 0;
    generatorShardTotal.forEach((v) => (sum += v));
    return sum;
  };
  const seenCombinations = new Set<number>();
  // Cross-shard dedup for generated (not-yet-processed) loadouts: local per-worker
  // dedup only catches duplicates within one shard; distinct shards can independently
  // discover the same loadout signature (e.g. two stat-identical main echoes assigned
  // to different shards). Only needed when there's more than one generator shard.
  const seenGeneratedHashes =
    generatorCount > 1 ? new Set<number>() : null;
  const dedupeBatchAcrossShards = (batch: any[]): any[] => {
    if (!seenGeneratedHashes) return batch;
    const deduped: any[] = [];
    for (const loadout of batch) {
      const hash = getOptimizerLoadoutHash(loadout);
      if (seenGeneratedHashes.has(hash)) continue;
      seenGeneratedHashes.add(hash);
      deduped.push(loadout);
    }
    return deduped;
  };
  let readyWorkers = 0;
  let cleanedUp = false;

  // Serialize static processor config once (not per batch)
  const serializableContext = createSerializableContext(context);
  const plainMinStats = Array.isArray(minStats)
    ? minStats.map((s: any) =>
        s && typeof s === "object" ? { ...s } : s,
      )
    : minStats;
  const serializableEchoSetPassiveBuffs = JSON.parse(
    JSON.stringify(echoSetPassiveBuffs),
  );
  const serializableMainEchoStats = JSON.parse(
    JSON.stringify(mainEchoStats),
  );
  const serializableRotationData = rotationData
    ? JSON.parse(JSON.stringify(rotationData))
    : null;

  const cleanupWorkers = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    callbacks.onCleanedUp?.();
    generatorWorkers.forEach((w) => {
      try {
        w.postMessage({ type: "stop" });
      } catch {
        // Worker may already be terminated
      }
      w.terminate();
    });
    processorWorkers.forEach((w) => {
      try {
        w.postMessage({ type: "stop" });
      } catch {
        // ignore
      }
      w.terminate();
    });
  };
  /** Ask each generator shard for another batch while the shared queue has room */
  const maybeContinueGenerator = () => {
    if (cleanedUp) return;
    for (const worker of generatorWorkers) {
      if (workQueue.length >= maxQueuedBatches) break;
      if (
        generatorShardDone.get(worker) ||
        !generatorShardAwaitingContinue.get(worker)
      ) {
        continue;
      }
      generatorShardAwaitingContinue.set(worker, false);
      worker.postMessage({ type: "continue" });
    }
  };

  // Initialize processor workers with static config once
  processorWorkers.forEach((worker) => {
    workerBusy.set(worker, false);
    worker.postMessage({
      type: "init",
      data: {
        context: serializableContext,
        minStats: plainMinStats,
        echoSetPassiveBuffs: serializableEchoSetPassiveBuffs,
        mainEchoStats: serializableMainEchoStats,
        target,
        damageType,
        rotationData: serializableRotationData,
        topN,
        slimResults,
        requiredSetBonusLabels: [...requiredSetBonusLabels],
      },
    });
    worker.onmessage = (e) => {
      if (e.data.type === "ready") {
        readyWorkers++;
        if (readyWorkers === processorWorkers.length) {
          distributeWork();
        }
      } else if (e.data.type === "result") {
        workerBusy.set(worker, false);
        totalProcessed += e.data.processed || 0;
        callbacks.onProcessed?.(totalProcessed);

        // Workers only return local top-N candidates; merge into global heap
        if (e.data.results && e.data.results.length > 0) {
          for (const result of e.data.results) {
            if (
              !result ||
              !result.loadout ||
              !Array.isArray(result.loadout)
            ) {
              continue;
            }
            if (result.loadout.length === 0) {
              continue;
            }
            const hash = getOptimizerLoadoutHash(result.loadout);
            if (seenCombinations.has(hash)) {
              continue;
            }
            seenCombinations.add(hash);

            // Ensure targetValue is a number
            const targetValue =
              typeof result.targetValue === "number"
                ? result.targetValue
                : Number(result.targetValue);

            if (heap.length < topN) {
              heap.push({
                ...result,
                targetValue,
                id: randomString(),
              });
              // Only sort when heap is full or near full (small heap, so sorting is fast)
              if (heap.length === topN) {
                heap.sort((a, b) => a.targetValue - b.targetValue);
              }
            } else {
              // Heap is full, check if this result is better than the minimum
              const heapMinValue = heap[0].targetValue;

              if (targetValue > heapMinValue) {
                // Replace minimum and bubble down (more efficient than full sort for small heaps)
                heap[0] = {
                  ...result,
                  targetValue,
                  id: randomString(),
                };
                // Bubble down: swap with smaller child until heap property is restored
                let idx = 0;
                while (true) {
                  const left = 2 * idx + 1;
                  const right = 2 * idx + 2;
                  let smallest = idx;

                  if (
                    left < heap.length &&
                    heap[left].targetValue < heap[smallest].targetValue
                  ) {
                    smallest = left;
                  }
                  if (
                    right < heap.length &&
                    heap[right].targetValue < heap[smallest].targetValue
                  ) {
                    smallest = right;
                  }

                  if (smallest === idx) break;

                  [heap[idx], heap[smallest]] = [heap[smallest], heap[idx]];
                  idx = smallest;
                }
              }
            }
          }
        }

        // Optimizer Workspace: throttled snapshot of the current best
        // (heap is a min-heap, so the max isn't heap[0] — scan it; cheap
        // since heap.length is bounded by topN). Only meaningful once the
        // heap has actually filled, otherwise every early insert would
        // trivially look like "the best so far".
        if (heap.length >= topN) {
          const nowMs = performance.now();
          if (nowMs - lastLiveBestUpdateMs >= 1000) {
            let best = heap[0];
            for (let i = 1; i < heap.length; i++) {
              if (heap[i].targetValue > best.targetValue) best = heap[i];
            }
            if (!liveBest || best.targetValue > liveBest.targetValue) {
              liveBest = best;
              callbacks.onLiveBest?.(best);
            }
            lastLiveBestUpdateMs = nowMs;
          }
        }

        // Request more work and unblock generator if queue drained
        distributeWork();
        maybeContinueGenerator();
      } else if (e.data.type === "error") {
        console.error(
          `Processor worker error (batch ${e.data.batchId}):`,
          e.data.error,
        );
        workerBusy.set(worker, false);
        totalProcessed += e.data.processed || 0;
        callbacks.onProcessed?.(totalProcessed);
        distributeWork();
        maybeContinueGenerator();
      } else {
        console.warn("Unknown message type from worker:", e.data);
      }
    };
  });

  // Distribute work to available workers
  const distributeWork = () => {
    // Don't distribute work if workers aren't ready yet
    if (readyWorkers < processorWorkers.length) {
      return;
    }

    while (workQueue.length > 0) {
      const work = workQueue.shift();
      if (!work) break;

      const availableWorker = processorWorkers.find(
        (w) => !workerBusy.get(w),
      );
      if (!availableWorker) {
        // No available workers, put work back at front
        workQueue.unshift(work);
        break;
      }

      workerBusy.set(availableWorker, true);

      try {
        // Slim process payload: static config was sent once on init
        availableWorker.postMessage({
          type: "process",
          data: {
            batch: work.batch,
            batchId: work.batchId,
          },
        });
      } catch (error: any) {
        console.error(
          `Error sending batch ${work.batchId} to worker:`,
          error,
        );
        workerBusy.set(availableWorker, false);
        // Put work back in queue to retry
        workQueue.unshift(work);
      }
    }

    // Unblock generator once queue has room again
    maybeContinueGenerator();

    // Check if we're done
    const allWorkersIdle = processorWorkers.every(
      (w) => !workerBusy.get(w),
    );
    if (generatorAllDone() && workQueue.length === 0 && allWorkersIdle) {
      // Set final results (sorted descending)
      const finalResults = heap
        .slice()
        .sort((a, b) => b.targetValue - a.targetValue);
      cleanupWorkers();
      callbacks.onFinished({
        results: finalResults,
        totalProcessed,
        generatedCount: totalProcessed || totalGenerated() || 0,
      });
    }
  };

  // Generator worker handlers — one per shard (generatorCount is 1 unless the
  // user's chosen worker count is 16+, see splitOptimizerWorkerCount)
  generatorWorkers.forEach((worker, shardIndex) => {
    generatorShardTotal.set(worker, 0);
    generatorShardDone.set(worker, false);
    generatorShardAwaitingContinue.set(worker, false);

    worker.onmessage = (e) => {
      if (e.data.type === "ready") {
        // Start generation - ensure echoes are serializable
        try {
          // Serialize echoes by only including needed properties
          const serializedEchoes = serializeEchoes(echoes);

          // Convert Vue reactive arrays/objects to plain arrays/objects
          // Vue reactive proxies cannot be cloned, so we need to convert them first
          const plainMainEchoKeys = Array.isArray(mainEchoKeys)
            ? [...mainEchoKeys] // Convert Proxy array to plain array
            : mainEchoKeys;

          const messageData = {
            type: "start",
            data: {
              echoes: serializedEchoes,
              mainEchoKeys: plainMainEchoKeys,
              batchSize,
              loadoutFormat,
              shardIndex,
              shardCount: generatorCount,
            },
          };

          worker.postMessage(messageData);
          if (process.env.NODE_ENV === "development") {
            console.log(
              `Successfully sent data to generator worker (shard ${shardIndex})`,
            );
          }
        } catch (error) {
          console.error("Error sending data to generator worker:", error);
          cleanupWorkers();
          callbacks.onAborted?.();
        }
      } else if (e.data.type === "batch") {
        generatorShardTotal.set(worker, e.data.totalGenerated || 0);
        callbacks.onGenerated?.(totalGenerated());

        // This shard is paused until we send "continue"
        generatorShardAwaitingContinue.set(worker, true);

        // Add batch to work queue, deduped against loadouts already seen from other shards
        const batch = dedupeBatchAcrossShards(e.data.batch || []);
        if (batch.length > 0) {
          workQueue.push({
            batch,
            batchId: batchIdCounter++,
          });

          // Distribute work if workers are ready
          if (readyWorkers === processorWorkers.length) {
            distributeWork();
          } else {
            maybeContinueGenerator();
          }
        } else {
          maybeContinueGenerator();
        }
      } else if (e.data.type === "done") {
        generatorShardDone.set(worker, true);
        generatorShardAwaitingContinue.set(worker, false);
        generatorShardTotal.set(
          worker,
          e.data.totalGenerated ?? generatorShardTotal.get(worker) ?? 0,
        );
        callbacks.onGenerated?.(totalGenerated());
        if (generatorAllDone()) {
          callbacks.onSearchComplete?.({ totalGenerated: totalGenerated() });
        }
        distributeWork(); // Process remaining work
      } else if (e.data.type === "error") {
        console.error(
          `Generator worker error (shard ${shardIndex}):`,
          e.data.error,
        );
        generatorShardDone.set(worker, true);
        generatorShardAwaitingContinue.set(worker, false);
        if (generatorAllDone()) {
          callbacks.onGeneratorFailed?.();
        }
        distributeWork();
      } else {
        console.warn(
          "Unknown message type from generator worker:",
          e.data,
        );
      }
    };

    // Initialize this shard
    worker.postMessage({ type: "init" });
  });

  return { cancel: cleanupWorkers };
}
