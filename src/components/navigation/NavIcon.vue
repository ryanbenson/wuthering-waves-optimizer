<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="nav-icon shrink-0"
    aria-hidden="true">
    <path :d="d" />
  </svg>
</template>

<script setup lang="ts">
// A stroke icon from navSections.ts's NAV_ICONS. `.nav-icon` opts out of
// style.css's light-theme rules that fill every nav/dropdown svg path black.
defineProps<{ d: string }>();
</script>
