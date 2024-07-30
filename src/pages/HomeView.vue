<template>
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
      key: self.crypto.randomUUID()
    }
  },
  mounted() {
    const navigationEntries = performance.getEntriesByType("navigation");
    const navigationActions = navigationEntries.map(nav => nav.type);
    if (navigationActions.includes('back_forward')) {
      setTimeout(() => {
        this.key = self.crypto.randomUUID();
      }, 10);
    }
  }
});
</script>
