<template>
  <div class="calculator__content">
    <div class="calculator__el">
      <Calculator class="calculator"></Calculator>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Calculator from "../components/Calculator.vue";
import { useCharacterStore } from "../stores/character";
export default defineComponent({
  name: "HomeView",
  components: { Calculator },
  methods: {
    init() {
      const characterStore = useCharacterStore();
      // characterStore.$hydrate({ runHooks: false });
    }
  },
  mounted() {
    this.init();
  }
});
</script>
