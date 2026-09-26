import { describe, it, expect } from "vitest";
import {
  computeFingerprint,
  countChangedCells,
  fingerprintDistance,
  FINGERPRINT_LENGTH,
  STATS_FINGERPRINT_GRID,
} from "../../src/scanner/fingerprint";

function makeImageData(width: number, height: number, fill: (x: number, y: number) => [number, number, number]) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b] = fill(x, y);
      const i = (y * width + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
  return { data, width, height, colorSpace: "srgb" } as ImageData;
}

describe("fingerprint", () => {
  it("produces a fixed-length vector regardless of input size", () => {
    const small = computeFingerprint(makeImageData(40, 20, () => [128, 128, 128]));
    const large = computeFingerprint(makeImageData(400, 200, () => [128, 128, 128]));
    expect(small.length).toBe(FINGERPRINT_LENGTH);
    expect(large.length).toBe(FINGERPRINT_LENGTH);
  });

  it("distance is 0 for identical frames", () => {
    const a = computeFingerprint(makeImageData(64, 32, (x, y) => [(x * 7) % 255, (y * 13) % 255, 60]));
    const b = computeFingerprint(makeImageData(64, 32, (x, y) => [(x * 7) % 255, (y * 13) % 255, 60]));
    expect(fingerprintDistance(a, b)).toBe(0);
  });

  it("distance is large between a black frame and a white frame", () => {
    const black = computeFingerprint(makeImageData(64, 32, () => [0, 0, 0]));
    const white = computeFingerprint(makeImageData(64, 32, () => [255, 255, 255]));
    expect(fingerprintDistance(black, white)).toBeCloseTo(1, 5);
  });

  it("small localized change produces a small but non-zero distance", () => {
    const base = computeFingerprint(makeImageData(64, 32, () => [100, 100, 100]));
    const changed = computeFingerprint(
      makeImageData(64, 32, (x, y) => (x < 4 && y < 4 ? [255, 255, 255] : [100, 100, 100])),
    );
    const distance = fingerprintDistance(base, changed);
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(0.05);
  });

  it("honors a custom grid size", () => {
    const fp = computeFingerprint(makeImageData(640, 480, () => [128, 128, 128]), STATS_FINGERPRINT_GRID);
    expect(fp.length).toBe(STATS_FINGERPRINT_GRID.width * STATS_FINGERPRINT_GRID.height);
  });

  it("countChangedCells counts only cells past the threshold", () => {
    const a = new Float32Array([0.1, 0.1, 0.1, 0.1]);
    const b = new Float32Array([0.1, 0.15, 0.5, 0.9]);
    expect(countChangedCells(a, b, 0.1)).toBe(2);
    expect(countChangedCells(a, a, 0.1)).toBe(0);
  });

  // Regression: two same-name, same-main-stat echoes differ only by a
  // substat digit. At a real capture size (2304x1440 → stats block
  // ≈604x456px) one ~12x20px glyph change is invisible to the coarse
  // mean distance but shows up in the fine stats grid.
  it("a single changed digit in the stat rows is caught by the fine grid, not the coarse mean", () => {
    const w = 604;
    const h = 456;
    const textRow = (y: number) => y % 54 >= 17 && y % 54 < 37;
    const base = (x: number, y: number): [number, number, number] =>
      textRow(y) && x > 480 && x < 580 && x % 14 < 8 ? [230, 230, 230] : [30, 30, 40];
    const withDigitChanged = (x: number, y: number): [number, number, number] =>
      x >= 546 && x < 558 && y >= 125 && y < 145 ? [230, 230, 230] : base(x, y);

    const coarseA = computeFingerprint(makeImageData(w, h, base));
    const coarseB = computeFingerprint(makeImageData(w, h, withDigitChanged));
    expect(fingerprintDistance(coarseA, coarseB)).toBeLessThan(0.035);

    const fineA = computeFingerprint(makeImageData(w, h, base), STATS_FINGERPRINT_GRID);
    const fineB = computeFingerprint(makeImageData(w, h, withDigitChanged), STATS_FINGERPRINT_GRID);
    expect(countChangedCells(fineA, fineB, 0.1)).toBeGreaterThanOrEqual(2);
  });
});
