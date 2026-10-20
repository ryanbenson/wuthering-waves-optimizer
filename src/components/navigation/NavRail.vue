<template>
  <nav
    ref="railRef"
    aria-label="Main"
    class="nav-rail fixed inset-y-0 left-0 w-[84px] flex flex-col items-stretch gap-1 px-1.5 py-3 bg-base-300 text-base-content border-r border-base-content/10">
    <RouterLink
      to="/"
      class="flex justify-center pt-1 pb-3 text-base-content"
      aria-label="Wuthering Tools home"
      title="Wuthering Tools"
      data-test-nav-logo
      @click="emit('home')">
      <span class="nav-logo" aria-hidden="true"></span>
    </RouterLink>

    <RouterLink
      v-for="section in MAIN_SECTIONS"
      :key="section.page"
      :to="section.to"
      class="nav-rail__item"
      :class="{ 'nav-rail__item--active': section.page === curPage }"
      :aria-current="section.page === curPage ? 'page' : undefined"
      v-bind="{ [section.testAttr]: '' }">
      <span class="nav-rail__pill"><NavIcon :icon="section.icon" class="size-7" /></span>
      {{ section.label }}
    </RouterLink>

    <div class="flex-1"></div>
    <div class="h-px bg-base-content/10 mx-2.5 my-1.5"></div>

    <RouterLink
      to="/scanners"
      class="nav-rail__item"
      :class="{ 'nav-rail__item--active': curPage === 'scanners' }"
      :aria-current="curPage === 'scanners' ? 'page' : undefined"
      title="Wavescan, the desktop echo scanner"
      data-test-nav-wavescan>
      <span class="nav-rail__pill"><NavIcon :icon="NAV_ICONS.scanner" class="size-5" /></span>
      Scanners
    </RouterLink>

    <div class="flex flex-col items-center gap-1">
      <ThemeChooser placement="right" />
      <NavUtilityMenu :cur-page="curPage" :is-v3="true" placement="right" />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ThemeChooser from "../ThemeChooser.vue";
import NavIcon from "./NavIcon.vue";
import NavUtilityMenu from "./NavUtilityMenu.vue";
import { MAIN_SECTIONS, NAV_ICONS } from "./navSections";
import { useSizeCssVar } from "../../composables/useSizeCssVar";

// The v3 desktop side rail (ADR 0045): logo, the main sections, Scanners,
// theme and the utility menu.
defineOptions({ name: "NavRail" });

defineProps<{ curPage: string }>();

const emit = defineEmits<{ home: [] }>();

// Pages offset themselves by --nav-rail-w (AppLayout.vue).
const railRef = ref<HTMLElement | null>(null);
useSizeCssVar(railRef, "--nav-rail-w", { dimension: "width", resetTo: "0px" });
</script>

<style lang="scss" scoped>
// The global stylesheet still carries the Vite scaffold's `a:hover` purple.
.nav-rail a:hover {
  color: inherit;
}

html[data-theme="black"] .nav-rail {
  background: oklch(var(--b1));
}

.nav-rail__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.4rem 0;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: oklch(var(--bc) / 0.7);
}
.nav-rail__item:hover {
  color: oklch(var(--bc));
}
.nav-rail__pill {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 2.25rem;
  border-radius: 999px;
  transition: background-color 0.15s;
}
.nav-rail__item:hover .nav-rail__pill {
  background: oklch(var(--bc) / 0.06);
}
.nav-rail__item--active {
  color: oklch(var(--bc));
  .nav-rail__pill {
    background: oklch(var(--p) / 0.25);
  }
}
.nav-rail__item--active:hover .nav-rail__pill {
  background: oklch(var(--p) / 0.3);
}
</style>
