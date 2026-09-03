<template>
  <div v-if="variant === 'v3'" class="bg-base-200 rounded-xl p-4 flex items-start justify-between gap-4">
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2">
        <span class="font-bold text-base">{{ label }}</span>
        <span class="badge badge-sm badge-primary badge-outline">Labs</span>
      </div>
      <p class="text-sm text-neutral-content max-w-xl">{{ details }}</p>
    </div>
    <input
      v-model="isEnabled"
      type="checkbox"
      class="toggle toggle-primary mt-1 shrink-0" />
  </div>
  <div v-else class="labs-list">
    <div class="form-control mt-4">
      <label class="label cursor-pointer flex gap-4 justify-start">
        <input
          v-model="isEnabled"
          type="checkbox"
          class="toggle toggle-primary" />
        <span class="label-text font-bold">{{ label }}</span>
        <p class="text-neutral-content">{{ details }}</p>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../stores/settings";

const props = withDefaults(
  defineProps<{
    labKey: string;
    label: string;
    details: string;
    variant?: "legacy" | "v3";
  }>(),
  { variant: "legacy" },
);

const settingsStore = useSettingsStore();
const { labs } = storeToRefs(settingsStore);
const { upsertLab } = settingsStore;

const isEnabled = computed({
  get() {
    return (
      (labs.value as Record<string, { isEnabled?: boolean } | undefined>)?.[
        props.labKey
      ]?.isEnabled ?? false
    );
  },
  async set(value: boolean) {
    const data: Record<string, { isEnabled: boolean }> = {};
    data[props.labKey] = {
      isEnabled: value,
    };
    await upsertLab(data);
  },
});
</script>

<style scoped lang="scss">
.actions {
  display: flex;
  gap: 2rem;

  @media (max-width: 660px) {
    flex-direction: column;
  }
}
textarea {
  min-width: 320px;
  min-height: 3rem;
  display: block;

  @media (max-width: 900px) {
    min-width: 240px;
  }
}
.notification {
  background: #045c04;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 1.5rem;

  &.notification--error {
    background: #890725;
  }
}
input[type="file"] {
  margin-bottom: 1rem;
}
.mb-1 {
  margin-bottom: 1rem;
}
</style>
