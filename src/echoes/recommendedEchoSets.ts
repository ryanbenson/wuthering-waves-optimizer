/**
 * A character's recommended echo sets (`suggestedEchoSets` in basic.ts) as the
 * set pickers use them. Pure: no Vue, no stores.
 */

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
