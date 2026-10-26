import { mainEchoesData } from "../echoes/index.ts";

/**
 * Whether an inventory echo matches a free-text name search, the same
 * case-insensitive substring match the weapon and character browsers use.
 * A blank search matches everything; an echo with no type set matches
 * nothing once there is a search.
 */
export function echoMatchesNameSearch(
  echoKey: string | null | undefined,
  search: string,
): boolean {
  const needle = search.trim().toLowerCase();
  if (!needle) return true;
  if (!echoKey) return false;
  const name = mainEchoesData[echoKey]?.name ?? echoKey;
  return name.toLowerCase().includes(needle);
}
