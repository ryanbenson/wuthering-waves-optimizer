/**
 * Shared logic behind Settings' export/import/delete flows — extracted so
 * the legacy Settings UI and the v3.0 "Backup & Restore" workspace panel
 * call the exact same data-correctness-critical code instead of each
 * carrying their own copy that could drift out of sync over time.
 *
 * Version 1 — character payload only (no meta wrapper)
 * Version 2 — { meta, data: { character, inventory } }
 * Version 3+ — schema migrations (see src/migrations); still uses the v2 shape
 * Version 5+ — data also includes { teamRotations }
 *
 * On import we apply pending transforms from meta.version, then mark current.
 */
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { useTeamRotationsStore } from "../stores/teamRotations";
import { randomString } from "./strings";
import {
  applyMigrationTransforms,
  CURRENT_DATA_VERSION,
  getExportDataVersion,
  hasNestedExportFormat,
  parseMetaDataVersion,
  setStoredDataVersion,
} from "../migrations";

/**
 * Gets all of the data to save
 */
export function getExportData() {
  const meta = {
    version: String(getExportDataVersion()),
    source: "WutheringTools",
  };
  const data = {
    character: localStorage.getItem("character"),
    inventory: localStorage.getItem("inventory"),
    teamRotations: localStorage.getItem("teamRotations"),
  };
  return {
    meta,
    data,
  };
}

/**
 * Gets a filename for the exported JSON file
 */
export function generateExportFilename() {
  const date = new Date();
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const parts = dateFormatter.formatToParts(date);
  const partsValues = {
    month: "",
    day: "",
    year: "",
  };
  parts.forEach(({ type, value }) => {
    if (type === "month") {
      partsValues.month = value;
    }
    if (type === "day") {
      partsValues.day = value;
    }
    if (type === "year") {
      partsValues.year = value;
    }
  });
  const dateStr = `${partsValues.year}-${partsValues.month}-${partsValues.day}`;
  return `character_data_${dateStr}.json`;
}

/**
 * Provides the data to import based on changes to the structures
 */
export function getImportData(data: string | object, toParse = false) {
  let parsedData: unknown = data;
  if (toParse) {
    parsedData = JSON.parse(data as string);
  }
  const returnData: {
    character: unknown;
    inventory: unknown;
    teamRotations: unknown;
    dataVersion: number;
  } = {
    character: undefined,
    inventory: undefined,
    teamRotations: undefined,
    dataVersion: 1,
  };
  const pd = parsedData as {
    meta?: { version?: string | number };
    data?: { character?: unknown; inventory?: unknown; teamRotations?: unknown };
  };
  if (pd?.meta && hasNestedExportFormat(pd.meta)) {
    returnData.character = pd?.data?.character;
    returnData.inventory = pd?.data?.inventory;
    returnData.teamRotations = pd?.data?.teamRotations;
    returnData.dataVersion = parseMetaDataVersion(pd.meta);
  } else {
    returnData.character = parsedData;
    returnData.inventory = { echoes: [], equipped: {} };
    returnData.dataVersion = 1;
  }
  return returnData;
}

export function parseStorePayload(payload: unknown, fromDataVersion: number): unknown {
  let value = payload;
  if (typeof value === "string") {
    value = JSON.parse(applyMigrationTransforms(value, fromDataVersion));
  } else if (value != null && typeof value === "object") {
    value = JSON.parse(
      applyMigrationTransforms(JSON.stringify(value), fromDataVersion),
    );
  }
  return value;
}

export function isJsonString(str: string | null) {
  if (str == null) return false;
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
}

/**
 * Parses a raw export/import payload and overwrites character, inventory,
 * and teamRotations store state with it.
 */
export function applyImportedDatabase(raw: string) {
  const importData = getImportData(raw, true);
  const characterStore = useCharacterStore();
  const inventoryStore = useInventoryStore();
  const teamRotationsStore = useTeamRotationsStore();

  characterStore.hardSetState(
    parseStorePayload(importData.character, importData.dataVersion) as never,
  );
  inventoryStore.hardSetState(
    parseStorePayload(importData.inventory, importData.dataVersion) as never,
  );
  // Older exports (pre-version-5) never had team data — hardSetState
  // already treats undefined as "no teams" via `data?.teams ?? []`.
  teamRotationsStore.hardSetState(
    parseStorePayload(importData.teamRotations, importData.dataVersion) as never,
  );
  // Transforms above bring data to the latest schema
  setStoredDataVersion(CURRENT_DATA_VERSION);
}

/**
 * Parses a raw list of echoes and adds them to the inventory (additive,
 * does not touch existing echoes). Returns the number imported.
 */
export async function importEchoesFromRaw(
  rawText: string,
  inventoryStore: ReturnType<typeof useInventoryStore>,
) {
  const normalized = applyMigrationTransforms(rawText);
  const data = JSON.parse(normalized) as unknown[];
  let amount = 0;
  for (const echo of data) {
    let id = randomString();
    const anyCollisions = inventoryStore.echoById(id);
    if (anyCollisions.length > 0) {
      id = randomString();
    }
    const echoItem = {
      echoId: id,
      ...(echo as object),
    };
    await inventoryStore.saveEcho(echoItem as never);
    amount++;
  }
  return amount;
}

/**
 * Resets character and inventory data to a blank state.
 */
export function clearAllUserData() {
  localStorage.setItem("character", "");
  const characterStore = useCharacterStore();
  characterStore.$hydrate({ runHooks: false });
  localStorage.setItem("inventory", "");
  const inventoryStore = useInventoryStore();
  inventoryStore.$hydrate({ runHooks: false });
}
