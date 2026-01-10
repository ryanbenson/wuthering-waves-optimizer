// Generator Worker - Generates loadouts in batches
import { generateLoadouts } from "../calculator/optimizer";

// Message types
interface GeneratorMessage {
  type: "init" | "start" | "stop";
  data?: {
    echoes: any[];
    mainEchoKeys: string[];
    batchSize: number;
  };
}

interface GeneratorResponse {
  type: "batch" | "done" | "error";
  batch?: any[];
  totalGenerated?: number;
  error?: string;
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
      // Track seen combinations to ensure uniqueness
      const seenCombinations = new Set<string>();
      let generatorDuplicates = 0;

      // Generate loadouts in batches
      // @ts-ignore - generateLoadouts returns a generator with any[] items
      let rawGenerated = 0;
      // @ts-ignore
      for (const loadout of generateLoadouts(echoes, mainEchoKeys)) {
        rawGenerated++;
        // Create a unique key for this combination
        const echoIds: string[] = [];
        const loadoutArray = loadout as any[];
        for (const e of loadoutArray) {
          if (e && e.echoId) {
            echoIds.push(String(e.echoId));
          }
        }
        echoIds.sort();
        const key = echoIds.join("|");

        // Skip if we've already seen this combination
        if (seenCombinations.has(key)) {
          generatorDuplicates++;
          continue;
        }
        seenCombinations.add(key);

        // CRITICAL: Clone the loadout array because generateLoadouts mutates the combo array
        // If we push the reference directly, all loadouts will be the same (the last mutated value)
        const clonedLoadout = JSON.parse(JSON.stringify(loadout));
        batch.push(clonedLoadout);
        totalGenerated++;

        // Send batch when it reaches the target size
        if (batch.length >= batchSize) {
          // Deep clone and verify echoIds are preserved
          const clonedBatch = JSON.parse(JSON.stringify(batch));
          // Log first loadout's structure to verify it's correct
          if (clonedBatch.length > 0 && totalGenerated === batchSize) {
            const firstLoadout = clonedBatch[0];
            const firstEchoIds = firstLoadout
              ?.map((e: any) => e?.echoId)
              .filter((id: any) => id != null);
            console.log(`Generator: First loadout in first batch:`, {
              isArray: Array.isArray(firstLoadout),
              length: Array.isArray(firstLoadout) ? firstLoadout.length : "N/A",
              echoIds: firstEchoIds,
              firstEcho: firstLoadout?.[0]
                ? {
                    echoId: firstLoadout[0].echoId,
                    echo: firstLoadout[0].echo,
                    type: firstLoadout[0].type,
                  }
                : "N/A",
            });
          }
          self.postMessage({
            type: "batch",
            batch: clonedBatch,
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
      console.log(
        `Generator complete: ${rawGenerated} raw loadouts from generator, ${totalGenerated} unique after deduplication, ${generatorDuplicates} duplicates filtered`,
      );
      self.postMessage({
        type: "done",
        totalGenerated,
      } as GeneratorResponse);
    } catch (error: any) {
      self.postMessage({
        type: "error",
        error: error?.message || "Unknown error",
      } as GeneratorResponse);
    }
  }
};
