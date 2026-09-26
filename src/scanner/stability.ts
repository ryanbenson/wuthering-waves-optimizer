/**
 * Turns a stream of panel fingerprints into "an echo panel just settled on
 * something new — go OCR it" events, without ever running OCR itself.
 *
 * Two gates, per plan (docs/scanner.md):
 * 1. Stability: the panel must stop changing (distance to the previous tick
 *    stays under `settleThreshold` for `settleTicks` consecutive ticks)
 *    before we trust it — otherwise a mid-click-animation frame gets OCR'd.
 * 2. Novelty: once settled, only fire if this fingerprint differs from both
 *    the last one we actually scanned AND the recent scan history (catches
 *    the user scrolling back over already-captured echoes).
 *
 * Each frame carries two fingerprints: a coarse one of the whole panel
 * (mean distance — tolerant of the animated portrait art) and a fine one of
 * just the stat rows (changed-cell count — sensitive to a single substat
 * digit). Two frames only count as "the same echo" if *both* agree. The
 * coarse one alone can't tell apart back-to-back same-name, same-main-stat
 * echoes, which the game's default name sort lines up in a row — every one
 * after the first was being dropped as a repeat before OCR ever ran.
 *
 * Factory/closure, not a class, per CLAUDE.md's "no classes for domain logic".
 */
import { countChangedCells, fingerprintDistance } from "./fingerprint";

export type StabilityEvent = "unstable" | "stable-repeat" | "stable-novel";

export type FrameFingerprints = {
  /** Coarse whole-panel fingerprint (PANEL_BOX). */
  panel: Float32Array;
  /** Fine stat-rows fingerprint (STATS_BLOCK). */
  stats: Float32Array;
};

export type StableFrameDetectorOptions = {
  settleThreshold?: number;
  settleTicks?: number;
  noveltyThreshold?: number;
  historyThreshold?: number;
  historySize?: number;
  /** Per-cell luma delta for a stats-grid cell to count as changed. */
  statsCellThreshold?: number;
  /**
   * Changed stats cells at or above which two settled frames are different
   * echoes. Deliberately low: a missed echo is silently lost data, while a
   * spurious re-scan is caught by dedupe.ts's signature check.
   */
  statsNoveltyCells?: number;
  /**
   * Changed stats cells (tick to tick) at or above which the panel is still
   * mid-transition. Higher than statsNoveltyCells so capture noise on a
   * handful of cells can't stall settling forever.
   */
  statsSettleCells?: number;
};

export function createStableFrameDetector(
  options: StableFrameDetectorOptions = {},
) {
  const settleThreshold = options.settleThreshold ?? 0.035;
  const settleTicks = options.settleTicks ?? 2;
  const noveltyThreshold = options.noveltyThreshold ?? 0.035;
  const historyThreshold = options.historyThreshold ?? 0.018;
  const historySize = options.historySize ?? 80;
  const statsCellThreshold = options.statsCellThreshold ?? 0.1;
  const statsNoveltyCells = options.statsNoveltyCells ?? 2;
  const statsSettleCells = options.statsSettleCells ?? 6;

  let previousTick: FrameFingerprints | null = null;
  let consecutiveStableTicks = 0;
  let lastScanned: FrameFingerprints | null = null;
  const history: FrameFingerprints[] = [];

  function sameEcho(a: FrameFingerprints, b: FrameFingerprints, panelThreshold: number) {
    return (
      fingerprintDistance(a.panel, b.panel) <= panelThreshold &&
      countChangedCells(a.stats, b.stats, statsCellThreshold) < statsNoveltyCells
    );
  }

  function observe(frame: FrameFingerprints): StabilityEvent {
    if (previousTick) {
      const settled =
        fingerprintDistance(frame.panel, previousTick.panel) <= settleThreshold &&
        countChangedCells(frame.stats, previousTick.stats, statsCellThreshold) < statsSettleCells;
      consecutiveStableTicks = settled ? consecutiveStableTicks + 1 : 0;
    } else {
      consecutiveStableTicks = 0;
    }
    previousTick = frame;

    if (consecutiveStableTicks < settleTicks) {
      return "unstable";
    }

    if (lastScanned && sameEcho(frame, lastScanned, noveltyThreshold)) {
      return "stable-repeat";
    }

    if (history.some((past) => sameEcho(frame, past, historyThreshold))) {
      return "stable-repeat";
    }

    return "stable-novel";
  }

  /** Call after successfully OCR'ing a "stable-novel" frame. */
  function commitScan(frame: FrameFingerprints) {
    lastScanned = frame;
    history.push(frame);
    if (history.length > historySize) {
      history.shift();
    }
    // A just-scanned frame is trivially stable again next tick.
    consecutiveStableTicks = settleTicks;
  }

  function reset() {
    previousTick = null;
    consecutiveStableTicks = 0;
    lastScanned = null;
    history.length = 0;
  }

  return { observe, commitScan, reset };
}

export type StableFrameDetector = ReturnType<typeof createStableFrameDetector>;
