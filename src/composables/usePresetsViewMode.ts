import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../stores/settings";

export type PresetsViewMode = "tile" | "list";

export function usePresetsViewMode() {
  const settingsStore = useSettingsStore();
  const { config } = storeToRefs(settingsStore);

  const viewMode = computed<PresetsViewMode>(() =>
    (config.value as { presetsView?: string } | null)?.presetsView === "list"
      ? "list"
      : "tile",
  );

  function setViewMode(next: PresetsViewMode) {
    void settingsStore.addToConfig({ presetsView: next });
  }

  return {
    viewMode,
    setViewMode,
  };
}
