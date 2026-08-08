<template>
  <label class="flex items-start gap-2 py-1.5 border-b border-base-300 last:border-0 cursor-pointer">
    <input
      type="checkbox"
      class="checkbox checkbox-xs mt-0.5 shrink-0"
      :checked="isEnabled"
      :disabled="alwaysEnabled"
      :data-test-advanced-buff-toggle="dataTestKey"
      @change="onToggle(($event.target as HTMLInputElement).checked)" />
    <span class="flex-1 text-xs opacity-90" v-html="details"></span>
    <input
      v-if="hasStacks"
      type="number"
      class="input input-bordered input-xs w-14 shrink-0"
      :min="minStacks ?? 0"
      :max="maxStacks ?? 99"
      :value="stacks"
      :data-test-advanced-buff-stacks="dataTestKey"
      @click.stop
      @change="onStacksChange(($event.target as HTMLInputElement).valueAsNumber)" />
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";

export interface AdvancedBuffOverride {
  isEnabled?: boolean;
  stacks?: number;
}

const props = withDefaults(
  defineProps<{
    dataTestKey: string;
    details: string;
    hasStacks?: boolean;
    minStacks?: number;
    maxStacks?: number;
    alwaysEnabled?: boolean;
    modelValue?: AdvancedBuffOverride;
  }>(),
  {
    hasStacks: false,
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
    modelValue: undefined,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: AdvancedBuffOverride];
}>();

const isEnabled = computed(() => props.alwaysEnabled || (props.modelValue?.isEnabled ?? false));
const stacks = computed(() => props.modelValue?.stacks ?? props.minStacks ?? 0);

function onToggle(checked: boolean) {
  emit("update:modelValue", { ...(props.modelValue ?? {}), isEnabled: checked });
}

function onStacksChange(value: number) {
  if (Number.isNaN(value)) return;
  emit("update:modelValue", { ...(props.modelValue ?? {}), stacks: value });
}
</script>
