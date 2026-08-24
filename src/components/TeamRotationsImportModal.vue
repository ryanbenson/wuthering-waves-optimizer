<template>
  <dialog
    ref="dialogEl"
    class="modal"
    data-test-team-rotations-import-modal
    @close="isOpen = false">
    <div class="modal-box max-w-lg" data-test-team-rotations-import>
      <h3 class="text-lg font-bold">Import a team</h3>

      <div class="flex flex-col gap-4 mt-2">
        <div>
          <h4 class="font-semibold text-sm mb-1">Import from text</h4>
          <p class="text-sm opacity-80">
            Paste a team exported from Team Rotations (or a preset's data) below.
          </p>
          <textarea
            v-model="importText"
            class="textarea textarea-bordered w-full mt-2"
            rows="4"
            data-test-team-rotations-import-text></textarea>
          <button
            type="button"
            class="btn btn-primary btn-sm mt-2"
            data-test-team-rotations-import-text-button
            @click="handleImportFromText">
            Import
          </button>
        </div>
        <div>
          <h4 class="font-semibold text-sm mb-1">Import from file</h4>
          <p class="text-sm opacity-80">Upload a team .json file exported from Team Rotations.</p>
          <input
            type="file"
            accept=".json"
            class="file-input file-input-bordered file-input-sm w-full max-w-xs mt-2"
            data-test-team-rotations-import-file
            @change="handleImportFileSelected" />
        </div>
      </div>

      <div class="modal-action">
        <button
          type="button"
          class="btn btn-sm"
          data-test-team-rotations-import-cancel
          @click="isOpen = false">
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
import { useToast } from "../composables/useToast";
import { parseTeamImportPayload, type TeamExportData } from "../teamRotations/exportImport";

const emit = defineEmits<{
  import: [data: TeamExportData];
}>();

const isOpen = defineModel<boolean>("open", { default: false });
const dialogEl = ref<HTMLDialogElement | null>(null);
const importText = ref("");
const { showToast } = useToast();

watch(isOpen, (open) => {
  const el = dialogEl.value;
  if (!el) return;
  if (open) {
    if (!el.open) el.showModal();
  } else {
    if (el.open) el.close();
    importText.value = "";
  }
});

function handleImportFromText() {
  if (!importText.value.trim()) {
    showToast("Paste a team's exported JSON first.", "error");
    return;
  }
  try {
    emit("import", parseTeamImportPayload(importText.value));
  } catch (e) {
    showToast(e instanceof Error ? e.message : "Failed to import that team.", "error");
  }
}

function handleImportFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const raw = e.target?.result;
    if (typeof raw !== "string") {
      showToast("Couldn't read that file.", "error");
      return;
    }
    try {
      emit("import", parseTeamImportPayload(raw));
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to import that team.", "error");
    }
  };
  reader.readAsText(file);
  input.value = "";
}
</script>
