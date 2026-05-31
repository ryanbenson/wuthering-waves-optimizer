import type { EchoObject } from "../echoes/stats";
import { buildPerformerAttackContextFromStore } from "./performerContextFromStore";
import type { PerformerAttackContext } from "./performerContextFromStore";
type PerformerBuildRequest = {
  performerCharacterKey: string;
  activeCharacterKey: string;
  activeTeamBuffsData?: Record<string, unknown>;
};

let worker: Worker | null = null;
let workerReady: Promise<void> | null = null;
let requestCounter = 0;

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(
      new URL("../workers/performerBuild.worker.ts", import.meta.url),
      { type: "module" },
    );
    workerReady = new Promise<void>((resolve, reject) => {
      const onMessage = (event: MessageEvent) => {
        if (event.data?.type === "ready") {
          worker?.removeEventListener("message", onMessage);
          resolve();
        } else if (event.data?.type === "error") {
          worker?.removeEventListener("message", onMessage);
          reject(new Error(event.data.error ?? "Performer worker init failed"));
        }
      };
      worker!.addEventListener("message", onMessage);
      worker!.postMessage({ type: "init" });
    });
  }
  return worker;
}

function serializeInventoryEchoes(
  echoes: Array<{ echoId?: string | null } & Record<string, unknown>>,
): Record<string, EchoObject> {
  const byId: Record<string, EchoObject> = {};
  for (const echo of echoes) {
    if (echo?.echoId) {
      byId[String(echo.echoId)] = echo as EchoObject;
    }
  }
  return byId;
}

async function computePerformerContextsOnMainThread(
  requests: PerformerBuildRequest[],
  charactersStore: Record<string, Record<string, unknown>>,
  inventoryEchoes: Array<{ echoId?: string | null } & Record<string, unknown>>,
  activeTeamBuffsData?: Record<string, unknown>,
): Promise<Record<string, PerformerAttackContext | null>> {
  const inventoryEchoesById = serializeInventoryEchoes(inventoryEchoes);
  const getEchoById = (echoId: string) =>
    inventoryEchoesById[echoId] as EchoObject | undefined;
  const contexts: Record<string, PerformerAttackContext | null> = {};
  for (const request of requests) {
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
        charactersStore,
        getEchoById,
        request.activeTeamBuffsData ?? activeTeamBuffsData,
      );
  }
  return contexts;
}

export async function computePerformerContextsFromStore(
  requests: PerformerBuildRequest[],
  charactersStore: Record<string, Record<string, unknown>>,
  inventoryEchoes: Array<{ echoId?: string | null } & Record<string, unknown>>,
  activeTeamBuffsData?: Record<string, unknown>,
): Promise<Record<string, PerformerAttackContext | null>> {
  const uniqueRequests = [
    ...new Map(
      requests.map((request) => [
        `${request.activeCharacterKey}:${request.performerCharacterKey}`,
        {
          ...request,
          activeTeamBuffsData:
            request.activeTeamBuffsData ?? activeTeamBuffsData,
        },
      ]),
    ).values(),
  ];

  if (!uniqueRequests.length) {
    return {};
  }

  if (typeof Worker === "undefined") {
    return computePerformerContextsOnMainThread(
      uniqueRequests,
      charactersStore,
      inventoryEchoes,
      activeTeamBuffsData,
    );
  }

  try {
    const performerWorker = getWorker();
    await workerReady;

    const requestId = String(++requestCounter);
    const charactersStorePlain = JSON.parse(JSON.stringify(charactersStore));
    const inventoryEchoesById = serializeInventoryEchoes(inventoryEchoes);

    return await new Promise((resolve, reject) => {
      const onMessage = (event: MessageEvent) => {
        if (event.data?.requestId !== requestId) {
          return;
        }
        performerWorker.removeEventListener("message", onMessage);
        if (event.data?.type === "result") {
          resolve(event.data.contexts ?? {});
        } else {
          reject(
            new Error(event.data?.error ?? "Performer worker compute failed"),
          );
        }
      };
      performerWorker.addEventListener("message", onMessage);
      performerWorker.postMessage({
        type: "compute",
        requestId,
        data: {
          requests: uniqueRequests,
          charactersStore: charactersStorePlain,
          inventoryEchoesById,
          activeTeamBuffsData,
        },
      });
    });
  } catch {
    return computePerformerContextsOnMainThread(
      uniqueRequests,
      charactersStore,
      inventoryEchoes,
      activeTeamBuffsData,
    );
  }
}

export function terminatePerformerBuildWorker() {
  worker?.terminate();
  worker = null;
  workerReady = null;
}
