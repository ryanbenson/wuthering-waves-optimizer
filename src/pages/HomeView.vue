<template>
  <Calculator></Calculator>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Calculator from "../components/Calculator.vue";
export default defineComponent({
  name: "HomeView",
  components: { Calculator },
});
</script>
