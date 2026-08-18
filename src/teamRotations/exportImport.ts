import { slugify } from "../utils/strings";

/**
 * The importable/exportable shape of a single team — everything in the
 * store's `Team` record except `id` (a fresh one is always generated on
 * import, so imported teams never collide with existing ones). This is also
 * exactly what a preset's `data` field holds (see ./presets.ts).
 */
export interface TeamExportData {
  name: string;
  characterIds: Array<string | null>;
  actions: unknown[];
  duration: number | string | null;
  enemyConfig: Record<string, unknown>;
}

const TEAM_EXPORT_TYPE = "teamRotation";
const TEAM_EXPORT_VERSION = "1";

export interface TeamExportPayload {
  meta: { version: string; source: string; type: typeof TEAM_EXPORT_TYPE };
  data: TeamExportData;
}

/**
 * Builds the full clipboard/file export payload for one team. Deliberately
 * only includes this team's own config (name/characterIds/actions/duration/
 * enemyConfig) — never the referenced characters' full builds — mirroring
 * the store's existing "teams reference characters by id, they don't
 * duplicate build data" design.
 */
export function buildTeamExportPayload(team: {
  name: string;
  characterIds: Array<string | null>;
  actions: unknown[];
  duration: number | string | null;
  enemyConfig: Record<string, unknown>;
}): TeamExportPayload {
  return {
    meta: { version: TEAM_EXPORT_VERSION, source: "WutheringTools", type: TEAM_EXPORT_TYPE },
    data: {
      name: team.name,
      characterIds: team.characterIds,
      actions: team.actions,
      duration: team.duration,
      enemyConfig: team.enemyConfig,
    },
  };
}

/** Filename for a team's downloaded export, based on its name. */
export function generateTeamExportFilename(teamName: string): string {
  return `${slugify(teamName) || "team"}.json`;
}

/**
 * Parses a team import payload from raw JSON text. Accepts either the
 * wrapped `{meta, data}` shape produced by exportTeam (clipboard/file), or a
 * bare team-data object directly (the shape used by a preset's `data`
 * field) — so the same import path handles a pasted export and a
 * hand-authored preset alike. Throws a descriptive Error for anything that
 * isn't recognizable as team data.
 */
export function parseTeamImportPayload(raw: string): TeamExportData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("That doesn't look like valid JSON.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("That doesn't look like a team export.");
  }

  const asRecord = parsed as Record<string, unknown>;
  const meta = asRecord.meta as { type?: string } | undefined;
  if (meta?.type && meta.type !== TEAM_EXPORT_TYPE) {
    throw new Error("That's a different kind of export, not a team.");
  }
  const candidate = "data" in asRecord ? asRecord.data : asRecord;

  if (!candidate || typeof candidate !== "object") {
    throw new Error("That doesn't look like a team export.");
  }
  const team = candidate as Partial<TeamExportData>;
  if (!Array.isArray(team.characterIds)) {
    throw new Error("That doesn't look like a team export — missing characterIds.");
  }
  if (!Array.isArray(team.actions)) {
    throw new Error("That doesn't look like a team export — missing actions.");
  }

  return {
    name: typeof team.name === "string" && team.name ? team.name : "Imported Team",
    characterIds: [0, 1, 2].map((i) => team.characterIds?.[i] ?? null),
    actions: team.actions.map(stripLegacyExcludeFields),
    duration: team.duration ?? null,
    enemyConfig: (team.enemyConfig as Record<string, unknown> | undefined) ?? {},
  };
}

/**
 * Drops the pre-#401 "exclude self/team/weapon buffs" checkbox fields from
 * an imported action, if present. These have no UI or persisted-data path
 * left in the app itself, but `actions` is otherwise passed through as
 * unvalidated JSON — a hand-edited export could still carry them, and
 * `calculateAttackDamage` (attacks.ts) still honors them if it sees them.
 */
function stripLegacyExcludeFields(action: unknown): unknown {
  if (!action || typeof action !== "object") {
    return action;
  }
  const { excludeSelfBuffs, excludeTeamBuffs, excludeWeaponBuffs, ...rest } = action as Record<string, unknown>;
  return rest;
}
