<template>
<div class="inventory__content">
  <div class="inventory__el">
    <Inventory class="inventory"></Inventory>
  </div>
</div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from "vue";
import Inventory from "../components/Inventory.vue";
export default defineComponent({
  name: "InventoryView",
  components: { Inventory },
});
</script>
