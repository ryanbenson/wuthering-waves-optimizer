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

  <h3 class="text-2xl font-bold mb-4">Delete your data</h3>

  <div class="card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <h3 class="card-title">Delete your data</h3>
      <p>This will reset your data to a blank state.</p>
      <button @click="confirmDelete" class="btn btn-error">Delete</button>
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
     * Confirms the deletion of user data
     */
    confirmDelete() {
      if (window.confirm("Do you really want to delete everything?")) {
        // empty character data
        localStorage.setItem("character", "");
        const characterStore = useCharacterStore();
        characterStore.$hydrate({ runHooks: false });
        // empty the inventory
        localStorage.setItem("inventory", "");
        const inventoryStore = useInventoryStore();
        inventoryStore.$hydrate({ runHooks: false });
        alert("Your data has been deleted!");
        location.reload();
      }
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
