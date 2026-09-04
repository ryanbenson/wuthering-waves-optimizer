<template>
  <div class="calculations">
    <Nav cur-page="inventory">
      <template #mobile>
        <InventoryMobileSubNav
          @change-screen="changeScreen"
          :screen="curScreen"></InventoryMobileSubNav>
      </template>
      <template #default>
        <InventorySubNav
            :screen="curScreen"
            @change-screen="changeScreen"></InventorySubNav>
      </template>
    </Nav>
    <div class="inventory__content p-8">
      <InventoryEchoesBrowser v-if="curScreen === 'echoes'"></InventoryEchoesBrowser>
      <InventoryPresetsBrowser v-if="curScreen === 'presets'"></InventoryPresetsBrowser>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import InventoryEchoesBrowser from "./InventoryEchoesBrowser.vue";
import InventoryPresetsBrowser from "./InventoryPresetsBrowser.vue";
import Nav from "./navigation/Nav.vue";
import InventorySubNav from "./navigation/InventorySubNav.vue";
import InventoryMobileSubNav from "./navigation/InventoryMobileSubNav.vue";

const curScreen = ref<"echoes" | "presets">("echoes");

function changeScreen(screen: "echoes" | "presets") {
  curScreen.value = screen;
}
</script>
