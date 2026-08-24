<template>
  <dialog
    ref="dialogEl"
    class="modal"
    data-test-rotations-import-modal
    @close="isOpen = false">
    <div class="modal-box max-w-lg" data-test-rotations-import>
      <h3 class="text-lg font-bold">Import a rotation</h3>

      <div class="flex flex-col gap-4 mt-2">
        <div>
          <h4 class="font-semibold text-sm mb-1">Import from text</h4>
          <p class="text-sm opacity-80">Paste a rotation exported from this page below.</p>
          <textarea
            v-model="importRotationData"
            name="importRotation"
            id="importRotaton"
            class="textarea textarea-bordered w-full mt-2"
            data-test-rotations-import-text></textarea>
          <button
            type="button"
            class="btn btn-primary btn-sm mt-2"
            data-test-rotations-import-text-button
            @click="handleImportRotation">
            Import
          </button>
        </div>
        <div>
          <h4 class="font-semibold text-sm mb-1">Import from file</h4>
          <p class="text-sm opacity-80">Upload a rotation .json file.</p>
          <div class="flex items-center gap-2 mt-2">
            <input
              ref="importRotationFileInputRef"
              type="file"
              accept=".json"
              class="file-input file-input-bordered file-input-sm flex-1 min-w-0"
              data-test-rotations-import-file
              @change="handleImportRotationFileSelected" />
            <button
              type="button"
              class="btn btn-primary btn-sm"
              :disabled="!importRotationFile"
              data-test-rotations-import-file-button
              @click="handleImportRotationFile">
              Import
            </button>
          </div>
        </div>
      </div>

      <div class="modal-action">
        <button
          type="button"
          class="btn btn-sm"
          data-test-rotations-import-cancel
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
import { parseRotationImportPayload, type RotationExportData } from "../characters/rotationExportImport";

const emit = defineEmits<{
  import: [data: RotationExportData];
}>();

const isOpen = defineModel<boolean>("open", { default: false });
const dialogEl = ref<HTMLDialogElement | null>(null);
const importRotationData = ref<string | null>(null);
const importRotationFile = ref<File | null>(null);
const importRotationFileInputRef = ref<HTMLInputElement | null>(null);
const { showToast } = useToast();

watch(isOpen, (open) => {
  const el = dialogEl.value;
  if (!el) return;
  if (open) {
    if (!el.open) el.showModal();
  } else {
    if (el.open) el.close();
    importRotationData.value = null;
    importRotationFile.value = null;
    if (importRotationFileInputRef.value) {
      importRotationFileInputRef.value.value = "";
    }
  }
});

function handleImportRotation() {
  try {
    emit("import", parseRotationImportPayload(importRotationData.value ?? ""));
  } catch (e) {
    showToast(e instanceof Error ? e.message : "Rotation data is not valid", "error");
  }
}

function handleImportRotationFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  importRotationFile.value = input.files?.[0] ?? null;
}

function handleImportRotationFile() {
  const file = importRotationFile.value;
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const raw = e.target?.result;
    if (typeof raw !== "string") {
      showToast("Couldn't read that file.", "error");
      return;
    }
    try {
      emit("import", parseRotationImportPayload(raw));
      importRotationFile.value = null;
      if (importRotationFileInputRef.value) {
        importRotationFileInputRef.value.value = "";
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Rotation data is not valid", "error");
    }
  };
  reader.readAsText(file);
}
</script>
