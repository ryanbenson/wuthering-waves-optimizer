/**
 * @wutheringtools/scanner-core: Wuthering Waves echo-screen scanning logic shared by
 * Wuthering Tools (browser scanner) and Wavescan (desktop scanner).
 *
 * Call `setScannerGameData(...)` once before using the parsing functions. Everything here
 * is plain TypeScript with no DOM, Vue or Pinia dependencies (ADR 0034).
 */
export * from "./gameData.js";
export * from "./types.js";
export * from "./levenshtein.js";
export * from "./fingerprint.js";
export * from "./stability.js";
export * from "./queue.js";
export * from "./contentRect.js";
export * from "./layout.js";
export * from "./layoutCheck.js";
export * from "./review.js";
export * from "./dedupe.js";
export * from "./parse.js";
// parsedEchoMapping has its own looser `ParsedSubstat` (optional fields); expose it under
// a distinct name so it doesn't clash with the scanner's `ParsedSubstat` from ./types.
export {
  getSubstatType,
  getSubstatValue,
  mapParsedEchoes,
  type MappedEcho,
  type ParsedEcho,
  type ParsedSubstat as LooseParsedSubstat,
} from "./parsedEchoMapping.js";
export * from "./echoIdentity.js";
export * from "./equippedBy.js";
