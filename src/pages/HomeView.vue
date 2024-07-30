<template>
  <div class="calculator__content">
    <div class="calculator__el">
      <Calculator class="calculator" :key="key"></Calculator>
    </div>
  </div>
</template>

<script lang="ts">
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
    if (performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD) {
      setTimeout(() => {
        alert('regenerate key')
        this.key = self.crypto.randomUUID();
      }, 250);
    }
  }
});
</script>
