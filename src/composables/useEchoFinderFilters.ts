import { toValue, type MaybeRefOrGetter } from "vue";
import { useSavedFilters, type SavedFiltersLocation } from "./useCharacterScopedFilters";

export type EchoFinderFilters = {
  echoSet: string | null;
  cost: number | null;
};

export const EMPTY_ECHO_FINDER_FILTERS: EchoFinderFilters = { echoSet: null, cost: null };

/** Reads saved filters defensively: anything missing or malformed means "not filtered". */
export function parseEchoFinderFilters(raw: unknown): EchoFinderFilters {
  if (!raw || typeof raw !== "object") return { ...EMPTY_ECHO_FINDER_FILTERS };
  const saved = raw as Record<string, unknown>;
  return {
    echoSet: typeof saved.echoSet === "string" ? saved.echoSet : null,
    cost: typeof saved.cost === "number" ? saved.cost : null,
  };
}

/** Where the Echo Finder was opened: a build slot (per character) or the inventory (global). */
export type EchoFinderScope = { character: string | null | undefined } | "inventory";

/**
 * The Echo Finder's set and cost filters. For a build slot they are
 * remembered per character (surface "echoFinder"); for an inventory echo,
 * globally in settings.config.inventoryEchoFinderFilters, since the
 * inventory isn't tied to a character. Shared by the v3 EchoPickerDialog and
 * the classic CalculatorEcho / InventoryEchoEdit pickers (which only have
 * the set filter). Search text is deliberately not remembered.
 */
export function useEchoFinderFilters(scope: MaybeRefOrGetter<EchoFinderScope>) {
  const saved = useSavedFilters({
    location: (): SavedFiltersLocation => {
      const current = toValue(scope);
      if (current === "inventory") return { globalKey: "inventoryEchoFinderFilters" };
      return current.character ? { characterId: current.character, surface: "echoFinder" } : null;
    },
    empty: EMPTY_ECHO_FINDER_FILTERS,
    parse: parseEchoFinderFilters,
  });
  return {
    echoSetFilter: saved.field("echoSet"),
    echoCostFilter: saved.field("cost"),
    resetEchoFinderFilters: () => saved.reset(),
  };
}
