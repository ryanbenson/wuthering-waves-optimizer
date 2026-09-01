import { computed, type Ref } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../stores/settings";
import { resolvePinnedStats, withStatPinToggled } from "../calculator/pinnedStats";

/**
 * Per-character pinned-stat favorites (CalculatorLiveResultOverview.vue's
 * pin buttons + CalculatorLiveResultDetail.vue's chip strip) — one source of
 * truth so both read/write the same resolved set. `character` and
 * `declaredDefaults` are refs so this stays correct across a character
 * switch without re-creating the composable.
 */
export function usePinnedStats(
  character: Ref<string>,
  declaredDefaults: Ref<string[]>,
) {
  const settingsStore = useSettingsStore();
  const { config } = storeToRefs(settingsStore);

  const pinnedKeys = computed(() =>
    resolvePinnedStats(config.value, character.value, declaredDefaults.value),
  );

  function togglePin(statKey: string) {
    if (!character.value) return;
    const next = withStatPinToggled(
      config.value,
      character.value,
      statKey,
      declaredDefaults.value,
    );
    // Full replace, not addToConfig — addToConfig's lodash `merge` doesn't
    // truncate an existing array/object branch, which would leave stale
    // pinned keys behind after an unpin. `next` is already the complete,
    // correctly-computed config value (see pinnedStats.ts).
    settingsStore.setConfig(next);
  }

  return { pinnedKeys, togglePin };
}
