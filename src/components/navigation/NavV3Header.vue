<template>
  <header class="nav-v3 bg-base-300 text-base-content shadow">
    <div class="flex items-center h-[60px] px-2 lg:px-4 gap-1">
      <RouterLink
        to="/"
        class="flex items-center gap-2.5 h-12 pl-1 pr-2 rounded-lg text-base-content hover:bg-base-content/5 shrink-0"
        aria-label="Wuthering Tools home"
        title="Wuthering Tools"
        data-test-nav-logo
        @click="emit('home')">
        <span class="nav-logo" aria-hidden="true"></span>
        <span class="hidden xl:inline text-base font-bold whitespace-nowrap">Wuthering Tools</span>
      </RouterLink>

      <!-- Desktop: the main sections as labeled tabs. -->
      <nav aria-label="Main" class="hidden lg:flex items-stretch self-stretch ml-2">
        <RouterLink
          v-for="section in MAIN_SECTIONS"
          :key="section.page"
          :to="section.to"
          class="flex items-center gap-2 px-3 xl:px-4 border-b-2 text-sm font-semibold whitespace-nowrap transition-colors"
          :class="
            section.page === curPage
              ? 'border-primary text-base-content'
              : 'border-transparent text-base-content/70 hover:text-base-content'
          "
          :aria-current="section.page === curPage ? 'page' : undefined"
          v-bind="{ [section.testAttr]: '' }">
          <NavIcon :d="section.icon" class="size-5" />
          {{ section.label }}
        </RouterLink>
      </nav>

      <!-- Phone: the current page's name opens a switcher with every section. -->
      <div class="dropdown lg:hidden">
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost h-11 min-h-11 px-2.5 gap-1.5 text-base font-bold"
          data-test-nav-section-switcher>
          {{ pageLabel(curPage) }}
          <NavIcon d="M6 9l6 6 6-6" class="size-[18px]" />
        </div>
        <div
          tabindex="0"
          class="dropdown-content z-50 !fixed inset-x-3 top-[64px] bg-base-200 text-base-content rounded-box border border-base-content/10 shadow-2xl p-2">
          <ul class="menu w-full p-0">
            <li v-for="section in MAIN_SECTIONS" :key="section.page">
              <RouterLink
                :to="section.to"
                class="flex items-center gap-3 py-2.5 text-base-content"
                :class="{ active: section.page === curPage }"
                @click="closeMenu">
                <NavIcon :d="section.icon" class="size-5" />
                {{ section.label }}
              </RouterLink>
            </li>
          </ul>
          <div class="border-t border-base-content/10 my-2 mx-1"></div>
          <p class="text-[0.7rem] font-bold uppercase tracking-wider text-base-content/55 px-3 pb-1">
            More from Wuthering Tools
          </p>
          <ul class="menu w-full p-0">
            <li>
              <RouterLink
                to="/scanners"
                class="flex items-center gap-3 py-2.5 text-base-content"
                :class="{ active: curPage === 'scanners' }"
                data-test-nav-switcher-scanners
                @click="closeMenu">
                <NavIcon :d="NAV_ICONS.scanner" class="size-5 text-primary" />
                <span class="flex flex-col">
                  <span class="font-semibold">Wavescan <span class="badge badge-sm badge-primary badge-outline ml-1">Desktop app</span></span>
                  <span class="text-xs text-base-content/70">Scan every echo from the game</span>
                </span>
              </RouterLink>
            </li>
            <li v-for="link in RESOURCE_LINKS" :key="link.page">
              <RouterLink
                :to="link.to"
                class="flex items-center gap-3 py-2 text-base-content"
                :class="{ active: link.page === curPage }"
                @click="closeMenu">
                <NavIcon :d="link.icon" class="size-5" />
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="flex-1"></div>

      <RouterLink
        to="/scanners"
        class="hidden lg:flex items-center gap-2 h-10 px-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors"
        :class="
          curPage === 'scanners'
            ? 'bg-base-content/10 text-base-content'
            : 'text-base-content/80 hover:bg-base-content/5 hover:text-base-content'
        "
        :aria-current="curPage === 'scanners' ? 'page' : undefined"
        data-test-nav-wavescan>
        <NavIcon :d="NAV_ICONS.scanner" class="size-5" />
        Wavescan
        <span class="badge badge-sm badge-primary badge-outline hidden xl:inline-flex">Desktop app</span>
      </RouterLink>

      <!-- relative z-[100]: keeps both dropdowns above the page content. -->
      <div class="flex gap-1 relative z-[100]">
        <ThemeChooser></ThemeChooser>
        <NavUtilityMenu :cur-page="curPage" :is-v3="true" />
      </div>
    </div>

    <NavSectionTabs
      v-if="sections"
      class="hidden lg:flex"
      :sections="sections"
      :active="activeSection"
      :label="`${pageLabel(curPage)} sections`"
      @select="emit('select-section', $event)" />
  </header>

  <NavBottomBar
    v-if="sections"
    :sections="sections"
    :active="activeSection"
    :label="`${pageLabel(curPage)} sections`"
    @select="emit('select-section', $event)" />
</template>

<script setup lang="ts">
import ThemeChooser from "../ThemeChooser.vue";
import NavIcon from "./NavIcon.vue";
import NavBottomBar from "./NavBottomBar.vue";
import NavSectionTabs from "./NavSectionTabs.vue";
import NavUtilityMenu from "./NavUtilityMenu.vue";
import { MAIN_SECTIONS, NAV_ICONS, RESOURCE_LINKS, pageLabel, type NavSections } from "./navSections";

// The v3 header (ADR 0045). Row one: logo, main sections, Wavescan, theme and
// the utility menu. Row two (desktop) or the bottom bar (phones): the page's
// own sections, when it passes any.
defineOptions({
  name: "NavV3Header",
});

withDefaults(
  defineProps<{
    curPage: string;
    sections?: NavSections | null;
    activeSection?: string;
  }>(),
  { sections: null, activeSection: "" },
);

const emit = defineEmits<{
  home: [];
  "select-section": [key: string];
}>();

function closeMenu() {
  (document.activeElement as HTMLElement | null)?.blur();
}
</script>

<style lang="scss" scoped>
// The global stylesheet still carries the Vite scaffold's `a:hover` purple,
// which outranks a plain text-* class on hover.
.nav-v3 a:hover {
  color: inherit;
}

html[data-theme="black"] .nav-v3 {
  background: oklch(var(--b1));
}
</style>
