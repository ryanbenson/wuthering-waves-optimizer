<template>
  <AppModal
    ref="modalRef"
    title="Rotation presets"
    max-width-class="max-w-lg"
    :lazy="false"
    :sheet="false"
    close-test-attr="data-test-rotations-presets-cancel"
    data-test-rotations-presets-modal
    @close="isOpen = false">
    <div data-test-rotations-presets>

      <div class="flex flex-col gap-2">
        <div v-if="!presets.length" class="text-sm opacity-70">
          No presets are available for {{ characterName }} yet.
        </div>
        <div
          v-for="preset in presets"
          :key="preset.name"
          class="card card-bordered card-compact bg-base-100">
          <div class="card-body">
            <h4 class="card-title text-base">{{ preset.name }}</h4>
            <p class="text-sm">{{ preset.description }}</p>
            <p class="italic text-sm opacity-80">Author: {{ preset.author }}</p>
            <button
              type="button"
              class="btn btn-primary btn-sm w-fit"
              @click="emit('import', preset)">
              Import
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { CharacterRotationPreset } from "../characters/rotationExportImport";
import AppModal from "./AppModal.vue";

defineProps<{
  presets: CharacterRotationPreset[];
  characterName: string;
}>();

const emit = defineEmits<{
  import: [preset: CharacterRotationPreset];
}>();

const isOpen = defineModel<boolean>("open", { default: false });
const modalRef = ref<InstanceType<typeof AppModal> | null>(null);

watch(isOpen, (open) => {
  if (open) {
    modalRef.value?.triggerOpenModal();
  } else {
    modalRef.value?.triggerCloseModal();
  }
});
</script>
