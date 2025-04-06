<template>
  <div class="calculations">
    <Nav cur-page="inventory"></Nav>
    <div class="inventory__content p-8">
      <InventoryEchoesBrowser></InventoryEchoesBrowser>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from "vue";
import InventoryEchoesBrowser from "./InventoryEchoesBrowser.vue";
import Nav from "./navigation/Nav.vue";
export default defineComponent({
  name: "Inventory",
  components: {
    InventoryEchoesBrowser,
    Nav,
  },
});
</script>
