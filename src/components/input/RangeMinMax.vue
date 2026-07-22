<template>
  <div class="range-minmax" :class="classes">
    <div class="range-minmax__track relative h-6 w-full">
      <div class="range-minmax__rail" aria-hidden="true"></div>
      <div
        class="range-minmax__fill"
        aria-hidden="true"
        :style="fillStyle"></div>
      <input
        type="range"
        class="range range-minmax__input range-minmax__input--min"
        :class="[sizeClass, { 'range-minmax__input--front': minIsFront }]"
        :id="minId"
        :min="min"
        :max="max"
        :step="step"
        :value="modelMin"
        :aria-label="minAriaLabel"
        :aria-valuemin="min"
        :aria-valuemax="modelMax"
        :aria-valuenow="modelMin"
        @pointerdown="activeThumb = 'min'"
        @input="onMinInput" />
      <input
        type="range"
        class="range range-minmax__input range-minmax__input--max"
        :class="[sizeClass, { 'range-minmax__input--front': !minIsFront }]"
        :id="maxId"
        :min="min"
        :max="max"
        :step="step"
        :value="modelMax"
        :aria-label="maxAriaLabel"
        :aria-valuemin="modelMin"
        :aria-valuemax="max"
        :aria-valuenow="modelMax"
        @pointerdown="activeThumb = 'max'"
        @input="onMaxInput" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../../stores/settings";

const props = withDefaults(
  defineProps<{
    id: string;
    min?: number;
    max?: number;
    step?: number;
    size?: "xs" | "sm" | "md" | "lg";
    minAriaLabel?: string;
    maxAriaLabel?: string;
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    size: "xs",
    minAriaLabel: "Minimum",
    maxAriaLabel: "Maximum",
  },
);

const modelMin = defineModel<number>("modelMin", { required: true });
const modelMax = defineModel<number>("modelMax", { required: true });

const settingsStore = useSettingsStore();
const { config } = storeToRefs(settingsStore);
const activeThumb = ref<"min" | "max">("max");

const minId = computed(() => `${props.id}-min`);
const maxId = computed(() => `${props.id}-max`);

const sizeClass = computed(() => {
  const map = {
    xs: "range-xs",
    sm: "range-sm",
    md: "range-md",
    lg: "range-lg",
  };
  return map[props.size];
});

const classes = computed(() => {
  const list: string[] = [];
  if ((config.value as { theme?: string } | null)?.theme === "black") {
    list.push("[--range-shdw:gray]");
  }
  return list;
});

const span = computed(() => Math.max(props.max - props.min, Number.EPSILON));

const minPercent = computed(
  () => ((modelMin.value - props.min) / span.value) * 100,
);
const maxPercent = computed(
  () => ((modelMax.value - props.min) / span.value) * 100,
);

const fillStyle = computed(() => ({
  left: `${minPercent.value}%`,
  width: `${Math.max(maxPercent.value - minPercent.value, 0)}%`,
}));

/** Keep the dragged thumb on top when handles overlap. */
const minIsFront = computed(() => activeThumb.value === "min");

function clamp(value: number) {
  return Math.min(props.max, Math.max(props.min, value));
}

function onMinInput(event: Event) {
  const raw = Number((event.target as HTMLInputElement).value);
  const next = clamp(raw);
  modelMin.value = Math.min(next, modelMax.value);
}

function onMaxInput(event: Event) {
  const raw = Number((event.target as HTMLInputElement).value);
  const next = clamp(raw);
  modelMax.value = Math.max(next, modelMin.value);
}
</script>

<style scoped lang="scss">
/*
  daisyUI's .range draws a left-fill via box-shadow + overflow:hidden
  (https://v4.daisyui.com/components/range/). That filler hides the other
  thumb in a dual-handle slider, so we strip it and paint our own rail/fill.
*/
.range-minmax {
  --range-shdw: var(--fallback-bc, oklch(var(--bc) / 1));
}

.range-minmax__rail,
.range-minmax__fill {
  position: absolute;
  top: 50%;
  height: 0.5rem;
  transform: translateY(-50%);
  border-radius: var(--rounded-box, 1rem);
  pointer-events: none;
}

.range-minmax__rail {
  inset-inline: 0;
  background-color: var(--fallback-bc, oklch(var(--bc) / 0.1));
}

.range-minmax__fill {
  background-color: var(--range-shdw, var(--fallback-bc, oklch(var(--bc) / 1)));
}

.range-minmax__input {
  position: absolute;
  inset-inline: 0;
  top: 50%;
  width: 100%;
  margin: 0;
  transform: translateY(-50%);
  pointer-events: none;
  background: transparent;
  overflow: visible !important;
  z-index: 2;

  &.range-minmax__input--front {
    z-index: 4;
  }

  &::-webkit-slider-runnable-track {
    background: transparent;
  }

  &::-moz-range-track {
    background: transparent;
  }

  /* Keep the daisyUI thumb look, drop the left-fill shadow */
  &::-webkit-slider-thumb {
    pointer-events: auto;
    position: relative;
    z-index: 5;
    box-shadow:
      0 0 0 3px var(--range-shdw, var(--fallback-bc, oklch(var(--bc) / 1)))
        inset,
      var(--focus-shadow, 0 0);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    pointer-events: auto;
    position: relative;
    z-index: 5;
    box-shadow:
      0 0 0 3px var(--range-shdw, var(--fallback-bc, oklch(var(--bc) / 1)))
        inset,
      var(--focus-shadow, 0 0);
    cursor: pointer;
  }
}
</style>
