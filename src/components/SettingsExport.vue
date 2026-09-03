<template>
  <h3 class="text-2xl font-bold mb-4">Export your database</h3>

  <div class="card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <h3 class="card-title">Backup your data</h3>
      <div class="actions actions--fetch">
        <div class="settings__import-export__copy panel">
          <p class="mb-2">Export your character data?</p>
          <button
            @click="copyCharacterData"
            class="btn btn-primary mr-2"
            data-test-settings-export-copy>
            Copy to clipboard
          </button>
          <button
            @click="downloadCharacterData"
            class="btn btn-primary"
            data-test-settings-export-download>
            Download
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "../composables/useToast";
import { downloadBlob } from "../utils/downloadFile";
import { getExportData, generateExportFilename } from "../utils/settingsBackup";

const { showToast } = useToast();

/**
 * Handler to copy the contents of the character data into the user's clipboard
 */
function copyCharacterData() {
  const data = getExportData();
  navigator.clipboard.writeText(JSON.stringify(data));
  showToast("Character data has been copied to your clipboard", "success");
}

/**
 * Handler to download the character data as a JSON file
 */
function downloadCharacterData() {
  const data = getExportData();
  downloadBlob(JSON.stringify(data), generateExportFilename());
  showToast("Character data has been downloaded", "success");
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
