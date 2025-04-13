<template>
  <div class="import-export">
    <SettingsImportExport></SettingsImportExport>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from "vue";
import SettingsImportExport from "./SettingsImportExport.vue";
export default defineComponent({
  name: "Settings",
  components: { SettingsImportExport },
  data() {
    return {
      name: "Settings",
    };
  },
});
</script>
