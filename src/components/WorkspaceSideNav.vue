<template>
  <div class="workspace-side-nav">
    <!-- Mobile: tap-to-open section switcher, reusing the same dropdown-menu
         pattern as InventoryMobileSubNav.vue. -->
    <details ref="mobileNavEl" class="workspace-side-nav__mobile sm:hidden dropdown">
      <summary
        tabindex="0"
        role="button"
        class="bg-base-200 rounded-lg p-1 pl-3 flex items-center justify-between w-full"
        data-test-workspace-nav-mobile-trigger>
        <span class="flex items-center gap-2">
          <span
            v-if="activeItem"
            class="size-4 opacity-70 [&_svg]:size-full"
            v-html="activeItem.icon"></span>
          <span class="font-bold text-sm">{{ activeItem?.label }}</span>
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" class="size-4 opacity-55"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </summary>
      <ul
        tabindex="0"
        class="menu menu-sm dropdown-content bg-base-300 rounded-box z-[1] mt-2 w-full p-2 shadow">
        <template v-for="group in groups" :key="group.label ?? 'ungrouped'">
          <li v-if="group.label" class="menu-title text-[.65rem] uppercase tracking-wider opacity-50">
            {{ group.label }}
          </li>
          <li v-for="item in group.items" :key="item.id">
            <component
              :is="item.to ? 'RouterLink' : 'a'"
              :to="item.to"
              @click="handleSelect(item)"
              class="workspace-side-nav__mobile-item"
              :class="{ active: isActive(item) }"
              :data-test-workspace-nav-mobile-item="item.id">
              <span class="size-4 [&_svg]:size-full" v-html="item.icon"></span>
              {{ item.label }}
              <span v-if="item.badge" class="badge badge-primary badge-sm ml-auto font-mono">
                {{ item.badge }}
              </span>
            </component>
          </li>
        </template>
      </ul>
    </details>

    <!-- Desktop sidebar -->
    <div class="hidden sm:flex w-52 shrink-0 flex-col gap-6">
      <h1 class="text-2xl font-bold">{{ title }}</h1>
      <div v-for="group in groups" :key="group.label ?? 'ungrouped'" class="flex flex-col gap-1">
        <div
          v-if="group.label"
          class="text-[.65rem] font-bold uppercase tracking-wider opacity-50 px-3 mb-0.5">
          {{ group.label }}
        </div>
        <component
          :is="item.to ? 'RouterLink' : 'button'"
          v-for="item in group.items"
          :key="item.id"
          :type="item.to ? undefined : 'button'"
          :to="item.to"
          class="workspace-side-nav__item"
          :class="{ 'workspace-side-nav__item--active': isActive(item) }"
          :data-test-workspace-nav-item="item.id"
          @click="handleSelect(item)">
          <span class="size-4 [&_svg]:size-full" v-html="item.icon"></span>
          <span>{{ item.label }}</span>
          <span v-if="item.badge" class="badge badge-primary badge-sm ml-auto font-mono">
            {{ item.badge }}
          </span>
        </component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Shared desktop sidebar + mobile dropdown nav for v3.0 workspace pages
 * (Settings, Info) so both share exactly one look and interaction model
 * instead of two hand-rolled, slightly-different ones. An item either
 * carries `to` (renders as a RouterLink, active state from the real
 * route - Info's usage) or omits it (renders as a button, active state
 * from `activeId` - Settings' usage, since its sections are local
 * component state, not routes).
 */
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

export interface WorkspaceNavItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
  to?: string;
}

export interface WorkspaceNavGroup {
  label?: string;
  items: WorkspaceNavItem[];
}

const props = defineProps<{
  title: string;
  groups: WorkspaceNavGroup[];
  activeId?: string;
}>();

const emit = defineEmits<{ select: [id: string] }>();

const route = useRoute();
const mobileNavEl = ref<HTMLDetailsElement | null>(null);

const allItems = computed(() => props.groups.flatMap((g) => g.items));

function isActive(item: WorkspaceNavItem): boolean {
  return item.to ? route.path === item.to : props.activeId === item.id;
}

const activeItem = computed(
  () => allItems.value.find((item) => isActive(item)) ?? allItems.value[0],
);

function handleSelect(item: WorkspaceNavItem) {
  if (!item.to) emit("select", item.id);
  mobileNavEl.value?.removeAttribute("open");
}
</script>

<style scoped lang="scss">
// The global stylesheet's default `a { color: #646cff }` (leftover Vite
// scaffold styling, see Nav.vue's own scoped-style comment about the same
// issue) otherwise bleeds through every RouterLink-rendered item here.
.workspace-side-nav__mobile-item {
  color: inherit;
  &:hover {
    color: inherit;
  }
}

.workspace-side-nav__item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.5rem 0.7rem;
  border-radius: 0.55rem;
  font-size: 0.84rem;
  font-weight: 600;
  text-align: left;
  position: relative;
  color: inherit;
  text-decoration: none;

  &:hover {
    color: inherit;
  }

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
