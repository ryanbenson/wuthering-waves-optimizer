<template>
  <dialog
    ref="dialogEl"
    class="modal"
    data-test-rotations-presets-modal
    @close="isOpen = false">
    <div class="modal-box max-w-lg" data-test-rotations-presets>
      <h3 class="text-lg font-bold">Rotation presets</h3>

      <div class="flex flex-col gap-2 mt-2 max-h-[60vh] overflow-y-auto">
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

      <div class="modal-action">
        <button
          type="button"
          class="btn btn-sm"
          data-test-rotations-presets-cancel
          @click="isOpen = false">
          Close
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop" @submit.prevent="isOpen = false">
      <button type="submit">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { CharacterRotationPreset } from "../characters/rotationExportImport";

defineProps<{
  presets: CharacterRotationPreset[];
  characterName: string;
}>();

const emit = defineEmits<{
  import: [preset: CharacterRotationPreset];
}>();

const isOpen = defineModel<boolean>("open", { default: false });
const dialogEl = ref<HTMLDialogElement | null>(null);

watch(isOpen, (open) => {
  const el = dialogEl.value;
  if (!el) return;
  if (open) {
    if (!el.open) el.showModal();
  } else if (el.open) {
    el.close();
  }
});
</script>
