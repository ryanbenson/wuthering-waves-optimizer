/**
 * Settings > Labs flags, stored as `settings.labs[key].isEnabled` (written by
 * SettingsLab.vue). Read them through these helpers, never the store shape
 * directly, so graduating a lab is a matter of deleting its helper's callers.
 */
type SettingsLike = { labs?: Record<string, { isEnabled?: boolean } | undefined> | null };

/** Recommended teams on the Team Buffs tab (issue #663). */
export const RECOMMENDED_TEAMS_LAB = "recommendedTeams";

// `object`, not SettingsLike, for the same reason as uiVersion.ts: Pinia's
// StoreGeneric fails TS's weak-type check against an all-optional type.
export function isLabEnabled(settings: object, key: string): boolean {
  return (settings as SettingsLike).labs?.[key]?.isEnabled === true;
}

export function isRecommendedTeamsEnabled(settings: object): boolean {
  return isLabEnabled(settings, RECOMMENDED_TEAMS_LAB);
}
