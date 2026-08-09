/**
 * Generator Worker
 *
 * This web worker is responsible for generating echo loadout combinations in batches.
 * It uses the `generateLoadouts` generator function to create all possible combinations
 * of echoes, filters duplicates, and sends batches to the main thread for processing.
 *
 * Architecture:
 * - Runs in a separate thread to avoid blocking the UI
 * - Generates loadouts incrementally using a generator function
 * - Deduplicates loadouts using a Set of combination keys
 * - Sends batches of loadouts to the main thread for distribution to processor workers
 * - Uses pull-based backpressure: after each batch, waits for "continue" from main
 * - Optionally runs as one of several shards (shardIndex/shardCount in "start" data), each
 *   covering a disjoint slice of the top-level search space; the main thread is responsible
 *   for deduping across shards since a local Set only catches duplicates within one shard
 *
 * Message Flow:
 * 1. Main thread sends "init" -> Worker responds with "ready"
 * 2. Main thread sends "start" with echoes, mainEchoKeys, batchSize
 * 3. Worker generates one batch, sends "batch", then waits for "continue"
 * 4. Main sends "continue" when the work queue has room
 * 5. Worker sends "done" when all loadouts are generated
 * 6. Worker sends "error" if any errors occur
 *
 * Performance Notes:
 * - Each loadout array is shallow-cloned before adding to batch (generateLoadouts mutates the combo array;
 *   echo objects themselves are treated as immutable and are structured-cloned on postMessage)
 * - Deduplication uses hashed signature keys so the Set does not retain multi-GB strings at scale
 * - Pull-based continue prevents unbounded queue growth on the main thread
 */

import {
  generateLoadouts,
  getOptimizerLoadoutHash,
  normalizeOptimizerLoadout,
  filterEchoesForOptimizer,
  normalizeLoadoutFormat,
  type OptimizerLoadoutFormat,
} from "../calculator/optimizer";

/**
 * Message sent from main thread to generator worker
 */
interface GeneratorMessage {
  type: "init" | "start" | "continue" | "stop";
  data?: {
    echoes: any[]; // Array of available echoes to combine
    mainEchoKeys: string[]; // Array of main echo keys (for filtering)
    batchSize: number; // Number of loadouts per batch
    loadoutFormat?: OptimizerLoadoutFormat | string; // Cost composition constraint
    /** This worker's slice index when generation is sharded across multiple generator workers. */
    shardIndex?: number;
    /** Total number of generator shards; 1 (default) means no sharding. */
    shardCount?: number;
  };
}

/**
 * Message sent from generator worker to main thread
 */
interface GeneratorResponse {
  type: "batch" | "done" | "error" | "ready";
  batch?: any[]; // Array of loadout combinations (only for "batch" type)
  totalGenerated?: number; // Total number of unique loadouts generated so far
  /** True when totalGenerated is 0 (no combinations from current echoes / filters) */
  noPossibleLoadouts?: boolean;
  error?: string; // Error message (only for "error" type)
}

let continueResolve: (() => void) | null = null;
let stopped = false;

function waitForContinue(): Promise<void> {
  if (stopped) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    continueResolve = resolve;
  });
}

function signalContinue(): void {
  const resolve = continueResolve;
  continueResolve = null;
  resolve?.();
}

self.onmessage = (e: MessageEvent<GeneratorMessage>) => {
  const { type, data } = e.data;

  if (type === "init") {
    self.postMessage({ type: "ready" } as GeneratorResponse);
    return;
  }

  if (type === "continue") {
    signalContinue();
    return;
  }

  if (type === "stop") {
    stopped = true;
    signalContinue();
    return;
  }

  if (type === "start" && data) {
    void runGeneration(data);
  }
};

async function runGeneration(data: NonNullable<GeneratorMessage["data"]>) {
  const {
    echoes,
    mainEchoKeys,
    batchSize,
    loadoutFormat,
    shardIndex = 0,
    shardCount = 1,
  } = data;
  const format = normalizeLoadoutFormat(loadoutFormat);
  const optimizerEchoes = filterEchoesForOptimizer(echoes) as any[];
  let batch: any[] = [];
  let totalGenerated = 0;
  stopped = false;
  continueResolve = null;

  try {
    if (!Array.isArray(optimizerEchoes) || optimizerEchoes.length === 0) {
      self.postMessage({
        type: "done",
        totalGenerated: 0,
        noPossibleLoadouts: true,
      } as GeneratorResponse);
      return;
    }

    // Track seen combinations as 64-bit signature hashes (same uniqueness as full keys, far less RAM)
    const seenCombinations = new Set<bigint>();

    // Generate loadouts in batches
    // @ts-ignore - generateLoadouts returns a generator with any[] items
    // @ts-ignore
    for (const loadout of generateLoadouts(
      optimizerEchoes,
      mainEchoKeys,
      0,
      [],
      0,
      new Set(),
      new Set(),
      format,
      undefined,
      shardIndex,
      shardCount,
    )) {
      if (stopped) {
        break;
      }

      const normalizedLoadout = normalizeOptimizerLoadout(loadout as any[]);
      const hash = getOptimizerLoadoutHash(normalizedLoadout);

      // Skip if we've already seen this combination
      if (seenCombinations.has(hash)) {
        continue;
      }
      seenCombinations.add(hash);

      // CRITICAL: Snapshot the loadout array because generateLoadouts mutates the combo via push/pop.
      // Echo objects are immutable here; postMessage structured-clones the batch for the main thread.
      batch.push(normalizedLoadout.slice());
      totalGenerated++;

      // Send batch when it reaches the target size, then wait for backpressure clearance
      if (batch.length >= batchSize) {
        self.postMessage({
          type: "batch",
          batch: batch,
          totalGenerated,
        } as GeneratorResponse);
        batch = [];
        await waitForContinue();
      }
    }

    if (stopped) {
      return;
    }

    // Send remaining loadouts
    if (batch.length > 0) {
      self.postMessage({
        type: "batch",
        batch,
        totalGenerated,
      } as GeneratorResponse);
      batch = [];
      await waitForContinue();
    }

    if (stopped) {
      return;
    }

    // Signal completion
    self.postMessage({
      type: "done",
      totalGenerated,
      noPossibleLoadouts: totalGenerated === 0,
    } as GeneratorResponse);
  } catch (error: any) {
    self.postMessage({
      type: "error",
      error: error?.message || "Unknown error",
    } as GeneratorResponse);
  }
}
