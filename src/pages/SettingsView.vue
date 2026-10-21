<template>
  <Nav
    cur-page="settings"
    :disable-mobile-nav="true"
    :sections="isLiveResultBarEnabled ? SETTINGS_SECTIONS : null"
    :active-section="activeSection"
    @select-section="selectSection"></Nav>
  <div class="page-settings">
    <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) off: legacy tab strip, untouched. -->
    <Settings v-if="!isLiveResultBarEnabled"></Settings>
    <!-- Labs flag on: the sections are in the nav's tab row (ADR 0045). -->
    <SettingsWorkspace v-else :section="activeSection"></SettingsWorkspace>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import Settings from "../components/Settings.vue";
import SettingsWorkspace, { type SettingsSectionId } from "../components/SettingsWorkspace.vue";
import Nav from "../components/navigation/Nav.vue";
import { SETTINGS_SECTIONS } from "../components/navigation/navSections";
import { useSettingsStore } from "../stores/settings";
import { isV3UiEnabled } from "../utils/uiVersion";

const settingsStore = useSettingsStore();
const isLiveResultBarEnabled = computed(
  () => isV3UiEnabled(settingsStore),
);

// /settings?section=wavescan (the Scanners page's import link) opens that section.
const activeSection = ref<SettingsSectionId>(
  useRoute()?.query.section === "wavescan" ? "wavescan" : "preferences",
);

function selectSection(key: string) {
  if (key === activeSection.value) return;
  activeSection.value = key as SettingsSectionId;
  window.scrollTo({ top: 0 });
}
</script>

<style scoped lang="scss">
.page-settings {
  padding: 2rem 3rem;
}
</style>
