import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../stores/settings";

/**
 * Remembers a filter panel's open/closed state globally (not per-character)
 * in settings.config, keyed by panelKey. Panels default to open when the
 * user hasn't toggled that section before.
 */
export function useFilterPanelOpen(panelKey: string) {
  const settingsStore = useSettingsStore();
  const { config } = storeToRefs(settingsStore);

  const isOpen = computed({
    get: () =>
      (config.value as { filterPanelsOpen?: Record<string, boolean> } | null)
        ?.filterPanelsOpen?.[panelKey] ?? true,
    set: (value: boolean) => {
      settingsStore.addToConfig({ filterPanelsOpen: { [panelKey]: value } });
    },
  });

  return isOpen;
}
