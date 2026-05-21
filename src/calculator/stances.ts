/** Buff or resonance chain definition with an optional stance binding. */
export interface StanceBoundBuff {
  key?: string;
  stance?: string;
}

/**
 * Returns whether a buff definition applies for the current stance.
 * Buffs without a stance apply in all stances.
 */
export function isBuffActiveForStance(
  buffDef: StanceBoundBuff | undefined,
  activeStance: string | null | undefined,
): boolean {
  if (!buffDef?.stance) {
    return true;
  }
  if (!activeStance) {
    return true;
  }
  return buffDef.stance === activeStance;
}

export function filterBuffsForStance<T extends StanceBoundBuff>(
  buffs: T[],
  activeStance: string | null | undefined,
): T[] {
  return buffs.filter((buff) => isBuffActiveForStance(buff, activeStance));
}

export function getDefaultStance(
  stances: string[] | undefined,
): string | null {
  return stances?.[0] ?? null;
}

/**
 * Resolves the active stance for a character, using persisted value or
 * inferring from enabled stance buffs (e.g. Absolution / Confession keys).
 */
export function resolveActiveStance(
  stances: string[] | undefined,
  storedStance: string | undefined,
  buffsConfig?: Record<string, { isEnabled?: boolean }> | null,
): string | null {
  if (!stances?.length) {
    return null;
  }
  if (storedStance && stances.includes(storedStance)) {
    return storedStance;
  }
  if (buffsConfig) {
    for (const stance of stances) {
      if (buffsConfig[stance]?.isEnabled) {
        return stance;
      }
    }
  }
  return stances[0];
}
