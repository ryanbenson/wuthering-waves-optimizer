/**
 * Cheap perceptual fingerprint used to gate when to run the (expensive) OCR
 * pass — see stability.ts. No OCR happens in this module; it only answers
 * "did the panel change".
 */

export type FingerprintGrid = { width: number; height: number };

/** Coarse whole-panel grid — enough to see a different echo's art/name. */
export const PANEL_FINGERPRINT_GRID: FingerprintGrid = { width: 32, height: 16 };
export const FINGERPRINT_LENGTH = PANEL_FINGERPRINT_GRID.width * PANEL_FINGERPRINT_GRID.height;

/**
 * Fine grid over just the stat rows (layout.ts's STATS_BLOCK). At the
 * measured capture resolutions a cell is roughly 9-10px square, i.e. a
 * single digit spans a few cells — fine enough that two same-name,
 * same-main-stat echoes differing only in a substat value register as
 * different. The coarse panel grid can't see that: one changed digit
 * averaged over the whole panel stays well under any usable threshold.
 */
export const STATS_FINGERPRINT_GRID: FingerprintGrid = { width: 64, height: 48 };

/**
 * Downsamples ImageData to a luma grid (0-1 range per cell, 32x16 by
 * default) via box averaging. Cheap enough to run on every capture tick.
 */
export function computeFingerprint(
  imageData: ImageData,
  grid: FingerprintGrid = PANEL_FINGERPRINT_GRID,
): Float32Array {
  const { data, width, height } = imageData;
  const { width: FP_WIDTH, height: FP_HEIGHT } = grid;
  const out = new Float32Array(FP_WIDTH * FP_HEIGHT);
  const cellW = width / FP_WIDTH;
  const cellH = height / FP_HEIGHT;

  for (let cy = 0; cy < FP_HEIGHT; cy++) {
    const y0 = Math.floor(cy * cellH);
    const y1 = Math.max(y0 + 1, Math.floor((cy + 1) * cellH));
    for (let cx = 0; cx < FP_WIDTH; cx++) {
      const x0 = Math.floor(cx * cellW);
      const x1 = Math.max(x0 + 1, Math.floor((cx + 1) * cellW));
      let sum = 0;
      let count = 0;
      for (let y = y0; y < y1; y++) {
        let rowIndex = (y * width + x0) * 4;
        for (let x = x0; x < x1; x++) {
          const r = data[rowIndex];
          const g = data[rowIndex + 1];
          const b = data[rowIndex + 2];
          sum += 0.299 * r + 0.587 * g + 0.114 * b;
          count++;
          rowIndex += 4;
        }
      }
      out[cy * FP_WIDTH + cx] = count > 0 ? sum / count / 255 : 0;
    }
  }
  return out;
}

/** Mean absolute difference between two fingerprints, in [0, 1]. */
export function fingerprintDistance(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length) return 1;
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += Math.abs(a[i] - b[i]);
  }
  return sum / a.length;
}

/**
 * How many cells differ by more than `cellThreshold`. Unlike the mean
 * distance above, a small localized change (one substat digit) isn't
 * diluted by every unchanged cell around it.
 */
export function countChangedCells(
  a: Float32Array,
  b: Float32Array,
  cellThreshold: number,
): number {
  if (a.length !== b.length) return Math.max(a.length, b.length);
  let changed = 0;
  for (let i = 0; i < a.length; i++) {
    if (Math.abs(a[i] - b[i]) > cellThreshold) changed++;
  }
  return changed;
}
