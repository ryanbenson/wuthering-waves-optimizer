<template>
  <nav
    ref="barRef"
    aria-label="Main"
    class="nav-bottom-bar fixed inset-x-0 bottom-0 z-40 bg-base-300 border-t border-base-content/10 grid grid-cols-5 px-1 pt-1.5">
    <RouterLink
      v-for="section in MAIN_SECTIONS"
      :key="section.page"
      :to="section.to"
      class="nav-bottom-bar__item"
      :class="{ 'nav-bottom-bar__item--active': section.page === curPage }"
      :aria-current="section.page === curPage ? 'page' : undefined"
      v-bind="{ [section.testAttr]: '' }">
      <span class="nav-bottom-bar__pill"><NavIcon :icon="section.icon" class="size-6" /></span>
      <span class="truncate max-w-full">{{ section.label }}</span>
    </RouterLink>

    <!-- Scanners, Settings, Info and the rest: the utility menu, opening upwards. -->
    <NavUtilityMenu :cur-page="curPage" :is-v3="true" placement="up" class="flex">
      <template #trigger>
        <div
          tabindex="0"
          role="button"
          class="nav-bottom-bar__item w-full"
          :class="{ 'nav-bottom-bar__item--active': isMorePage(curPage) }"
          aria-label="More"
          data-test-nav-bottom-more>
          <span class="nav-bottom-bar__pill"><NavIcon :icon="NAV_ICONS.more" class="size-6" /></span>
          <span class="truncate max-w-full">{{ isMorePage(curPage) ? pageLabel(curPage) : "More" }}</span>
        </div>
      </template>
    </NavUtilityMenu>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
import NavIcon from "./NavIcon.vue";
import NavUtilityMenu from "./NavUtilityMenu.vue";
import { MAIN_SECTIONS, NAV_ICONS, isMorePage, pageLabel } from "./navSections";
import { useSizeCssVar } from "../../composables/useSizeCssVar";

// The v3 phone bottom bar (ADR 0045): the main sections, then More.
defineOptions({ name: "NavBottomBar" });

defineProps<{ curPage: string }>();

const barRef = ref<HTMLElement | null>(null);
useSizeCssVar(barRef, "--nav-bottom-h", { resetTo: "0px" });
</script>

<style lang="scss" scoped>
.nav-bottom-bar {
  padding-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px));
}
.nav-bottom-bar a:hover {
  color: inherit;
}
html[data-theme="black"] .nav-bottom-bar {
  background: oklch(var(--b1));
}
.nav-bottom-bar__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  min-height: 3.5rem;
  min-width: 0;
  font-size: 0.75rem;
  font-weight: 600;
  // Dim with opacity, not a translucent colour: the white game-art icons
  // don't follow the text colour.
  color: oklch(var(--bc));
  opacity: 0.7;
  cursor: pointer;
}
.nav-bottom-bar__pill {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 2rem;
  border-radius: 999px;
}
.nav-bottom-bar__item--active {
  opacity: 1;
  .nav-bottom-bar__pill {
    background: oklch(var(--p) / 0.25);
  }
}
</style>
