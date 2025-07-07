<template>
  <div
    v-if="isNotificationShown"
    class="alert mb-8"
    :class="{
      'alert-error': notificationError,
      'alert-success': !notificationError,
    }">
    {{ message }}
  </div>

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
</template>

<script lang="ts">
// @ts-nocheck
/**
 * Version 1 (which has no meta) only includes character data as a root property
 * Version 2, adds meta object, and puts data in: { meta, data: { character, inventory }}
 */
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
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
     * Provides the data to import based on changes to the structures
     * If there's a meta tag, then that got introduced in v2
     * v2 also introduces inventory data
     * If there's no meta, then that's v1, which is just the character data itself
     *   and has nothing else
     * @returns {Object}
     */
    getImportData(data, toParse = false) {
      let parsedData = data;
      if (toParse) {
        parsedData = JSON.parse(data);
      }
      const returnData = {};
      if (parsedData?.meta && parsedData?.meta.version === "2") {
        returnData.character = parsedData?.data?.character;
        returnData.inventory = parsedData?.data?.inventory;
      } else {
        returnData.character = parsedData;
        returnData.inventory = { echoes: [], equipped: {} };
      }
      return returnData;
    },
    /**
     * Imports the raw character data through a given string in the input
     */
    importRawCharacterData() {
      console.log(this.importedRawCharacterData);
      if (!this.importedRawCharacterData) {
        return this.triggerNotification("No character data given", true);
      }
      if (this.isJsonString(this.importedRawCharacterData) === false) {
        return this.triggerNotification("Character data given is invalid", true);
      }
      // overwrite the local storage then rehydrate
      const importData = this.getImportData(
        this.importedRawCharacterData,
        true,
      );
      // import char data
      const characterStore = useCharacterStore();
      let charData = importData.character;
      if (typeof charData === "string") {
        charData = JSON.parse(charData);
      }
      characterStore.hardSetState(charData);
      // import inventory data
      const inventoryStore = useInventoryStore();
      let inventoryData = importData.inventory;
      if (typeof inventoryData === "string") {
        inventoryData = JSON.parse(inventoryData);
      }
      inventoryStore.hardSetState(inventoryData);
      // notify user and refresh
      alert("Your data has been overwritten!");
      this.importedRawCharacterData = null;
      location.reload();
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
      const importData = this.getImportData(this.fileData, true);
      // import char data
      const characterStore = useCharacterStore();
      let charData = importData.character;
      if (typeof charData === "string") {
        charData = JSON.parse(charData);
      }
      characterStore.hardSetState(charData);
      // import inventory data
      const inventoryStore = useInventoryStore();
      let inventoryData = importData.inventory;
      if (typeof inventoryData === "string") {
        inventoryData = JSON.parse(inventoryData);
      }
      inventoryStore.hardSetState(inventoryData);
      // notify user and refresh
      alert("Your data has been overwritten!");
      this.fileData = null;
      location.reload();
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
