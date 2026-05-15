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
 *
 * Message Flow:
 * 1. Main thread sends "init" -> Worker responds with "ready"
 * 2. Main thread sends "start" with echoes, mainEchoKeys, batchSize
 * 3. Worker generates loadouts and sends "batch" messages as batches fill up
 * 4. Worker sends "done" when all loadouts are generated
 * 5. Worker sends "error" if any errors occur
 *
 * Performance Notes:
 * - Each loadout is cloned before adding to batch (critical: generateLoadouts mutates arrays)
 * - Batches are sent directly without additional cloning (already cloned)
 * - Deduplication happens in the worker to reduce main thread overhead
 */

import {
  generateLoadouts,
  getOptimizerLoadoutKey,
  normalizeOptimizerLoadout,
} from "../calculator/optimizer";

/**
 * Message sent from main thread to generator worker
 */
interface GeneratorMessage {
  type: "init" | "start" | "stop";
  data?: {
    echoes: any[]; // Array of available echoes to combine
    mainEchoKeys: string[]; // Array of main echo keys (for filtering)
    batchSize: number; // Number of loadouts per batch
  };
}

/**
 * Message sent from generator worker to main thread
 */
interface GeneratorResponse {
  type: "batch" | "done" | "error";
  batch?: any[]; // Array of loadout combinations (only for "batch" type)
  totalGenerated?: number; // Total number of unique loadouts generated so far
  /** True when totalGenerated is 0 (no combinations from current echoes / filters) */
  noPossibleLoadouts?: boolean;
  error?: string; // Error message (only for "error" type)
}

self.onmessage = (e: MessageEvent<GeneratorMessage>) => {
  const { type, data } = e.data;

  if (type === "init") {
    // Worker initialized
    self.postMessage({ type: "ready" } as any);
    return;
  }

  if (type === "start" && data) {
    const { echoes, mainEchoKeys, batchSize } = data;
    let batch: any[] = [];
    let totalGenerated = 0;

    try {
      if (!Array.isArray(echoes) || echoes.length === 0) {
        self.postMessage({
          type: "done",
          totalGenerated: 0,
          noPossibleLoadouts: true,
        } as GeneratorResponse);
        return;
      }

      // Track seen combinations to ensure uniqueness
      const seenCombinations = new Set<string>();

      // Generate loadouts in batches
      // @ts-ignore - generateLoadouts returns a generator with any[] items
      // @ts-ignore
      for (const loadout of generateLoadouts(echoes, mainEchoKeys)) {
        const normalizedLoadout = normalizeOptimizerLoadout(loadout as any[]);
        const key = getOptimizerLoadoutKey(normalizedLoadout);

        // Skip if we've already seen this combination
        if (seenCombinations.has(key)) {
          continue;
        }
        seenCombinations.add(key);

        // CRITICAL: Clone the loadout array because generateLoadouts mutates the combo array
        // If we push the reference directly, all loadouts will be the same (the last mutated value)
        const clonedLoadout = JSON.parse(JSON.stringify(normalizedLoadout));
        batch.push(clonedLoadout);
        totalGenerated++;

        // Send batch when it reaches the target size
        if (batch.length >= batchSize) {
          // Batch already contains cloned loadouts, so we can send directly
          self.postMessage({
            type: "batch",
            batch: batch, // Already cloned, no need to clone again
            totalGenerated,
          } as GeneratorResponse);
          batch = [];
        }
      }

      // Send remaining loadouts
      if (batch.length > 0) {
        self.postMessage({
          type: "batch",
          batch: JSON.parse(JSON.stringify(batch)),
          totalGenerated,
        } as GeneratorResponse);
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
};
