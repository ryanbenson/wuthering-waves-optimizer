/**
 * "Stat Bonus" self-buffs (`key` starting with `StatBonus`, e.g.
 * `StatBonusATK3`) represent a character's permanently-unlocked ascension/
 * inherent-skill stat tiers — the player toggles each tier once as they
 * level up, not per-combat like other self-buffs. Every character's
 * `buffs.ts` follows this `key` convention (see `CalculatorCharacterBuffs.vue`'s
 * stat-bonus grid, which renders these separately from combat-conditional
 * buffs).
 */
export function isStatBonusBuff(key: string): boolean {
  return key.startsWith("StatBonus");
}
