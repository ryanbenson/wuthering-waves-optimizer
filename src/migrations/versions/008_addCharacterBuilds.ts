import { randomString } from "../../utils/strings";
import { extractBuildFields } from "../../characters/buildFields";
import { transformPersistedStores, type Migration } from "../types";

/**
 * Seeds a single "Default build" for a character record that doesn't have
 * `builds` yet, using the same `extractBuildFields` helper the character
 * store uses at runtime (see `src/characters/buildFields.ts`) so migration
 * and runtime can never disagree on what counts as build data. Idempotent:
 * a character that already has a non-empty `builds` array is left
 * untouched, so re-running this transform (e.g. via `applyMigrationTransforms`
 * against an already-migrated backup) is always a no-op.
 */
function migrateCharacterRecord(character: Record<string, unknown>) {
  if (Array.isArray(character.builds) && character.builds.length > 0) {
    return;
  }

  const build = {
    id: randomString(12),
    name: "Default build",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...extractBuildFields(character),
  };
  character.builds = [build];
  character.activeBuildId = build.id;
}

function migrateCharacterData(data: Record<string, unknown>) {
  const characters = data.characters;
  if (!characters || typeof characters !== "object") {
    return;
  }

  for (const character of Object.values(characters)) {
    if (!character || typeof character !== "object") {
      continue;
    }
    migrateCharacterRecord(character as Record<string, unknown>);
  }
}

/**
 * Handles both shapes this transform can see: the raw `character` store
 * payload (`{ characters, activeCharacter, favoriteCharacters }`, as stored
 * directly in localStorage) and a nested export/import payload
 * (`{ meta, data: { character: "<json string>" | {...} } }`), mirroring
 * `007_mainEchoBuffs.ts`'s dispatch.
 */
function migrateParsedData(data: unknown) {
  if (!data || typeof data !== "object") {
    return;
  }
  const obj = data as Record<string, unknown>;

  if ("characters" in obj) {
    migrateCharacterData(obj);
    return;
  }

  const nested = obj.data;
  if (nested && typeof nested === "object") {
    const nestedObj = nested as Record<string, unknown>;
    if (typeof nestedObj.character === "string") {
      try {
        const characterData = JSON.parse(nestedObj.character);
        migrateCharacterData(characterData);
        nestedObj.character = JSON.stringify(characterData);
      } catch {
        // ignore invalid character JSON
      }
      return;
    }
    if (nestedObj.character && typeof nestedObj.character === "object") {
      migrateCharacterData(nestedObj.character as Record<string, unknown>);
    }
  }
}

export function addCharacterBuilds(json: string): string {
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
  version: 8,
  description:
    "Add builds[]/activeBuildId to character records, seeding a 'Default build' from each character's existing data (issue #278)",
  transform: addCharacterBuilds,
  up() {
    transformPersistedStores(addCharacterBuilds);
  },
};

export default migration;
