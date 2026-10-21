<template>
  <nav
    :aria-label="label"
    class="nav-section-tabs flex items-stretch gap-1 px-3 xl:px-4 h-16 bg-base-300 text-base-content border-b border-base-content/10 overflow-x-auto">
    <template v-for="(group, index) in desktopGroups" :key="group.label">
      <!-- Group dividers only with labels; icons alone read fine without them. -->
      <div
        v-if="index > 0"
        class="w-px my-4 mx-1.5 bg-base-content/10 shrink-0"
        :class="{ 'hidden xl:block': compact }"
        aria-hidden="true"></div>
      <button
        v-for="item in group.items"
        :key="item.key"
        type="button"
        class="flex items-center gap-2 shrink-0 px-2.5 xl:px-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors"
        :class="
          item.key === active
            ? 'border-primary text-base-content'
            : 'border-transparent text-base-content opacity-70 hover:opacity-100'
        "
        :title="item.label"
        :aria-label="item.label"
        :aria-current="item.key === active ? 'page' : undefined"
        v-bind="{ [`data-test-${sections.testName}-nav`]: item.testId }"
        @click="emit('select', item.key)">
        <NavIcon :icon="item.icon" class="size-6" />
        <!-- Pages with many sections (the calculator) show labels from xl:
             at 1024px their icons alone fit beside the rail. -->
        <span :class="{ 'hidden xl:inline': compact }">{{ item.label }}</span>
        <span v-if="item.badge" class="badge badge-primary badge-sm font-mono">{{ item.badge }}</span>
      </button>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import NavIcon from "./NavIcon.vue";
import type { NavSections } from "./navSections";

// The v3 desktop row of the page's own sections (ADR 0045), right of the rail.
const props = defineProps<{
  sections: NavSections;
  active: string;
  label: string;
}>();

const emit = defineEmits<{ select: [key: string] }>();

const desktopGroups = computed(() =>
  props.sections.groups
    .map((group) => ({ ...group, items: group.items.filter((item) => !item.phoneOnly) }))
    .filter((group) => group.items.length > 0),
);

// Up to six sections fit with labels at any desktop width.
const compact = computed(() => desktopGroups.value.reduce((count, group) => count + group.items.length, 0) > 6);
</script>

<style lang="scss" scoped>
// Scrolls sideways only if a page ever has more tabs than fit; no bar.
.nav-section-tabs {
  scrollbar-width: none;
}
html[data-theme="black"] .nav-section-tabs {
  background: oklch(var(--b1));
}
</style>
