/**
 * Percent-based Custom Buffs fields (Calculator "Custom Buffs" tab) are
 * persisted to the character store as whole numbers (e.g. `10` for "10%"),
 * matching the plain `<input type="number">` the user types into. Flat stat
 * fields (ATK_FLAT/HP_FLAT/DEF_FLAT) are stored and used as-is. Every
 * consumer of custom buffs downstream (stats.ts/attacks.ts) expects percent
 * fields as decimal fractions, so callers must run raw store values through
 * this before handing them to calculation code.
 */
export const CUSTOM_BUFF_FLAT_KEYS: ReadonlySet<string> = new Set([
  "ATK_FLAT",
  "HP_FLAT",
  "DEF_FLAT",
]);

export function normalizeCustomBuffs(
  raw: Record<string, unknown> | null | undefined,
): Record<string, number> {
  const normalized: Record<string, number> = {};
  for (const [key, rawValue] of Object.entries(raw ?? {})) {
    const value = Number(rawValue);
    if (!Number.isFinite(value) || value === 0) continue;
    normalized[key] = CUSTOM_BUFF_FLAT_KEYS.has(key) ? value : value / 100;
  }
  return normalized;
}
