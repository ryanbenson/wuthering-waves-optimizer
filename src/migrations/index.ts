/**
 * Local storage schema migrations.
 *
 * On app load, compare the user's stored version to CURRENT_STORAGE_VERSION.
 * Each pending migration runs in order, then the stored version is bumped.
 *
 * To add a migration:
 * 1. Increment CURRENT_STORAGE_VERSION
 * 2. Append an entry to `migrations` with that version number
 * 3. Prefer idempotent `transform` helpers so imports of old backups stay safe
 */

export const STORAGE_VERSION_KEY = "storageVersion";

/** Latest storage schema version. Bump when adding a migration. */
export const CURRENT_STORAGE_VERSION = 1;

/** Pinia persisted-store keys that hold user data. */
const PERSISTED_STORE_KEYS = ["character", "inventory"] as const;

type Migration = {
  /** Target version after this migration succeeds (1-based, sequential). */
  version: number;
  description: string;
  /**
   * Optional pure transform for JSON strings. Used by imports and by `up`
   * when rewriting persisted store keys.
   */
  transform?: (json: string) => string;
  /** Mutates localStorage (and anything else) for this version bump. */
  up: () => void;
};

function applyReplacements(
  json: string,
  replacements: ReadonlyArray<readonly [string, string]>,
): string {
  return replacements.reduce(
    (acc, [from, to]) => acc.split(from).join(to),
    json,
  );
}

function transformPersistedStores(
  transform: (json: string) => string,
) {
  for (const key of PERSISTED_STORE_KEYS) {
    const raw = localStorage.getItem(key);
    if (!raw) {
      continue;
    }
    const next = transform(raw);
    if (next !== raw) {
      localStorage.setItem(key, next);
    }
  }
}

/** Renames for Sun-sinking Eclipse → Havoc Eclipse (keys + display labels). */
const RENAME_SUN_SINKING_ECLIPSE = [
  // Longer / display labels first is unnecessary here: the base phrase
  // also rewrites "… 2 Set" and "… 5 Set" as substrings.
  ["Sun-sinking Eclipse", "Havoc Eclipse"],
  ["SunSinkingEclipse", "HavocEclipse"],
] as const;

function renameSunSinkingEclipse(json: string): string {
  return applyReplacements(json, RENAME_SUN_SINKING_ECLIPSE);
}

/**
 * Ordered list of migrations. Append only — never reorder or renumber.
 */
const migrations: Migration[] = [
  {
    version: 1,
    description:
      "Rename echo set SunSinkingEclipse / Sun-sinking Eclipse → Havoc Eclipse",
    transform: renameSunSinkingEclipse,
    up() {
      transformPersistedStores(renameSunSinkingEclipse);
    },
  },
];

export function getStoredStorageVersion(): number {
  const raw = localStorage.getItem(STORAGE_VERSION_KEY);
  if (raw == null || raw === "") {
    return 0;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function setStoredStorageVersion(version: number) {
  localStorage.setItem(STORAGE_VERSION_KEY, String(version));
}

/**
 * Apply every migration transform newer than `fromVersion` to a JSON string.
 * Useful when importing backups that predate the current schema.
 */
export function applyMigrationTransforms(
  json: string,
  fromVersion = 0,
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
  let version = getStoredStorageVersion();
  const pending = migrations
    .filter((migration) => migration.version > version)
    .sort((a, b) => a.version - b.version);

  for (const migration of pending) {
    migration.up();
    version = migration.version;
    setStoredStorageVersion(version);
  }
}
