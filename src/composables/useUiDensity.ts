import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../stores/settings";

export type UiDensity = "comfy" | "compact";

export function useUiDensity() {
  const settingsStore = useSettingsStore();
  const { config } = storeToRefs(settingsStore);

  const density = computed<UiDensity>(() =>
    (config.value as { density?: string } | null)?.density === "compact"
      ? "compact"
      : "comfy",
  );

  const isCompact = computed(() => density.value === "compact");

  function applyDensityAttribute(next: UiDensity) {
    document.documentElement.setAttribute("data-density", next);
  }

  function setDensity(next: UiDensity) {
    applyDensityAttribute(next);
    void settingsStore.addToConfig({ density: next });
  }

  function initDensity() {
    applyDensityAttribute(density.value);
  }

  return {
    density,
    isCompact,
    setDensity,
    initDensity,
  };
}
