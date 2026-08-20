import { applyBuildFields, omitBuildMetadata } from "../characters/buildFields";

/**
 * Returns a `characters` map where `characters[characterId]` is replaced by
 * the named build's data — falling back to the character's own current
 * (active-build) data when `buildId` is null/undefined or doesn't match any
 * stored build (e.g. a team imported into a different profile, or a build
 * that was since deleted; never a hard error).
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
  const build = characterData?.builds?.find((b: { id: string }) => b.id === buildId);
  if (!build) {
    return characters;
  }
  return {
    ...characters,
    [characterId]: applyBuildFields(characterData, omitBuildMetadata(build)),
  };
}
