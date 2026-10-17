/**
 * Normalized ROI table for the WuWa Echo Management detail panel.
 *
 * All regions are fractions of the *full captured frame*, not fixed pixels —
 * required because the live screen-share stream, an uploaded video file, and
 * a calibration screenshot can all come in at different resolutions. This
 * has been validated against real captures at three different resolutions
 * that all share the game's fixed 16:10 UI aspect (2800x1752, 2880x1800,
 * 2304x1440) — the fractions below were measured directly off those real
 * screenshots (row-band/column detection over luma variance), not guessed.
 * See docs/scanner.md for how these were derived and what to re-measure if
 * a future WuWa UI update moves the panel.
 *
 * **The fractions are for a 16:10 game area (REFERENCE_ASPECT).** Other
 * aspects are mapped onto it by toPixelRegion / regionPercentStyle (via
 * regionForFrame) rather than getting a table of their own, and both take
 * the game's area within the frame (contentRect.ts) so window chrome or
 * black bars around the game don't shift the crops. WuWa scales
 * this screen's UI with the frame's *width* and anchors it to the top, so
 * at 16:9 every x fraction is unchanged and every y/height fraction grows by
 * (16/9) / (16/10) = 10/9. Verified by overlaying the mapped boxes on a real
 * 16:9 Echo Management screenshot (every box, including the tight set icon
 * and the substat column split, landed on its target) and OCR'ing the
 * mapped crops (name, main/secondary, wrapped substat labels and values all
 * read correctly). See docs/scanner.md's "Aspect ratios".
 *
 * Two simplifications, both from real usage:
 * - **No level or cost OCR.** The app doesn't persist echo level yet (every
 *   scanned echo is treated as max-level), so there's nothing to gain from
 *   reading "+n" at all. Cost is derived from the resolved echo's own class
 *   (getCostByClass) once name+set narrow it down, the same fallback
 *   CalculatorEchoParser.vue already has for when its own cost OCR misses —
 *   just always taken now, rather than only as a fallback. That means the
 *   header crop only needs the name line: WuWa doesn't wrap long echo names,
 *   it shrinks the font to fit instead, so NAME_BLOCK stays a single-line,
 *   fixed-height crop regardless of name length.
 * - **Stat rows exclude the small leading stat-type icon** (the glyph
 *   matching subStatIconMap's icons, e.g. a sword for ATK) rather than
 *   including it in the OCR crop. Real debug-crop text showed tesseract
 *   reading that icon as garbage characters ahead of the real label
 *   ("QQ HP 957", "% DEF") — a real noise source parseStatRow's
 *   plausibility check has to work around. Measured the icon/text gap
 *   directly (column-variance scan of a real row) rather than guessing.
 *
 * Stat rows are still captured as individually-cropped regions — one OCR
 * call per row — mirroring CalculatorEchoParser.vue's proven-reliable
 * Discord-bot-image approach (5 separate substat crops there too), rather
 * than one big multi-line block asking tesseract to segment rows itself.
 * Row Y-positions are fixed fractions: the main-stat row starts at 0.384
 * and every following row sits at a further ~0.0373 down, consistently
 * across all three measured resolutions.
 *
 * Substats are read primarily from two columns over SUBSTAT_BLOCK's span
 * (SUBSTAT_LABEL_COLUMN / SUBSTAT_VALUE_COLUMN), paired by line position.
 * The per-row SUBSTAT_ROWS crops and the whole SUBSTAT_BLOCK are only OCR'd
 * as fallbacks when the column pass doesn't yield all 5 substats (expected
 * every time now that level is assumed max); SUBSTAT_BLOCK is parsed with
 * `splitStatBlock`. Long labels wrapping to a second line
 * ("Resonance Skill DMG Bonus") is the main reason per-row crops fall
 * short: the game doesn't reserve consistent spacing for a wrap, so a
 * wrapped row can shift everything below it down by an amount that varies
 * echo to echo — something no *fixed*-position per-row crop can fully
 * account for, but a wide-enough block re-read still generally recovers.
 */
import type { FrameSize, RegionFrac, RegionPx } from "./types.js";

export const FULL_FRAME: RegionFrac = { x: 0, y: 0, width: 1, height: 1 };

export const PANEL_BOX: RegionFrac = {
  x: 0.685,
  y: 0.095,
  width: 0.29,
  height: 0.67,
};

/**
 * Echo name only — single line, tight height. Pixel-measured off a real
 * screenshot (luma-variance row scan of just the title text, excluding
 * both the top HUD bar above it and the portrait art below): the title
 * band sits at y≈0.109-0.132. Checked against both a short name
 * ("Thousand-Puppet Pavilion") and a long one ("Reminiscence - Nightmare:
 * Adam Smasher") — the game shrinks the font for the long one rather than
 * wrapping it, so both fit this same fixed-height single-line crop.
 */
export const NAME_BLOCK: RegionFrac = {
  x: 0.685,
  y: 0.104,
  width: 0.27,
  height: 0.034,
};

/**
 * Small set-icon badge on the "+level" line (the level text itself isn't
 * read — see this file's top doc comment — but the icon sitting on that
 * line still needs its own crop for matchSetFirst).
 *
 * The first version of this constant (x 0.685, y 0.127) was an eyeballed
 * guess, and wrong enough to consistently miss the actual icon and land on
 * background/portrait art instead — every `matchSetFirst` call was
 * confidently returning whatever set happened to be closest to that muted
 * background blur, regardless of which echo was on screen. A second
 * version (x 0.724, y 0.155) was pixel-measured but still left the icon
 * occupying under half the crop, real background margin around it (a
 * screenshot comparison against the actual reference icon image, e.g.
 * https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sets/CelestialLight.webp,
 * which is cropped tight to its content) — that surrounding margin
 * competes with the icon itself once matchSetFirst resizes to 32x32,
 * diluting the real signal.
 *
 * These values are cropped as tight as the icon's own measured bounds
 * allow (a couple of pixels of margin, not a generous box around it),
 * verified visually against two different echoes' icons — shaved another
 * 2px off the top and right after a closer look still showed a sliver of
 * empty space on those two edges specifically.
 *
 * Tight geometry alone wasn't the whole accuracy problem though — see
 * capture.ts's grabCircularMaskedBitmap for the other half (the
 * background behind the icon isn't black, so echoParser.worker.ts's
 * shared black-background masking doesn't remove it, which was corrupting
 * the color-family comparison matchSetFirst relies on most) and its
 * detectIconBounds for a third: even "tight" hand-measured bounds still
 * left enough margin to make the captured icon read as smaller than the
 * (truly tight, no-margin) reference icon once both get resized to the
 * same comparison canvas — a scale mismatch, not a color one. That's now
 * corrected dynamically per-capture rather than by chasing tighter and
 * tighter fixed fractions here.
 */
export const SET_ICON_BOX: RegionFrac = {
  x: 0.7266,
  y: 0.1594,
  width: 0.0184,
  height: 0.0317,
};

/** Starts right after the stat-type icon glyph (see this file's top doc comment) — measured gap, not guessed. */
const STAT_ROW_X = 0.713;
const STAT_ROW_WIDTH = 0.262;
const FIRST_STAT_ROW_Y = 0.384;
const STAT_ROW_PITCH = 0.0373;
/** Tall enough for one line + padding; main/secondary labels never wrap. */
const SINGLE_LINE_ROW_HEIGHT = 0.028;
/**
 * Tall enough to also catch a wrapped label's continuation line, which
 * lands in the next row's space (WRAP_SAFE_ROW_HEIGHT / STAT_ROW_PITCH ≈
 * 1.3x). This was originally 0.065 (≈1.74x pitch) — real footage showed
 * that was tall enough to regularly capture a *neighboring* row's actual
 * text as well as this row's own (visible in the debug crop grid as two
 * consecutive substat crops both containing the same line), not just
 * blank overlap margin. Reduced to lessen how often that happens for the
 * common single-line case. The real fix for when a wrap still throws a
 * row off is SUBSTAT_BLOCK below — a per-row crop's *height* alone can't
 * solve an *earlier* row's wrap shifting every row below it down by a
 * variable amount, since the game doesn't reserve consistent spacing for
 * a wrap.
 */
const WRAP_SAFE_ROW_HEIGHT = 0.048;

export const MAIN_STAT_ROW: RegionFrac = {
  x: STAT_ROW_X,
  y: FIRST_STAT_ROW_Y,
  width: STAT_ROW_WIDTH,
  height: SINGLE_LINE_ROW_HEIGHT,
};

/** Not persisted (getEchoStats derives it from cost+rank) — cropped and OCR'd anyway as a sanity signal the debug view can show. */
export const SECONDARY_STAT_ROW: RegionFrac = {
  x: STAT_ROW_X,
  y: FIRST_STAT_ROW_Y + STAT_ROW_PITCH,
  width: STAT_ROW_WIDTH,
  height: SINGLE_LINE_ROW_HEIGHT,
};

/** Up to 5 possible substat slots, in panel order — the primary pass. */
export const SUBSTAT_ROWS: RegionFrac[] = [2, 3, 4, 5, 6].map((rowIndex) => ({
  x: STAT_ROW_X,
  y: FIRST_STAT_ROW_Y + rowIndex * STAT_ROW_PITCH,
  width: STAT_ROW_WIDTH,
  height: WRAP_SAFE_ROW_HEIGHT,
}));

/**
 * Fallback pass: all 5 substat rows plus wrap allowance, as one block.
 * Spans from the first substat row's own start (row index 2) through
 * enough extra height for 5 rows at full pitch plus ~2 extra wrapped
 * lines — generous on purpose, since this only runs when the per-row
 * pass came up short and a wider net is exactly the point.
 */
export const SUBSTAT_BLOCK: RegionFrac = {
  x: STAT_ROW_X,
  y: FIRST_STAT_ROW_Y + 2 * STAT_ROW_PITCH,
  width: STAT_ROW_WIDTH,
  height: 5 * STAT_ROW_PITCH + 2 * SINGLE_LINE_ROW_HEIGHT,
};

/**
 * x where the substat label column ends and the value column begins.
 * Measured with a column scan for bright text pixels across 11 real
 * 2880x1800 Echo screenshots: label text always ends at or before 0.887
 * (the widest single-line label, "Heavy Attack DMG Bonus"), and values
 * (right-aligned) always start at or after 0.922 (the widest value, e.g.
 * "10.5%"). The split sits in the middle of that ~0.035 (≈100px) gap so
 * either side can drift a little without leaking into the other column.
 */
const SUBSTAT_COLUMN_SPLIT_X = 0.905;

/**
 * Primary substat pass: SUBSTAT_BLOCK's span, split into a label-only
 * column and a value-only column, each OCR'd on its own. A wrapped label
 * ("Resonance Skill DMG" / "Bonus") only adds a line to the label column;
 * the value column always reads one value per row, lined up with the first
 * line of its label. parse.ts's parseSubstatColumns pairs them by each
 * line's vertical position. See docs/scanner.md's "Substat OCR".
 */
export const SUBSTAT_LABEL_COLUMN: RegionFrac = {
  x: STAT_ROW_X,
  y: SUBSTAT_BLOCK.y,
  width: SUBSTAT_COLUMN_SPLIT_X - STAT_ROW_X,
  height: SUBSTAT_BLOCK.height,
};

export const SUBSTAT_VALUE_COLUMN: RegionFrac = {
  x: SUBSTAT_COLUMN_SPLIT_X,
  y: SUBSTAT_BLOCK.y,
  width: STAT_ROW_X + STAT_ROW_WIDTH - SUBSTAT_COLUMN_SPLIT_X,
  height: SUBSTAT_BLOCK.height,
};

/**
 * Main stat row through the end of SUBSTAT_BLOCK — fingerprinted (not
 * OCR'd) at a fine grid alongside the coarse PANEL_BOX fingerprint, so the
 * change-detection gate notices when only the stat text changes. The
 * game's default name sort puts same-name echoes back to back, and a run
 * of them with the same main stat looks identical to the coarse panel
 * fingerprint (same art, name, main stat) — see stability.ts.
 */
export const STATS_BLOCK: RegionFrac = {
  x: STAT_ROW_X,
  y: FIRST_STAT_ROW_Y,
  width: STAT_ROW_WIDTH,
  height: SUBSTAT_BLOCK.y + SUBSTAT_BLOCK.height - FIRST_STAT_ROW_Y,
};

/**
 * The "Equipped by <name>" line under the Echo Skill section (blank when the echo
 * isn't equipped), read by equippedBy.ts. Measured off a real 1920x1080 (16:9)
 * capture: text band y 879-899px, x 1370-1581px for "Equipped by Hsin", with the
 * character's avatar at x 1325-1354. Left edge starts after the avatar (same reason
 * stat rows skip their icon), right edge runs to the panel edge for long names; y is
 * mapped back to the 16:10 reference (x 9/10, see this file's top comment).
 */
export const EQUIPPED_BY_LINE: RegionFrac = {
  x: 0.7094,
  y: 0.7267,
  width: 0.2594,
  height: 0.0283,
};

/**
 * The discard (heart, "Z") and lock (padlock, "C") toggles over the echo art, read by
 * echoMarks.ts. Measured off real 1920x1080 captures (locked, unlocked, discarded):
 * heart glyph x 1342-1369, y 360-383px; padlock glyph x 1467-1485, y 358-383px, same
 * position for every echo. LOCK_ICON_BOX is centred on the padlock (x 1464-1488) so
 * isLockClosed can split it into left and right halves. y mapped to 16:10 (x 9/10).
 */
export const DISCARD_ICON_BOX: RegionFrac = {
  x: 0.6979,
  y: 0.2975,
  width: 0.0167,
  height: 0.0242,
};
export const LOCK_ICON_BOX: RegionFrac = {
  x: 0.7625,
  y: 0.2967,
  width: 0.0125,
  height: 0.025,
};

/**
 * Every named ROI in one list, for the debug view (EchoScannerCapture.vue):
 * dashed boxes drawn over the live preview, and — per captured candidate —
 * a labeled crop thumbnail + its raw OCR text, so a mismatch like the
 * set-icon one (see SET_ICON_BOX's doc comment) is visible and diagnosable
 * from the UI itself instead of guessed at blind.
 */
export const DEBUG_REGIONS: { key: string; label: string; region: RegionFrac }[] = [
  { key: "panel", label: "Detail panel", region: PANEL_BOX },
  { key: "name", label: "Name", region: NAME_BLOCK },
  { key: "setIcon", label: "Set icon", region: SET_ICON_BOX },
  { key: "main", label: "Main stat", region: MAIN_STAT_ROW },
  { key: "secondary", label: "Fixed secondary", region: SECONDARY_STAT_ROW },
  { key: "substatLabels", label: "Substat labels", region: SUBSTAT_LABEL_COLUMN },
  { key: "substatValues", label: "Substat values", region: SUBSTAT_VALUE_COLUMN },
  ...SUBSTAT_ROWS.map((region, i) => ({ key: `sub${i}`, label: `Substat ${i + 1}`, region })),
  { key: "substatBlock", label: "Substat fallback block", region: SUBSTAT_BLOCK },
  { key: "equippedBy", label: "Equipped by", region: EQUIPPED_BY_LINE },
  { key: "discardIcon", label: "Discard icon", region: DISCARD_ICON_BOX },
  { key: "lockIcon", label: "Lock icon", region: LOCK_ICON_BOX },
];

/** The aspect every RegionFrac in this file was measured at — see this file's top doc comment. */
export const REFERENCE_ASPECT = 16 / 10;

/**
 * Game-area aspects that have been checked against real captures. A game
 * area within SNAP_TOLERANCE of one maps exactly as that aspect, so 16:10
 * captures a few pixels off (2800x1752) resolve exactly as before.
 */
const MEASURED_ASPECTS = [16 / 10, 16 / 9];
const SNAP_TOLERANCE = 0.01;

/**
 * The game-area aspects the scanner accepts. Both ends are measured (16:10
 * and 16:9, plus the ±0.05 slack they always had); in between, the same
 * width-scaled, top-anchored rule is applied continuously, which is an
 * interpolation between two verified points. Outside it — ultrawide, 4:3 —
 * WuWa likely lays the screen out differently, and we have no captures to
 * check against, so those are still rejected up front.
 */
export const SUPPORTED_ASPECT_RANGE = { min: 16 / 10 - 0.05, max: 16 / 9 + 0.05 } as const;

/** The game area's size in pixels, given the frame and the game's area within it (contentRect.ts). */
export function contentSize(frame: FrameSize, content: RegionFrac = FULL_FRAME): FrameSize {
  return { width: content.width * frame.width, height: content.height * frame.height };
}

/** Whether a game area of this size is in SUPPORTED_ASPECT_RANGE. */
export function isSupportedAspect(content: FrameSize): boolean {
  const aspect = content.width / content.height;
  return aspect >= SUPPORTED_ASPECT_RANGE.min && aspect <= SUPPORTED_ASPECT_RANGE.max;
}

/**
 * Maps a reference (16:10) region onto a game area of this size, as 0-1
 * fractions of that area: x and width unchanged, y and height scaled by
 * aspect / REFERENCE_ASPECT (the UI scales with width and is top-anchored).
 * Snaps to a measured aspect when within SNAP_TOLERANCE of one.
 */
export function regionForFrame(region: RegionFrac, content: FrameSize): RegionFrac {
  const raw = content.width / content.height;
  const aspect = MEASURED_ASPECTS.find((a) => Math.abs(raw - a) < SNAP_TOLERANCE) ?? raw;
  const scale = aspect / REFERENCE_ASPECT;
  if (scale === 1) return region;
  return { x: region.x, y: region.y * scale, width: region.width, height: region.height * scale };
}

/** A reference region as fractions of the whole frame, placed inside the game's area. */
function regionInFrame(region: RegionFrac, frame: FrameSize, content: RegionFrac): RegionFrac {
  const mapped = regionForFrame(region, contentSize(frame, content));
  return {
    x: content.x + mapped.x * content.width,
    y: content.y + mapped.y * content.height,
    width: mapped.width * content.width,
    height: mapped.height * content.height,
  };
}

/** `content` is the game's area within the frame (contentRect.ts); the whole frame by default. */
export function toPixelRegion(region: RegionFrac, frame: FrameSize, content: RegionFrac = FULL_FRAME): RegionPx {
  const placed = regionInFrame(region, frame, content);
  return {
    x: Math.round(placed.x * frame.width),
    y: Math.round(placed.y * frame.height),
    width: Math.round(placed.width * frame.width),
    height: Math.round(placed.height * frame.height),
  };
}

/** CSS for drawing a region's box over an image/video that fills its container at the frame's own aspect — the frame-mapped 0-1 fractions are already the right percentages. */
export function regionPercentStyle(region: RegionFrac, frame: FrameSize, content: RegionFrac = FULL_FRAME) {
  const placed = regionInFrame(region, frame, content);
  return {
    left: `${placed.x * 100}%`,
    top: `${placed.y * 100}%`,
    width: `${placed.width * 100}%`,
    height: `${placed.height * 100}%`,
  };
}

/** CSS for drawing the game's area itself (contentRect.ts) over the same image/video — a plain frame fraction, no aspect mapping. */
export function contentPercentStyle(content: RegionFrac) {
  return {
    left: `${content.x * 100}%`,
    top: `${content.y * 100}%`,
    width: `${content.width * 100}%`,
    height: `${content.height * 100}%`,
  };
}
