<template>
  <img v-if="'src' in icon" :src="icon.src" alt="" class="nav-icon-img shrink-0 object-contain" />
  <svg
    v-else
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="icon.viewBox ?? '0 0 24 24'"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="nav-icon shrink-0"
    aria-hidden="true">
    <path
      v-for="(path, index) in icon.paths"
      :key="index"
      :d="path.d"
      :class="{ 'nav-icon__fill': path.fill }"
      :fill="path.fill ? 'currentColor' : 'none'" />
  </svg>
</template>

<script setup lang="ts">
import type { NavIconDef } from "./navSections";

// An icon from navSections.ts's NAV_ICONS. style.css inverts `.nav-icon-img`
// (white game art) in light themes, and `.nav-icon` opts the SVGs out of its
// light-theme rules that fill every nav/dropdown svg path black.
defineProps<{ icon: NavIconDef }>();
</script>
