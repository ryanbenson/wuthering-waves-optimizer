<template>
  <Nav cur-page="settings" :disable-mobile-nav="true"></Nav>
  <div class="page-settings">
    <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) off: legacy tab strip, untouched. -->
    <Settings v-if="!isLiveResultBarEnabled"></Settings>
    <!-- Labs flag on: grouped sidebar workspace. -->
    <SettingsWorkspace v-else></SettingsWorkspace>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Settings from "../components/Settings.vue";
import SettingsWorkspace from "../components/SettingsWorkspace.vue";
import Nav from "../components/navigation/Nav.vue";
import { useSettingsStore } from "../stores/settings";
import { isV3UiEnabled } from "../utils/uiVersion";
import { useDocumentTitle } from "../composables/useDocumentTitle";

useDocumentTitle(
  "Settings — Wuthering Waves Calculator & Optimizer",
  "Preferences, backup and restore, Wavescan import and Labs for the Wuthering Waves Calculator & Optimizer.",
);

const settingsStore = useSettingsStore();
const isLiveResultBarEnabled = computed(
  () => isV3UiEnabled(settingsStore),
);
</script>

<style scoped lang="scss">
.page-settings {
  padding: 2rem 3rem;
}
</style>
