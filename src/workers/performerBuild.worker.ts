/**
 * Performer Build Worker
 *
 * Computes rotation teammate build contexts from Pinia store data off the main thread.
 * Message flow: init -> ready; compute -> result | error
 */

import type { EchoObject } from "../echoes/stats";
import { buildPerformerAttackContextFromStore } from "../calculator/performerContextFromStore";
import type { PerformerAttackContext } from "../calculator/performerContextFromStore";

type PerformerBuildRequest = {
  performerCharacterKey: string;
  activeCharacterKey: string;
};

type ComputeMessage = {
  type: "compute";
  requestId: string;
  data: {
    requests: PerformerBuildRequest[];
    charactersStore: Record<string, Record<string, unknown>>;
    inventoryEchoesById: Record<string, EchoObject>;
  };
};

type WorkerMessage = { type: "init" } | ComputeMessage;

type WorkerResponse =
  | { type: "ready" }
  | {
      type: "result";
      requestId: string;
      contexts: Record<string, PerformerAttackContext | null>;
    }
  | { type: "error"; requestId?: string; error: string };

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const message = event.data;
  if (message.type === "init") {
    const response: WorkerResponse = { type: "ready" };
    self.postMessage(response);
    return;
  }

  if (message.type !== "compute") {
    return;
  }

  const { requestId, data } = message;
  try {
    const getEchoById = (echoId: string) =>
      data.inventoryEchoesById[echoId] as EchoObject | undefined;
    const contexts: Record<string, PerformerAttackContext | null> = {};

    for (const request of data.requests) {
      const { performerCharacterKey, activeCharacterKey } = request;
      if (
        !performerCharacterKey ||
        performerCharacterKey === activeCharacterKey
      ) {
        continue;
      }
      contexts[performerCharacterKey] =
        await buildPerformerAttackContextFromStore(
          performerCharacterKey,
          activeCharacterKey,
          data.charactersStore,
          getEchoById,
        );
    }

    const response: WorkerResponse = {
      type: "result",
      requestId,
      contexts,
    };
    self.postMessage(response);
  } catch (error) {
    const response: WorkerResponse = {
      type: "error",
      requestId,
      error: error instanceof Error ? error.message : String(error),
    };
    self.postMessage(response);
  }
};

export {};
