<template>
  <div class="app-filter-panel">
    <div
      class="app-filter-panel__bar flex flex-wrap items-center gap-2 rounded-lg bg-base-200 p-2">
      <slot name="bar" />
      <button
        type="button"
        class="btn btn-sm"
        :aria-expanded="open"
        :aria-controls="panelId"
        data-test-filter-panel-toggle
        @click="open = !open">
        {{ label }}
        <span
          v-if="activeCount"
          class="badge badge-sm badge-primary ml-1"
          data-test-filter-panel-active-count>
          {{ activeCount }}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
          class="size-2.5 shrink-0 opacity-60 fill-current transition-transform"
          :class="{ 'rotate-180': open }"
          aria-hidden="true">
          <path
            d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
        </svg>
      </button>
      <button
        type="button"
        class="btn btn-sm btn-ghost"
        :disabled="clearDisabled"
        data-test-filter-panel-clear
        @click="$emit('clear')">
        Clear all
      </button>
    </div>
    <div
      class="app-filter-panel__collapse"
      :class="{ 'app-filter-panel__collapse--open': open }">
      <div class="app-filter-panel__collapse-inner">
        <div
          :id="panelId"
          class="app-filter-panel__body space-y-3 rounded-lg bg-base-200 p-3 mt-2">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { randomString } from "../utils/strings";

withDefaults(
  defineProps<{
    label?: string;
    activeCount?: number;
    clearDisabled?: boolean;
  }>(),
  {
    label: "Filters",
    activeCount: 0,
    clearDisabled: false,
  },
);

defineEmits<{
  clear: [];
}>();

const open = ref(false);
const panelId = `app-filter-panel-${randomString()}`;
</script>

<style scoped>
.app-filter-panel__collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.2s ease;
}
.app-filter-panel__collapse--open {
  grid-template-rows: 1fr;
}
.app-filter-panel__collapse-inner {
  overflow: hidden;
  min-height: 0;
}
/* Once open, stop clipping — a clipped-but-open panel cuts off nested
   dropdowns (e.g. the Set filter's menu) that render outside its box.
   Still clipped while closed/animating, which is what the collapse
   reveal actually depends on. */
.app-filter-panel__collapse--open .app-filter-panel__collapse-inner {
  overflow: visible;
}
</style>
