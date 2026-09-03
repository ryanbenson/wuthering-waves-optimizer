<template>
  <div class="settings-workspace flex flex-col gap-4">
    <h1 class="text-2xl font-bold sm:hidden">Settings</h1>

    <!-- Mobile: tap-to-open section switcher, reusing the same dropdown-menu
         pattern as InventoryMobileSubNav.vue. -->
    <details class="settings-workspace__mobile-nav sm:hidden dropdown">
      <summary
        tabindex="0"
        role="button"
        class="bg-base-200 rounded-lg p-1 pl-3 flex items-center justify-between w-full"
        data-test-settings-mobile-nav-trigger>
        <span class="flex items-center gap-2">
          <span class="size-4 opacity-70 [&_svg]:size-full" v-html="activeSectionMeta.icon"></span>
          <span class="font-bold text-sm">{{ activeSectionMeta.label }}</span>
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" class="size-4 opacity-55"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </summary>
      <ul
        tabindex="0"
        class="menu menu-sm dropdown-content bg-base-300 rounded-box z-[1] mt-2 w-full p-2 shadow">
        <template v-for="group in sectionGroups" :key="group.label">
          <li class="menu-title text-[.65rem] uppercase tracking-wider opacity-50">
            {{ group.label }}
          </li>
          <li v-for="section in group.items" :key="section.id">
            <a
              @click="selectSection(section.id)"
              :class="{ active: activeSection === section.id }"
              :data-test-settings-mobile-nav-item="section.id">
              <span class="size-4 [&_svg]:size-full" v-html="section.icon"></span>
              {{ section.label }}
              <span v-if="section.badge" class="badge badge-primary badge-sm ml-auto font-mono">
                {{ section.badge }}
              </span>
            </a>
          </li>
        </template>
      </ul>
    </details>

    <div class="flex gap-6">
      <!-- Desktop sidebar -->
      <div class="hidden sm:flex w-52 shrink-0 flex-col gap-6">
        <h1 class="text-2xl font-bold">Settings</h1>
        <div v-for="group in sectionGroups" :key="group.label" class="flex flex-col gap-1">
          <div class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 px-3 mb-0.5">
            {{ group.label }}
          </div>
          <button
            v-for="section in group.items"
            :key="section.id"
            type="button"
            class="settings-workspace__side-item"
            :class="{ 'settings-workspace__side-item--active': activeSection === section.id }"
            :data-test-settings-nav-item="section.id"
            @click="selectSection(section.id)">
            <span class="size-4 [&_svg]:size-full" v-html="section.icon"></span>
            <span>{{ section.label }}</span>
            <span v-if="section.badge" class="badge badge-primary badge-sm ml-auto font-mono">
              {{ section.badge }}
            </span>
          </button>
        </div>
      </div>

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

type Section = { id: SectionId; label: string; icon: string; badge?: string };

const sectionGroups: { label: string; items: Section[] }[] = [
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

function selectSection(id: SectionId) {
  activeSection.value = id;
  const mobileNav = document.querySelector(".settings-workspace__mobile-nav");
  if (mobileNav) {
    mobileNav.removeAttribute("open");
  }
}
</script>

<style scoped lang="scss">
.settings-workspace__side-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.5rem 0.7rem;
  border-radius: 0.55rem;
  font-size: 0.84rem;
  font-weight: 600;
  text-align: left;
  position: relative;

  &--active {
    background: color-mix(in oklch, oklch(var(--p)) 16%, oklch(var(--b2)));
    &::before {
      content: "";
      position: absolute;
      left: -0.55rem;
      top: 0.35rem;
      bottom: 0.35rem;
      width: 3px;
      border-radius: 3px;
      background: oklch(var(--p));
    }
  }
}
</style>
