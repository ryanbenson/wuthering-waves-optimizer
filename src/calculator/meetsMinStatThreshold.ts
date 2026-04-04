/**
 * True if a computed stat satisfies a user-entered minimum.
 * User values are in display units (e.g. 118.4 for 118.4%); callers compare against
 * stats stored at internal scale (same value / 100). Uses a small epsilon so loadouts
 * that match the minimum in the UI are not rejected due to floating-point rounding.
 */
export function meetsMinStatThreshold(
  statValue: unknown,
  minValueRaw: unknown,
): boolean {
  if (statValue === undefined || statValue === null) {
    return false;
  }
  const stat = Number(statValue);
  const threshold = Number(minValueRaw) / 100;
  if (!Number.isFinite(stat) || !Number.isFinite(threshold)) {
    return false;
  }
  const EPS = 1e-6;
  return stat + EPS >= threshold;
}
