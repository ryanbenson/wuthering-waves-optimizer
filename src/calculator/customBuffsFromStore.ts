/** Mirrors CalculatorCustomBuffs buffsData — store values are UI percents (2 = 2%). */
export function processCustomBuffsFromStore(
  raw: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  const source = raw ?? {};
  const pct = (key: string) => {
    const value = source[key];
    return typeof value === "number" && value !== 0 ? value / 100 : 0;
  };
  const flat = (key: string) => {
    const value = source[key];
    return typeof value === "number" && value !== 0 ? value : 0;
  };

  return {
    ATK: pct("ATK"),
    ATK_FLAT: flat("ATK_FLAT"),
    HP: pct("HP"),
    HP_FLAT: flat("HP_FLAT"),
    DEF: pct("DEF"),
    DEF_FLAT: flat("DEF_FLAT"),
    CritRate: pct("CritRate"),
    CritDMG: pct("CritDMG"),
    EnergyRegen: pct("EnergyRegen"),
    BasicAttackDMGBonus: pct("BasicAttackDMGBonus"),
    HeavyAttackDMGBonus: pct("HeavyAttackDMGBonus"),
    ResonanceSkillDMGBonus: pct("ResonanceSkillDMGBonus"),
    ResonanceLiberationDMGBonus: pct("ResonanceLiberationDMGBonus"),
    EchoDMGBonus: pct("EchoDMGBonus"),
    Glacio: pct("Glacio"),
    Fusion: pct("Fusion"),
    Electro: pct("Electro"),
    Aero: pct("Aero"),
    Spectro: pct("Spectro"),
    Havoc: pct("Havoc"),
    HealingBonus: pct("HealingBonus"),
    DamageAmplify: pct("DamageAmplify"),
    DamageAmplifyGlacioChafe: pct("DamageAmplifyGlacioChafe"),
    DamageAmplifyAeroErosion: pct("DamageAmplifyAeroErosion"),
    DamageAmplifySpectroFrazzle: pct("DamageAmplifySpectroFrazzle"),
    DamageAmplifyElectroFlare: pct("DamageAmplifyElectroFlare"),
    DamageAmplifyFusionBurst: pct("DamageAmplifyFusionBurst"),
    ResistShred: pct("ResistShred"),
    DefIgnore: pct("DefIgnore"),
    DefReduction: pct("DefReduction"),
    CoordinatedDMGBonus: pct("CoordinatedDMGBonus"),
    TuneBreakDMGBonus: pct("TuneBreakDMGBonus"),
    SpecialMultiplier: pct("SpecialMultiplier"),
  };
}
