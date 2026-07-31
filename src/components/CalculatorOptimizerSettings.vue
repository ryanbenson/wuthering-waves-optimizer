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
        <span class="label-text">Loadout format</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import {
  normalizeLoadoutFormat,
  type OptimizerLoadoutFormat,
} from "../calculator/optimizer";

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
