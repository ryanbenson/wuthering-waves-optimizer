<template>
  <div class="workspace-split grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
    <div class="min-w-0" data-test-workspace-split-main>
      <slot></slot>
    </div>

    <!--
      Summary panel. Right-hand, sticky column from the md breakpoint up
      (top:0 inside the tab's own scroll region, same convention as the
      Echoes tab's sticky score box). Below md it moves above the management
      column (order-first) behind a show/hide toggle. DOM order stays
      main-then-summary so tab order follows the primary controls.
    -->
    <aside
      class="order-first md:order-none min-w-0 md:sticky md:top-0 md:max-h-screen md:overflow-y-auto"
      data-test-workspace-split-summary>
      <button
        type="button"
        class="md:hidden w-full flex items-center gap-2 rounded-lg bg-base-200 px-3 py-2 text-sm font-semibold"
        :aria-expanded="open"
        data-test-workspace-split-toggle
        @click="open = !open">
        <span class="flex-1 text-left">{{ label }}</span>
        <span v-if="count" class="badge badge-sm badge-primary font-mono">{{ count }}</span>
        <span class="text-xs font-normal opacity-60">{{ open ? "Hide" : "Show" }}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
          class="size-2.5 opacity-60 fill-current transition-transform"
          :class="{ 'rotate-180': open }"
          aria-hidden="true">
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
        </svg>
      </button>
      <div :class="open ? 'block mt-2' : 'hidden'" class="md:!block md:!mt-0">
        <slot name="summary"></slot>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineOptions({ name: "WorkspaceSplitLayout" });

// `label`/`count` only feed the small-screen show/hide bar.
defineProps<{ label: string; count?: number }>();

// Collapsed by default on small screens so the management controls stay
// the first thing you see; the count badge still signals what's active.
const open = ref(false);
</script>
