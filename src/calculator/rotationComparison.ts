import { getCharByName } from "../characters/characters";
import { FALLBACK_ATTACK_GROUP_PRIORITY } from "./liveResultBar";
import type { CharacterRotationInput } from "./characterRotation";

export interface ComparisonTargetOptions {
  /**
   * The exact `"Rotation:id"` / `"Attack:group|key"` / `"Stat:key"` string
   * the caller is currently showing for this character — same vocabulary as
   * `CalculatorOptimizerTarget.vue`/the Live Result Bar
   * (`liveResultBarTarget`, persisted per-character in
   * `settingsStore.config.liveResultBarByCharacter`). When resolvable, this
   * is used INSTEAD of the "first saved rotation" heuristic below: matching
   * the exact number the user is watching change is far more useful than a
   * plausible-looking guess, and a character can have several saved
   * rotations where "first" isn't the one currently on screen. A `"Stat:"`
   * target has no rotation equivalent and always falls through to the
   * heuristic, same as an unresolvable/stale target (e.g. a since-deleted
   * rotation id).
   */
  target?: string | null;
}

function resolveExplicitTarget(
  characterData: Record<string, any>,
  target: string,
  previewId: string,
  previewName: string,
): CharacterRotationInput | null {
  const separatorIndex = target.indexOf(":");
  if (separatorIndex === -1) return null;
  const type = target.slice(0, separatorIndex);
  const rest = target.slice(separatorIndex + 1);

  if (type === "Rotation") {
    const savedRotations = characterData.rotations as CharacterRotationInput[] | undefined;
    return savedRotations?.find((r) => r.id === rest) ?? null;
  }

  if (type === "Attack") {
    const pipeIndex = rest.indexOf("|");
    if (pipeIndex === -1) return null;
    const group = rest.slice(0, pipeIndex);
    const key = rest.slice(pipeIndex + 1);
    return {
      id: previewId,
      name: previewName,
      duration: null,
      actions: [{ id: "preview", key, type: group.slice(0, -"Attacks".length), count: 1 }],
    };
  }

  // "Stat:" targets aren't a damage rotation at all — nothing to mirror.
  return null;
}

/**
 * Picks what a swap-impact estimate should compare against.
 *
 * Prefers `options.target` when given and resolvable (see
 * `ComparisonTargetOptions`). Otherwise falls back to the character's first
 * saved rotation if one exists (mirrors `buildLiveResultBarTarget`'s
 * `{type: "rotation"}` preference — first saved rotation, no further
 * ranking), else a synthetic one-action "rotation" built from the highest-
 * priority attack group that actually has attacks (mirrors
 * `fallbackLiveResultBarTarget`'s group priority, but resolved directly
 * against the character's own attack definitions instead of already-
 * computed `allDamages`, since this runs headlessly). Returns `null` when
 * nothing resolves — callers should treat that as "nothing to compare
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
  options: ComparisonTargetOptions = {},
): Promise<CharacterRotationInput | null> {
  const characterData = characters?.[characterId] ?? {};

  if (options.target) {
    const resolved = resolveExplicitTarget(characterData, options.target, previewId, previewName);
    if (resolved) return resolved;
  }

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
