<template>
  <dialog
    ref="dialogEl"
    class="modal"
    data-test-team-rotation-import-modal
    @close="isOpen = false">
    <div class="modal-box max-w-lg">
      <h3 class="text-lg font-bold">Import a rotation for {{ characterName }}</h3>
      <p class="py-1 text-sm opacity-80">
        Bring in one of this character's own saved rotations, or a community preset, as this
        slot's actions.
      </p>

      <div class="flex flex-col gap-4 mt-2 max-h-[60vh] overflow-y-auto">
        <div>
          <h4 class="font-semibold text-sm mb-1">Your rotations</h4>
          <p v-if="!ownRotations.length" class="text-sm opacity-60">
            You don't have any saved rotations for {{ characterName }} yet.
          </p>
          <div v-else class="flex flex-col gap-2">
            <div
              v-for="rotation in ownRotations"
              :key="rotation.id"
              class="card card-bordered card-compact bg-base-100"
              :data-test-team-rotation-import-own="rotation.id">
              <div class="card-body">
                <div class="flex items-center justify-between gap-2">
                  <span class="font-semibold truncate">{{ rotation.name }}</span>
                  <span class="text-xs opacity-60 shrink-0">
                    {{ rotation.actions.length }} action{{ rotation.actions.length === 1 ? "" : "s" }}
                  </span>
                </div>
                <p v-if="rotation.description" class="text-xs opacity-70">{{ rotation.description }}</p>
                <div class="join self-end mt-1">
                  <button
                    type="button"
                    class="btn btn-xs join-item"
                    data-test-team-rotation-import-append
                    @click="chooseSource(rotation.actions, 'append')">
                    Append
                  </button>
                  <button
                    type="button"
                    class="btn btn-xs btn-primary join-item"
                    data-test-team-rotation-import-overwrite
                    @click="chooseSource(rotation.actions, 'overwrite')">
                    Overwrite
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 class="font-semibold text-sm mb-1">Presets</h4>
          <p v-if="!presets.length" class="text-sm opacity-60">
            No presets are available for {{ characterName }} yet.
          </p>
          <div v-else class="flex flex-col gap-2">
            <div
              v-for="preset in presets"
              :key="preset.name"
              class="card card-bordered card-compact bg-base-100"
              :data-test-team-rotation-import-preset="preset.name">
              <div class="card-body">
                <div class="flex items-center justify-between gap-2">
                  <span class="font-semibold truncate">{{ preset.name }}</span>
                  <span class="text-xs opacity-60 shrink-0">
                    {{ preset.data.actions.length }} action{{ preset.data.actions.length === 1 ? "" : "s" }}
                  </span>
                </div>
                <p v-if="preset.description" class="text-xs opacity-70">{{ preset.description }}</p>
                <p v-if="preset.author" class="text-xs italic opacity-60">Author: {{ preset.author }}</p>
                <div class="join self-end mt-1">
                  <button
                    type="button"
                    class="btn btn-xs join-item"
                    data-test-team-rotation-import-append
                    @click="chooseSource(preset.data.actions, 'append')">
                    Append
                  </button>
                  <button
                    type="button"
                    class="btn btn-xs btn-primary join-item"
                    data-test-team-rotation-import-overwrite
                    @click="chooseSource(preset.data.actions, 'overwrite')">
                    Overwrite
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-action">
        <button type="button" class="btn btn-sm" data-test-team-rotation-import-cancel @click="isOpen = false">
          Cancel
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
import type { SourceRotationAction } from "../calculator/teamRotation";

type RotationRow = {
  id?: string;
  name: string;
  description?: string | null;
  actions: SourceRotationAction[];
};

type RotationPreset = {
  name: string;
  description?: string;
  author?: string;
  data: RotationRow;
};

defineProps<{
  characterName: string;
  ownRotations: RotationRow[];
  presets: RotationPreset[];
}>();

const emit = defineEmits<{
  import: [actions: SourceRotationAction[], mode: "overwrite" | "append"];
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

function chooseSource(actions: SourceRotationAction[], mode: "overwrite" | "append") {
  emit("import", actions, mode);
  isOpen.value = false;
}
</script>
