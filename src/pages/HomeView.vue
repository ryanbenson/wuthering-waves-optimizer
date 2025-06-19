<template>
  <div class="drawer drawer-end z-50">
    <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <!-- Page content here -->
      <label for="my-drawer-4" class="drawer-button btn btn-primary">
        Open drawer
      </label>
    </div>
    <div class="drawer-side">
      <label
        for="my-drawer-4"
        aria-label="close sidebar"
        class="drawer-overlay"></label>
      <div class="bg-base-200 text-base-content min-h-full w-80 p-4">
        <!-- Sidebar content here -->
        <h3 class="text-2xl font-bold mb-4">HP</h3>
        <hr />
        <p>
          Base:
          <strong>14800</strong>
        </p>
        <p>HP%:</p>
        <ul class="mt-2">
          <li>
            Stat Bonuses:
            <strong>12%</strong>
          </li>
          <li>
            Echoes:
            <strong>180%</strong>
          </li>
          <li>
            Custom Buffs:
            <strong>20%</strong>
          </li>
        </ul>
        <p>Flat HP:</p>
        <ul class="mt-2">
          <li>
            Echoes:
            <strong>7800</strong>
          </li>
          <li>
            Custom Buffs:
            <strong>500</strong>
          </li>
        </ul>
        <hr />
        <p class="mt-4">
          Total:
          <strong>46000</strong>
        </p>
      </div>
    </div>
  </div>
  <div class="calculator__content">
    <div class="calculator__el">
      <Calculator class="calculator" :key="key"></Calculator>
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
