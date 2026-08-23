/**
 * A character's stored data (`characters[id]` in the `character` store) is
 * split into two categories:
 *
 * - Shared/permanent fields (`characterLevel`, `talents`, `substatWeights`) —
 *   progression facts and preferences about the character itself, unaffected
 *   by which build is active.
 * - Everything else — the build. This is a denylist rather than an
 *   allowlist deliberately: any new field added to a character record in
 *   the future is automatically build-scoped without this file needing an
 *   update, matching issue #278's "keep the data structure as-is, and that
 *   is the equipped build" approach.
 *
 * Pure, no Vue/Pinia — used by both the character store (equip/switch a
 * build at runtime) and the version-8 migration (seed a "Default" build for
 * existing characters), so the two can never drift on what counts as build
 * data.
 */

const SHARED_FIELD_KEYS = ["characterLevel", "talents", "substatWeights"] as const;
const BOOKKEEPING_KEYS = ["builds", "activeBuildId"] as const;
const BUILD_METADATA_KEYS = ["id", "name", "createdAt", "updatedAt"] as const;

/**
 * Deep-clones plain, JSON-serializable data. Character records live in a
 * Pinia store, so callers here are often handed a reactive Vue Proxy rather
 * than a plain object — `structuredClone` can't clone those directly, and
 * this data is JSON-persisted to localStorage anyway (see
 * `docs/src-stores.md`), so a JSON round-trip is both safe and matches how
 * this data is treated everywhere else.
 */
function deepClone<T>(value: T): T {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

/**
 * Extracts a build-entry's worth of fields from a character record. Deletes
 * the excluded keys from a shallow copy *before* cloning — `builds` in
 * particular can be large (every other build's own data), so this avoids
 * deep-cloning it just to throw it away.
 */
export function extractBuildFields(
  characterData: Record<string, any>,
): Record<string, any> {
  const shallow = { ...(characterData ?? {}) };
  for (const key of SHARED_FIELD_KEYS) {
    delete shallow[key];
  }
  for (const key of BOOKKEEPING_KEYS) {
    delete shallow[key];
  }
  return deepClone(shallow);
}

/**
 * Returns a new character record with `characterData`'s shared fields
 * preserved and every other field replaced by a deep clone of
 * `buildFields`. Never mutates either input.
 */
export function applyBuildFields(
  characterData: Record<string, any>,
  buildFields: Record<string, any>,
): Record<string, any> {
  const preserved: Record<string, any> = {};
  for (const key of SHARED_FIELD_KEYS) {
    if (characterData && key in characterData) {
      preserved[key] = characterData[key];
    }
  }
  for (const key of BOOKKEEPING_KEYS) {
    if (characterData && key in characterData) {
      preserved[key] = characterData[key];
    }
  }

  return {
    ...deepClone(buildFields ?? {}),
    ...preserved,
  };
}

/**
 * Strips a build entry's own metadata (`id`, `name`, `createdAt`,
 * `updatedAt`) down to just its build-data fields — the shape
 * `applyBuildFields` expects as its second argument when equipping a build
 * onto the live character record.
 */
export function omitBuildMetadata(build: Record<string, any>): Record<string, any> {
  const shallow = { ...(build ?? {}) };
  for (const key of BUILD_METADATA_KEYS) {
    delete shallow[key];
  }
  return deepClone(shallow);
}
