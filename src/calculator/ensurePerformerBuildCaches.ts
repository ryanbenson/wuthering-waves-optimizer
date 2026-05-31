import { getCharByName } from "../characters/characters";
import type { EchoObject } from "../echoes/stats";
import {
  readCachedEchoStats,
  readCachedWeaponStats,
} from "./performerBuildDebug";
import {
  buildEchoStatsFromCharacterStore,
  buildWeaponDataFromCharacterStore,
  resolvePerformerCharacterKey,
  type TeamBuffsState,
} from "./rotationPerformer";

type CharacterStoreEntry = Record<string, unknown>;

/** Pre-populates cached echo/weapon stat snapshots from inventory when missing. */
export async function ensurePerformerBuildCaches(
  rotation: { actions: Array<Record<string, unknown>> },
  activeCharacterKey: string,
  charactersStore: Record<string, CharacterStoreEntry>,
  getEchoById: (echoId: string) => EchoObject | undefined,
  persistCache: (
    characterKey: string,
    patch: Record<string, unknown>,
  ) => Promise<void>,
): Promise<Record<string, CharacterStoreEntry>> {
  const teamBuffs = (charactersStore[activeCharacterKey]?.teamBuffs ??
    {}) as TeamBuffsState;
  const performerKeys = new Set<string>();
  for (const action of rotation.actions) {
    const performerCharacterKey = resolvePerformerCharacterKey(
      (action.performer as string) ?? "active",
      activeCharacterKey,
      teamBuffs,
    );
    if (
      performerCharacterKey &&
      performerCharacterKey !== activeCharacterKey
    ) {
      performerKeys.add(performerCharacterKey);
    }
  }

  const nextStore = { ...charactersStore };
  for (const performerKey of performerKeys) {
    const charStore = nextStore[performerKey] ?? {};
    const hasEchoCache = Boolean(readCachedEchoStats(charStore));
    const hasWeaponCache = Boolean(readCachedWeaponStats(charStore));
    if (hasEchoCache && hasWeaponCache) {
      continue;
    }

    const chosenChar = (await getCharByName(performerKey)) as Record<
      string,
      unknown
    >;
    const patch: Record<string, unknown> = {};
    if (!hasEchoCache) {
      patch.cachedEchoStats = buildEchoStatsFromCharacterStore(
        performerKey,
        charStore,
        getEchoById,
      );
    }
    if (!hasWeaponCache) {
      patch.cachedWeaponStats = await buildWeaponDataFromCharacterStore(
        performerKey,
        charStore,
        chosenChar,
      );
    }
    await persistCache(performerKey, patch);
    nextStore[performerKey] = { ...charStore, ...patch };
  }

  return nextStore;
}
