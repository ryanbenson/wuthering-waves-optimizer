<template>
  <div
    v-if="isNotificationShown"
    class="notification"
    :class="{ 'notification--error': notificationError }">
    {{ message }}
  </div>
  <h2>Database</h2>
  <h3>Backup your data</h3>
  <div class="actions actions--fetch">
    <div class="settings__import-export__copy panel">
      <p>Export your character data?</p>
      <button @click="copyCharacterData" class="button">
        Copy to clipboard
      </button>
    </div>
  </div>
  <div class="actions actions--fetch">
    <div class="settings__import-export__download panel">
      <p>Download your character data?</p>
      <button @click="downloadCharacterData" class="button">Download</button>
    </div>
  </div>

  <h3>Overwrite your existing data</h3>

  <div class="actions actions--overwrite">
    <div class="settings__import-export__import-text panel">
      <p>Import your character data? Paste your data here</p>
      <textarea v-model="importedRawCharacterData"></textarea>
      <button @click="importRawCharacterData" class="button button--danger">
        Confirm Import
      </button>
    </div>
  </div>
  <div class="actions actions--overwrite">
    <div class="settings__import-export__import-file panel">
      <p>Upload your character data?</p>
      <input type="file" @change="handleFileUpload" accept=".json" />
      <textarea v-model="fileData" readonly></textarea>
      <button @click="confirmUpload" class="button button--danger">
        Confirm Overwrite with File Data
      </button>
    </div>
  </div>

  <h3>Delete your data</h3>
  <div class="actions actions--delete">
    <div class="settings__import-delete panel">
      <p>Delete your data?</p>
      <button @click="confirmDelete" class="button button--danger">
        Delete
      </button>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { useCharacterStore } from "../stores/character";
import { defineComponent } from "vue";
export default defineComponent({
  name: "SettingsImportExport",
  data() {
    return {
      importedRawCharacterData: "",
      message: "",
      isNotificationShown: false,
      notificationError: false,
      fileData: null,
    };
  },
  methods: {
    /**
     * Handler to copy the contents of the character data into the user's clipboard
     */
    copyCharacterData() {
      const data = localStorage.getItem("character");
      navigator.clipboard.writeText(data);
      this.triggerNotification(
        "Character data has been copied to your clipboard"
      );
    },
    /**
     * Handler to download the character data as a JSON file
     */
    downloadCharacterData() {
      const data = localStorage.getItem("character");
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = this.generateFilename();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.triggerNotification("Character data has been downloaded");
    },
    /**
     * Gets a filename for the JSON file
     */
    generateFilename() {
      const today = new Date();
      const date = today.toISOString().split("T")[0]; // YYYY-MM-DD format
      return `character_data_${date}.json`;
    },
    /**
     * Imports the raw character data through a given string in the input
     */
    importRawCharacterData() {
      if (!this.importedRawCharacterData) {
        this.triggerNotification("No character data given", true);
      }
      if (this.isJsonString(this.importedRawCharacterData) === false) {
        this.triggerNotification("Character data given is invalid", true);
      }
      // overwrite the local storage then rehydrate
      const data = localStorage.setItem(
        "character",
        this.importedRawCharacterData
      );
      const characterStore = useCharacterStore();
      characterStore.$hydrate({ runHooks: false });
      alert("Your data has been ovwerwriten!");
      this.importedRawCharacterData = null;
    },
    /**
     * Process the file and store the data
     * @param {Object} event
     */
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target.result;
            this.fileData = data;
          } catch (error) {
            this.triggerNotification("Error parsing JSON file", true);
            this.fileData = null;
          }
        };
        reader.readAsText(file);
      } else {
        this.triggerNotification("Please upload a valid JSON file.", true);
        this.fileData = null;
      }
    },
    /**
     * Confirms the file upload and overwrite the data
     */
    confirmUpload() {
      if (!this.fileData) {
        this.triggerNotification("No character data given", true);
      }
      if (this.isJsonString(this.fileData) === false) {
        this.triggerNotification("Character data given is invalid", true);
      }
      // overwrite the local storage then rehydrate
      const data = localStorage.setItem("character", this.fileData);
      const characterStore = useCharacterStore();
      characterStore.$hydrate({ runHooks: false });
      alert("Your data has been ovwerwriten!");
      this.fileData = null;
    },
    /**
     * Confirms the deletion of user data
     */
    confirmDelete() {
      if (window.confirm("Do you really want to delete everything?")) {
        const data = localStorage.setItem("character", "");
        const characterStore = useCharacterStore();
        characterStore.$hydrate({ runHooks: false });
        alert("Your data has been deleted!");
        location.reload();
      }
    },
    /**
     * Determines if the given JSON is valid or not
     * @param {String} str
     */
    isJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    /**
     * Shows the notification message and hides it after a duration
     * @param {String} message
     */
    triggerNotification(message, error = false) {
      this.message = message;
      this.isNotificationShown = true;
      this.notificationError = error;
      setTimeout(() => {
        this.isNotificationShown = false;
        this.message = "";
        this.notificationError = false;
      }, 5000);
    },
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
  margin-bottom: 1rem;

  @media (max-width: 900px) {
    min-width: 240px;
  }
}
p,
h2 {
  margin-top: 0;
}
h3 {
  margin: 2rem 0 0;
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
.button {
  background: #076b89;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;

  &.button--danger {
    background: #890725;
  }
}
.panel {
  margin-top: 1rem;
  background-color: #161616;
  padding: 1rem;
  border-radius: 6px;
  min-width: 368px;

  @media (prefers-color-scheme: light) {
    background-color: #f8f8f8;
  }
}
.mb-1 {
  margin-bottom: 1rem;
}
</style>
