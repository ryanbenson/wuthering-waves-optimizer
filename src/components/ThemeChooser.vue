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
      <ul class="menu w-56">
        <li class="menu-title text-xs">Theme</li>
        <li v-for="option in themeOptions" :key="option">
          <button
            type="button"
            class="gap-3 px-2"
            :data-set-theme="option"
            @click="chooseTheme(option)">
            <div
              :data-theme="option"
              class="bg-base-100 grid shrink-0 grid-cols-2 gap-0.5 rounded-md p-1 shadow-sm">
              <div class="bg-base-content size-1 rounded-full"></div>
              <div class="bg-primary size-1 rounded-full"></div>
              <div class="bg-secondary size-1 rounded-full"></div>
              <div class="bg-accent size-1 rounded-full"></div>
            </div>
            <div class="w-32 truncate">{{ option }}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-3 w-3 shrink-0"
              :class="theme === option ? 'opacity-100' : 'opacity-0'">
              <path
                d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
            </svg>
          </button>
        </li>
        <li class="menu-title text-xs mt-2">Density</li>
        <li v-for="option in densityOptions" :key="option.value">
          <button
            type="button"
            class="gap-3 px-2"
            :data-set-density="option.value"
            @click="chooseDensity(option.value)">
            <div class="w-32 truncate capitalize">{{ option.label }}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-3 w-3 shrink-0 ml-auto"
              :class="density === option.value ? 'opacity-100' : 'opacity-0'">
              <path
                d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
            </svg>
          </button>
        </li>
        <li class="menu-title text-xs mt-2">Interface</li>
        <li v-for="option in uiOptions" :key="option.label">
          <button
            type="button"
            class="gap-3 px-2"
            :data-set-ui="option.classic ? 'classic' : 'v3'"
            @click="setClassicUi(option.classic, 'theme-menu')">
            <div class="w-32 truncate">{{ option.label }}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-3 w-3 shrink-0 ml-auto"
              :class="isClassicUi === option.classic ? 'opacity-100' : 'opacity-0'">
              <path
                d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
            </svg>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { THEME_OPTIONS, useTheme } from "../composables/useTheme";
import { useUiDensity, type UiDensity } from "../composables/useUiDensity";
import { useClassicUi } from "../composables/useClassicUi";
import { closeDropdownOnTriggerReclick } from "../utils/dropdownToggle";

defineOptions({ name: "ThemeChooser" });

// "right": opens beside the trigger, for the v3 side rail.
withDefaults(defineProps<{ placement?: "down" | "right" }>(), { placement: "down" });

const { theme: settingsTheme, setTheme: applyTheme } = useTheme();
const { density, setDensity, initDensity } = useUiDensity();

const themeOptions = THEME_OPTIONS;
const densityOptions: Array<{ value: UiDensity; label: string }> = [
  { value: "comfy", label: "Comfy" },
  { value: "compact", label: "Compact" },
];

// v3 is the default; classic is an opt-in until it's retired (ADR 0038).
const { isClassicUi, setClassicUi } = useClassicUi();
const uiOptions = [
  { classic: false, label: "v3 (default)" },
  { classic: true, label: "Classic" },
];

const theme = ref("dark");

const isDarkSchemePreferred = computed(
  () => window?.matchMedia?.("(prefers-color-scheme:dark)")?.matches ?? false,
);

function chooseTheme(next: string) {
  theme.value = next;
  applyTheme(next);
}

function chooseDensity(next: UiDensity) {
  setDensity(next);
}

function init() {
  const next =
    settingsTheme.value ?? (isDarkSchemePreferred.value ? "dark" : "light");
  theme.value = next;
  applyTheme(next);
  initDensity();
}

onMounted(() => {
  init();
});
</script>
