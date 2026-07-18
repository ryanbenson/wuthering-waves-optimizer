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

function isEmptyPersistedPayload(raw: string): boolean {
  if (!raw || raw === "" || raw === "null" || raw === "{}" || raw === "[]") {
    return true;
  }

  try {
    const data = JSON.parse(raw) as Record<string, unknown>;
    if (Array.isArray(data)) {
      return data.length === 0;
    }
    if (!data || typeof data !== "object") {
      return true;
    }

    // Character store default / empty shell
    if ("characters" in data) {
      const characters = data.characters;
      return (
        !characters ||
        typeof characters !== "object" ||
        Object.keys(characters as object).length === 0
      );
    }

    // Inventory store default / empty shell
    if ("echoes" in data) {
      const echoes = data.echoes;
      const presets = data.echoPresets;
      const hasEchoes = Array.isArray(echoes) && echoes.length > 0;
      const hasPresets = Array.isArray(presets) && presets.length > 0;
      return !hasEchoes && !hasPresets;
    }
  } catch {
    return false;
  }

  return false;
}

/** True when character/inventory keys look like real saved user data. */
export function hasPersistedUserData(): boolean {
  for (const key of PERSISTED_STORE_KEYS) {
    const raw = localStorage.getItem(key);
    if (!raw || isEmptyPersistedPayload(raw)) {
      continue;
    }
    return true;
  }
  return false;
}
