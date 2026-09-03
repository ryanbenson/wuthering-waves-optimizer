<template>
  <h3 class="text-2xl font-bold mb-4">Overwrite your existing data</h3>

  <div class="card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <h3 class="card-title">Import from text</h3>
      <p>
        Import your character data? Paste your data here. This will overwrite
        your existing data.
      </p>
      <textarea
        v-model="importedRawCharacterData"
        class="textarea textarea-bordered"
        data-test-import-raw-text></textarea>
      <button @click="importRawCharacterData" class="btn btn-error" data-test-import-raw-button>
        Confirm Import
      </button>
    </div>
  </div>

  <div class="card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <h3 class="card-title">Import from file</h3>
      <p>Upload your character data? This will overwrite your existing data.</p>
      <input
        type="file"
        @change="handleFileUpload"
        accept=".json"
        class="file-input file-input-bordered" />
      <textarea
        v-model="fileData"
        readonly
        class="textarea textarea-bordered"></textarea>
      <button @click="confirmUpload" class="btn btn-error">
        Confirm Overwrite with File Data
      </button>
    </div>
  </div>

  <h3 class="text-2xl font-bold mb-4">Import echoes</h3>

  <div class="card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <h3 class="card-title">Import from text</h3>
      <p>
        This will import a list of echoes and <strong>add</strong> them to your inventory. It will not replace your inventory. It should be in JSON format, and an array of echo objects.
      </p>
      <textarea
        v-model="importEchoesAddRawText"
        class="textarea textarea-bordered"
        data-test-import-raw-text-echoes></textarea>
      <button @click="importEchoesAddRaw" class="btn btn-primary" data-test-import-raw-echoes-button>
        Confirm Import Echoes
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * On import we apply pending transforms from meta.version, then mark current.
 * See src/utils/settingsBackup.ts for the shared import/export/version logic.
 */
import { ref } from "vue";
import { useInventoryStore } from "../stores/inventory";
import { useToast } from "../composables/useToast";
import {
  applyImportedDatabase,
  importEchoesFromRaw,
  isJsonString,
} from "../utils/settingsBackup";

const { showToast } = useToast();

const importedRawCharacterData = ref("");
const importEchoesAddRawText = ref("");
const fileData = ref<string | null>(null);

const inventoryStore = useInventoryStore();

/**
 * Imports the raw character data through a given string in the input
 */
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

/**
 * Process the file and store the data
 */
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

/**
 * Confirms the file upload and overwrite the data
 */
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
