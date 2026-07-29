import { getMainEchoBuffs, migrateLegacyMainEchoBuffState } from "../../echoes/mainEchoBuffs";
import { mainEchoesData } from "../../echoes/index";
import { transformPersistedStores, type Migration } from "../types";

type BuffState = { isEnabled?: boolean; stacks?: number };

function migrateMainEcho(mainEcho: Record<string, unknown>) {
  const echoKey = mainEcho.echo;
  if (typeof echoKey !== "string" || !echoKey) {
    return;
  }

  const echoData = mainEchoesData[echoKey];
  const buffs = getMainEchoBuffs(echoData);
  const migrated = migrateLegacyMainEchoBuffState(
    mainEcho as {
      isEnabled?: boolean;
      stacks?: number;
      buffs?: Record<string, BuffState>;
    },
    buffs,
  );
  if (!migrated) {
    return;
  }

  mainEcho.buffs = migrated;
  delete mainEcho.isEnabled;
  delete mainEcho.stacks;
}

function migrateOptimizerMainEchoBuffs(mainEchoBuffs: unknown) {
  if (!mainEchoBuffs || typeof mainEchoBuffs !== "object" || Array.isArray(mainEchoBuffs)) {
    return;
  }

  for (const [echoKey, entry] of Object.entries(
    mainEchoBuffs as Record<string, unknown>,
  )) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      continue;
    }
    const record = entry as Record<string, unknown>;
    const echoData = mainEchoesData[echoKey];
    const buffs = getMainEchoBuffs(echoData);
    const migrated = migrateLegacyMainEchoBuffState(
      record as {
        isEnabled?: boolean;
        stacks?: number;
        buffs?: Record<string, BuffState>;
      },
      buffs,
    );
    if (!migrated) {
      continue;
    }
    record.buffs = migrated;
    delete record.isEnabled;
    delete record.stacks;
  }
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
    const record = character as Record<string, unknown>;
    if (record.mainEcho && typeof record.mainEcho === "object") {
      migrateMainEcho(record.mainEcho as Record<string, unknown>);
    }
    const optimizer = record.optimizer;
    if (optimizer && typeof optimizer === "object") {
      migrateOptimizerMainEchoBuffs(
        (optimizer as Record<string, unknown>).mainEchoBuffs,
      );
    }
  }
}

function migrateParsedData(data: unknown) {
  if (!data || typeof data !== "object") {
    return;
  }
  const obj = data as Record<string, unknown>;

  // Direct character-store payload
  if ("characters" in obj) {
    migrateCharacterData(obj);
    return;
  }

  // Nested export: { data: { character: "<json string>" } } or already-parsed
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

export function migrateMainEchoBuffs(json: string): string {
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
  version: 4,
  description:
    "Move mainEcho.isEnabled/stacks and optimizer.mainEchoBuffs into per-buff maps",
  transform: migrateMainEchoBuffs,
  up() {
    transformPersistedStores(migrateMainEchoBuffs);
  },
};

export default migration;
