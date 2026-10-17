import { displayInt, displayPercentage } from "./numbers";

/** How a finalStats value is shown: a flat number, or a percentage (scale turns a fraction into percent). */
export type StatDisplay = { kind: "int" | "pct"; scale?: number };

/** The number as it's displayed (ints floor, percentages round to 0.1), so a
 *  delta always matches subtracting the two numbers you can see. */
function shownStatValue(display: StatDisplay, value: number): number {
  if (display.kind === "int") return Math.floor(value);
  return Math.round(value * (display.scale ?? 1) * 10) / 10;
}

function formatStatValue(display: StatDisplay, shownValue: number): string {
  return display.kind === "int" ? displayInt(shownValue) : displayPercentage(shownValue);
}

export type StatWithDelta = { text: string; delta: number | null; deltaText: string | null };

/** The shown VALUE and its signed DELTA ("+36", "-10.0%"); no delta when there is nothing to compare against. */
export function statWithDelta(display: StatDisplay, value: number, current?: number | null): StatWithDelta {
  const shown = shownStatValue(display, value);
  const text = formatStatValue(display, shown);
  if (typeof current !== "number") return { text, delta: null, deltaText: null };
  const delta = shown - shownStatValue(display, current);
  return { text, delta, deltaText: `${delta >= 0 ? "+" : ""}${formatStatValue(display, delta)}` };
}
