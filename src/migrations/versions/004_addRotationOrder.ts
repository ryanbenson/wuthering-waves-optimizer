import { transformPersistedStores, type Migration } from "../types";

function rotationOrderValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function ensureRotationOrders(rotations: unknown): unknown {
  if (!Array.isArray(rotations) || rotations.length === 0) {
    return rotations;
  }

  const withOrder = rotations.map((rotation, index) => {
    if (!rotation || typeof rotation !== "object") {
      return rotation;
    }
    const row = rotation as Record<string, unknown>;
    const existing = rotationOrderValue(row.order);
    return {
      ...row,
      order: existing ?? index,
    };
  });

  withOrder.sort((a, b) => {
    const aOrder =
      a && typeof a === "object"
        ? (rotationOrderValue((a as Record<string, unknown>).order) ??
          Number.MAX_SAFE_INTEGER)
        : Number.MAX_SAFE_INTEGER;
    const bOrder =
      b && typeof b === "object"
        ? (rotationOrderValue((b as Record<string, unknown>).order) ??
          Number.MAX_SAFE_INTEGER)
        : Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder;
  });

  return withOrder.map((rotation, index) => {
    if (!rotation || typeof rotation !== "object") {
      return rotation;
    }
    return {
      ...(rotation as Record<string, unknown>),
      order: index,
    };
  });
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
    if ("rotations" in char) {
      char.rotations = ensureRotationOrders(char.rotations);
    }
  }
}

function migrateParsedData(data: unknown) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return;
  }

  const obj = data as Record<string, unknown>;
  if (obj.characters) {
    migrateCharacterData(obj);
  }
}

function needsRotationOrderMigration(data: unknown): boolean {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return false;
  }
  const characters = (data as Record<string, unknown>).characters;
  if (!characters || typeof characters !== "object") {
    return false;
  }

  for (const character of Object.values(characters)) {
    if (!character || typeof character !== "object") {
      continue;
    }
    const rotations = (character as Record<string, unknown>).rotations;
    if (!Array.isArray(rotations) || rotations.length === 0) {
      continue;
    }

    const orders = rotations.map((rotation) => {
      if (!rotation || typeof rotation !== "object") {
        return null;
      }
      return rotationOrderValue((rotation as Record<string, unknown>).order);
    });

    if (orders.some((order) => order === null)) {
      return true;
    }

    for (let index = 0; index < orders.length; index++) {
      if (orders[index] !== index) {
        return true;
      }
    }
  }

  return false;
}

function addRotationOrder(json: string): string {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return json;
  }

  if (!needsRotationOrderMigration(data)) {
    return json;
  }

  migrateParsedData(data);
  return JSON.stringify(data);
}

const migration: Migration = {
  version: 4,
  description:
    "Add order property to character rotations from array index",
  transform: addRotationOrder,
  up() {
    transformPersistedStores(addRotationOrder);
  },
};

export default migration;
