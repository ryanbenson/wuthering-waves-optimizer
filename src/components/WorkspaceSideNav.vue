<template>
  <div class="workspace-side-nav">
    <!-- Mobile: always-visible full-width segmented tab bar - every section
         gets an equal-width column (icon + label), so nothing overflows or
         scrolls and it reads as one bounded nav control, not loose chips. -->
    <div class="workspace-side-nav__mobile sm:hidden bg-base-200 rounded-xl p-1">
      <div
        class="grid gap-0.5"
        :style="{ gridTemplateColumns: `repeat(${allItems.length}, minmax(0, 1fr))` }">
        <component
          :is="item.to ? 'RouterLink' : 'button'"
          v-for="item in allItems"
          :key="item.id"
          :type="item.to ? undefined : 'button'"
          :to="item.to"
          class="workspace-side-nav__tab"
          :class="{ 'workspace-side-nav__tab--active': isActive(item) }"
          :data-test-workspace-nav-mobile-item="item.id"
          @click="handleSelect(item)">
          <span class="workspace-side-nav__tab-icon size-5 [&_svg]:size-full" v-html="item.icon"></span>
          <span v-if="item.badge" class="workspace-side-nav__tab-badge">{{ item.badge }}</span>
          <span class="workspace-side-nav__tab-label">{{ item.label }}</span>
        </component>
      </div>
    </div>

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
 * Shared desktop sidebar + mobile tab bar for v3.0 workspace pages
 * (Settings, Info) so both share exactly one look and interaction model
 * instead of two hand-rolled, slightly-different ones. An item either
 * carries `to` (renders as a RouterLink, active state from the real
 * route - Info's usage) or omits it (renders as a button, active state
 * from `activeId` - Settings' usage, since its sections are local
 * component state, not routes).
 */
import { computed } from "vue";
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

const allItems = computed(() => props.groups.flatMap((g) => g.items));

function isActive(item: WorkspaceNavItem): boolean {
  return item.to ? route.path === item.to : props.activeId === item.id;
}

function handleSelect(item: WorkspaceNavItem) {
  if (!item.to) emit("select", item.id);
}
</script>

<style scoped lang="scss">
// The global stylesheet's default `a { color: #646cff }` (leftover Vite
// scaffold styling, see Nav.vue's own scoped-style comment about the same
// issue) otherwise bleeds through every RouterLink-rendered item here.
.workspace-side-nav__tab {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  padding: 0.45rem 0.15rem;
  border-radius: 0.6rem;
  min-width: 0;
  color: inherit;
  text-decoration: none;
  border: none;
  background: transparent;
  opacity: 0.65;

  &:hover {
    color: inherit;
  }
}

.workspace-side-nav__tab-icon {
  opacity: 0.85;
}

.workspace-side-nav__tab-label {
  font-size: 0.62rem;
  font-weight: 700;
  line-height: 1.15;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.workspace-side-nav__tab-badge {
  position: absolute;
  top: 0.15rem;
  right: 0.55rem;
  min-width: 0.9rem;
  height: 0.9rem;
  padding: 0 0.2rem;
  border-radius: 999px;
  background: oklch(var(--p));
  color: oklch(var(--pc));
  font-size: 0.55rem;
  font-weight: 700;
  font-family: monospace;
  display: flex;
  align-items: center;
  justify-content: center;
}

.workspace-side-nav__tab--active {
  opacity: 1;
  background: color-mix(in oklch, oklch(var(--p)) 16%, oklch(var(--b1)));
  color: color-mix(in oklch, oklch(var(--p)) 60%, white);
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
