<template>
  <div class="drawer drawer-end z-50">
    <input 
      id="my-drawer-4" 
      ref="drawerCheckbox"
      type="checkbox" 
      class="drawer-toggle" />
    <div class="drawer-content">
      <!-- Page content here -->
    </div>
    <div class="drawer-side">
      <label
        for="my-drawer-4"
        aria-label="close sidebar"
        class="drawer-overlay"></label>
      <div id="sidebar" class="bg-base-100 text-base-content min-h-full max-w-[480px] w-full p-4"></div>
    </div>
  </div>
  <div class="calculator__content">
    <div class="calculator__el">
      <Calculator 
        class="calculator" 
        :key="key"
        @stat-selected="openDrawer"
        @attack-selected="openDrawer"
        @breakdown-closed="closeDrawer"></Calculator>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from "vue";
import Calculator from "../components/Calculator.vue";
export default defineComponent({
  name: "HomeView",
  components: { Calculator },
  data() {
    return {
      key: self.crypto.randomUUID(),
    };
  },
  methods: {
    openDrawer() {
      if (this.$refs.drawerCheckbox) {
        this.$refs.drawerCheckbox.checked = true;
      }
    },
    closeDrawer() {
      if (this.$refs.drawerCheckbox) {
        this.$refs.drawerCheckbox.checked = false;
      }
    },
  },
  mounted() {
    /**
     * This catches if the user closes their browser and re-opens, which
     * triggers a back_forward event type for the browser. This causes data conflicts.
     * The browser will try to use its own cached data in the app, which overrides
     * the data from the store and localstorage and causes UI and calc issues.
     * If we find the back_forward event, we trash the initially mounted instance
     * and make a new one by regenerating the key, which recycles the data
     * to use the correct data.
     */
    const navigationEntries = performance.getEntriesByType("navigation");
    const navigationActions = navigationEntries.map((nav) => nav.type);
    if (navigationActions.includes("back_forward")) {
      const urlParams = new URLSearchParams(window.location.search);
      const debug = urlParams.get("debug");
      if (debug == "true") {
        alert("welcome back");
      }
      setTimeout(() => {
        this.key = self.crypto.randomUUID();
      }, 10);
    }
  },
});
</script>
