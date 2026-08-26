import { subStats } from "./stats";

export type SubstatFamily = "flat" | "crit" | "dmg" | "util";

// Groups the 13 possible substats into 4 families so they can be scanned by
// color instead of read one label at a time — crit (build-defining), dmg
// bonus (per-attack-type), utility (energy regen), and the flat/% stat pool.
export const SUBSTAT_FAMILY: Record<string, SubstatFamily> = {
  HP_FLAT: "flat",
  ATK_FLAT: "flat",
  DEF_FLAT: "flat",
  ATK: "flat",
  HP: "flat",
  DEF: "flat",
  EnergyRegen: "util",
  CritRate: "crit",
  CritDMG: "crit",
  BasicAttackDMGBonus: "dmg",
  HeavyAttackDMGBonus: "dmg",
  ResonanceSkillDMGBonus: "dmg",
  ResonanceLiberationDMGBonus: "dmg",
};

export function getSubstatFamily(stat: string | null | undefined): SubstatFamily {
  if (!stat) return "flat";
  return SUBSTAT_FAMILY[stat] ?? "flat";
}

// Every entry in `subStats` (the canonical 13-key list from stats.ts) must be
// classified — this assertion fails fast in dev/test if a new substat type
// is ever added there without a family assignment here.
subStats.forEach((key) => {
  if (!SUBSTAT_FAMILY[key]) {
    throw new Error(`substatFamilies.ts: missing family for substat "${key}"`);
  }
});
