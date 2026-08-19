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
