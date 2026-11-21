/**
 * What a saved scan changes besides the inventory rows: the loadouts to equip (every
 * scanned echo whose panel said "Equipped by <character>") and the game's lock / discard
 * marks. Both find each scanned echo in the inventory by identity, so an echo that was
 * already owned counts too. The loadouts are grouped and ordered the way a Wavescan
 * import is (groupWavescanLoadouts: highest cost first, over-limit loadouts blocked)
 * and written through useWavescanLoadouts' applyLoadoutWrites.
 */
import type { ParsedEchoSlot } from "./types";
import { mapParsedEchoes, type MappedEcho } from "../echoes/parsedEchoMapping";
import { getEchoIdentityKey } from "../utils/echoIdentity";
import { groupWavescanLoadouts, padLoadout, type WavescanLoadoutInput } from "../wavescan/loadouts";
import type { WavescanLoadoutWrite } from "../composables/useWavescanLoadouts";

/** The game shows this echo as discarded (marked as trash). Locked wins, as in game. */
export function isGameTrash(slot: ParsedEchoSlot): boolean {
  return Boolean(slot.trash) && !slot.locked;
}

/**
 * Finds a scanned slot's echo in the inventory by identity. The identity has no level
 * or unique id, so identical copies (+0 fodder is common) can't be told apart: when more
 * than one inventory echo matches, this returns undefined rather than guess.
 */
function inventoryMatcher<T extends MappedEcho>(inventoryEchoes: readonly T[]) {
  const byIdentity = new Map<string, T[]>();
  for (const echo of inventoryEchoes) {
    const key = getEchoIdentityKey(echo);
    byIdentity.set(key, [...(byIdentity.get(key) ?? []), echo]);
  }
  return (slot: ParsedEchoSlot): T | undefined => {
    const [mapped] = mapParsedEchoes([slot], false);
    const matches = byIdentity.get(getEchoIdentityKey(mapped));
    return matches?.length === 1 && matches[0].echoId ? matches[0] : undefined;
  };
}

/**
 * The game's lock / discard marks to add to scanned echoes found in the inventory.
 * Add-only: a mark the app has and the game doesn't show is kept. A lock the game shows
 * is added, and replaces a discard mark set in the app (the app keeps the two exclusive,
 * as the game does; `replacedDiscard` says so). A discard mark is only added to an echo
 * with no mark in the app: never to one locked there (a misread can't take away its
 * delete protection) or kept for testing (`temp`, which "delete all discarded" would
 * then remove). An echo kept for testing gets no lock either, since locking clears `temp`.
 * Applied with useEchoInventory's setEchoLocked / setEchoTrash.
 */
export function planScannedMarks(
  slots: readonly ParsedEchoSlot[],
  inventoryEchoes: readonly (MappedEcho & { locked?: boolean; trash?: boolean; temp?: boolean })[],
): ScannedMark[] {
  const find = inventoryMatcher(inventoryEchoes);
  const changes = new Map<string, ScannedMark>();
  for (const slot of slots) {
    if (!slot.echo || !(slot.locked || isGameTrash(slot))) continue;
    const echo = find(slot);
    if (!echo?.echoId || echo.temp) continue;
    if (slot.locked) {
      if (!echo.locked) {
        changes.set(echo.echoId, { echoId: echo.echoId, mark: "locked", replacedDiscard: Boolean(echo.trash) });
      }
    } else if (!echo.trash && !echo.locked) {
      changes.set(echo.echoId, { echoId: echo.echoId, mark: "trash", replacedDiscard: false });
    }
  }
  return [...changes.values()];
}

export type ScannedMark = { echoId: string; mark: "locked" | "trash"; replacedDiscard: boolean };

export function planScannedLoadouts(
  slots: readonly ParsedEchoSlot[],
  inventoryEchoes: readonly MappedEcho[],
  characterKeys: Iterable<string>,
): { writes: WavescanLoadoutWrite[]; blocked: { characterKey: string; reason: string }[] } {
  const find = inventoryMatcher(inventoryEchoes);
  const echoes: (MappedEcho & { echoId: string })[] = [];
  const equippedBy: Record<string, string> = {};
  for (const slot of slots) {
    if (!slot.equippedBy || !slot.echo) continue;
    const echo = find(slot);
    if (!echo?.echoId || equippedBy[echo.echoId]) continue;
    echoes.push({ ...echo, echoId: echo.echoId });
    equippedBy[echo.echoId] = slot.equippedBy;
  }

  const input: WavescanLoadoutInput = { echoes, skipped: [], equippedBy };
  const { groups } = groupWavescanLoadouts(input, characterKeys);
  const byId = new Map(echoes.map((echo) => [echo.echoId, echo]));
  const writes: WavescanLoadoutWrite[] = [];
  const blocked: { characterKey: string; reason: string }[] = [];
  for (const group of groups) {
    if (!group.characterKey) continue;
    if (group.blockedReason) {
      blocked.push({ characterKey: group.characterKey, reason: group.blockedReason });
      continue;
    }
    const main = byId.get(group.echoIds[0]);
    writes.push({
      characterKey: group.characterKey,
      echoIds: padLoadout(group.echoIds),
      mainEcho: main?.echo ? { echo: main.echo, rank: main.rank ?? 5 } : null,
    });
  }
  return { writes, blocked };
}
