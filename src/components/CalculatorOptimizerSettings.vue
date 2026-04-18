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
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

defineOptions({ name: "CalculatorOptimizerSettings" });

const props = defineProps<{
  character: string;
  currentIgnoreOtherResonantorEchoes?: boolean | string;
}>();

const emit = defineEmits<{
  "optimizer:settings-updated": [
    payload: { ignoreOtherResonantorEchoes: boolean },
  ];
}>();

const ignoreOtherResonantorEchoes = ref(false);

function updatedSettings() {
  emit("optimizer:settings-updated", {
    ignoreOtherResonantorEchoes: ignoreOtherResonantorEchoes.value,
  });
}

watch(ignoreOtherResonantorEchoes, () => {
  updatedSettings();
});

onMounted(() => {
  const v = props.currentIgnoreOtherResonantorEchoes;
  ignoreOtherResonantorEchoes.value = typeof v === "boolean" ? v : false;
});
</script>
