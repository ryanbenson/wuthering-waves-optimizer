<template>
  <div
    v-if="visible"
    class="app-bulk-action-bar sticky top-0 z-10 my-4 flex flex-wrap items-center gap-2 rounded-box border border-base-300 bg-base-200/95 p-3 backdrop-blur"
    data-test-bulk-actions>
    <span class="mr-1 text-sm font-medium">{{ count }} selected</span>
    <slot name="selection" />
    <div class="divider divider-horizontal mx-0 hidden sm:flex"></div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean;
  count: number;
}>();
</script>
