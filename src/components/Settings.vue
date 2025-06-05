<template>
  <div class="import-export">
    <h1 class="text-2xl mb-4">Settings</h1>

    <!-- Main container switches from vertical to horizontal layout -->
    <div class="tab-group flex flex-col sm:flex-row w-full">
      
      <!-- Tabs switch from horizontal to vertical depending on screen -->
      <div
        role="tablist"
        class="relative flex flex-row sm:flex-col border-b border-base-300 sm:border-b-0"
      >
        <a
          href="#"
          class="tab-link text-base-content px-4 py-2"
          :class="getActiveClasses('export')"
          @click="setTab('export')"
        >
          Export
        </a>
        <a
          href="#"
          class="tab-link text-base-content px-4 py-2"
          :class="getActiveClasses('import')"
          @click="setTab('import')"
        >
          Import
        </a>
        <a
          href="#"
          class="tab-link text-base-content px-4 py-2"
          :class="getActiveClasses('advanced')"
          @click="setTab('advanced')"
        >
          Advanced
        </a>
      </div>

      <!-- Content area switches from stacked (mobile) to right-aligned (sm+) -->
      <div class="import-export-content mt-8 sm:ml-12 sm:mt-0">
        <SettingsExport v-if="tab === 'export'" />
        <SettingsImport v-if="tab === 'import'" />
        <SettingsDelete v-if="tab === 'advanced'" />
      </div>
    </div>
  </div>
</template>


<script lang="ts">
// @ts-nocheck
import { defineComponent } from "vue";
import SettingsDelete from "./SettingsDelete.vue";
import SettingsExport from "./SettingsExport.vue";
import SettingsImport from "./SettingsImport.vue";
export default defineComponent({
  name: "Settings",
  components: { SettingsDelete, SettingsExport, SettingsImport },
  data() {
    return {
      tab: "export",
    };
  },
  methods: {
    setTab(tab) {
      this.tab = tab;
    },
    getActiveClasses(tab: string) {
      if (this.tab === tab) {
        return `
          relative 
          before:content-[''] 
          before:absolute 
          before:left-0 
          before:top-auto 
          before:bottom-0 
          before:h-0.5 
          before:w-full 
          before:bg-primary

          sm:before:top-0 
          sm:before:bottom-0 
          sm:before:left-0 
          sm:before:w-0.5 
          sm:before:h-full 
          sm:before:bg-primary 
        `;
      } else {
        return "";
      }
    }
  }
});
</script>

<style lang="scss">
.contain {
  min-height: 100%;
}
</style>