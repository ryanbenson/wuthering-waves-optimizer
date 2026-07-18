/**
 * App data version + migrations.
 *
 * `meta.version` in exports and the localStorage data-version key share one
 * timeline:
 *   1 — legacy export (character payload only, no meta wrapper)
 *   2 — { meta, data: { character, inventory } } export format
 *   3 — rename SunSinkingEclipse / Sun-sinking Eclipse → Havoc Eclipse
 *
 * On load, compare the user's version to CURRENT_DATA_VERSION and run each
 * pending migration in order.
 *
 * To add a migration:
 * 1. Increment CURRENT_DATA_VERSION
 * 2. Add `versions/00N_description.ts` that default-exports a Migration
 * 3. Import it and append it to `migrations` below (keep sorted by version)
 */

import type { Migration } from "./types";
import renameSunSinkingEclipse from "./versions/003_renameSunSinkingEclipse";

/** localStorage key that mirrors export `meta.version`. */
export const DATA_VERSION_KEY = "dataVersion";

/**
 * Interim key from the first migration draft. Migrated away on read.
 * @deprecated
 */
const LEGACY_STORAGE_VERSION_KEY = "storageVersion";

/**
 * Latest data version. Bump when adding a migration.
 * Also written to export `meta.version`.
 */
export const CURRENT_DATA_VERSION = 3;

/**
 * Version assumed when no data-version key exists yet (users already on the
 * v2 export-format era, before schema migrations).
 */
export const BASELINE_DATA_VERSION = 2;

/**
 * Ordered migrations. Append only — never reorder or renumber.
 * Each file's `version` must match CURRENT when it is the newest.
 */
const migrations: Migration[] = [renameSunSinkingEclipse];

function parseVersion(raw: string | null | undefined): number | null {
  if (raw == null || raw === "") {
    return null;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Resolve a version number from export `meta` (and interim storageVersion).
 */
export function parseMetaDataVersion(meta?: {
  version?: string | number;
  storageVersion?: number;
}): number {
  // Interim exports used storageVersion: 1 for the rename under old numbering
  if (meta?.storageVersion === 1) {
    return 3;
  }
  const fromMeta = parseVersion(
    meta?.version == null ? null : String(meta.version),
  );
  if (fromMeta != null) {
    return fromMeta;
  }
  return 1;
}

/** True when the backup uses { meta, data: { character, inventory } }. */
export function hasNestedExportFormat(meta?: {
  version?: string | number;
}): boolean {
  return parseMetaDataVersion(meta) >= 2;
}

export function getStoredDataVersion(): number {
  // Fold interim key into the unified timeline
  const legacy = parseVersion(localStorage.getItem(LEGACY_STORAGE_VERSION_KEY));
  if (legacy === 1) {
    localStorage.removeItem(LEGACY_STORAGE_VERSION_KEY);
    setStoredDataVersion(3);
    return 3;
  }
  if (legacy != null) {
    localStorage.removeItem(LEGACY_STORAGE_VERSION_KEY);
  }

  const stored = parseVersion(localStorage.getItem(DATA_VERSION_KEY));
  if (stored == null) {
    return BASELINE_DATA_VERSION;
  }
  return stored;
}

export function setStoredDataVersion(version: number) {
  localStorage.setItem(DATA_VERSION_KEY, String(version));
}

/**
 * Apply every migration transform newer than `fromVersion` to a JSON string.
 * Useful when importing backups that predate the current schema.
 */
export function applyMigrationTransforms(
  json: string,
  fromVersion = BASELINE_DATA_VERSION,
): string {
  return migrations
    .filter((migration) => migration.version > fromVersion)
    .sort((a, b) => a.version - b.version)
    .reduce((acc, migration) => {
      if (!migration.transform) {
        return acc;
      }
      return migration.transform(acc);
    }, json);
}

/**
 * Runs all migrations newer than the user's stored version.
 * Must run before Pinia stores hydrate from localStorage.
 */
export function runMigrations() {
  let version = getStoredDataVersion();
  const pending = migrations
    .filter((migration) => migration.version > version)
    .sort((a, b) => a.version - b.version);

  for (const migration of pending) {
    migration.up();
    version = migration.version;
    setStoredDataVersion(version);
  }

  // Ensure the key exists even when there was nothing pending (e.g. fresh install)
  if (parseVersion(localStorage.getItem(DATA_VERSION_KEY)) == null) {
    setStoredDataVersion(CURRENT_DATA_VERSION);
  }
}
