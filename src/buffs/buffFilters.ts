/**
 * Text search + "hide unused" filtering shared by the team buff lists
 * (resonator, echo, and weapon buffs) in CalculatorPartyBuffs.vue.
 */
export interface FilterableBuff {
  name: string;
  details: string;
  alwaysEnabled?: boolean;
}

export function stripBuffDetailsHtml(details: string): string {
  return details.replace(/<[^>]*>/g, " ");
}

export function buffMatchesSearch(buff: FilterableBuff, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) {
    return true;
  }
  return (
    buff.name.toLowerCase().includes(q) ||
    stripBuffDetailsHtml(buff.details ?? "").toLowerCase().includes(q)
  );
}

/**
 * A buff counts as "used" if it's forced on (`alwaysEnabled`) or the user
 * has actually enabled it — `alwaysEnabled` buffs are exempt from "hide
 * unused" since the user has no toggle to disable them anyway.
 */
export function buffIsUsed(buff: FilterableBuff, isEnabled: boolean): boolean {
  return Boolean(buff.alwaysEnabled) || isEnabled;
}

/**
 * "Hide impossible" filter: a buff tagged with the weapon type that grants
 * it (weapon team buffs carry `weaponType`) is only possible if one of the
 * selected teammates can wield that type. Untagged buffs (character/echo)
 * and an empty team (nothing to rule out against) are always possible.
 */
export function buffIsPossibleForTeam(
  buff: { weaponType?: string },
  teamWeaponTypes: readonly string[],
): boolean {
  if (!buff.weaponType || !teamWeaponTypes.length) {
    return true;
  }
  return teamWeaponTypes.includes(buff.weaponType);
}
