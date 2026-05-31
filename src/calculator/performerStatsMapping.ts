export type RotationPerformerManualStats = {
  totalAtk?: number | null;
  totalHp?: number | null;
  totalDef?: number | null;
  critRate?: number | null;
  critDMG?: number | null;
  energyRegen?: number | null;
  glacio?: number | null;
  fusion?: number | null;
  electro?: number | null;
  aero?: number | null;
  spectro?: number | null;
  havoc?: number | null;
  basicAttackDMGBonus?: number | null;
  heavyAttackDMGBonus?: number | null;
  resonanceSkillDMGBonus?: number | null;
  introSkillDMGBonus?: number | null;
  outroSkillDMGBonus?: number | null;
  resonanceLiberationDMGBonus?: number | null;
  echoDMGBonus?: number | null;
};

export function finalStatsToPerformerStats(
  finalStats: Record<string, unknown>,
): Record<string, unknown> {
  return {
    totalAtk: finalStats.totalAtk,
    totalHp: finalStats.totalHp,
    totalDef: finalStats.totalDef,
    totalCritRate: finalStats.totalCritRate,
    totalCritDMG: finalStats.totalCritDMG,
    energyRegen: finalStats.energyRegen,
    glacio: finalStats.glacio,
    fusion: finalStats.fusion,
    electro: finalStats.electro,
    aero: finalStats.aero,
    spectro: finalStats.spectro,
    havoc: finalStats.havoc,
    basicAttackDMGBonus: finalStats.basicAttackDMGBonus,
    heavyAttackDMGBonus: finalStats.heavyAttackDMGBonus,
    resonanceSkillDMGBonus: finalStats.resonanceSkillDMGBonus,
    introSkillDMGBonus: finalStats.introSkillDMGBonus,
    outroSkillDMGBonus: finalStats.outroSkillDMGBonus,
    resonanceLiberationDMGBonus: finalStats.resonanceLiberationDMGBonus,
    echoDmgBonus: finalStats.echoDMGBonus,
    healingBonus: finalStats.healingBonus,
    shieldBonus: finalStats.shieldBonus,
    DefIgnore: finalStats.DefIgnore,
    ResistReduction: finalStats.resistReduction,
    resistReduction: finalStats.resistReduction,
    TotalDeepenEffect: finalStats.totalDeepenEffect,
  };
}

export function manualStatsToPerformerStats(
  manual: RotationPerformerManualStats,
): Record<string, unknown> {
  return {
    totalAtk: Number(manual.totalAtk ?? 0),
    totalHp: Number(manual.totalHp ?? 0),
    totalDef: Number(manual.totalDef ?? 0),
    totalCritRate: Number(manual.critRate ?? 0) / 100,
    totalCritDMG: Number(manual.critDMG ?? 0) / 100,
    energyRegen: Number(manual.energyRegen ?? 100) / 100,
    glacio: Number(manual.glacio ?? 0),
    fusion: Number(manual.fusion ?? 0),
    electro: Number(manual.electro ?? 0),
    aero: Number(manual.aero ?? 0),
    spectro: Number(manual.spectro ?? 0),
    havoc: Number(manual.havoc ?? 0),
    basicAttackDMGBonus: Number(manual.basicAttackDMGBonus ?? 0),
    heavyAttackDMGBonus: Number(manual.heavyAttackDMGBonus ?? 0),
    resonanceSkillDMGBonus: Number(manual.resonanceSkillDMGBonus ?? 0),
    introSkillDMGBonus: Number(manual.introSkillDMGBonus ?? 0),
    outroSkillDMGBonus: Number(manual.outroSkillDMGBonus ?? 0),
    resonanceLiberationDMGBonus: Number(manual.resonanceLiberationDMGBonus ?? 0),
    echoDmgBonus: Number(manual.echoDMGBonus ?? 0),
  };
}
