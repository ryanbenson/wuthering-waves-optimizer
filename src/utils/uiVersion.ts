/**
 * Which UI the user sees. The v3 UI is the default; the classic UI is an opt-in that
 * lives in `settings.config.useClassicUi` (ADR 0038). This replaced the old
 * "UI Overhaul 3.0" Labs flag (`labs.liveResultBar`), which is now ignored, so anyone
 * who tried v3 during the beta and turned it off still lands on v3 after launch.
 *
 * Every "v3 or classic?" branch in the app should go through these, never read the
 * setting directly.
 */
type SettingsLike = { config?: Record<string, unknown> | null };

export const CLASSIC_UI_CONFIG_KEY = "useClassicUi";

// `object`, not SettingsLike: Pinia's StoreGeneric fails TS's weak-type check against
// an all-optional type, and the settings store is untyped JS anyway.
export function isClassicUiEnabled(settings: object): boolean {
  return (settings as SettingsLike).config?.[CLASSIC_UI_CONFIG_KEY] === true;
}

export function isV3UiEnabled(settings: object): boolean {
  return !isClassicUiEnabled(settings);
}
