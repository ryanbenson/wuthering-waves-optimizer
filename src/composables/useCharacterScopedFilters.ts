import { computed, ref, toValue, type ComputedRef, type MaybeRefOrGetter, type Ref, type WritableComputedRef } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../stores/settings";

/** Picker surfaces whose filters are remembered per character. */
export type CharacterFilterSurface = "echoBrowser" | "echoFinder" | "weaponBrowser" | "teammateBrowser";

/** settings.config keys for picker filters remembered globally (not per character). */
export type GlobalFilterKey = "inventoryEchoFinderFilters";

/**
 * Where a picker's filters are saved: per character, under one global
 * settings.config key, or nowhere (local, unsaved state).
 */
export type SavedFiltersLocation =
  | { characterId: string; surface: CharacterFilterSurface }
  | { globalKey: GlobalFilterKey }
  | null;

type SavedCharacterFilters = Record<string, Partial<Record<CharacterFilterSurface, unknown>>>;

export type SavedFilters<T extends Record<string, unknown>> = {
  filters: ComputedRef<T>;
  field: <K extends keyof T>(key: K) => WritableComputedRef<T[K]>;
  /** Back to unfiltered, keeping any `keep` keys (e.g. a sort, which isn't a filter). */
  reset: (keep?: (keyof T)[]) => void;
};

/**
 * A picker's filters saved in settings.config, at a reactive `location`:
 * per character (characterFilters[characterId][surface]) or under one
 * global key (e.g. the inventory's Echo Finder). When the location changes
 * (e.g. the active character), the filters read become that location's.
 *
 * Saved data is always read through `parse`, so missing or malformed values
 * mean "not filtered" — settings is never migrated (see docs/src-stores.md).
 * A null location keeps the filters in local state for this component
 * instance only — nothing is saved.
 */
export function useSavedFilters<T extends Record<string, unknown>>(opts: {
  location: MaybeRefOrGetter<SavedFiltersLocation>;
  empty: T;
  parse: (raw: unknown) => T;
}): SavedFilters<T> {
  const settingsStore = useSettingsStore();
  const { config } = storeToRefs(settingsStore);

  const unsaved = ref(structuredClone(opts.empty)) as Ref<T>;

  const filters = computed(() => {
    const location = toValue(opts.location);
    if (!location) return unsaved.value;
    const saved = config.value as
      | ({ characterFilters?: SavedCharacterFilters } & Partial<Record<GlobalFilterKey, unknown>>)
      | null;
    if ("globalKey" in location) return opts.parse(saved?.[location.globalKey]);
    return opts.parse(saved?.characterFilters?.[location.characterId]?.[location.surface]);
  });

  function write(next: T) {
    const location = toValue(opts.location);
    if (!location) {
      unsaved.value = next;
    } else if ("globalKey" in location) {
      settingsStore.setGlobalFilters(location.globalKey, next);
    } else {
      settingsStore.setCharacterFilters(location.characterId, location.surface, next);
    }
  }

  function field<K extends keyof T>(key: K) {
    return computed({
      get: () => filters.value[key],
      set: (value: T[K]) => write({ ...filters.value, [key]: value }),
    });
  }

  return {
    filters,
    field,
    reset: (keep = []) => {
      const next = structuredClone(opts.empty);
      for (const key of keep) next[key] = filters.value[key];
      write(next);
    },
  };
}

/**
 * A picker's filters, remembered per character in
 * settings.config.characterFilters[characterId][surface], so each resonator
 * keeps its own echo/weapon/teammate filters across opens, character
 * switches and reloads. `characterId` is reactive. With no character the
 * filters work in local, unsaved state. See useSavedFilters.
 */
export function useCharacterScopedFilters<T extends Record<string, unknown>>(opts: {
  surface: CharacterFilterSurface;
  characterId: MaybeRefOrGetter<string | null | undefined>;
  empty: T;
  parse: (raw: unknown) => T;
}): SavedFilters<T> {
  return useSavedFilters({
    location: () => {
      const characterId = toValue(opts.characterId);
      return characterId ? { characterId, surface: opts.surface } : null;
    },
    empty: opts.empty,
    parse: opts.parse,
  });
}
