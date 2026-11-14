/**
 * Who is wearing an echo, split into the active resonator and everyone else.
 *
 * `equipped` is the inventory store's map, `{ echoId: { characterKey: slot } }`.
 * A key being present means that resonator has the echo on (the store deletes
 * the key when it is taken off), and one echo can be on several resonators.
 */
export interface EchoEquippedBy {
  onActive: boolean;
  /** Other resonators wearing the echo, in the order they equipped it. */
  others: string[];
}

export function getEchoEquippedBy(
  equipped: Record<string, Record<string, number>> | null | undefined,
  echoId: string | null | undefined,
  activeCharacter: string | null | undefined,
): EchoEquippedBy {
  if (!echoId) return { onActive: false, others: [] };
  const characters = Object.keys(equipped?.[echoId] ?? {});
  return {
    onActive: Boolean(activeCharacter) && characters.includes(activeCharacter as string),
    others: characters.filter((character) => character !== activeCharacter),
  };
}

/**
 * Whether a loadout is already what `character` is wearing: every echo in it
 * is on that resonator and the loadout's main echo (its first entry) is in
 * slot 0. The order of the other slots doesn't matter — re-equipping would
 * only shuffle them. A different main echo is a different build (main echo
 * buff, damage), so it doesn't count as equipped.
 */
export function isLoadoutEquipped(
  equipped: Record<string, Record<string, number>> | null | undefined,
  loadoutEchoIds: (string | null | undefined)[],
  character: string | null | undefined,
): boolean {
  if (!character || loadoutEchoIds.length === 0) return false;
  if (loadoutEchoIds.some((echoId) => !echoId)) return false;
  if (equipped?.[loadoutEchoIds[0] as string]?.[character] !== 0) return false;
  return loadoutEchoIds.every((echoId) => equipped?.[echoId as string]?.[character] !== undefined);
}
