/**
 * Turns Wavescan echo rows into inventory echoes, and works out what an
 * append or replace import will change (ADR 0038). Pure — no stores — so
 * the Settings panel just applies the plan.
 */
import { getCostByClass, mainEchoesData } from "../echoes";
import { echoSetLabelMap, statsTable, subStatRanges, subStats } from "../echoes/stats";
import { getEchoIdentityKey } from "../utils/echoIdentity";
import { randomString } from "../utils/strings";
import type { WavescanEcho } from "./format";

const MAX_SUBSTATS = 5;

export type WavescanInventoryEcho = {
  echoId: string;
  echo: string;
  echoSet: string;
  type: number;
  rank: number;
  stat: string;
  echoSubStatsType1: string | null;
  echoSubStatsValue1: number | null;
  echoSubStatsType2: string | null;
  echoSubStatsValue2: number | null;
  echoSubStatsType3: string | null;
  echoSubStatsValue3: number | null;
  echoSubStatsType4: string | null;
  echoSubStatsValue4: number | null;
  echoSubStatsType5: string | null;
  echoSubStatsValue5: number | null;
};

export type WavescanSkippedEcho = {
  /** Position in the file's `echoes` array, 1-based for display. */
  position: number;
  scanId: string | null;
  echo: string | null;
  reason: string;
};

export type WavescanEchoMapResult = {
  echoes: WavescanInventoryEcho[];
  skipped: WavescanSkippedEcho[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Returns why the row can't be imported, or null when it's valid. */
function getInvalidReason(row: unknown): string | null {
  if (!isRecord(row)) {
    return "Not an echo object";
  }
  const { echo, echoSet, cost, rank, stat, substats } = row;

  const echoData = typeof echo === "string" ? mainEchoesData[echo] : undefined;
  if (!echoData) {
    return `Unknown echo "${String(echo)}"`;
  }
  if (typeof echoSet !== "string" || !echoSetLabelMap[echoSet]) {
    return `Unknown echo set "${String(echoSet)}"`;
  }
  if (!echoData.sets.includes(echoSet)) {
    return `${echoData.name} can't roll the ${echoSetLabelMap[echoSet]} set`;
  }
  const expectedCost = getCostByClass(echoData.class);
  if (cost !== expectedCost) {
    return `Cost ${String(cost)} doesn't match ${echoData.name} (cost ${expectedCost})`;
  }
  if (typeof rank !== "number" || !Number.isInteger(rank)) {
    return "Missing rarity";
  }
  if (typeof stat !== "string" || !statsTable[expectedCost]?.[stat]) {
    return `"${String(stat)}" isn't a valid main stat for a cost ${expectedCost} echo`;
  }
  if (statsTable[expectedCost][stat][rank] === undefined) {
    return `Rarity ${rank} isn't supported`;
  }

  if (!Array.isArray(substats) || substats.length > MAX_SUBSTATS) {
    return "Substats are missing or there are more than 5";
  }
  const seenTypes = new Set<string>();
  for (const substat of substats) {
    if (!isRecord(substat) || typeof substat.type !== "string") {
      return "A substat is malformed";
    }
    const { type, value } = substat;
    if (!subStats.includes(type)) {
      return `Unknown substat "${type}"`;
    }
    if (seenTypes.has(type)) {
      return `Substat ${type} appears twice`;
    }
    seenTypes.add(type);
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
      return `Substat ${type} has an invalid value`;
    }
    // Roll ranges are for 5-star echoes; lower rarities roll lower.
    const range = subStatRanges[type];
    if (rank === 5 && range && (value < range.min || value > range.max)) {
      return `Substat ${type} value ${value} is outside its roll range (${range.min}–${range.max})`;
    }
  }
  return null;
}

function toInventoryEcho(row: WavescanEcho, echoId: string): WavescanInventoryEcho {
  const slot = (index: number) => row.substats[index];
  return {
    echoId,
    echo: row.echo,
    echoSet: row.echoSet,
    type: row.cost,
    rank: row.rank,
    stat: row.stat,
    echoSubStatsType1: slot(0)?.type ?? null,
    echoSubStatsValue1: slot(0)?.value ?? null,
    echoSubStatsType2: slot(1)?.type ?? null,
    echoSubStatsValue2: slot(1)?.value ?? null,
    echoSubStatsType3: slot(2)?.type ?? null,
    echoSubStatsValue3: slot(2)?.value ?? null,
    echoSubStatsType4: slot(3)?.type ?? null,
    echoSubStatsValue4: slot(3)?.value ?? null,
    echoSubStatsType5: slot(4)?.type ?? null,
    echoSubStatsValue5: slot(4)?.value ?? null,
  };
}

/**
 * Validates each row against this app's echo data and maps the valid ones
 * to the inventory shape. Invalid rows are reported, never guessed at — a
 * wrong echo silently in the inventory is worse than a skipped one.
 *
 * `takenIds` are echo ids already in use, so generated ids never collide.
 */
export function mapWavescanEchoes(
  rows: unknown[],
  takenIds: Iterable<string> = [],
): WavescanEchoMapResult {
  const usedIds = new Set(takenIds);
  const nextId = () => {
    let id = randomString();
    while (usedIds.has(id)) id = randomString();
    usedIds.add(id);
    return id;
  };

  const echoes: WavescanInventoryEcho[] = [];
  const skipped: WavescanSkippedEcho[] = [];
  rows.forEach((row, index) => {
    const reason = getInvalidReason(row);
    if (reason) {
      const record = isRecord(row) ? row : {};
      skipped.push({
        position: index + 1,
        scanId: typeof record.scanId === "string" ? record.scanId : null,
        echo: typeof record.echo === "string" ? record.echo : null,
        reason,
      });
      return;
    }
    echoes.push(toInventoryEcho(row as WavescanEcho, nextId()));
  });
  return { echoes, skipped };
}

export type WavescanImportMode = "append" | "replace";

type ExistingEcho = Parameters<typeof getEchoIdentityKey>[0] & {
  echoId: string;
  locked?: boolean;
};

export type WavescanEchoImportPlan = {
  toAdd: WavescanInventoryEcho[];
  /** Inventory echo ids to delete before adding (replace mode only). */
  toRemoveIds: string[];
  /** Scanned echoes that are already in the (kept) inventory. */
  alreadyOwnedCount: number;
  /** Locked echoes that replace mode keeps. */
  keptLockedCount: number;
};

/**
 * Append keeps every inventory echo; replace removes all but the locked
 * ones. Either way, scanned echoes that exactly match a kept echo are not
 * added again. Matching is counted, not set-based: an unleveled echo can
 * legitimately appear twice with identical stats, so two scanned copies
 * against one owned copy still adds one.
 */
export function planWavescanEchoImport(
  scanned: WavescanInventoryEcho[],
  inventory: ExistingEcho[],
  mode: WavescanImportMode,
): WavescanEchoImportPlan {
  const kept = mode === "replace" ? inventory.filter((echo) => echo.locked) : inventory;
  const toRemoveIds =
    mode === "replace"
      ? inventory.filter((echo) => !echo.locked).map((echo) => echo.echoId)
      : [];

  const ownedCounts = new Map<string, number>();
  for (const echo of kept) {
    const key = getEchoIdentityKey(echo);
    ownedCounts.set(key, (ownedCounts.get(key) ?? 0) + 1);
  }

  const toAdd: WavescanInventoryEcho[] = [];
  let alreadyOwnedCount = 0;
  for (const echo of scanned) {
    const key = getEchoIdentityKey(echo);
    const owned = ownedCounts.get(key) ?? 0;
    if (owned > 0) {
      ownedCounts.set(key, owned - 1);
      alreadyOwnedCount++;
    } else {
      toAdd.push(echo);
    }
  }

  return {
    toAdd,
    toRemoveIds,
    alreadyOwnedCount,
    keptLockedCount: mode === "replace" ? kept.length : 0,
  };
}
