import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../stores/settings";

export const THEME_OPTIONS = [
  "dark",
  "light",
  "black",
  "synthwave",
  "pastel",
  "night",
  "nord",
  "dracula",
] as const;

export type ThemeName = (typeof THEME_OPTIONS)[number];
export type ThemeStyle = "light" | "dark";

/**
 * DaisyUI themes whose base colors read as "light" (dark text on a light
 * surface). Components that special-case the light look (icon filters,
 * overlay contrast, etc.) should key off `data-theme-style` rather than a
 * specific theme name, so any theme added here picks up those adjustments
 * automatically.
 */
const LIGHT_THEMES: ReadonlySet<string> = new Set(["light", "pastel", "nord"]);

export function getThemeStyle(theme: string): ThemeStyle {
  return LIGHT_THEMES.has(theme) ? "light" : "dark";
}

function applyThemeAttributes(theme: string) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute(
    "data-theme-style",
    getThemeStyle(theme),
  );
}

export function useTheme() {
  const settingsStore = useSettingsStore();
  const { config } = storeToRefs(settingsStore);

  const theme = computed<string | null>(
    () => (config.value as { theme?: string } | null)?.theme ?? null,
  );

  function setTheme(next: string) {
    applyThemeAttributes(next);
    void settingsStore.addToConfig({ theme: next });
  }

  return { theme, setTheme };
}
