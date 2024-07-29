<template>
  <div class="import-export">
    <SettingsImportExport></SettingsImportExport>
  </div>
</template>

<script>
import SettingsImportExport from "./SettingsImportExport.vue";
export default {
  name: "Settings",
  components: { SettingsImportExport },
  data() {
    return {
      name: "hi",
    };
  },
};
</script>
