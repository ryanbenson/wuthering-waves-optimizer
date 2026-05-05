<template>
  <div class="drawer drawer-end z-50">
    <input
      id="my-drawer-4"
      v-model="isDrawerOpen"
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
        :key="calculatorKey"
        :is-breakdown-open="isDrawerOpen"
        @stat-selected="openDrawer"
        @attack-selected="openDrawer"
        @breakdown-closed="closeDrawer"></Calculator>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Calculator from "../components/Calculator.vue";

const calculatorKey = ref(self.crypto.randomUUID());
const isDrawerOpen = ref(false);

function openDrawer() {
  isDrawerOpen.value = true;
}

function closeDrawer() {
  isDrawerOpen.value = false;
}

onMounted(() => {
  const navigationEntries = performance.getEntriesByType(
    "navigation",
  ) as PerformanceNavigationTiming[];
  const navigationActions = navigationEntries.map((nav) => nav.type);
  if (navigationActions.includes("back_forward")) {
    const urlParams = new URLSearchParams(window.location.search);
    const debug = urlParams.get("debug");
    if (debug == "true") {
      alert("welcome back");
    }
    setTimeout(() => {
      calculatorKey.value = self.crypto.randomUUID();
    }, 10);
  }
});
</script>
