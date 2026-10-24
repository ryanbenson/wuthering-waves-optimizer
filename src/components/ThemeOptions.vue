<template>
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
    <template v-if="showInterface">
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
    </template>
  </ul>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { THEME_OPTIONS, useTheme } from "../composables/useTheme";
import { useUiDensity, type UiDensity } from "../composables/useUiDensity";
import { useClassicUi } from "../composables/useClassicUi";

// The theme, density and interface lists, shared by ThemeChooser.vue's
// dropdown and the phone More menu (NavUtilityMenu.vue). Mounting it applies
// the saved theme and density, so every layout renders one, opened or not.
defineOptions({ name: "ThemeOptions" });

// The v3 More menu has its own "Switch to classic UI" item.
withDefaults(defineProps<{ showInterface?: boolean }>(), { showInterface: true });

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
