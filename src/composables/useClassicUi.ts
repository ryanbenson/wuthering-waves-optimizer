/**
 * Reads and switches between the v3 UI (default) and the classic UI (opt-in),
 * reporting each switch to Umami so we can see how many people still prefer
 * classic before it's retired (ADR 0038).
 */
import { computed } from "vue";
import { useSettingsStore } from "../stores/settings";
import { CLASSIC_UI_CONFIG_KEY, isClassicUiEnabled } from "../utils/uiVersion";
import { trackEvent, trackEventWhenReady } from "../utils/analytics";

/** Where a switch happened, for analytics. */
export type ClassicUiToggleSource = "theme-menu" | "settings" | "whats-new";

const SESSION_REPORTED_KEY = "wt-classic-ui-session-reported";

export function useClassicUi() {
  const settingsStore = useSettingsStore();

  const isClassicUi = computed(() => isClassicUiEnabled(settingsStore));

  function setClassicUi(enabled: boolean, source: ClassicUiToggleSource) {
    if (enabled === isClassicUi.value) return;
    settingsStore.addToConfig({ [CLASSIC_UI_CONFIG_KEY]: enabled });
    trackEvent(enabled ? "classic-ui-enabled" : "classic-ui-disabled", { source });
  }

  return { isClassicUi, setClassicUi };
}

/**
 * Sends one "classic-ui-session" event per browser session while the classic UI is
 * on. The enable/disable events count switches; this counts people still *using*
 * classic, which is what matters for retiring it. Call once at app start.
 */
export function reportClassicUiSession() {
  const settingsStore = useSettingsStore();
  if (!isClassicUiEnabled(settingsStore)) return;
  try {
    if (sessionStorage.getItem(SESSION_REPORTED_KEY)) return;
    sessionStorage.setItem(SESSION_REPORTED_KEY, "1");
  } catch {
    // Storage blocked (private mode etc.): report anyway; worst case it's once per load.
  }
  trackEventWhenReady("classic-ui-session");
}
