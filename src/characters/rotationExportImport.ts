import { slugify } from "../utils/strings";

/**
 * The importable/exportable shape of a single character rotation — its own
 * fields plus its actions, but never its `id` (or any nested action/buff
 * id) — fresh ids are always generated on import, so an imported rotation
 * never collides with (or overwrites) an existing one.
 */
export interface RotationExportData {
  name: string;
  description: string;
  duration: string | number | null;
  echo: string | null;
  echoRank: string | number | null;
  actions: Array<Record<string, unknown>>;
}

const ROTATION_EXPORT_TYPE = "characterRotation";
const ROTATION_EXPORT_VERSION = "1";

export interface RotationExportPayload {
  meta: { version: string; source: string; type: typeof ROTATION_EXPORT_TYPE };
  data: RotationExportData;
}

/** Drops `id` from an action and each of its buffs, without mutating the input. */
function stripActionIds(actions: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(actions)) {
    return [];
  }
  return actions.map((action) => {
    if (!action || typeof action !== "object") {
      return action as Record<string, unknown>;
    }
    const { id: _id, buffs, ...rest } = action as Record<string, unknown>;
    if (!Array.isArray(buffs)) {
      return rest;
    }
    return {
      ...rest,
      buffs: buffs.map((buff) => {
        if (!buff || typeof buff !== "object") {
          return buff;
        }
        const { id: _buffId, ...buffRest } = buff as Record<string, unknown>;
        return buffRest;
      }),
    };
  });
}

/** Builds the full clipboard/file export payload for one rotation. */
export function buildRotationExportPayload(rotation: {
  name: string;
  description?: string | null;
  duration?: string | number | null;
  echo?: string | null;
  echoRank?: string | number | null;
  actions: unknown[];
}): RotationExportPayload {
  return {
    meta: { version: ROTATION_EXPORT_VERSION, source: "WutheringTools", type: ROTATION_EXPORT_TYPE },
    data: {
      name: rotation.name,
      description: rotation.description ?? "",
      duration: rotation.duration ?? null,
      echo: rotation.echo ?? null,
      echoRank: rotation.echoRank ?? null,
      actions: stripActionIds(rotation.actions),
    },
  };
}

/** Filename for a rotation's downloaded export, based on its name. */
export function generateRotationExportFilename(rotationName: string): string {
  return `${slugify(rotationName) || "rotation"}.json`;
}

/**
 * Parses a rotation import payload from raw JSON text. Accepts either the
 * wrapped `{meta, data}` shape produced by `buildRotationExportPayload`
 * (clipboard/file), or a bare rotation-data object directly — the shape
 * already used by hand-authored presets (`characters/<Name>/presets.ts`) and
 * by rotations copied before this envelope existed. Throws a descriptive
 * Error for anything that isn't recognizable as rotation data.
 */
export function parseRotationImportPayload(raw: string): RotationExportData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("That doesn't look like valid JSON.");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("That doesn't look like a rotation export.");
  }

  const asRecord = parsed as Record<string, unknown>;
  const meta = asRecord.meta as { type?: string } | undefined;
  if (meta?.type && meta.type !== ROTATION_EXPORT_TYPE) {
    throw new Error("That's a different kind of export, not a rotation.");
  }
  const rawData = asRecord.data;
  const candidate = rawData && typeof rawData === "object" && !Array.isArray(rawData) ? rawData : asRecord;

  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw new Error("That doesn't look like a rotation export.");
  }

  const data = candidate as Record<string, unknown>;
  if (typeof data.character === "string" || typeof data.inventory === "string") {
    throw new Error("That's a different kind of export, not a rotation.");
  }
  if (!Array.isArray(data.actions)) {
    throw new Error("That doesn't look like a rotation export — missing actions.");
  }

  return {
    name: typeof data.name === "string" && data.name ? data.name : "Imported Rotation",
    description: typeof data.description === "string" ? data.description : "",
    duration: (data.duration as string | number | null | undefined) ?? null,
    echo: typeof data.echo === "string" ? data.echo : null,
    echoRank: (data.echoRank as string | number | null | undefined) ?? null,
    actions: data.actions as Array<Record<string, unknown>>,
  };
}
