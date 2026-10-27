<template>
  <div class="calculations">
    <Nav
      cur-page="inventory"
      :sections="isV3 ? INVENTORY_SECTIONS : null"
      :active-section="curScreen"
      @select-section="changeScreen($event as 'echoes' | 'presets')">
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
import { computed, ref } from "vue";
import InventoryEchoesBrowser from "./InventoryEchoesBrowser.vue";
import InventoryPresetsBrowser from "./InventoryPresetsBrowser.vue";
import Nav from "./navigation/Nav.vue";
import InventorySubNav from "./navigation/InventorySubNav.vue";
import InventoryMobileSubNav from "./navigation/InventoryMobileSubNav.vue";
import { INVENTORY_SECTIONS } from "./navigation/navSections";
import { useSettingsStore } from "../stores/settings";
import { isV3UiEnabled } from "../utils/uiVersion";

const settingsStore = useSettingsStore();
const isV3 = computed(() => isV3UiEnabled(settingsStore));

const curScreen = ref<"echoes" | "presets">("echoes");

function changeScreen(screen: "echoes" | "presets") {
  if (screen === curScreen.value) return;
  curScreen.value = screen;
  // A new section starts at the top.
  window.scrollTo({ top: 0 });
}
</script>
