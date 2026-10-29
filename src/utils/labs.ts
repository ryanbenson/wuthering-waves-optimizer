/**
 * Settings > Labs flags, stored as `settings.labs[key].isEnabled` (written by
 * SettingsLab.vue). Read them through these helpers, never the store shape
 * directly, so graduating a lab is a matter of deleting its helper's callers.
 */
type SettingsLike = { labs?: Record<string, { isEnabled?: boolean } | undefined> | null };

/** Frame-data rotation length and DPS (ADR 0047). */
export const FRAME_TIMING_LAB = "frameTiming";

// `object`, not SettingsLike, for the same reason as uiVersion.ts: Pinia's
// StoreGeneric fails TS's weak-type check against an all-optional type.
export function isLabEnabled(settings: object, key: string): boolean {
  return (settings as SettingsLike).labs?.[key]?.isEnabled === true;
}

export function isFrameTimingEnabled(settings: object): boolean {
  return isLabEnabled(settings, FRAME_TIMING_LAB);
}
