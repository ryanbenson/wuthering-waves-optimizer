import { getCharByName } from "../characters/characters";
import type { EchoObject } from "../echoes/stats";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import {
  buildEchoStatsFromCharacterStore,
  buildWeaponDataFromCharacterStore,
  readCharacterComputedBuild,
  resolvePerformerCharacterKey,
  type CharacterComputedBuildCache,
  type TeamBuffsState,
} from "./rotationPerformer";
import { computeTeamBuffsDataFromStore } from "./teamBuffsFromStore";

type CharacterStoreEntry = Record<string, unknown>;

export async function computeCharacterComputedBuildFromStore(
  characterKey: string,
  charStore: CharacterStoreEntry,
  charactersStore: Record<string, CharacterStoreEntry>,
): Promise<CharacterComputedBuildCache> {
  const inventoryStore = useInventoryStore();
  const getEchoById = (echoId: string) =>
    inventoryStore.getEchoById(echoId) as EchoObject | undefined;
  const chosenChar = (await getCharByName(characterKey)) as Record<
    string,
    unknown
  >;
  const echoStats = buildEchoStatsFromCharacterStore(
    characterKey,
    charStore,
    getEchoById,
  );
  const weaponData = await buildWeaponDataFromCharacterStore(
    characterKey,
    charStore,
    chosenChar,
  );
  const teamBuffsData = computeTeamBuffsDataFromStore(
    characterKey,
    charactersStore,
  );
  return {
    echoStats: JSON.parse(JSON.stringify(echoStats)),
    teamBuffsData: JSON.parse(JSON.stringify(teamBuffsData)),
    weaponData: {
      attack: weaponData.attack,
      modifier: weaponData.modifier,
      modifierValue: weaponData.modifierValue,
      weaponPassiveStats: JSON.parse(
        JSON.stringify(weaponData.weaponPassiveStats ?? {}),
      ),
    },
  };
}

/** Party / rotation characters that may need a stored build snapshot while another character is active. */
export function collectPartyCharacterKeys(
  activeCharacterKey: string,
  charactersStore: Record<string, CharacterStoreEntry>,
  rotations?: Array<{ actions?: Array<{ performer?: string }> }>,
): string[] {
  const keys = new Set<string>();
  const teamBuffs = (charactersStore[activeCharacterKey]?.teamBuffs ??
    {}) as TeamBuffsState;

  if (teamBuffs.selectedCharacter1) {
    keys.add(teamBuffs.selectedCharacter1);
  }
  if (teamBuffs.selectedCharacter2) {
    keys.add(teamBuffs.selectedCharacter2);
  }
  for (const performerKey of Object.keys(teamBuffs.rotationPerformers ?? {})) {
    keys.add(performerKey);
  }
  for (const rotation of rotations ?? []) {
    for (const action of rotation.actions ?? []) {
      keys.add(
        resolvePerformerCharacterKey(
          action.performer as never,
          activeCharacterKey,
          teamBuffs,
        ),
      );
    }
  }
  keys.delete(activeCharacterKey);
  return [...keys];
}

export async function refreshPartyComputedBuildsFromStore(
  activeCharacterKey: string,
  charactersStore: Record<string, CharacterStoreEntry>,
  options?: {
    rotations?: Array<{ actions?: Array<{ performer?: string }> }>;
  },
): Promise<void> {
  if (!activeCharacterKey) {
    return;
  }
  const characterStore = useCharacterStore();
  const partyKeys = collectPartyCharacterKeys(
    activeCharacterKey,
    charactersStore,
    options?.rotations,
  );

  await Promise.all(
    partyKeys.map(async (characterKey) => {
      const charStore = charactersStore[characterKey];
      if (!charStore) {
        return;
      }
      const computedBuild = await computeCharacterComputedBuildFromStore(
        characterKey,
        charStore,
        charactersStore,
      );
      const existing = readCharacterComputedBuild(charStore) ?? {};
      const merged: CharacterComputedBuildCache = {
        ...existing,
        ...computedBuild,
      };
      await characterStore.setCharacterData(characterKey, {
        computedBuild: merged,
      });
      charStore.computedBuild = merged;
    }),
  );
}
