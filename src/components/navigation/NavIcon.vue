<template>
  <img
    v-if="'src' in icon"
    :src="icon.src"
    alt=""
    class="nav-icon-img shrink-0 object-contain"
    :style="scaleStyle" />
  <svg
    v-else
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="icon.viewBox ?? '0 0 24 24'"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="nav-icon nav-icon-img shrink-0"
    :style="scaleStyle"
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
import { computed } from "vue";
import type { NavIconDef } from "./navSections";

// An icon from navSections.ts's NAV_ICONS. The SVGs are drawn white like the
// game art, so the two match; style.css inverts both (`.nav-icon-img`) in
// light themes, and `.nav-icon` opts the SVGs out of its light-theme rules
// that fill every nav/dropdown svg path black.
const props = defineProps<{ icon: NavIconDef }>();

const scaleStyle = computed(() => (props.icon.scale ? { transform: `scale(${props.icon.scale})` } : undefined));
</script>

<style scoped>
.nav-icon {
  color: #fff;
}
</style>
