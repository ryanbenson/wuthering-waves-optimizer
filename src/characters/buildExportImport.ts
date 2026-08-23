import { omitBuildMetadata } from "./buildFields";
import { slugify } from "../utils/strings";

/**
 * The importable/exportable shape of a single character build — the build's
 * own fields (see `buildFields.ts`) plus its `name`, but never its `id`
 * /`createdAt`/`updatedAt` — a fresh id and timestamps are always generated
 * on import, so an imported build never collides with (or overwrites) an
 * existing one.
 */
export interface BuildExportData extends Record<string, unknown> {
  name: string;
}

const BUILD_EXPORT_TYPE = "characterBuild";
const BUILD_EXPORT_VERSION = "1";

export interface BuildExportPayload {
  meta: { version: string; source: string; type: typeof BUILD_EXPORT_TYPE };
  data: BuildExportData;
}

/** Builds the full clipboard/file export payload for one build entry. */
export function buildBuildExportPayload(build: Record<string, unknown> & { name: string }): BuildExportPayload {
  return {
    meta: { version: BUILD_EXPORT_VERSION, source: "WutheringTools", type: BUILD_EXPORT_TYPE },
    data: { name: build.name, ...omitBuildMetadata(build) },
  };
}

/** Filename for a build's downloaded export, based on its name. */
export function generateBuildExportFilename(buildName: string): string {
  return `${slugify(buildName) || "build"}.json`;
}

/**
 * Parses a build import payload from raw JSON text. Accepts either the
 * wrapped `{meta, data}` shape produced by `buildBuildExportPayload`
 * (clipboard/file), or a bare build-data object directly. Throws a
 * descriptive Error for anything that isn't recognizable as build data.
 *
 * A build's fields are an open-ended denylist (see `buildFields.ts`) — even
 * a totally empty object is a legitimate "blank" build — so unlike team
 * import there's no required field to validate against. Instead this
 * specifically detects and rejects this app's own whole-database export
 * (`SettingsExport.vue`), whose `data.character`/`data.inventory` are
 * serialized JSON strings that no real build ever has.
 */
export function parseBuildImportPayload(raw: string): BuildExportData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("That doesn't look like valid JSON.");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("That doesn't look like a build export.");
  }

  const asRecord = parsed as Record<string, unknown>;
  const meta = asRecord.meta as { type?: string } | undefined;
  if (meta?.type && meta.type !== BUILD_EXPORT_TYPE) {
    throw new Error("That's a different kind of export, not a character build.");
  }
  const rawData = asRecord.data;
  const candidate = rawData && typeof rawData === "object" && !Array.isArray(rawData) ? rawData : asRecord;

  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw new Error("That doesn't look like a build export.");
  }

  const data = candidate as Record<string, unknown>;
  if (typeof data.character === "string" || typeof data.inventory === "string") {
    throw new Error("That's a different kind of export, not a character build.");
  }

  const fields = omitBuildMetadata(data);
  delete fields.builds;
  delete fields.activeBuildId;

  return {
    name: typeof data.name === "string" && data.name ? data.name : "Imported Build",
    ...fields,
  };
}
