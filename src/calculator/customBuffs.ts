export type CustomBuffKey =
  | "ATK"
  | "ATK_FLAT"
  | "HP"
  | "HP_FLAT"
  | "DEF"
  | "DEF_FLAT"
  | "CritRate"
  | "CritDMG"
  | "EnergyRegen"
  | "BasicAttackDMGBonus"
  | "HeavyAttackDMGBonus"
  | "ResonanceSkillDMGBonus"
  | "ResonanceLiberationDMGBonus"
  | "EchoDMGBonus"
  | "Glacio"
  | "Fusion"
  | "Electro"
  | "Aero"
  | "Spectro"
  | "Havoc"
  | "HealingBonus"
  | "DamageAmplify"
  | "DamageAmplifyGlacioChafe"
  | "DamageAmplifyAeroErosion"
  | "DamageAmplifySpectroFrazzle"
  | "DamageAmplifyElectroFlare"
  | "DamageAmplifyFusionBurst"
  | "ResistShred"
  | "ResistIgnore"
  | "DefIgnore"
  | "DefReduction"
  | "CoordinatedDMGBonus"
  | "TuneBreakDMGBonus"
  | "SpecialMultiplier"
  | "TotalDamage";

/** Keys stored as flat additive values, not whole-number percentages. */
const FLAT_CUSTOM_BUFF_KEYS: ReadonlySet<CustomBuffKey> = new Set(["ATK_FLAT", "HP_FLAT", "DEF_FLAT"]);

function toNum(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

/**
 * `characters[id].customBuffs` persists percent-type fields as whole
 * numbers the way the Custom Buffs UI displays them (e.g. `5` for "+5%"),
 * not the 0-1 fraction `addBuffs`/`calculateAllStats` expect everywhere
 * else in the app (buff `modifierValue`s are always fractions, e.g.
 * `0.05`). `CalculatorCustomBuffs.vue` converts locally before feeding the
 * Results tab's own calculation; anything reading `customBuffs` straight
 * from the store (team rotations, the optimizer, build previews — all via
 * `buildCharacterContext.ts`) must go through this first, or every
 * percent-type custom buff ends up 100x too strong.
 */
export function normalizeCustomBuffs(
  raw: Partial<Record<CustomBuffKey, number>> | null | undefined,
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw ?? {})) {
    const num = toNum(value);
    result[key] = FLAT_CUSTOM_BUFF_KEYS.has(key as CustomBuffKey) ? num : num / 100;
  }
  return result;
}
