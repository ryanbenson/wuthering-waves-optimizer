/** Pinia persisted-store keys that hold user data. */
export const PERSISTED_STORE_KEYS = ["character", "inventory"] as const;

export type Migration = {
  /**
   * Target data version after this migration succeeds.
   * Must match `meta.version` in exports (see SettingsExport).
   */
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

export function applyReplacements(
  json: string,
  replacements: ReadonlyArray<readonly [string, string]>,
): string {
  return replacements.reduce(
    (acc, [from, to]) => acc.split(from).join(to),
    json,
  );
}

export function transformPersistedStores(transform: (json: string) => string) {
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
