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
  <h3 class="text-2xl font-bold mb-4">Export your database</h3>

  <div class="card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <h3 class="card-title">Backup your data</h3>
      <div class="actions actions--fetch">
        <div class="settings__import-export__copy panel">
          <p class="mb-2">Export your character data?</p>
          <button @click="copyCharacterData" class="btn btn-primary mr-2">
            Copy to clipboard
          </button>
          <button @click="downloadCharacterData" class="btn btn-primary">
            Download
          </button>
        </div>
      </div>
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
     * Gets all of the data to save
     */
    getData() {
      const meta = {
        version: "2",
        source: "WutheringTools",
      };
      const data = {
        character: localStorage.getItem("character"),
        inventory: localStorage.getItem("inventory"),
      };
      const d = {
        meta,
        data,
      };
      return d;
    },
    /**
     * Handler to copy the contents of the character data into the user's clipboard
     */
    copyCharacterData() {
      const data = this.getData();
      navigator.clipboard.writeText(JSON.stringify(data));
      this.triggerNotification(
        "Character data has been copied to your clipboard",
      );
    },
    /**
     * Handler to download the character data as a JSON file
     */
    downloadCharacterData() {
      const data = this.getData();
      const blob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });
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
      const date = new Date();
      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });

      const parts = dateFormatter.formatToParts(date);
      const partsValues = {
        month: '',
        day: '',
        year: ''
      };
      parts.forEach(({type, value}) => {
        if (type === 'month') {
          partsValues.month = value;
        }
        if (type === 'day') {
          partsValues.day = value;
        }
        if (type === 'year') {
          partsValues.year = value;
        }
      });
      const dateStr = `${partsValues.year}-${partsValues.month}-${partsValues.day}`;
      return `character_data_${dateStr}.json`;
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
