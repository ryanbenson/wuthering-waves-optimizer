/**
 * The export file written by Wavescan, the desktop scanner (ADR 0038).
 * Echoes only for now; characters, weapons, etc. will be added as optional
 * top-level arrays, so readers must ignore keys they don't know yet.
 *
 * Field values already use this app's own keys (echo, set, stat), because
 * Wavescan reads them from our published scanner-data.json (ADR 0035).
 */
export const WAVESCAN_FORMAT = "WutheringToolsScan";
export const WAVESCAN_MAX_SUPPORTED_VERSION = 1;

export type WavescanSubstat = {
  type: string;
  value: number;
};

export type WavescanEcho = {
  scanId?: string;
  echo: string;
  echoSet: string;
  cost: number;
  rank: number;
  level?: number;
  stat: string;
  substats: WavescanSubstat[];
  equippedBy?: string | null;
};

export type WavescanMeta = {
  scannerVersion?: string;
  scannedAt?: string;
  platform?: string;
  language?: string;
  mode?: string;
};

export type WavescanFile = {
  format: typeof WAVESCAN_FORMAT;
  version: number;
  meta?: WavescanMeta;
  echoes?: WavescanEcho[];
};

export type WavescanParseResult =
  | { ok: true; file: WavescanFile }
  | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Checks the envelope (format, version, array shapes) only. Each echo is
 * validated separately by `mapWavescanEchoes`, so one bad row doesn't
 * reject the whole file.
 */
export function parseWavescanFile(raw: string): WavescanParseResult {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { ok: false, error: "This isn't valid JSON." };
  }
  if (!isRecord(data) || data.format !== WAVESCAN_FORMAT) {
    return { ok: false, error: "This doesn't look like a Wavescan export." };
  }
  if (typeof data.version !== "number" || data.version < 1) {
    return { ok: false, error: "This Wavescan export has no valid version." };
  }
  if (data.version > WAVESCAN_MAX_SUPPORTED_VERSION) {
    return {
      ok: false,
      error: `This Wavescan export is version ${data.version}, but this site only reads up to version ${WAVESCAN_MAX_SUPPORTED_VERSION}. Refresh the page to get the latest version of the site.`,
    };
  }
  if (data.echoes !== undefined && !Array.isArray(data.echoes)) {
    return { ok: false, error: "This Wavescan export's echo list is malformed." };
  }
  if (data.meta !== undefined && !isRecord(data.meta)) {
    return { ok: false, error: "This Wavescan export's metadata is malformed." };
  }
  return { ok: true, file: data as WavescanFile };
}
