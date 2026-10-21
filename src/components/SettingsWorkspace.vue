<template>
  <div class="settings-workspace flex flex-col gap-3">
    <div class="bg-base-200 p-1 pl-3 rounded-lg flex items-center justify-between">
      <h3 class="text-sm font-semibold">{{ sectionLabel }}</h3>
    </div>

    <SettingsPreferences v-if="section === 'preferences'" variant="v3" />
    <SettingsBackupRestore v-else-if="section === 'backup-restore'" />
    <SettingsDelete v-else-if="section === 'danger-zone'" variant="v3" />
    <SettingsWavescan v-else-if="section === 'wavescan'" />
    <SettingsLabs v-else-if="section === 'labs'" variant="v3" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SettingsBackupRestore from "./SettingsBackupRestore.vue";
import SettingsDelete from "./SettingsDelete.vue";
import SettingsLabs from "./SettingsLabs.vue";
import SettingsPreferences from "./SettingsPreferences.vue";
import SettingsWavescan from "./SettingsWavescan.vue";
import { SETTINGS_SECTIONS } from "./navigation/navSections";

export type SettingsSectionId =
  | "preferences"
  | "backup-restore"
  | "danger-zone"
  | "wavescan"
  | "labs";

// The v3 Settings page. Its sections are picked in the nav's tab row
// (SETTINGS_SECTIONS, ADR 0045); SettingsView.vue holds which one is open.
const props = defineProps<{ section: SettingsSectionId }>();

const sectionLabel = computed(
  () =>
    SETTINGS_SECTIONS.groups
      .flatMap((group) => group.items)
      .find((item) => item.key === props.section)?.label ?? "",
);
</script>
