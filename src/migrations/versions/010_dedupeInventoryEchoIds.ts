import { randomString } from "../../utils/strings";
import { transformPersistedStores, type Migration } from "../types";

type InventoryEcho = Record<string, unknown> & { echoId?: unknown };

const STAT_FIELDS = [
  "echo",
  "echoSet",
  "stat",
  "type",
  ...[1, 2, 3, 4, 5].flatMap((n) => [`echoSubStatsType${n}`, `echoSubStatsValue${n}`]),
];

/** A character-slot pointer that ended up in the inventory: an id and no echo data at all. */
function isBlankEcho(echo: InventoryEcho): boolean {
  return STAT_FIELDS.every((field) => echo[field] == null);
}

/** Every id the inventory refers to, so a new id can't collide with a stale reference. */
function collectTakenIds(inventory: Record<string, unknown>, echoes: InventoryEcho[]): Set<string> {
  const taken = new Set<string>();
  for (const echo of echoes) {
    if (typeof echo.echoId === "string") taken.add(echo.echoId);
  }
  const equipped = inventory.equipped;
  if (equipped && typeof equipped === "object") {
    for (const id of Object.keys(equipped)) taken.add(id);
  }
  if (Array.isArray(inventory.echoPresets)) {
    for (const preset of inventory.echoPresets) {
      if (!preset || typeof preset !== "object") continue;
      for (let n = 1; n <= 5; n++) {
        const id = (preset as Record<string, unknown>)[`echo${n}Id`];
        if (typeof id === "string") taken.add(id);
      }
    }
  }
  return taken;
}

/**
 * Inventory echoes sharing one `echoId` (until saveEcho stored copies, an
 * image import followed by equipping another echo into the imported slot
 * overwrote the imported echo with a blank pointer carrying the equipped
 * echo's id). Lookups by id take the first match, so the slot could render
 * the blank copy.
 *
 * Per duplicated id, the first entry with echo data keeps the id (the first
 * entry when none has data), so every reference to it — character slots,
 * builds, `equipped`, echo presets — keeps pointing at the echo the user
 * meant and nothing outside the inventory has to change. Other entries with
 * data get fresh ids (unequipped, unreferenced). Other blank entries carry
 * no data and are dropped.
 *
 * Only the inventory store has a top-level `echoes` array; every other input
 * is returned unchanged, as is an inventory without duplicates.
 */
export function dedupeInventoryEchoIds(json: string): string {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return json;
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return json;
  }
  const inventory = data as Record<string, unknown>;
  if (!Array.isArray(inventory.echoes)) {
    return json;
  }
  const echoes = inventory.echoes.filter(
    (echo): echo is InventoryEcho => !!echo && typeof echo === "object",
  );

  const groups = new Map<string, InventoryEcho[]>();
  for (const echo of echoes) {
    if (typeof echo.echoId !== "string") continue;
    const group = groups.get(echo.echoId);
    if (group) group.push(echo);
    else groups.set(echo.echoId, [echo]);
  }
  const duplicated = [...groups.values()].filter((group) => group.length > 1);
  if (duplicated.length === 0) {
    return json;
  }

  const taken = collectTakenIds(inventory, echoes);
  const nextId = () => {
    let id = randomString();
    while (!id || taken.has(id)) id = randomString();
    taken.add(id);
    return id;
  };

  const dropped = new Set<InventoryEcho>();
  for (const group of duplicated) {
    const keeper = group.find((echo) => !isBlankEcho(echo)) ?? group[0];
    for (const echo of group) {
      if (echo === keeper) continue;
      if (isBlankEcho(echo)) dropped.add(echo);
      else echo.echoId = nextId();
    }
  }
  inventory.echoes = inventory.echoes.filter((echo) => !dropped.has(echo as InventoryEcho));

  return JSON.stringify(inventory);
}

const migration: Migration = {
  version: 10,
  description:
    "Give inventory echoes that share an echoId unique ids — the referenced echo keeps the id; blank duplicates are dropped",
  transform: dedupeInventoryEchoIds,
  up() {
    transformPersistedStores(dedupeInventoryEchoIds);
  },
};

export default migration;
