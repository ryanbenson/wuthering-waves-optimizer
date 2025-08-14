<template>
  <div class="calculations">
    <Nav cur-page="inventory" :disable-mobile-nav="true"></Nav>
    <div class="inventory__content p-8">
      <div role="tablist" class="tabs tabs-bordered">
        <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Echoes"
          checked="checked" />
        <div role="tabpanel" class="tab-content mt-6">
          <InventoryEchoesBrowser></InventoryEchoesBrowser>
        </div>

        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          class="tab"
          aria-label="Presets" />
        <div role="tabpanel" class="tab-content mt-6">
          Listing of presets
        </div>
      </div>
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
