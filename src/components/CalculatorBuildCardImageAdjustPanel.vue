<template>
  <div class="dropdown dropdown-end" data-export-hide>
    <button
      tabindex="0"
      class="btn btn-sm btn-neutral"
      :aria-label="`Adjust ${label} image`"
      :data-test-image-adjust-trigger="testId">
      Adjust
    </button>
    <div
      tabindex="0"
      class="dropdown-content bg-base-200 text-base-content rounded-box z-10 mt-2 w-64 border border-white/5 p-3 shadow-2xl outline-1 outline-black/5"
      :data-test-image-adjust-panel="testId">
      <label class="form-control">
        <div class="label py-1">
          <span class="label-text text-xs">Background style</span>
        </div>
        <select
          class="select select-bordered select-sm"
          :value="transform.fit"
          @change="onFitChange"
          :data-test-image-adjust-fit="testId">
          <option v-for="opt in fitOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </label>
      <label class="form-control mt-2">
        <div class="label py-1">
          <span class="label-text text-xs">Scale ({{ transform.scale }}%)</span>
        </div>
        <input
          type="range"
          class="range range-sm"
          :min="scaleMin"
          :max="scaleMax"
          step="5"
          :value="transform.scale"
          @input="onFieldInput('scale', $event)"
          :data-test-image-adjust-scale="testId" />
      </label>
      <label class="form-control mt-2">
        <div class="label py-1">
          <span class="label-text text-xs">Horizontal position</span>
        </div>
        <input
          type="range"
          class="range range-sm"
          :min="offsetMin"
          :max="offsetMax"
          step="1"
          :value="transform.offsetX"
          @input="onFieldInput('offsetX', $event)"
          :data-test-image-adjust-offset-x="testId" />
      </label>
      <label class="form-control mt-2">
        <div class="label py-1">
          <span class="label-text text-xs">Vertical position</span>
        </div>
        <input
          type="range"
          class="range range-sm"
          :min="offsetMin"
          :max="offsetMax"
          step="1"
          :value="transform.offsetY"
          @input="onFieldInput('offsetY', $event)"
          :data-test-image-adjust-offset-y="testId" />
      </label>
      <button
        type="button"
        class="btn btn-xs btn-ghost mt-3 w-full"
        @click="$emit('reset')"
        :data-test-image-adjust-reset="testId">
        Reset positioning
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  IMAGE_FIT_OPTIONS,
  IMAGE_OFFSET_MAX,
  IMAGE_OFFSET_MIN,
  IMAGE_SCALE_MAX,
  IMAGE_SCALE_MIN,
  resolveImageTransform,
  type ImageFit,
  type ImageTransform,
} from "../utils/imageTransform";

const props = defineProps<{
  label: string;
  modelValue?: Partial<ImageTransform> | null;
  testId: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: ImageTransform];
  reset: [];
}>();

const fitOptions = IMAGE_FIT_OPTIONS;
const scaleMin = IMAGE_SCALE_MIN;
const scaleMax = IMAGE_SCALE_MAX;
const offsetMin = IMAGE_OFFSET_MIN;
const offsetMax = IMAGE_OFFSET_MAX;

const transform = computed(() => resolveImageTransform(props.modelValue));

function onFitChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value as ImageFit;
  emit("update:modelValue", { ...resolveImageTransform(props.modelValue), fit: value });
}

function onFieldInput(field: "scale" | "offsetX" | "offsetY", e: Event) {
  const value = Number((e.target as HTMLInputElement).value);
  emit("update:modelValue", { ...resolveImageTransform(props.modelValue), [field]: value });
}
</script>
