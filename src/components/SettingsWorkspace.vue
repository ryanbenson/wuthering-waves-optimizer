<template>
  <div class="settings-workspace flex flex-col gap-4">
    <div class="flex flex-col sm:flex-row gap-6">
      <WorkspaceSideNav
        title="Settings"
        :groups="sectionGroups"
        :active-id="activeSection"
        @select="selectSection" />

      <!-- Content -->
      <div class="flex-1 min-w-0 flex flex-col gap-3">
        <div class="bg-base-200 p-1 pl-3 rounded-lg flex items-center justify-between">
          <h3 class="text-sm font-semibold">{{ activeSectionMeta.label }}</h3>
        </div>

        <SettingsPreferences v-if="activeSection === 'preferences'" variant="v3" />
        <SettingsBackupRestore v-else-if="activeSection === 'backup-restore'" />
        <SettingsDelete v-else-if="activeSection === 'danger-zone'" variant="v3" />
        <SettingsLabs v-else-if="activeSection === 'labs'" variant="v3" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

type SectionId = "preferences" | "backup-restore" | "danger-zone" | "labs";

import SettingsBackupRestore from "./SettingsBackupRestore.vue";
import SettingsDelete from "./SettingsDelete.vue";
import SettingsLabs from "./SettingsLabs.vue";
import SettingsPreferences from "./SettingsPreferences.vue";
import WorkspaceSideNav, { type WorkspaceNavGroup } from "./WorkspaceSideNav.vue";

// Hand-inlined icons (rendered via v-html), matching the convention already
// used across this redesign wave (Nav.vue, workspace components) rather
// than an icon library or a render-function abstraction.
function svgIcon(paths: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${paths}</svg>`;
}

const ICONS = {
  preferences: svgIcon(
    '<line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>',
  ),
  backupRestore: svgIcon(
    '<path d="M21 8v11a2 2 0 01-2 2H5a2 2 0 01-2-2V8"></path><path d="M23 3H1v5h22V3z"></path><line x1="10" y1="12" x2="14" y2="12"></line>',
  ),
  dangerZone: svgIcon(
    '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>',
  ),
  labs: svgIcon(
    '<path d="M9 2v6.3L4.2 17a2 2 0 001.8 3h12a2 2 0 001.8-3L15 8.3V2"></path><line x1="8.5" y1="2" x2="15.5" y2="2"></line><line x1="8" y1="15" x2="16" y2="15"></line>',
  ),
};

const sectionGroups: WorkspaceNavGroup[] = [
  {
    label: "General",
    items: [{ id: "preferences", label: "Preferences", icon: ICONS.preferences }],
  },
  {
    label: "Your Data",
    items: [
      { id: "backup-restore", label: "Backup & Restore", icon: ICONS.backupRestore },
      { id: "danger-zone", label: "Danger Zone", icon: ICONS.dangerZone },
    ],
  },
  {
    label: "Labs",
    items: [{ id: "labs", label: "Labs", icon: ICONS.labs, badge: "1" }],
  },
];

const allSections = sectionGroups.flatMap((g) => g.items);

const activeSection = ref<SectionId>("preferences");
const activeSectionMeta = computed(
  () => allSections.find((s) => s.id === activeSection.value) ?? allSections[0],
);

function selectSection(id: string) {
  activeSection.value = id as SectionId;
}
</script>
