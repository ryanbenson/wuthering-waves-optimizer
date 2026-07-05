<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-4"
    aria-hidden="true">
    <path
      d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
    <line v-if="hidden" x1="3" y1="3" x2="21" y2="21" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  hidden?: boolean;
}>();
</script>
