type LoadoutEcho = { type?: string | number } & Record<string, unknown>;

/**
 * Slot 0 is always the main echo (fixed) — the rest is sorted by cost
 * descending, matching how most players lay out their own build
 * (e.g. [main, 3, 3, 1, 1] rather than the processing order [main, 3, 1, 3, 1]).
 */
export function sortLoadoutForDisplay<T extends LoadoutEcho>(loadout: T[]): T[] {
  if (loadout.length <= 1) return loadout;
  const [main, ...rest] = loadout;
  rest.sort((a, b) => Number(b.type ?? 0) - Number(a.type ?? 0));
  return [main, ...rest];
}
