/** A rectangle in build-card pixels (the card is always 1920×1080). */
export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Where each field of one echo slot sits on the card. */
export interface EchoSlotRegions {
  /** The cost digit in the slot's top-right corner. */
  cost: Region;
  /** The main stat's label (e.g. "Crit. Rate"). */
  mainStatLabel: Region;
  /** One region per substat line, top to bottom (5). */
  substats: Region[];
  /** The echo's portrait, for image matching. */
  echoImage: Region;
  /** The Sonata set icon, for image matching. */
  set: Region;
}

export interface ParsedSubstat {
  /** The substat label as read (e.g. "Crit. DMG"); not mapped to a stat key. */
  subStat: string;
  /** The value as read (e.g. "17.4%" or "50"), or "" when no value was found. */
  subStatValue: string;
}

/** One echo slot read off the card. */
export interface BuildCardEchoSlot {
  /** 1, 3 or 4; `null` when neither OCR nor the matched echo could tell. */
  cost: number | null;
  /** The main stat's label as read, trimmed. */
  mainStatLabel: string;
  substats: ParsedSubstat[];
  /** The matched echo's key, or `null`. */
  echo: string | null;
  /** The matched Sonata set key, or `null`. */
  set: string | null;
}

/** The game data the parser needs. Field names match `@wutheringtools/scanner-core` and `scanner-data.json`. */
export interface BuildCardGameData {
  /** Every echo, keyed by its registry key. */
  echoes: Record<string, { key: string; class: string; sets?: string[] }>;
  /** Echo class → cost (1, 3 or 4). */
  echoCostByClass: Record<string, number>;
}

/**
 * The host app's OCR and image matching. The parser decides *what* to read and in what
 * order; these do the reading. Calls are made one at a time, so a single OCR worker is fine.
 */
export interface BuildCardAdapters {
  /** OCR one region and return its text. See `preprocessForOcr` and `RECOMMENDED_OCR_PARAMS`. */
  readText(region: Region): Promise<string>;
  /**
   * Match the set icon in `region`. `possibleSets` is `null` to compare against every set,
   * or the sets the already-matched echo can roll. Return the set key, or `null`.
   */
  matchSet(region: Region, possibleSets: string[] | null): Promise<string | null>;
  /**
   * Match the echo portrait in `region`. `candidateEchoKeys` is `null` to compare against
   * every echo, or the echoes that fit the matched set and cost (possibly empty).
   * Return the echo key, or `null`.
   */
  matchEcho(region: Region, candidateEchoKeys: string[] | null): Promise<string | null>;
}
