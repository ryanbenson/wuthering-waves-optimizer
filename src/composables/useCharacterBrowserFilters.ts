import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../stores/settings";
import {
  CHARACTER_BUILD_STATUSES,
  type CharacterBuildStatus,
} from "../characters/characterBuildStatus";

export type CharacterBrowserFilters = {
  element: string | null;
  rarity: number | null;
  weapon: string | null;
  buildStatus: CharacterBuildStatus | null;
  favorites: boolean;
};

const EMPTY_FILTERS: CharacterBrowserFilters = {
  element: null,
  rarity: null,
  weapon: null,
  buildStatus: null,
  favorites: false,
};

/** Reads saved filters defensively: anything missing or malformed means "not filtered". */
export function parseCharacterBrowserFilters(raw: unknown): CharacterBrowserFilters {
  if (!raw || typeof raw !== "object") return { ...EMPTY_FILTERS };
  const saved = raw as Record<string, unknown>;
  return {
    element: typeof saved.element === "string" ? saved.element : null,
    rarity: typeof saved.rarity === "number" ? saved.rarity : null,
    weapon: typeof saved.weapon === "string" ? saved.weapon : null,
    buildStatus: CHARACTER_BUILD_STATUSES.includes(saved.buildStatus as CharacterBuildStatus)
      ? (saved.buildStatus as CharacterBuildStatus)
      : null,
    favorites: saved.favorites === true,
  };
}

/**
 * The character browser's filters (element, rarity, weapon, build status,
 * favorites), remembered globally in settings.config so they survive closing
 * the browser and reloading the site. Shared by the legacy and v3 browsers.
 * Search text is deliberately not remembered: a stale search silently hides
 * characters the next time the browser opens.
 */
export function useCharacterBrowserFilters() {
  const settingsStore = useSettingsStore();
  const { config } = storeToRefs(settingsStore);

  const filters = computed(() =>
    parseCharacterBrowserFilters(
      (config.value as { characterBrowserFilters?: unknown } | null)?.characterBrowserFilters,
    ),
  );

  function update(patch: Partial<CharacterBrowserFilters>) {
    settingsStore.setCharacterBrowserFilters({ ...filters.value, ...patch });
  }

  function field<K extends keyof CharacterBrowserFilters>(key: K) {
    return computed({
      get: () => filters.value[key],
      set: (value: CharacterBrowserFilters[K]) => update({ [key]: value }),
    });
  }

  return {
    filterElement: field("element"),
    filterRarity: field("rarity"),
    filterWeapon: field("weapon"),
    filterBuildStatus: field("buildStatus"),
    filterFavorites: field("favorites"),
    resetFilters: () => settingsStore.setCharacterBrowserFilters({ ...EMPTY_FILTERS }),
  };
}

export type CharacterBrowserView = "list" | "grid";

/**
 * The v3 character browser's list/grid view, remembered globally in
 * settings.config like the filters. Not a filter, so "Clear" leaves it alone.
 */
export function useCharacterBrowserView() {
  const settingsStore = useSettingsStore();
  const { config } = storeToRefs(settingsStore);

  return computed({
    get: (): CharacterBrowserView =>
      (config.value as { characterBrowserView?: unknown } | null)?.characterBrowserView === "list"
        ? "list"
        : "grid",
    set: (value: CharacterBrowserView) => {
      settingsStore.addToConfig({ characterBrowserView: value });
    },
  });
}
