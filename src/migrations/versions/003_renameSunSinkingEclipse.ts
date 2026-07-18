import { transformPersistedStores, type Migration } from "../types";

const SET_KEY_RENAMES: Record<string, string> = {
  SunSinkingEclipse: "HavocEclipse",
};

const SET_LABEL_RENAMES: Record<string, string> = {
  "Sun-sinking Eclipse": "Havoc Eclipse",
  "Sun-sinking Eclipse 2 Set": "Havoc Eclipse 2 Set",
  "Sun-sinking Eclipse 5 Set": "Havoc Eclipse 5 Set",
};

/** Cheap check — avoids parse/walk when the old names are absent. */
function needsRename(json: string): boolean {
  return (
    json.includes("SunSinkingEclipse") || json.includes("Sun-sinking Eclipse")
  );
}

function renameSetToken(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }
  return SET_KEY_RENAMES[value] ?? SET_LABEL_RENAMES[value] ?? value;
}

function renamePassiveKeys(passives: unknown) {
  if (!passives || typeof passives !== "object" || Array.isArray(passives)) {
    return;
  }
  const record = passives as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (!key.includes("SunSinkingEclipse")) {
      continue;
    }
    const nextKey = key.split("SunSinkingEclipse").join("HavocEclipse");
    if (nextKey !== key) {
      record[nextKey] = record[key];
      delete record[key];
    }
  }
}

function renameEchoFields(echo: Record<string, unknown>) {
  if ("echoSet" in echo) {
    echo.echoSet = renameSetToken(echo.echoSet);
  }
}

function renameEchoCollection(echoes: unknown) {
  if (!echoes) {
    return;
  }
  const list = Array.isArray(echoes) ? echoes : Object.values(echoes);
  for (const echo of list) {
    if (echo && typeof echo === "object") {
      renameEchoFields(echo as Record<string, unknown>);
    }
  }
}

function renameEchoSetBonus(bonus: unknown) {
  if (!bonus || typeof bonus !== "object") {
    return;
  }
  const record = bonus as Record<string, unknown>;
  for (const key of ["setBonusOnePiece", "setBonusOne", "setBonusTwo"]) {
    if (key in record) {
      record[key] = renameSetToken(record[key]);
    }
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
    const char = character as Record<string, unknown>;
    renameEchoCollection(char.echoes);
    renameEchoSetBonus(char.echoSetBonus);
    renamePassiveKeys(char.echoSetPassives);

    const optimizer = char.optimizer;
    if (optimizer && typeof optimizer === "object") {
      const opt = optimizer as Record<string, unknown>;
      if (Array.isArray(opt.echoSets)) {
        opt.echoSets = opt.echoSets.map((set) => renameSetToken(set));
      }
      renamePassiveKeys(opt.echoSetPassives);
    }
  }
}

function migrateInventoryData(data: Record<string, unknown>) {
  renameEchoCollection(data.echoes);
}

/**
 * Migrates character store, inventory store, or a raw echo array in place.
 */
function migrateParsedData(data: unknown) {
  if (Array.isArray(data)) {
    for (const item of data) {
      if (item && typeof item === "object") {
        renameEchoFields(item as Record<string, unknown>);
      }
    }
    return;
  }

  if (!data || typeof data !== "object") {
    return;
  }

  const obj = data as Record<string, unknown>;
  if (obj.characters) {
    migrateCharacterData(obj);
    return;
  }
  if (obj.echoes) {
    migrateInventoryData(obj);
  }
}

function renameSunSinkingEclipse(json: string): string {
  if (!needsRename(json)) {
    return json;
  }

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
  version: 3,
  description:
    "Rename echo set SunSinkingEclipse / Sun-sinking Eclipse → Havoc Eclipse",
  transform: renameSunSinkingEclipse,
  up() {
    transformPersistedStores(renameSunSinkingEclipse);
  },
};

export default migration;
