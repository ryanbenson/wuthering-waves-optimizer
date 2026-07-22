<template>
  <div title="Change Theme" class="dropdown dropdown-end block">
    <div
      tabindex="0"
      role="button"
      class="btn group btn-sm gap-1.5 px-1.5 btn-ghost"
      aria-label="Change Theme">
      <div
        class="bg-base-100 group-hover:border-base-content/20 border-base-content/10 grid shrink-0 grid-cols-2 gap-0.5 rounded-md border p-1 transition-colors">
        <div class="bg-base-content size-1 rounded-full"></div>
        <div class="bg-primary size-1 rounded-full"></div>
        <div class="bg-secondary size-1 rounded-full"></div>
        <div class="bg-accent size-1 rounded-full"></div>
      </div>
      <svg
        width="12px"
        height="12px"
        class="mt-px hidden size-2 fill-current opacity-60 sm:inline-block"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2048 2048">
        <path
          d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
      </svg>
    </div>
    <div
      tabindex="0"
      class="dropdown-content bg-base-200 text-base-content rounded-box top-px max-h-[calc(100vh-8.6rem)] overflow-y-auto border border-white/5 shadow-2xl outline-1 outline-black/5 mt-16">
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
              :class="theme === option ? 'visible' : 'invisible'">
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
              :class="density === option.value ? 'visible' : 'invisible'">
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
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../stores/settings";
import { useUiDensity, type UiDensity } from "../composables/useUiDensity";

defineOptions({ name: "ThemeChooser" });

const settingsStore = useSettingsStore();
const { config } = storeToRefs(settingsStore);
const { density, setDensity, initDensity } = useUiDensity();

const themeOptions = ["dark", "light", "black"] as const;
const densityOptions: Array<{ value: UiDensity; label: string }> = [
  { value: "comfy", label: "Comfy" },
  { value: "compact", label: "Compact" },
];

const theme = ref("dark");

const settingsTheme = computed(
  () => (config.value as { theme?: string } | null)?.theme ?? null,
);

const isDarkSchemePreferred = computed(
  () => window?.matchMedia?.("(prefers-color-scheme:dark)")?.matches ?? false,
);

function setTheme() {
  document.documentElement.setAttribute("data-theme", theme.value);
  void settingsStore.addToConfig({ theme: theme.value });
}

function chooseTheme(next: string) {
  theme.value = next;
  setTheme();
}

function chooseDensity(next: UiDensity) {
  setDensity(next);
}

function init() {
  let next: string | null = null;
  if (settingsTheme.value) {
    next = settingsTheme.value;
  }
  if (!settingsTheme.value) {
    next = isDarkSchemePreferred.value ? "dark" : "light";
  }
  theme.value = next ?? "dark";
  setTheme();
  initDensity();
}

onMounted(() => {
  init();
});
</script>
