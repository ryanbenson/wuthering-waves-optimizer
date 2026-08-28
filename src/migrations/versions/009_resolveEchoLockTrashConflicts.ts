import { transformPersistedStores, type Migration } from "../types";

/**
 * `locked` and `trash` used to be independent flags, so an echo could end up
 * with both set. They're now mutually exclusive (see useEchoInventory.ts) —
 * locked wins, since it's the deliberate "protect this echo" state.
 * Idempotent: an echo that isn't both locked and trash is left untouched.
 */
function resolveEchoConflict(echo: Record<string, unknown>) {
  if (echo.locked && echo.trash) {
    echo.trash = false;
  }
}

function resolveEchoCollection(echoes: unknown) {
  if (!echoes) {
    return;
  }
  const list = Array.isArray(echoes) ? echoes : Object.values(echoes);
  for (const echo of list) {
    if (echo && typeof echo === "object") {
      resolveEchoConflict(echo as Record<string, unknown>);
    }
  }
}

function migrateParsedData(data: unknown) {
  if (Array.isArray(data)) {
    for (const item of data) {
      if (item && typeof item === "object") {
        resolveEchoConflict(item as Record<string, unknown>);
      }
    }
    return;
  }

  if (!data || typeof data !== "object") {
    return;
  }

  const obj = data as Record<string, unknown>;
  if (obj.echoes) {
    resolveEchoCollection(obj.echoes);
  }
}

export function resolveEchoLockTrashConflicts(json: string): string {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return json;
  }

  migrateParsedData(data);
  return JSON.stringify(data);
}

const migration: Migration = {
  version: 9,
  description:
    "Resolve echoes with both locked and trash set — locked wins now that they're mutually exclusive",
  transform: resolveEchoLockTrashConflicts,
  up() {
    transformPersistedStores(resolveEchoLockTrashConflicts);
  },
};

export default migration;
