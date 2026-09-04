import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { getWeaponsByType } from "../../src/weapons/weapons";

const WEAPONS_ROOT = join(__dirname, "../../src/weapons");
const TYPES = ["Swords", "Broadblades", "Rectifiers", "Pistols", "Gauntlets"];

/**
 * The registry's `mainStat` is hand-maintained data duplicated from each
 * weapon module's own `weaponData[level].modifier` — the browse modal filters
 * on it without paying to lazy-load 100+ weapon modules just to read one
 * field. These tests are what keep the copy honest: a new weapon added to the
 * registry without a `mainStat`, or with one that disagrees with its module,
 * fails here rather than silently mis-filtering in the UI.
 */
function readModuleMainStat(type: string, key: string): string | null {
  const path = join(WEAPONS_ROOT, type, `${key}.ts`);
  if (!existsSync(path)) return null;
  const source = readFileSync(path, "utf8");
  const start = source.indexOf("const weaponData");
  if (start === -1) return null;
  // `weaponInfo.passiveData` entries carry their own unrelated `modifier`
  // field (passive effect type), so only scan the weaponData block.
  const end = source.indexOf("export function", start);
  const block = source.slice(start, end === -1 ? undefined : end);
  const match = block.match(/modifier:\s*"([^"]+)"/);
  return match ? match[1] : null;
}

function everyRegistryEntry(): Array<{ type: string; key: string; name: string; mainStat?: string }> {
  const entries: Array<{ type: string; key: string; name: string; mainStat?: string }> = [];
  for (const type of TYPES) {
    const list = getWeaponsByType(type) as Record<string, Array<any>>;
    for (const tier of ["five", "four", "three", "two", "one"]) {
      for (const entry of list[tier] ?? []) {
        entries.push({ type, ...entry });
      }
    }
  }
  return entries;
}

describe("weapons registry mainStat", () => {
  it("has a non-empty mainStat on every entry", () => {
    const missing = everyRegistryEntry()
      .filter((entry) => !entry.mainStat)
      .map((entry) => `${entry.type}/${entry.key}`);
    expect(missing).toEqual([]);
  });

  it("agrees with each weapon module's own weaponData modifier", () => {
    const mismatches = everyRegistryEntry()
      .map((entry) => {
        const fromModule = readModuleMainStat(entry.type, entry.key);
        if (fromModule && fromModule !== entry.mainStat) {
          return `${entry.type}/${entry.key}: registry=${entry.mainStat} module=${fromModule}`;
        }
        return null;
      })
      .filter(Boolean);
    expect(mismatches).toEqual([]);
  });

  it("only uses stat values the filter UI knows how to label", () => {
    // Kept in sync with WEAPON_MAIN_STAT_LABELS in weapons.ts — a new stat
    // showing up here means the filter dropdown needs a label for it.
    const known = new Set(["ATK", "CritDMG", "CritRate", "DEF", "EnergyRegen", "HP"]);
    const unknown = [
      ...new Set(everyRegistryEntry().map((entry) => entry.mainStat).filter(Boolean)),
    ].filter((stat) => !known.has(stat as string));
    expect(unknown).toEqual([]);
  });
});
