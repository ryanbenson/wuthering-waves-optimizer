// Layout helpers shared by the rotation editors' SVG charts (ADR 0049).
import { FRAMES_PER_SECOND } from "../calculator/frameData";
import { framesToSeconds } from "../calculator/rotationTiming";

/** A round axis maximum at or above `value`. */
export function niceMax(value: number): number {
  if (value <= 0) return 1;
  const power = Math.pow(10, Math.floor(Math.log10(value)));
  for (const step of [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) {
    if (step * power >= value) return step * power;
  }
  return 10 * power;
}

/** 950, 8.5k, 1.2M: short enough for axis labels and small marks. */
export function compactNumber(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${trimZero((value / 1_000_000).toFixed(1))}M`;
  if (abs >= 10_000) return `${Math.round(value / 1000)}k`;
  if (abs >= 1000) return `${trimZero((value / 1000).toFixed(1))}k`;
  return String(Math.round(value));
}

function trimZero(text: string): string {
  return text.endsWith(".0") ? text.slice(0, -2) : text;
}

export function fullNumber(value: number): string {
  return Math.round(value).toLocaleString();
}

export function secondsToFrames(seconds: number): number {
  return seconds * FRAMES_PER_SECOND;
}

export function secondsText(frames: number): string {
  return `${framesToSeconds(frames).toFixed(2)}s`;
}

/** An action's label for a chart mark, without the " DMG" most attack names
 * end in: it says nothing on a damage chart and costs room. */
export function chartLabel(label: string): string {
  return label.replace(/\s+DMG$/i, "");
}

/** Rough width of 11px UI text, for deciding whether a label fits a mark. */
export function textWidth(text: string, fontSize = 11): number {
  return text.length * fontSize * 0.58;
}

/** Shortens `text` with an ellipsis to fit `width` pixels, or "" if even one
 * character and the ellipsis won't. */
export function fitText(text: string, width: number, fontSize = 11): string {
  if (textWidth(text, fontSize) <= width) return text;
  const chars = Math.floor(width / (fontSize * 0.58)) - 1;
  return chars >= 3 ? `${text.slice(0, chars)}…` : "";
}

/** Time-axis ticks at whole seconds, thinned so labels don't collide. */
export function secondTicks(totalFrames: number, plotWidth: number): number[] {
  const seconds = framesToSeconds(totalFrames);
  const maxTicks = Math.max(2, Math.floor(plotWidth / 44));
  const step = [1, 2, 5, 10, 15, 20, 30, 60].find((candidate) => seconds / candidate <= maxTicks) ?? 60;
  const ticks: number[] = [];
  for (let t = 0; t <= seconds + 1e-9; t += step) ticks.push(t);
  return ticks;
}

/** A step path for a running total: flat until each point, then up to it. */
export function stepPath(
  points: Array<{ frame: number; value: number }>,
  x: (frame: number) => number,
  y: (value: number) => number,
  endFrame: number,
): string {
  let d = `M${x(0).toFixed(1)} ${y(0).toFixed(1)}`;
  for (const point of points.slice(1)) {
    d += ` H${x(point.frame).toFixed(1)} V${y(point.value).toFixed(1)}`;
  }
  return `${d} H${x(endFrame).toFixed(1)}`;
}
