import type { MaybeRefOrGetter } from "vue";
import { ECHO_CV_MAX, ECHO_RV_MAX } from "../echoes/stats";
import { useCharacterScopedFilters } from "./useCharacterScopedFilters";

export const ECHO_RATING_PERCENT_MIN = 0;
export const ECHO_RATING_PERCENT_MAX = 100;

export type EchoBrowserSort = "default" | "impact";
export type EchoBrowserEquippedFilter = "self" | "any";

export type EchoBrowserFilters = {
  cost: number | null;
  echoSet: string | null;
  equipped: EchoBrowserEquippedFilter | null;
  mainStat: string | null;
  favorites: boolean;
  substats: string[];
  cvMin: number;
  cvMax: number;
  rvMin: number;
  rvMax: number;
  ratingMin: number;
  ratingMax: number;
  sortBy: EchoBrowserSort;
};

export const EMPTY_ECHO_BROWSER_FILTERS: EchoBrowserFilters = {
  cost: null,
  echoSet: null,
  equipped: null,
  mainStat: null,
  favorites: false,
  substats: [],
  cvMin: 0,
  cvMax: ECHO_CV_MAX,
  rvMin: 0,
  rvMax: ECHO_RV_MAX,
  ratingMin: ECHO_RATING_PERCENT_MIN,
  ratingMax: ECHO_RATING_PERCENT_MAX,
  sortBy: "default",
};

/** A saved [min, max] pair, or the full range if either end is unusable. */
function parseRange(rawMin: unknown, rawMax: unknown, floor: number, ceiling: number): [number, number] {
  const valid = (value: unknown): value is number =>
    typeof value === "number" && Number.isFinite(value) && value >= floor && value <= ceiling;
  if (!valid(rawMin) || !valid(rawMax) || rawMin > rawMax) return [floor, ceiling];
  return [rawMin, rawMax];
}

/** Reads saved filters defensively: anything missing or malformed means "not filtered". */
export function parseEchoBrowserFilters(raw: unknown): EchoBrowserFilters {
  if (!raw || typeof raw !== "object") return { ...EMPTY_ECHO_BROWSER_FILTERS, substats: [] };
  const saved = raw as Record<string, unknown>;
  const [cvMin, cvMax] = parseRange(saved.cvMin, saved.cvMax, 0, ECHO_CV_MAX);
  const [rvMin, rvMax] = parseRange(saved.rvMin, saved.rvMax, 0, ECHO_RV_MAX);
  const [ratingMin, ratingMax] = parseRange(
    saved.ratingMin,
    saved.ratingMax,
    ECHO_RATING_PERCENT_MIN,
    ECHO_RATING_PERCENT_MAX,
  );
  return {
    cost: typeof saved.cost === "number" ? saved.cost : null,
    echoSet: typeof saved.echoSet === "string" ? saved.echoSet : null,
    equipped: saved.equipped === "self" || saved.equipped === "any" ? saved.equipped : null,
    mainStat: typeof saved.mainStat === "string" ? saved.mainStat : null,
    favorites: saved.favorites === true,
    substats: Array.isArray(saved.substats)
      ? saved.substats.filter((stat): stat is string => typeof stat === "string")
      : [],
    cvMin,
    cvMax,
    rvMin,
    rvMax,
    ratingMin,
    ratingMax,
    sortBy: saved.sortBy === "impact" ? "impact" : "default",
  };
}

/**
 * The echo browser's filters and sort, remembered per character (surface
 * "echoBrowser"). Shared by the v3 and classic browsers; the classic one has
 * no sort control and simply ignores `sortBy`. Search text and the page are
 * deliberately not remembered.
 */
export function useEchoBrowserFilters(characterId: MaybeRefOrGetter<string | null | undefined>) {
  const scoped = useCharacterScopedFilters({
    surface: "echoBrowser",
    characterId,
    empty: EMPTY_ECHO_BROWSER_FILTERS,
    parse: parseEchoBrowserFilters,
  });
  return {
    costFilter: scoped.field("cost"),
    echoSet: scoped.field("echoSet"),
    equippedFilter: scoped.field("equipped"),
    mainStatFilter: scoped.field("mainStat"),
    favoriteFilter: scoped.field("favorites"),
    substatFilter: scoped.field("substats"),
    cvMin: scoped.field("cvMin"),
    cvMax: scoped.field("cvMax"),
    rvMin: scoped.field("rvMin"),
    rvMax: scoped.field("rvMax"),
    ratingMin: scoped.field("ratingMin"),
    ratingMax: scoped.field("ratingMax"),
    sortBy: scoped.field("sortBy"),
    // "Clear" resets the filters but leaves the sort, as it always has.
    resetEchoBrowserFilters: () => scoped.reset(["sortBy"]),
  };
}
