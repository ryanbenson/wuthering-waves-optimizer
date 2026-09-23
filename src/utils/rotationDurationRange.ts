/** One action anywhere in a rotation, in its displayed sequence — the pool
 * the "lasts for X actions" / "until action Y" Duration control draws from. */
export interface DurationRangeAction {
  id: string;
  characterName: string;
  key?: string | null;
}

export interface DurationPoolEntry {
  id: string;
  label: string;
}

export type DurationMode = "count" | "until";

/**
 * This action plus every later action in the rotation's sequence. For Team
 * Rotations that spans every character, not just this one, since a buff's
 * duration is about the rotation's real timeline. Earlier actions aren't
 * eligible: a buff can't retroactively apply to something that already
 * happened. An unknown `actionId` falls back to the whole list.
 */
export function getDurationPool(rangeActions: DurationRangeAction[], actionId: string | undefined): DurationPoolEntry[] {
  const startIndex = rangeActions.findIndex((a) => a.id === actionId);
  const from = startIndex === -1 ? rangeActions : rangeActions.slice(startIndex);
  return from.map((a, index) => ({
    id: a.id,
    label: `${index === 0 ? "This action" : `+${index}`} — ${a.characterName}: ${a.key || "unconfigured"}`,
  }));
}

/**
 * Resolves the Duration control's inputs into the concrete action ids to
 * write into: the first `count` pool entries (clamped to 1..pool length), or
 * everything up to and including `untilActionId` (the whole pool when it
 * isn't found).
 */
export function resolveDurationTargetIds(
  pool: DurationPoolEntry[],
  mode: DurationMode,
  count: number,
  untilActionId: string | null,
): string[] {
  if (mode === "until") {
    const idx = pool.findIndex((a) => a.id === untilActionId);
    return pool.slice(0, idx === -1 ? pool.length : idx + 1).map((a) => a.id);
  }
  const clamped = Math.max(1, Math.min(count || 1, pool.length));
  return pool.slice(0, clamped).map((a) => a.id);
}
