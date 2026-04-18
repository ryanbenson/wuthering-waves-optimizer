<template>
  <div class="labs-list">
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

const props = defineProps<{
  labKey: string;
  label: string;
  details: string;
}>();

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
