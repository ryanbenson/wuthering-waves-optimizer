/**
 * Loadouts to equip after a scan is saved: every scanned echo whose panel said
 * "Equipped by <character>", found in the inventory by identity (so an echo that
 * was already owned counts too), grouped and ordered the way a Wavescan import is
 * (groupWavescanLoadouts: highest cost first, over-limit loadouts blocked).
 * The writes go through useWavescanLoadouts' applyLoadoutWrites.
 */
import type { ParsedEchoSlot } from "./types";
import { mapParsedEchoes, type MappedEcho } from "../echoes/parsedEchoMapping";
import { getEchoIdentityKey } from "../utils/echoIdentity";
import { groupWavescanLoadouts, padLoadout } from "../wavescan/loadouts";
import type { WavescanLoadoutWrite } from "../composables/useWavescanLoadouts";

/**
 * The game's lock / discard marks for every scanned echo found in the inventory by
 * identity, where they differ from what the inventory has. Applied with useEchoInventory's
 * setEchoLocked / setEchoTrash, which keep the two exclusive like the game does.
 */
export function planScannedMarks(
  slots: readonly ParsedEchoSlot[],
  inventoryEchoes: readonly (MappedEcho & { locked?: boolean; trash?: boolean })[],
): { echoId: string; locked: boolean; trash: boolean }[] {
  const byIdentity = new Map(inventoryEchoes.map((echo) => [getEchoIdentityKey(echo), echo]));
  const changes = new Map<string, { echoId: string; locked: boolean; trash: boolean }>();
  for (const slot of slots) {
    if (!slot.echo || slot.locked === undefined) continue;
    const [mapped] = mapParsedEchoes([slot], false);
    const echo = byIdentity.get(getEchoIdentityKey(mapped));
    if (!echo?.echoId) continue;
    const locked = Boolean(slot.locked);
    const trash = !locked && Boolean(slot.trash);
    if (Boolean(echo.locked) !== locked || Boolean(echo.trash) !== trash) {
      changes.set(echo.echoId, { echoId: echo.echoId, locked, trash });
    }
  }
  return [...changes.values()];
}

export function planScannedLoadouts(
  slots: readonly ParsedEchoSlot[],
  inventoryEchoes: readonly MappedEcho[],
  characterKeys: Iterable<string>,
): { writes: WavescanLoadoutWrite[]; blocked: { characterKey: string; reason: string }[] } {
  const byIdentity = new Map(inventoryEchoes.map((echo) => [getEchoIdentityKey(echo), echo]));
  const echoes: MappedEcho[] = [];
  const equippedBy: Record<string, string> = {};
  for (const slot of slots) {
    if (!slot.equippedBy || !slot.echo) continue;
    const [mapped] = mapParsedEchoes([slot], false);
    const echo = byIdentity.get(getEchoIdentityKey(mapped));
    if (!echo?.echoId || equippedBy[echo.echoId]) continue;
    echoes.push(echo);
    equippedBy[echo.echoId] = slot.equippedBy;
  }

  const { groups } = groupWavescanLoadouts({ echoes, skipped: [], equippedBy } as never, characterKeys);
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
