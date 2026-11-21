/**
 * Groups scanned echoes by who Wavescan saw wearing them (`equippedBy`), so
 * the import can equip each character the way they are in game. Pure — the
 * Settings panel shows the groups for review and applies them.
 * See docs/wavescan-import.md.
 */
import { PLAYER_CHARACTER_KEY } from "@wutheringtools/scanner-core/equippedBy";
import type { WavescanEchoMapResult } from "./echoes";

/**
 * What groupWavescanLoadouts reads from a Wavescan import (WavescanEchoMapResult),
 * narrowed so the echo scanner can pass inventory echoes too.
 */
export type WavescanLoadoutInput = {
  echoes: readonly { echoId: string; type: number | null }[];
  skipped: readonly Pick<WavescanEchoMapResult["skipped"][number], "equippedBy">[];
  equippedBy: WavescanEchoMapResult["equippedBy"];
};

export const LOADOUT_SLOTS = 5;
export const MAX_LOADOUT_COST = 12;

export type WavescanLoadoutGroup = {
  /** `equippedBy` as written in the file. */
  wearer: string;
  /** The character key, or null for the main character, which the user picks. */
  characterKey: string | null;
  isPlayer: boolean;
  /** Mapped echo ids, highest cost first, file order within a cost. */
  echoIds: string[];
  /** Two or more echoes share the top cost, so the main echo is a guess. */
  mainEchoGuessed: boolean;
  /** Echoes this character wears that were skipped as invalid. */
  skippedCount: number;
  /** Why this loadout can't be equipped as scanned, or null. */
  blockedReason: string | null;
};

export type WavescanLoadoutPlan = {
  groups: WavescanLoadoutGroup[];
  /** `equippedBy` values that aren't a known character. Imported unequipped. */
  unmatched: { wearer: string; count: number }[];
};

/**
 * `knownKeys` is every character key this app has. The main character is
 * written as `PLAYER_CHARACTER_KEY` because the game shows the player's
 * name, not which Rover; the user picks which Rover entry it is.
 */
export function groupWavescanLoadouts(
  mapped: WavescanLoadoutInput,
  knownKeys: Iterable<string>,
): WavescanLoadoutPlan {
  const known = new Set(knownKeys);
  const groups = new Map<string, WavescanLoadoutGroup>();
  const unmatched = new Map<string, number>();
  const costById = new Map(mapped.echoes.map((echo) => [echo.echoId, Number(echo.type)]));

  for (const echo of mapped.echoes) {
    const wearer = mapped.equippedBy[echo.echoId];
    if (!wearer) continue;
    const isPlayer = wearer === PLAYER_CHARACTER_KEY;
    if (!isPlayer && !known.has(wearer)) {
      unmatched.set(wearer, (unmatched.get(wearer) ?? 0) + 1);
      continue;
    }
    let group = groups.get(wearer);
    if (!group) {
      group = {
        wearer,
        characterKey: isPlayer ? null : wearer,
        isPlayer,
        echoIds: [],
        mainEchoGuessed: false,
        skippedCount: 0,
        blockedReason: null,
      };
      groups.set(wearer, group);
    }
    group.echoIds.push(echo.echoId);
  }

  for (const skip of mapped.skipped) {
    const group = skip.equippedBy ? groups.get(skip.equippedBy) : undefined;
    if (group) group.skippedCount++;
  }

  for (const group of groups.values()) {
    group.echoIds = sortByCostDesc(group.echoIds, costById);
    const costs = group.echoIds.map((id) => costById.get(id) ?? 0);
    group.mainEchoGuessed = costs.length > 1 && costs[0] === costs[1];
    const total = costs.reduce((sum, cost) => sum + cost, 0);
    if (group.echoIds.length > LOADOUT_SLOTS) {
      group.blockedReason = `Wavescan listed ${group.echoIds.length} echoes, but a character can only equip ${LOADOUT_SLOTS}.`;
    } else if (total > MAX_LOADOUT_COST) {
      group.blockedReason = `These echoes cost ${total}, over the limit of ${MAX_LOADOUT_COST}.`;
    }
  }

  return {
    groups: [...groups.values()],
    unmatched: [...unmatched].map(([wearer, count]) => ({ wearer, count })),
  };
}

/** Stable: echoes with the same cost keep their order. */
function sortByCostDesc(ids: string[], costById: Map<string, number>): string[] {
  return ids
    .map((id, index) => ({ id, index, cost: costById.get(id) ?? 0 }))
    .sort((a, b) => b.cost - a.cost || a.index - b.index)
    .map(({ id }) => id);
}

/** Moves the id at `from` to `to`, returning a new array. */
export function moveLoadoutEcho(ids: string[], from: number, to: number): string[] {
  if (from === to || from < 0 || to < 0 || from >= ids.length || to >= ids.length) {
    return ids;
  }
  const next = [...ids];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved!);
  return next;
}

/** Five slots, empty ones null. */
export function padLoadout(ids: readonly (string | null | undefined)[]): (string | null)[] {
  return Array.from({ length: LOADOUT_SLOTS }, (_, index) => ids[index] ?? null);
}

/** Same echo in every slot, in the same order. */
export function isSameLoadout(
  current: readonly (string | null | undefined)[],
  next: readonly (string | null | undefined)[],
): boolean {
  const a = padLoadout(current);
  const b = padLoadout(next);
  return a.every((id, index) => id === b[index]);
}

/**
 * Echoes in `echoIds` that another character has equipped now. Equipping
 * them here takes them off that character, the same as in game.
 * `equipped` is the inventory store's `{ echoId: { character: slot } }` map.
 */
export function findEquippedElsewhere(
  equipped: Record<string, Record<string, number>>,
  characterKey: string,
  echoIds: readonly (string | null)[],
): { echoId: string; characterKey: string; slot: number }[] {
  const found: { echoId: string; characterKey: string; slot: number }[] = [];
  for (const echoId of echoIds) {
    if (!echoId) continue;
    for (const [other, slot] of Object.entries(equipped[echoId] ?? {})) {
      if (other !== characterKey) found.push({ echoId, characterKey: other, slot });
    }
  }
  return found;
}

/**
 * Which Rover entry an echo "equipped by the player" most likely belongs to:
 * the only Rover the user has set up, else the active character if it's a
 * Rover, else null (the user has to pick).
 */
export function defaultRoverKey(
  roverKeys: readonly string[],
  ownedKeys: readonly string[],
  activeCharacter: string,
): string | null {
  const owned = roverKeys.filter((key) => ownedKeys.includes(key));
  if (owned.length === 1) return owned[0]!;
  if (roverKeys.includes(activeCharacter)) return activeCharacter;
  return null;
}

/** `base`, or `base (2)`, `base (3)`… when a build already has that name. */
export function nextBuildName(base: string, existingNames: readonly string[]): string {
  if (!existingNames.includes(base)) return base;
  let n = 2;
  while (existingNames.includes(`${base} (${n})`)) n++;
  return `${base} (${n})`;
}
