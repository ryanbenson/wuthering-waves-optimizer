<template>
  <AppModal
    ref="modalRef"
    title="Import a team"
    max-width-class="max-w-lg"
    :lazy="false"
    :sheet="false"
    close-test-attr="data-test-team-rotations-import-cancel"
    data-test-team-rotations-import-modal
    @close="isOpen = false">
    <div data-test-team-rotations-import>

      <div class="flex flex-col gap-4">
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
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useToast } from "../composables/useToast";
import { parseTeamImportPayload, type TeamExportData } from "../teamRotations/exportImport";
import AppModal from "./AppModal.vue";

const emit = defineEmits<{
  import: [data: TeamExportData];
}>();

const isOpen = defineModel<boolean>("open", { default: false });
const modalRef = ref<InstanceType<typeof AppModal> | null>(null);
const importText = ref("");
const { showToast } = useToast();

watch(isOpen, (open) => {
  if (open) {
    modalRef.value?.triggerOpenModal();
  } else {
    modalRef.value?.triggerCloseModal();
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
