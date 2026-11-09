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
