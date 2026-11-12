import type { MaybeRefOrGetter } from "vue";
import { useCharacterScopedFilters } from "./useCharacterScopedFilters";

export type WeaponBrowserSort = "impact" | "rarity" | "name";

export type WeaponBrowserFilters = {
  rarity: number | null;
  mainStat: string | null;
  sortBy: WeaponBrowserSort;
};

export const EMPTY_WEAPON_BROWSER_FILTERS: WeaponBrowserFilters = {
  rarity: null,
  mainStat: null,
  sortBy: "impact",
};

const SORTS: WeaponBrowserSort[] = ["impact", "rarity", "name"];

/** Reads saved filters defensively: anything missing or malformed means "not filtered". */
export function parseWeaponBrowserFilters(raw: unknown): WeaponBrowserFilters {
  if (!raw || typeof raw !== "object") return { ...EMPTY_WEAPON_BROWSER_FILTERS };
  const saved = raw as Record<string, unknown>;
  return {
    rarity: typeof saved.rarity === "number" ? saved.rarity : null,
    mainStat: typeof saved.mainStat === "string" ? saved.mainStat : null,
    sortBy: SORTS.includes(saved.sortBy as WeaponBrowserSort)
      ? (saved.sortBy as WeaponBrowserSort)
      : EMPTY_WEAPON_BROWSER_FILTERS.sortBy,
  };
}

/**
 * The weapon browser's filters and sort, remembered per character (surface
 * "weaponBrowser"). Shared by the v3 and classic browsers; the classic one
 * only has the rarity filter. Search text is deliberately not remembered.
 */
export function useWeaponBrowserFilters(characterId: MaybeRefOrGetter<string | null | undefined>) {
  const scoped = useCharacterScopedFilters({
    surface: "weaponBrowser",
    characterId,
    empty: EMPTY_WEAPON_BROWSER_FILTERS,
    parse: parseWeaponBrowserFilters,
  });
  return {
    rarityFilter: scoped.field("rarity"),
    mainStatFilter: scoped.field("mainStat"),
    sortBy: scoped.field("sortBy"),
    // "Clear" resets the filters but leaves the sort, as it always has.
    resetWeaponBrowserFilters: () => scoped.reset(["sortBy"]),
  };
}
