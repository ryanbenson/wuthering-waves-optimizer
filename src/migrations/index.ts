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

import { hasPersistedUserData, type Migration } from "./types";
import renameSunSinkingEclipse from "./versions/003_renameSunSinkingEclipse";

/** localStorage key that mirrors export `meta.version`. */
export const DATA_VERSION_KEY = "dataVersion";

/**
 * Latest data version. Bump when adding a migration.
 * Also written to export `meta.version`.
 */
export const CURRENT_DATA_VERSION = 3;

/**
 * Version assumed when an existing user has data but no data-version key yet
 * (v2 export-format era, before schema migrations).
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

/** Resolve a version number from export `meta`. */
export function parseMetaDataVersion(meta?: {
  version?: string | number;
}): number {
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

/**
 * Read-only version lookup. Does not write localStorage.
 * Missing key → baseline (2) when the caller already knows data exists.
 */
export function getStoredDataVersion(): number {
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
 * Version to embed in exports. Prefer the stored key; otherwise current.
 */
export function getExportDataVersion(): number {
  const stored = parseVersion(localStorage.getItem(DATA_VERSION_KEY));
  return stored ?? CURRENT_DATA_VERSION;
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
 *
 * Empty profiles are a true no-op (no localStorage writes). Writing during
 * module init can prevent the document `load` event from firing in Cypress.
 *
 * Cypress also skips this entirely — fixtures are already at current schema,
 * and import applies transforms via applyMigrationTransforms.
 */
export function runMigrations() {
  if (typeof window !== "undefined" && (window as any)?.Cypress) {
    return;
  }

  const explicitVersion = parseVersion(localStorage.getItem(DATA_VERSION_KEY));

  // Brand-new / empty profile: nothing to upgrade, don't touch storage
  if (explicitVersion == null && !hasPersistedUserData()) {
    return;
  }

  let version = explicitVersion ?? BASELINE_DATA_VERSION;
  const pending = migrations
    .filter((migration) => migration.version > version)
    .sort((a, b) => a.version - b.version);

  for (const migration of pending) {
    migration.up();
    version = migration.version;
    setStoredDataVersion(version);
  }

  // Stamp current for profiles that already had data at the latest schema
  if (parseVersion(localStorage.getItem(DATA_VERSION_KEY)) == null) {
    setStoredDataVersion(CURRENT_DATA_VERSION);
  }
}
