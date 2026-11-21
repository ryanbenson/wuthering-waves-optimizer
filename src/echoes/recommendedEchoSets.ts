/**
 * A character's recommended echo sets (`suggestedEchoSets` in basic.ts) as the
 * set pickers and both optimizers use them. Pure: no Vue, no stores.
 */

/**
 * The sets the optimizer searches: the player's saved choice, or the character's
 * recommended sets when nothing usable is saved (an empty list can't run). The
 * optimizer and the team optimizer both read the saved list through this, and
 * the recommended sets are never written back unless the player picks sets.
 */
export function eligibleEchoSets(
  saved: readonly string[] | null | undefined,
  recommended: readonly string[] | null | undefined,
): string[] {
  return [...(saved?.length ? saved : (recommended ?? []))];
}

/**
 * The sets a set row shows, in the row's own order: all of them, or with
 * "Recommended only" the recommended ones plus any already selected, so a
 * selected set never hides. Without recommendations the row shows every set.
 */
export function shownEchoSets(
  all: readonly string[],
  recommended: readonly string[],
  selected: readonly string[],
  recommendedOnly: boolean,
): string[] {
  if (!recommendedOnly || !recommended.length) return [...all];
  return all.filter((set) => recommended.includes(set) || selected.includes(set));
}

/**
 * The sets an echo list is limited to: the selected ones, else the recommended
 * ones while "Recommended only" is on, else none (no set filter).
 */
export function setFilterFor(
  recommended: readonly string[],
  selected: readonly string[],
  recommendedOnly: boolean,
): string[] {
  if (selected.length) return [...selected];
  return recommendedOnly ? [...recommended] : [];
}
