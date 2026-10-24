<template>
  <header class="nav-phone-header flex items-center gap-1 h-14 pl-1.5 pr-4 bg-base-300 text-base-content border-b border-base-content/10">
    <!-- The page's sections, when it has any, behind a hamburger. -->
    <div v-if="sections" class="dropdown shrink-0" @mousedown="closeDropdownOnTriggerReclick">
      <div
        tabindex="0"
        role="button"
        class="btn btn-ghost btn-square"
        :aria-label="label"
        data-test-nav-section-switcher>
        <NavIcon :icon="NAV_ICONS.menu" class="size-6" />
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
              <span v-if="item.badge" class="badge badge-primary badge-sm font-mono">{{ item.badge }}</span>
            </button>
          </li>
        </template>
      </ul>
    </div>

    <RouterLink
      to="/"
      class="flex shrink-0 px-1.5 text-base-content"
      aria-label="Wuthering Tools home"
      title="Wuthering Tools"
      data-test-nav-logo
      @click="emit('home')">
      <span class="nav-logo !size-8" aria-hidden="true"></span>
    </RouterLink>

    <span class="flex-1 min-w-0 truncate text-base font-bold px-1" data-test-nav-section-title>
      {{ activeItem?.label ?? pageLabel(curPage) }}
    </span>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import NavIcon from "./NavIcon.vue";
import { NAV_ICONS, pageLabel, type NavSections } from "./navSections";
import { closeDropdownOnTriggerReclick } from "../../utils/dropdownToggle";

// The v3 phone header (ADR 0045): a hamburger with the page's sections, the
// logo and the current section (or page) name. The main sections and the
// theme (More → Appearance) are in NavBottomBar.vue.
defineOptions({ name: "NavPhoneHeader" });

const props = defineProps<{
  curPage: string;
  sections: NavSections | null;
  active: string;
}>();

const emit = defineEmits<{ home: []; select: [key: string] }>();

const label = computed(() => `${pageLabel(props.curPage)} sections`);
const activeItem = computed(() =>
  props.sections?.groups.flatMap((group) => group.items).find((item) => item.key === props.active),
);

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
