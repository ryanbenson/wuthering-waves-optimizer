import { applyBuildFields, omitBuildMetadata } from "../characters/buildFields";

/**
 * Returns a `characters` map where `characters[characterId]` is replaced by
 * the named build's data — falling back to the character's own current
 * (live) data when `buildId` is null/undefined, doesn't match any stored
 * build (e.g. a team imported into a different profile, or a build that was
 * since deleted; never a hard error), or *is* the character's currently
 * active build.
 *
 * That last case matters because a build's own entry inside `builds[]` is
 * only refreshed at the moment the store's `equipBuild` switches away from
 * it (see `src/stores/character.js`) — so between switches it can be stale.
 * The character record's live top-level fields are the active build's true
 * current state, not whatever `builds[]` last had cached. A caller can end
 * up pinning a slot to the active build's id (not just leaving it
 * null/undefined to mean "active") whenever a build picker lets you choose
 * any build including the active one — e.g. Team Rotations' per-slot build
 * picker — so this can't be narrowed to "only happens when buildId is
 * null."
 *
 * Used by Team Rotations' per-slot build override so a rotation can use a
 * build other than whichever one is currently active, without touching
 * `buildCharacterCalculationContext`'s own signature — mirrors
 * `applyAdvancedOverrides`'s synthetic-characters-map pattern
 * (`rotationAdvancedBuffs.ts`, issue #401's per-action buff overrides).
 */
export function resolveCharactersForBuild(
  characters: Record<string, any>,
  characterId: string,
  buildId: string | null | undefined,
): Record<string, any> {
  if (!buildId) {
    return characters;
  }
  const characterData = characters?.[characterId];
  if (buildId === characterData?.activeBuildId) {
    return characters;
  }
  const build = characterData?.builds?.find((b: { id: string }) => b.id === buildId);
  if (!build) {
    return characters;
  }
  return {
    ...characters,
    [characterId]: applyBuildFields(characterData, omitBuildMetadata(build)),
  };
}

/**
 * Alias of `resolveCharactersForBuild` for build *preview* call sites
 * (Manage Builds' rich per-build cards, the Team Rotations build picker),
 * which always pass a real build id — including the active build's — rather
 * than relying on `null` to mean "active." Kept as a separate name so those
 * call sites read clearly; the underlying behavior (and the active-build
 * staleness guard) is identical.
 */
export function resolveCharactersForBuildPreview(
  characters: Record<string, any>,
  characterId: string,
  buildId: string,
): Record<string, any> {
  return resolveCharactersForBuild(characters, characterId, buildId);
}
