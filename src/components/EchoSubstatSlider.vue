<template>
  <div class="echo-substat-slider">
    <span
      class="echo-substat-slider__floaty"
      :style="{ left: floatyLeftPercent + '%' }"
      aria-hidden="true">
      {{ modelValue }}{{ unit }}
    </span>
    <Range
      :id="id"
      :values="values"
      :default-value="modelValue"
      size="xs"
      show-ticks
      class="w-full"
      :aria-label="ariaLabel"
      @update-value="onUpdate" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Range from "./input/Range.vue";

const props = defineProps<{
  id: string;
  values: number[];
  modelValue: number;
  unit?: string;
  ariaLabel?: string;
}>();

const emit = defineEmits<{ "update:modelValue": [value: number] }>();

const floatyLeftPercent = computed(() => {
  const idx = props.values.indexOf(props.modelValue);
  const max = props.values.length - 1;
  if (idx < 0 || max <= 0) return 0;
  return (idx / max) * 100;
});

function onUpdate(val: number) {
  emit("update:modelValue", val);
}
</script>

<style scoped>
.echo-substat-slider {
  position: relative;
  padding-top: 1.15rem;
}
.echo-substat-slider__floaty {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  font-family: ui-monospace, "SFMono-Regular", monospace;
  font-size: 0.7rem;
  font-weight: 700;
  background-color: oklch(var(--b3));
  border-radius: 0.3rem;
  padding: 0 0.3rem;
  pointer-events: none;
  white-space: nowrap;
}
</style>
