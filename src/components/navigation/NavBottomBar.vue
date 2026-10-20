<template>
  <nav
    ref="barRef"
    :aria-label="label"
    class="nav-bottom-bar fixed inset-x-0 bottom-0 z-40 lg:hidden bg-base-300 border-t border-base-content/10 grid px-1 pt-1.5"
    :style="{ gridTemplateColumns: `repeat(${slots}, minmax(0, 1fr))` }">
    <button
      v-for="item in shown"
      :key="item.key"
      type="button"
      class="nav-bottom-bar__item"
      :class="{ 'nav-bottom-bar__item--active': item.key === active }"
      :aria-current="item.key === active ? 'page' : undefined"
      v-bind="{ [`data-test-${sections.testName}-mobile-nav`]: item.testId }"
      @click="select(item.key)">
      <span class="nav-bottom-bar__pill"><NavIcon :d="item.icon" class="size-[21px]" /></span>
      <span class="truncate max-w-full">{{ item.label }}</span>
    </button>

    <!-- Everything else, as a list opening upwards. Focus-driven like the
         other nav dropdowns, so it closes on click-away. -->
    <div v-if="hidden.length > 0" class="dropdown dropdown-top dropdown-end flex">
      <div
        tabindex="0"
        role="button"
        class="nav-bottom-bar__item w-full"
        :class="{ 'nav-bottom-bar__item--active': activeHidden }"
        :aria-label="`All ${label.toLowerCase()}`"
        data-test-nav-bottom-all>
        <span class="nav-bottom-bar__pill">
          <NavIcon :d="activeHidden ? activeHidden.icon : NAV_ICONS.all" class="size-[21px]" />
        </span>
        <span class="truncate max-w-full">{{ activeHidden ? activeHidden.label : "All" }}</span>
      </div>
      <ul
        tabindex="0"
        class="dropdown-content menu bg-base-200 text-base-content rounded-box w-60 p-2 mb-3 shadow-2xl border border-base-content/10 z-50">
        <template v-for="group in sections.groups" :key="group.label">
          <li v-if="sections.groups.length > 1" class="menu-title text-xs">{{ group.label }}</li>
          <li v-for="item in group.items" :key="item.key">
            <button
              type="button"
              class="flex items-center gap-3"
              :class="{ active: item.key === active }"
              v-bind="{ [`data-test-${sections.testName}-mobile-nav`]: shownKeys.has(item.key) ? undefined : item.testId }"
              @click="select(item.key)">
              <NavIcon :d="item.icon" class="size-5" />
              {{ item.label }}
            </button>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import NavIcon from "./NavIcon.vue";
import { NAV_ICONS, type NavSectionItem, type NavSections } from "./navSections";
import { useHeightCssVar } from "../../composables/useHeightCssVar";

const props = defineProps<{
  sections: NavSections;
  active: string;
  label: string;
}>();

const emit = defineEmits<{ select: [key: string] }>();

const barRef = ref<HTMLElement | null>(null);
// Hidden (display: none) from lg up, so it measures 0 there.
useHeightCssVar(barRef, "--nav-bottom-h", "0px");

const allItems = computed(() => props.sections.groups.flatMap((group) => group.items));

const shown = computed(() => {
  const keys = props.sections.phoneKeys;
  if (keys.length === 0) return allItems.value;
  return keys
    .map((key) => allItems.value.find((item) => item.key === key))
    .filter((item): item is NavSectionItem => item !== undefined);
});
const shownKeys = computed(() => new Set(shown.value.map((item) => item.key)));
const hidden = computed(() => allItems.value.filter((item) => !shownKeys.value.has(item.key)));
const activeHidden = computed(() => hidden.value.find((item) => item.key === props.active));
const slots = computed(() => shown.value.length + (hidden.value.length > 0 ? 1 : 0));

function select(key: string) {
  emit("select", key);
  (document.activeElement as HTMLElement | null)?.blur();
}
</script>

<style lang="scss" scoped>
.nav-bottom-bar {
  padding-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px));
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
  color: oklch(var(--bc) / 0.7);
  cursor: pointer;
}
.nav-bottom-bar__pill {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 1.9rem;
  border-radius: 999px;
}
.nav-bottom-bar__item--active {
  color: oklch(var(--bc));
  .nav-bottom-bar__pill {
    background: oklch(var(--p) / 0.22);
  }
}
</style>
