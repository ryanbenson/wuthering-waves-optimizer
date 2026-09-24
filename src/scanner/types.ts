/**
 * Shared types for the echo screen scanner (src/scanner/).
 *
 * Pure TS, no Vue/DOM types beyond the ones the browser itself defines
 * (ImageBitmap, HTMLVideoElement, File) — see docs/scanner.md.
 */

/** A rectangular region expressed as fractions (0-1) of the full captured frame. */
export type RegionFrac = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** The same region resolved to integer pixels for a specific frame size. */
export type RegionPx = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type FrameSize = { width: number; height: number };

/**
 * Matches CalculatorEchoParser.vue's `ParsedSubstat` / `ParsedEchoSlot`
 * shapes exactly, so the scanner can feed CalculatorEchoImporter.vue's
 * existing review/save pipeline (mapParsedEchoes, duplicate review,
 * finalizeImport) unchanged.
 */
export type ParsedSubstat = { subStat: string; subStatValue: string };

export type ParsedEchoSlot = {
  cost: number | string | null;
  mainStatLabel: string;
  substats: ParsedSubstat[];
  echo: string | null;
  set: string | null;
};

/** Per-field confidence, surfaced in the review UI so nothing low-confidence auto-saves silently. */
export type FieldConfidence = "high" | "low";

/** One OCR'd line and its vertical extent within its own crop (echoScanner.worker.ts). Only relative position within one crop is meaningful. */
export type OcrLine = { text: string; y0: number; y1: number };

/** Which substat pass produced a candidate's substats — see parse.ts's parseEchoCandidate. */
export type SubstatSource = "columns" | "rows" | "block";

export type ScanCandidate = {
  id: string;
  slot: ParsedEchoSlot;
  confidence: {
    name: FieldConfidence;
    cost: FieldConfidence;
    mainStat: FieldConfidence;
    set: FieldConfidence;
    substats: FieldConfidence[];
  };
  /** True when the panel had no main stat selected yet (freshly acquired echo) — should be skipped, not saved. */
  needsMainStatSelection: boolean;
  /** Which substat pass won — "columns" is the primary pass; "rows"/"block" mean a fallback recovered more. See parse.ts's parseEchoCandidate. */
  substatSource: SubstatSource;
  /** Dedupe signature — see dedupe.ts. */
  signature: string;
  /** Small preview crop of the echo portrait, for the review list UI. */
  thumbnailDataUrl?: string;
  /** Raw OCR text this candidate was parsed from — shown as a diagnostic for low-confidence fields, not used for parsing itself. */
  rawHeaderText: string;
  rawStatsText: string;
  /** Per-region crop thumbnails + their own OCR text — only populated when the scanner's debug mode was on for this session. See layout.ts's DEBUG_REGIONS. */
  debugCrops?: { key: string; label: string; dataUrl: string; text: string }[];
  /** A downscaled snapshot of the whole frame, for drawing every ROI box on top of as one reviewable image — see capture.ts's grabFullFrameSnapshot. Only populated in debug mode. */
  debugFullFrame?: string;
};
