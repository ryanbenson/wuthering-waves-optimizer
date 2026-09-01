/**
 * Pure helpers for the pinned-stat favorites strip in the redesigned Full
 * breakdown panel (`CalculatorLiveResultOverview.vue`). Extends the existing
 * "which stats does the live-result-bar chip strip show" mechanism
 * (`Calculator.vue`'s `liveResultBarStatKeys`, falling back to
 * `DEFAULT_LIVE_RESULT_BAR_STATS`) with a per-character user override, rather
 * than inventing a second, parallel concept.
 *
 * Persisted shape: `settingsStore.config.pinnedStatsByCharacter[character]`
 * is an object map (`{ [statKey]: true }`), never an array — `addToConfig`
 * deep-merges via lodash `merge`, which does not truncate an existing array
 * when a shorter one is written on top of it, so unpinning a stat by writing
 * a shorter array would silently leave stale entries. An object map makes
 * "unpin" a real key delete, and the caller (`usePinnedStats.ts`) writes the
 * whole next config via `setConfig` rather than `addToConfig` for this
 * branch, sidestepping the merge behavior entirely.
 *
 * A character is only ever "customized" once the settings store has an own
 * key for it — `hasOwnProperty`, not "the map is non-empty" — so a user who
 * unpins every stat gets a genuinely empty strip instead of silently falling
 * back to the character's declared defaults again.
 */

export interface StatGroup {
  label: string;
  keys: string[];
}

// Matches the approved design review's grouping exactly.
export const STAT_GROUPS: StatGroup[] = [
  { label: "Core", keys: ["totalHp", "totalAtk", "totalDef"] },
  {
    label: "Crit",
    keys: ["totalCritRate", "totalCritDMG", "energyRegen"],
  },
  {
    label: "DMG Bonuses",
    keys: [
      "basicAttackDmgBonus",
      "heavyAttackDmgBonus",
      "resonanceSkillDmgBonus",
      "resonanceLiberationDmgBonus",
      "elementDmgBonus",
      "healingBonus",
      "tuneBreakBoost",
    ],
  },
];

// Canonical order for the pinned-chip strip, independent of pin/click order
// or object key insertion order.
export const STAT_KEYS: string[] = STAT_GROUPS.flatMap((group) => group.keys);

/**
 * The stats a character's panel should show as pinned right now: the
 * character's own customized set once one exists, otherwise
 * `declaredDefaults` (the existing character-declared / global fallback).
 */
export function resolvePinnedStats(
  config: Record<string, any> | null | undefined,
  character: string,
  declaredDefaults: string[],
): string[] {
  const byCharacter = config?.pinnedStatsByCharacter;
  const hasCustomized =
    !!byCharacter && Object.prototype.hasOwnProperty.call(byCharacter, character);
  if (!hasCustomized) return declaredDefaults;

  const forChar = byCharacter[character] ?? {};
  return STAT_KEYS.filter((key) => forChar[key]);
}

/**
 * Returns the *next* settings config with `statKey` toggled for `character`
 * — doesn't touch the store. Toggles against the currently-effective
 * (resolved) set, not just the raw stored map, so a character's first pin
 * starts from their declared defaults plus the change rather than replacing
 * those defaults with a single stat.
 */
export function withStatPinToggled(
  config: Record<string, any> | null | undefined,
  character: string,
  statKey: string,
  declaredDefaults: string[],
): Record<string, any> {
  const current = config ?? {};
  const currentlyPinned = new Set(
    resolvePinnedStats(current, character, declaredDefaults),
  );
  if (currentlyPinned.has(statKey)) {
    currentlyPinned.delete(statKey);
  } else {
    currentlyPinned.add(statKey);
  }

  const forChar: Record<string, true> = {};
  for (const key of STAT_KEYS) {
    if (currentlyPinned.has(key)) forChar[key] = true;
  }

  return {
    ...current,
    pinnedStatsByCharacter: {
      ...(current.pinnedStatsByCharacter ?? {}),
      [character]: forChar,
    },
  };
}
