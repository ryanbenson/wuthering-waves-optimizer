/**
 * Stats stored as decimal ratios (user enters 50 for 50% → stored as 0.5).
 */
const DECIMAL_RATIO_STATS = new Set([
  "totalCritRate",
  "totalCritDMG",
  "energyRegen",
]);

/**
 * Normalize a user-entered minimum to the same scale as the stored finalStat.
 * - Flat totals (totalAtk/Hp/Def) and %-point bonuses: use as-is
 * - Crit Rate / Crit DMG / Energy Regen: divide by 100
 */
function normalizeMinValue(statKey: unknown, minValueRaw: unknown): number {
  const raw = Number(minValueRaw);
  if (!Number.isFinite(raw)) {
    return NaN;
  }
  if (typeof statKey === "string" && DECIMAL_RATIO_STATS.has(statKey)) {
    return raw / 100;
  }
  return raw;
}

/**
 * True if a computed stat satisfies a user-entered minimum.
 * User values are in display units; conversion to stored scale depends on the
 * selected stat (see normalizeMinValue). Uses a small epsilon so loadouts that
 * match the minimum in the UI are not rejected due to floating-point rounding.
 */
export function meetsMinStatThreshold(
  statValue: unknown,
  minValueRaw: unknown,
  statKey?: unknown,
): boolean {
  if (statValue === undefined || statValue === null) {
    return false;
  }
  const stat = Number(statValue);
  const threshold = normalizeMinValue(statKey, minValueRaw);
  if (!Number.isFinite(stat) || !Number.isFinite(threshold)) {
    return false;
  }
  const EPS = 1e-6;
  return stat + EPS >= threshold;
}
