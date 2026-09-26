import { describe, it, expect } from "vitest";
import {
  PANEL_BOX,
  NAME_BLOCK,
  MAIN_STAT_ROW,
  SECONDARY_STAT_ROW,
  SUBSTAT_ROWS,
  SUBSTAT_BLOCK,
  SUBSTAT_LABEL_COLUMN,
  SUBSTAT_VALUE_COLUMN,
  STATS_BLOCK,
  SET_ICON_BOX,
  DEBUG_REGIONS,
  toPixelRegion,
  isSupportedAspect,
  matchSupportedAspect,
  regionForFrame,
  regionPercentStyle,
} from "../../src/scanner/layout";

// Real capture resolutions reviewed from the user's provided footage
// (~/Downloads/ScreenshotsEchoes) — all WuWa's fixed 16:10 Echo Management
// UI, at three different pixel sizes. The panel fractions must resolve to
// consistent, in-bounds pixel regions at each.
const REAL_RESOLUTIONS = [
  { width: 2880, height: 1800 }, // screenshots
  { width: 2304, height: 1440 }, // recorded video
  { width: 2800, height: 1752 }, // first session's sample screenshot
];

// 16:9 frames, mapped onto the 16:10 table by regionForFrame (see
// layout.ts's top doc comment). 1400x788 is the real 16:9 screenshot the
// mapping was verified against; the others are common 16:9 monitors.
const SIXTEEN_NINE_RESOLUTIONS = [
  { width: 1400, height: 788 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
];

const ALL_RESOLUTIONS = [...REAL_RESOLUTIONS, ...SIXTEEN_NINE_RESOLUTIONS];

describe("layout", () => {
  it.each(ALL_RESOLUTIONS)("keeps the panel box in-bounds at %ox%o", (frame) => {
    const region = toPixelRegion(PANEL_BOX, frame);
    expect(region.x).toBeGreaterThan(0);
    expect(region.y).toBeGreaterThan(0);
    expect(region.x + region.width).toBeLessThanOrEqual(frame.width);
    expect(region.y + region.height).toBeLessThanOrEqual(frame.height);
  });

  it.each(ALL_RESOLUTIONS)("keeps the main/secondary stat rows inside the panel box at %ox%o", (frame) => {
    const panel = toPixelRegion(PANEL_BOX, frame);
    for (const row of [MAIN_STAT_ROW, SECONDARY_STAT_ROW]) {
      const region = toPixelRegion(row, frame);
      expect(region.x).toBeGreaterThanOrEqual(panel.x);
      expect(region.y).toBeGreaterThanOrEqual(panel.y);
      expect(region.x + region.width).toBeLessThanOrEqual(panel.x + panel.width + 2);
      expect(region.y + region.height).toBeLessThanOrEqual(panel.y + panel.height + 2);
    }
  });

  it.each(ALL_RESOLUTIONS)("keeps the name block above the main stat row, which sits above the secondary row at %ox%o", (frame) => {
    const name = toPixelRegion(NAME_BLOCK, frame);
    const main = toPixelRegion(MAIN_STAT_ROW, frame);
    const secondary = toPixelRegion(SECONDARY_STAT_ROW, frame);
    expect(name.y + name.height).toBeLessThanOrEqual(main.y);
    expect(main.y).toBeLessThan(secondary.y);
  });

  it.each(ALL_RESOLUTIONS)("lays out all 5 substat row slots below the secondary row, each further down than the last, at %ox%o", (frame) => {
    const secondary = toPixelRegion(SECONDARY_STAT_ROW, frame);
    expect(SUBSTAT_ROWS).toHaveLength(5);
    let previousY = secondary.y;
    for (const row of SUBSTAT_ROWS) {
      const region = toPixelRegion(row, frame);
      expect(region.y).toBeGreaterThan(previousY);
      previousY = region.y;
    }
  });

  it("gives substat rows a taller crop than main/secondary rows, to catch a wrapped label's continuation line", () => {
    expect(SUBSTAT_ROWS[0].height).toBeGreaterThan(MAIN_STAT_ROW.height);
    expect(SUBSTAT_ROWS[0].height).toBeGreaterThan(SECONDARY_STAT_ROW.height);
  });

  it.each(ALL_RESOLUTIONS)(
    "keeps the (pixel-measured) set icon box inside the panel and below the name block, tightly cropped to roughly a square, at %ox%o — regression: the original guessed box missed the icon entirely, causing every scan to return the same wrong set",
    (frame) => {
      const panel = toPixelRegion(PANEL_BOX, frame);
      const name = toPixelRegion(NAME_BLOCK, frame);
      const icon = toPixelRegion(SET_ICON_BOX, frame);
      expect(icon.x).toBeGreaterThanOrEqual(panel.x);
      expect(icon.y).toBeGreaterThanOrEqual(name.y + name.height); // sits on its own line, below the name
      expect(icon.x + icon.width).toBeLessThanOrEqual(panel.x + panel.width);
      expect(icon.y + icon.height).toBeLessThanOrEqual(panel.y + panel.height);
      // Tight crop, not a generous box around the icon — roughly square, not a wide rectangle.
      expect(Math.abs(icon.width - icon.height) / Math.max(icon.width, icon.height)).toBeLessThan(0.3);
    },
  );

  it.each(ALL_RESOLUTIONS)("keeps SUBSTAT_BLOCK spanning at least all 5 substat rows, inside the panel, at %ox%o", (frame) => {
    const panel = toPixelRegion(PANEL_BOX, frame);
    const block = toPixelRegion(SUBSTAT_BLOCK, frame);
    const firstRow = toPixelRegion(SUBSTAT_ROWS[0], frame);
    const lastRow = toPixelRegion(SUBSTAT_ROWS[SUBSTAT_ROWS.length - 1], frame);
    expect(block.y).toBeLessThanOrEqual(firstRow.y);
    expect(block.y + block.height).toBeGreaterThan(lastRow.y);
    expect(block.y + block.height).toBeLessThanOrEqual(panel.y + panel.height);
  });

  it.each(ALL_RESOLUTIONS)("keeps STATS_BLOCK covering the main stat row through SUBSTAT_BLOCK, inside the panel, at %ox%o", (frame) => {
    const panel = toPixelRegion(PANEL_BOX, frame);
    const stats = toPixelRegion(STATS_BLOCK, frame);
    const main = toPixelRegion(MAIN_STAT_ROW, frame);
    const substats = toPixelRegion(SUBSTAT_BLOCK, frame);
    expect(stats.y).toBeLessThanOrEqual(main.y);
    expect(stats.y + stats.height).toBeGreaterThanOrEqual(substats.y + substats.height - 1);
    expect(stats.y + stats.height).toBeLessThanOrEqual(panel.y + panel.height);
    expect(stats.x + stats.width).toBeLessThanOrEqual(panel.x + panel.width + 2);
  });

  it("excludes the leading stat-type icon from stat row crops (measured gap, not the full row width)", () => {
    // Real footage showed tesseract misreading that icon glyph as garbage
    // text ("QQ HP 957") ahead of the real label — see layout.ts's top doc
    // comment. MAIN_STAT_ROW/SECONDARY_STAT_ROW/SUBSTAT_ROWS/SUBSTAT_BLOCK
    // should all share the same (icon-excluding) left edge.
    const xs = new Set(
      [MAIN_STAT_ROW, SECONDARY_STAT_ROW, SUBSTAT_BLOCK, SUBSTAT_LABEL_COLUMN, ...SUBSTAT_ROWS].map((r) => r.x),
    );
    expect(xs.size).toBe(1);
  });

  it("splits SUBSTAT_BLOCK into non-overlapping label and value columns that cover it exactly", () => {
    for (const frame of ALL_RESOLUTIONS) {
      const block = toPixelRegion(SUBSTAT_BLOCK, frame);
      const labels = toPixelRegion(SUBSTAT_LABEL_COLUMN, frame);
      const values = toPixelRegion(SUBSTAT_VALUE_COLUMN, frame);
      expect(labels.y).toBe(block.y);
      expect(values.y).toBe(block.y);
      expect(labels.height).toBe(block.height);
      expect(values.height).toBe(block.height);
      expect(labels.x + labels.width).toBeLessThanOrEqual(values.x + 1);
      expect(Math.abs(values.x + values.width - (block.x + block.width))).toBeLessThanOrEqual(1);
    }
  });

  it("lists every named ROI exactly once in DEBUG_REGIONS, for the scanner's debug view", () => {
    const keys = DEBUG_REGIONS.map((r) => r.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).toEqual(
      expect.arrayContaining([
        "panel",
        "name",
        "setIcon",
        "main",
        "secondary",
        "sub0",
        "sub1",
        "sub2",
        "sub3",
        "sub4",
        "substatBlock",
        "substatLabels",
        "substatValues",
      ]),
    );
  });

  it("accepts WuWa's real 16:10 aspect ratios", () => {
    for (const frame of REAL_RESOLUTIONS) {
      expect(isSupportedAspect(frame)).toBe(true);
    }
  });

  it("accepts 16:9", () => {
    for (const frame of SIXTEEN_NINE_RESOLUTIONS) {
      expect(isSupportedAspect(frame)).toBe(true);
      expect(matchSupportedAspect(frame)).toBeCloseTo(16 / 9);
    }
  });

  it("rejects a very different aspect ratio (e.g. a webcam or unrelated capture)", () => {
    expect(isSupportedAspect({ width: 640, height: 480 })).toBe(false); // 4:3
    expect(isSupportedAspect({ width: 3440, height: 1440 })).toBe(false); // 21:9 ultrawide
  });

  it("leaves regions unchanged on 16:10 frames, including ones a few pixels off exact 16:10", () => {
    for (const frame of REAL_RESOLUTIONS) {
      expect(regionForFrame(SET_ICON_BOX, frame)).toBe(SET_ICON_BOX);
    }
    // Snaps to 16:10 rather than scaling by 2800x1752's exact 1.598 ratio.
    expect(toPixelRegion(MAIN_STAT_ROW, { width: 2800, height: 1752 }).y).toBe(Math.round(0.384 * 1752));
  });

  it("maps 16:9 by keeping x fractions and scaling y fractions by 10/9 (UI scales with width, top-anchored)", () => {
    const mapped = regionForFrame(MAIN_STAT_ROW, { width: 1920, height: 1080 });
    expect(mapped.x).toBe(MAIN_STAT_ROW.x);
    expect(mapped.width).toBe(MAIN_STAT_ROW.width);
    expect(mapped.y).toBeCloseTo((MAIN_STAT_ROW.y * 10) / 9);
    expect(mapped.height).toBeCloseTo((MAIN_STAT_ROW.height * 10) / 9);
  });

  it("lands on the targets measured off a real 16:9 screenshot (1400x788)", () => {
    const frame = { width: 1400, height: 788 };
    // Pixel positions read off the screenshot itself: the set icon sits at
    // ~(1018-1040, 145-166); "Crit. DMG" main-stat text starts at x≈998, y≈340.
    const icon = toPixelRegion(SET_ICON_BOX, frame);
    expect(icon.x).toBeLessThanOrEqual(1018);
    expect(icon.x + icon.width).toBeGreaterThanOrEqual(1040);
    expect(icon.y).toBeLessThanOrEqual(145);
    expect(icon.y + icon.height).toBeGreaterThanOrEqual(166);
    const main = toPixelRegion(MAIN_STAT_ROW, frame);
    expect(main.x).toBeCloseTo(998, -1);
    expect(main.y).toBeGreaterThanOrEqual(330);
    expect(main.y).toBeLessThanOrEqual(342);
  });

  it("maps debug overlay percentages with the same 16:9 scaling as the crops", () => {
    const style = regionPercentStyle(MAIN_STAT_ROW, { width: 1920, height: 1080 });
    expect(parseFloat(style.left)).toBeCloseTo(MAIN_STAT_ROW.x * 100);
    expect(parseFloat(style.top)).toBeCloseTo(((MAIN_STAT_ROW.y * 10) / 9) * 100);
  });

  it("resolves fractional regions to integer pixels", () => {
    const region = toPixelRegion({ x: 0.1, y: 0.2, width: 0.3, height: 0.4 }, { width: 1001, height: 999 });
    expect(Number.isInteger(region.x)).toBe(true);
    expect(Number.isInteger(region.y)).toBe(true);
    expect(Number.isInteger(region.width)).toBe(true);
    expect(Number.isInteger(region.height)).toBe(true);
  });
});
