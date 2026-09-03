<template>
  <div class="flex flex-col gap-4">
    <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-3">
      <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">
        Backup
      </div>
      <p class="text-sm opacity-70">
        Save a backup of your characters, inventory, and team rotations.
      </p>
      <div class="flex gap-2">
        <button
          @click="copyCharacterData"
          class="btn btn-sm btn-primary"
          data-test-settings-export-copy>
          Copy to clipboard
        </button>
        <button
          @click="downloadCharacterData"
          class="btn btn-sm btn-primary"
          data-test-settings-export-download>
          Download .json
        </button>
      </div>
    </div>

    <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-3">
      <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">
        Import echoes
      </div>
      <p class="text-sm opacity-70">
        Adds a scanned or shared list of echoes to your inventory — does not
        touch your existing data. Should be JSON, an array of echo objects.
      </p>
      <textarea
        v-model="importEchoesAddRawText"
        class="textarea textarea-bordered"
        data-test-import-raw-text-echoes></textarea>
      <button
        @click="importEchoesAddRaw"
        class="btn btn-sm btn-primary self-start"
        data-test-import-raw-echoes-button>
        Import echoes
      </button>
    </div>

    <div class="bg-base-200 rounded-xl p-4 flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50">
          Import &amp; overwrite
        </div>
      </div>
      <div role="alert" class="alert alert-warning py-2 text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="h-5 w-5 shrink-0 stroke-current">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01" />
        </svg>
        <span>This replaces all of your existing data — this can't be undone.</span>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div class="flex flex-col gap-2">
          <p class="text-sm opacity-70">Paste a previously exported backup.</p>
          <textarea
            v-model="importedRawCharacterData"
            class="textarea textarea-bordered"
            data-test-import-raw-text></textarea>
          <button
            @click="importRawCharacterData"
            class="btn btn-sm btn-error self-start"
            data-test-import-raw-button>
            Overwrite from text
          </button>
        </div>

        <div class="flex flex-col gap-2">
          <p class="text-sm opacity-70">Or upload a backup file.</p>
          <input
            type="file"
            @change="handleFileUpload"
            accept=".json"
            class="file-input file-input-bordered file-input-sm"
            data-test-import-file-input />
          <textarea
            v-model="fileData"
            readonly
            class="textarea textarea-bordered"></textarea>
          <button
            @click="confirmUpload"
            class="btn btn-sm btn-error self-start"
            data-test-import-file-confirm>
            Overwrite from file
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * v3.0 "Backup & Restore" panel — merges legacy's separate Export and
 * Import tabs into one, and adds an explicit warning banner above the
 * destructive overwrite-import controls (legacy has no such warning).
 * All data logic is shared with legacy via src/utils/settingsBackup.ts —
 * see docs/adr/0022-settings-page-redesign.md.
 */
import { ref } from "vue";
import { useInventoryStore } from "../stores/inventory";
import { useToast } from "../composables/useToast";
import { downloadBlob } from "../utils/downloadFile";
import {
  applyImportedDatabase,
  generateExportFilename,
  getExportData,
  importEchoesFromRaw,
  isJsonString,
} from "../utils/settingsBackup";

const { showToast } = useToast();

const importedRawCharacterData = ref("");
const importEchoesAddRawText = ref("");
const fileData = ref<string | null>(null);

const inventoryStore = useInventoryStore();

function copyCharacterData() {
  const data = getExportData();
  navigator.clipboard.writeText(JSON.stringify(data));
  showToast("Character data has been copied to your clipboard", "success");
}

function downloadCharacterData() {
  const data = getExportData();
  downloadBlob(JSON.stringify(data), generateExportFilename());
  showToast("Character data has been downloaded", "success");
}

function importRawCharacterData() {
  if (!importedRawCharacterData.value) {
    return showToast("No character data given", "error");
  }
  if (isJsonString(importedRawCharacterData.value) === false) {
    return showToast("Character data given is invalid", "error");
  }
  applyImportedDatabase(importedRawCharacterData.value);
  showToast("Your data has been overwritten!", "success");
  importedRawCharacterData.value = "";
  window.setTimeout(() => location.reload(), 1500);
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file && file.type === "application/json") {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        fileData.value = typeof data === "string" ? data : null;
      } catch {
        showToast("Error parsing JSON file", "error");
        fileData.value = null;
      }
    };
    reader.readAsText(file);
  } else {
    showToast("Please upload a valid JSON file.", "error");
    fileData.value = null;
  }
}

function confirmUpload() {
  if (!fileData.value) {
    showToast("No character data given", "error");
    return;
  }
  if (isJsonString(fileData.value) === false) {
    showToast("Character data given is invalid", "error");
    return;
  }
  applyImportedDatabase(fileData.value);
  showToast("Your data has been overwritten!", "success");
  fileData.value = null;
  window.setTimeout(() => location.reload(), 1500);
}

async function importEchoesAddRaw() {
  try {
    const amount = await importEchoesFromRaw(
      importEchoesAddRawText.value,
      inventoryStore,
    );
    showToast(`Imported ${amount} echoes.`, "success");
  } catch (e) {
    showToast(`Failed to import echoes: ${e}`, "error");
  }
}
</script>
