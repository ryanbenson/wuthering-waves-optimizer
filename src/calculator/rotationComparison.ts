import { getCharByName } from "../characters/characters";
import { FALLBACK_ATTACK_GROUP_PRIORITY } from "./liveResultBar";
import type { CharacterRotationInput } from "./characterRotation";

/**
 * Picks what a swap-impact estimate should compare against: the character's
 * first saved rotation if one exists (mirrors `buildLiveResultBarTarget`'s
 * `{type: "rotation"}` preference — first saved rotation, no further
 * ranking), else a synthetic one-action "rotation" built from the highest-
 * priority attack group that actually has attacks (mirrors
 * `fallbackLiveResultBarTarget`'s group priority, but resolved directly
 * against the character's own attack definitions instead of already-
 * computed `allDamages`, since this runs headlessly). Returns `null` when
 * neither exists — callers should treat that as "nothing to compare
 * against" rather than guessing.
 *
 * Shared by every swap-impact estimator (weapons, echoes): nothing here is
 * specific to what is being swapped, only to which rotation the before/after
 * damage numbers are measured on, so both callers stay on one definition of
 * "the comparison target".
 */
export async function resolveComparisonRotation(
  characterId: string,
  characters: Record<string, any>,
  previewId = "swap-impact-preview",
  previewName = "Swap impact preview",
): Promise<CharacterRotationInput | null> {
  const characterData = characters?.[characterId] ?? {};
  const savedRotations = characterData.rotations as CharacterRotationInput[] | undefined;
  if (savedRotations?.length) {
    return savedRotations[0];
  }

  const chosenChar = (await getCharByName(characterId)) as Record<string, any> | null;
  for (const group of FALLBACK_ATTACK_GROUP_PRIORITY) {
    const list = chosenChar?.[group]?.attacks;
    if (Array.isArray(list) && list.length) {
      const type = group.slice(0, -"Attacks".length);
      return {
        id: previewId,
        name: previewName,
        duration: null,
        actions: [{ id: "preview", key: list[0].key, type, count: 1 }],
      };
    }
  }
  return null;
}
