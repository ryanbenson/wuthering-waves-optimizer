<template>
  <div
    title="Change Theme"
    class="dropdown dropdown-end block"
    :class="{ 'dropdown-right': placement === 'right' }"
    @mousedown="closeDropdownOnTriggerReclick">
    <div
      tabindex="0"
      role="button"
      class="btn group btn-ghost btn-square"
      aria-label="Change Theme">
      <div
        class="bg-base-100 group-hover:border-base-content/20 border-base-content/10 grid size-6 shrink-0 grid-cols-[repeat(2,auto)] place-content-center gap-1 rounded-md border transition-colors">
        <div class="bg-base-content size-1.5 rounded-full"></div>
        <div class="bg-primary size-1.5 rounded-full"></div>
        <div class="bg-secondary size-1.5 rounded-full"></div>
        <div class="bg-accent size-1.5 rounded-full"></div>
      </div>
    </div>
    <div
      tabindex="0"
      class="dropdown-content bg-base-200 text-base-content rounded-box top-px max-h-[calc(100vh-8.6rem)] overflow-y-auto border border-white/5 shadow-2xl outline-1 outline-black/5"
      :class="placement === 'right' ? 'ml-2 w-max' : 'mt-16'">
      <ThemeOptions />
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeOptions from "./ThemeOptions.vue";
import { closeDropdownOnTriggerReclick } from "../utils/dropdownToggle";

defineOptions({ name: "ThemeChooser" });

// "right": opens beside the trigger, for the v3 side rail.
withDefaults(defineProps<{ placement?: "down" | "right" }>(), { placement: "down" });
</script>
