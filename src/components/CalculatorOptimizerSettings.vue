<template>
  <div class="optimizer-settings-list">
    <div class="form-control">
      <label class="label cursor-pointer flex gap-4 justify-start">
        <input
          v-model="ignoreOtherResonantorEchoes"
          type="checkbox"
          class="toggle toggle-primary toggle-sm" />
        <span class="label-text">
          Ignore echoes equipped by other resonators
        </span>
      </label>
    </div>
    <div class="form-control mt-2">
      <label class="label">
        <h3>Loadout format</h3>
      </label>
      <div class="join">
        <input
          v-model="loadoutFormat"
          value="Any"
          class="join-item btn btn-sm"
          type="radio"
          name="loadout-format"
          aria-label="Any"
          data-test-optimizer-loadout-format-any />
        <input
          v-model="loadoutFormat"
          value="43311"
          class="join-item btn btn-sm"
          type="radio"
          name="loadout-format"
          aria-label="43311"
          data-test-optimizer-loadout-format-43311 />
        <input
          v-model="loadoutFormat"
          value="44111"
          class="join-item btn btn-sm"
          type="radio"
          name="loadout-format"
          aria-label="44111"
          data-test-optimizer-loadout-format-44111 />
      </div>
    </div>
    <div class="form-control mt-2">
      <label class="label flex-col items-start gap-1">
        <h3>Worker count</h3>
        <span class="text-sm text-neutral-content">
          Background threads used to search echo loadouts. More workers
          finish faster but use more CPU, battery, and memory — going above
          your device's CPU core count usually won't help. This also applies
          in Settings → Preferences.
        </span>
      </label>
      <div class="join">
        <button
          v-for="option in OPTIMIZER_WORKER_COUNT_OPTIONS"
          :key="option.value"
          type="button"
          class="btn btn-sm join-item"
          :class="{ 'btn-primary': optimizerWorkerCount === option.value }"
          :data-test-optimizer-worker-count-pref="option.value"
          @click="optimizerWorkerCount = option.value">
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import {
  normalizeLoadoutFormat,
  type OptimizerLoadoutFormat,
} from "../calculator/optimizer";
import { useSettingsStore } from "../stores/settings";
import {
  OPTIMIZER_WORKER_COUNT_OPTIONS,
  resolveOptimizerWorkerCount,
  type OptimizerWorkerCount,
} from "../utils/optimizerPreferences";

defineOptions({ name: "CalculatorOptimizerSettings" });

const props = defineProps<{
  character: string;
  currentIgnoreOtherResonantorEchoes?: boolean | string;
  currentLoadoutFormat?: OptimizerLoadoutFormat | string | null;
}>();

const emit = defineEmits<{
  "optimizer:settings-updated": [
    payload: {
      ignoreOtherResonantorEchoes: boolean;
      loadoutFormat: OptimizerLoadoutFormat;
    },
  ];
}>();

const ignoreOtherResonantorEchoes = ref(false);
const loadoutFormat = ref<OptimizerLoadoutFormat>("Any");

// Worker count is a global device preference (not per-character), so it reads/writes
// the same settings store field as Settings → Preferences directly — no props/emit
// round-trip through character.optimizer.* like the settings above.
const settingsStore = useSettingsStore();
const { config } = storeToRefs(settingsStore);

const optimizerWorkerCount = computed({
  get: (): OptimizerWorkerCount =>
    resolveOptimizerWorkerCount(
      (config.value as { optimizerWorkerCount?: unknown })
        ?.optimizerWorkerCount,
    ),
  set: (value: OptimizerWorkerCount) => {
    void settingsStore.addToConfig({ optimizerWorkerCount: value });
  },
});

function updatedSettings() {
  emit("optimizer:settings-updated", {
    ignoreOtherResonantorEchoes: ignoreOtherResonantorEchoes.value,
    loadoutFormat: loadoutFormat.value,
  });
}

watch(ignoreOtherResonantorEchoes, () => {
  updatedSettings();
});

watch(loadoutFormat, () => {
  updatedSettings();
});

onMounted(() => {
  const v = props.currentIgnoreOtherResonantorEchoes;
  ignoreOtherResonantorEchoes.value = typeof v === "boolean" ? v : false;
  loadoutFormat.value = normalizeLoadoutFormat(props.currentLoadoutFormat);
});
</script>
