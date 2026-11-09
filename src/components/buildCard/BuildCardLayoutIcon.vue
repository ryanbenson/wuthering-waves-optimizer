<template>
  <!-- A tiny diagram of each layout's arrangement, so the picker reads as
       "card layouts" at a glance. Drawn in currentColor to follow the button. -->
  <svg
    class="build-card-layout-icon"
    viewBox="0 0 32 18"
    width="32"
    height="18"
    aria-hidden="true"
    focusable="false">
    <rect x="0.5" y="0.5" width="31" height="17" rx="2" fill="none" stroke="currentColor" stroke-opacity="0.5" />
    <template v-if="layout === 'columns'">
      <rect x="3" y="3" width="8" height="12" rx="1" fill="currentColor" />
      <rect x="12.5" y="3" width="7" height="12" rx="1" fill="currentColor" fill-opacity="0.55" />
      <rect x="21" y="3" width="8" height="12" rx="1" fill="currentColor" fill-opacity="0.55" />
    </template>
    <template v-else-if="layout === 'hero'">
      <rect x="3" y="3" width="11" height="12" rx="1" fill="currentColor" />
      <rect x="15.5" y="3" width="13.5" height="6" rx="1" fill="currentColor" fill-opacity="0.55" />
      <rect v-for="i in 4" :key="i" :x="15.5 + (i - 1) * 3.5" y="10.5" width="2.5" height="4.5" rx="0.5" fill="currentColor" fill-opacity="0.55" />
    </template>
    <template v-else>
      <rect x="3" y="3" width="14" height="12" rx="1" fill="currentColor" />
      <rect x="18.5" y="3" width="10.5" height="12" rx="1" fill="currentColor" fill-opacity="0.55" />
    </template>
  </svg>
</template>

<script setup lang="ts">
import type { BuildCardLayoutId } from "../../buildCard/layouts";

defineProps<{ layout: BuildCardLayoutId }>();
</script>

<style scoped>
.build-card-layout-icon {
  flex-shrink: 0;
}
</style>
