import {
  applyReplacements,
  transformPersistedStores,
  type Migration,
} from "../types";

/**
 * Renames Sun-sinking Eclipse → Havoc Eclipse (set keys + display labels).
 *
 * Replacing "Sun-sinking Eclipse" also rewrites "… 2 Set" / "… 5 Set".
 */
const REPLACEMENTS = [
  ["Sun-sinking Eclipse", "Havoc Eclipse"],
  ["SunSinkingEclipse", "HavocEclipse"],
] as const;

function renameSunSinkingEclipse(json: string): string {
  return applyReplacements(json, REPLACEMENTS);
}

const migration: Migration = {
  version: 3,
  description:
    "Rename echo set SunSinkingEclipse / Sun-sinking Eclipse → Havoc Eclipse",
  transform: renameSunSinkingEclipse,
  up() {
    transformPersistedStores(renameSunSinkingEclipse);
  },
};

export default migration;
