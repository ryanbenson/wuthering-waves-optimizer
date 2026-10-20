<template>
  <nav
    :aria-label="label"
    class="flex items-center gap-1 px-3 xl:px-5 h-12 border-t border-base-content/10 overflow-x-auto">
    <div
      v-for="(group, index) in desktopGroups"
      :key="group.label"
      class="flex items-center gap-0.5 shrink-0"
      :class="{ 'pr-2 mr-1 border-r border-base-content/10': index < desktopGroups.length - 1 }">
      <span
        v-if="desktopGroups.length > 1"
        class="hidden xl:inline text-[0.7rem] font-bold uppercase tracking-wider text-base-content/55 pl-1 pr-2">
        {{ group.label }}
      </span>
      <button
        v-for="item in group.items"
        :key="item.key"
        type="button"
        class="flex items-center gap-2 h-9 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
        :class="
          item.key === active
            ? 'bg-base-content/10 text-base-content'
            : 'text-base-content/70 hover:text-base-content hover:bg-base-content/5'
        "
        :aria-current="item.key === active ? 'page' : undefined"
        v-bind="{ [`data-test-${sections.testName}-nav`]: item.testId }"
        @click="emit('select', item.key)">
        <NavIcon :d="item.icon" class="hidden xl:block size-[18px]" />
        {{ item.label }}
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import NavIcon from "./NavIcon.vue";
import type { NavSections } from "./navSections";

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
</script>
