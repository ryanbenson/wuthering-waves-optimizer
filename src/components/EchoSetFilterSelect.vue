<template>
  <div class="flex flex-wrap items-center gap-2 mb-6">
    <AppRichSelect
      :model-value="modelValue"
      :options="echoSetSelectOptions"
      searchable
      allow-empty
      empty-label="Set"
      aria-label="Filter by echo set"
      class="w-fit min-w-[200px]"
      @update:model-value="(value) => $emit('update:modelValue', value as string | null)" />
    <button
      type="button"
      class="btn btn-sm btn-ghost"
      :disabled="!modelValue"
      @click="$emit('update:modelValue', null)">
      Clear
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AppRichSelect, { type AppRichSelectOption } from "./AppRichSelect.vue";
import { echoSetLabelMap } from "../echoes/stats";
import { buildEchoSetSelectOptions } from "../utils/richSelectOptions";

defineProps<{
  modelValue: string | null;
}>();

defineEmits<{
  "update:modelValue": [value: string | null];
}>();

const echoSetSelectOptions = computed((): AppRichSelectOption[] =>
  buildEchoSetSelectOptions(Object.keys(echoSetLabelMap)),
);
</script>
