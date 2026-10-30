<template>
  <!-- One line under the chart instead of a floating tooltip: it works the
       same for hover and tap, and never runs off a phone screen. -->
  <div
    class="flex flex-wrap items-baseline gap-x-2 gap-y-1 min-h-[1.5rem] text-xs"
    aria-live="polite"
    data-test-rotation-chart-readout>
    <template v-if="item">
      <b class="font-semibold">{{ item.title }}</b>
      <span class="opacity-75">{{ item.detail }}</span>
      <button
        v-if="item.actionId"
        type="button"
        class="link link-primary ml-auto"
        data-test-rotation-chart-goto
        @click="emit('select', item.actionId)">
        Go to action
      </button>
    </template>
    <span v-else class="opacity-50">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
export interface ReadoutItem {
  title: string;
  detail: string;
  /** Set when the item is an action the editor can scroll to. */
  actionId?: string;
}

defineProps<{ item: ReadoutItem | null; hint: string }>();

const emit = defineEmits<{ select: [id: string] }>();
</script>
