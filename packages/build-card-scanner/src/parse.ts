import type { ParsedSubstat } from "./types.js";

/**
 * Reads the cost digit. The card draws cost 4 in a way OCR often reads as "<B>"; anything
 * else uses the first number found. Returns `null` for empty or unreadable text.
 */
export function parseCostText(raw: string): number | null {
  if (raw === "<B>") return 4;
  if (!raw) return null;
  const leading = parseInt(raw, 10);
  if (!isNaN(leading)) return leading;
  const match = raw.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

/**
 * Fixes values OCR misreads often enough to matter. Each one is a value no substat can
 * actually roll, so the correction is safe.
 */
export function correctKnownSubstatMisreads(label: string, value: string): string {
  if (label === "Crit. Rate" && (value === "17.5%" || value === "1.5%")) {
    return "7.5%";
  }
  if ((label === "DEF" || label === "DEF Y") && value === "11.9%") {
    return "11.8%";
  }
  return value;
}

/**
 * Splits one OCR'd substat line into label and value ("Crit. DMG 17.4%"). Returns `null`
 * for a blank line, or a label with an empty value when no number was found.
 */
export function parseSubstatLine(raw: string): ParsedSubstat | null {
  const cleaned = raw
    .replace(/\n/g, " ")
    .replace(/[^\w.%+ ]/g, "")
    .trim();
  const m = cleaned.match(/(.+?)\s+(\d+(\.\d+)?%?)(\s|$)/);
  if (m) {
    const label = m[1].trim();
    return { subStat: label, subStatValue: correctKnownSubstatMisreads(label, m[2].trim()) };
  }
  if (cleaned) {
    return { subStat: cleaned, subStatValue: "" };
  }
  return null;
}
