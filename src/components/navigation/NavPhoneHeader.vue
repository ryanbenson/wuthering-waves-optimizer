<template>
  <header class="nav-phone-header flex items-center gap-1.5 h-14 pl-3 pr-1.5 bg-base-300 text-base-content border-b border-base-content/10">
    <RouterLink
      to="/"
      class="flex shrink-0 text-base-content"
      aria-label="Wuthering Tools home"
      title="Wuthering Tools"
      data-test-nav-logo
      @click="emit('home')">
      <span class="nav-logo !size-8" aria-hidden="true"></span>
    </RouterLink>

    <!-- The page's sections, when it has any: the current one opens the rest. -->
    <div v-if="sections && activeItem" class="dropdown flex-1 min-w-0">
      <div
        tabindex="0"
        role="button"
        class="flex items-center gap-2 h-11 px-2.5 rounded-lg border border-base-content/10 bg-base-200 min-w-0"
        :aria-label="`${label}: ${activeItem.label}`"
        data-test-nav-section-switcher>
        <NavIcon :icon="activeItem.icon" class="size-6" />
        <span class="font-bold truncate">{{ activeItem.label }}</span>
        <span class="text-xs text-base-content/60 whitespace-nowrap">{{ activeIndex + 1 }} of {{ allItems.length }}</span>
        <span class="flex-1"></span>
        <NavIcon :icon="NAV_ICONS.chevronDown" class="size-[18px]" />
      </div>
      <ul
        tabindex="0"
        class="dropdown-content menu z-50 !fixed inset-x-3 top-[60px] max-h-[calc(100vh-60px-var(--nav-bottom-h)-1rem)] overflow-y-auto flex-nowrap bg-base-200 text-base-content rounded-box border border-base-content/10 shadow-2xl p-2">
        <template v-for="group in sections.groups" :key="group.label">
          <li v-if="sections.groups.length > 1" class="menu-title text-xs">{{ group.label }}</li>
          <li v-for="item in group.items" :key="item.key">
            <button
              type="button"
              class="flex items-center gap-3 py-2.5"
              :class="{ active: item.key === active }"
              :aria-current="item.key === active ? 'page' : undefined"
              v-bind="{ [`data-test-${sections.testName}-mobile-nav`]: item.testId }"
              @click="select(item.key)">
              <NavIcon :icon="item.icon" class="size-6" />
              {{ item.label }}
            </button>
          </li>
        </template>
      </ul>
    </div>
    <span v-else class="flex-1 min-w-0 truncate text-base font-bold px-1.5">{{ pageLabel(curPage) }}</span>

    <ThemeChooser />
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ThemeChooser from "../ThemeChooser.vue";
import NavIcon from "./NavIcon.vue";
import { NAV_ICONS, pageLabel, type NavSections } from "./navSections";

// The v3 phone header (ADR 0045): logo, the page's section switcher (or its
// name) and the theme menu. The main sections are in NavBottomBar.vue.
defineOptions({ name: "NavPhoneHeader" });

const props = defineProps<{
  curPage: string;
  sections: NavSections | null;
  active: string;
}>();

const emit = defineEmits<{ home: []; select: [key: string] }>();

const label = computed(() => `${pageLabel(props.curPage)} sections`);
const allItems = computed(() => props.sections?.groups.flatMap((group) => group.items) ?? []);
const activeIndex = computed(() => allItems.value.findIndex((item) => item.key === props.active));
const activeItem = computed(() => allItems.value[activeIndex.value]);

function select(key: string) {
  emit("select", key);
  (document.activeElement as HTMLElement | null)?.blur();
}
</script>

<style lang="scss" scoped>
.nav-phone-header a:hover {
  color: inherit;
}

html[data-theme="black"] .nav-phone-header {
  background: oklch(var(--b1));
}
</style>
