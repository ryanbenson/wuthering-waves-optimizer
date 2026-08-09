/**
 * Combines the base echo stats and the three echo-set-bonus stat objects
 * into the final `echoStats` object fed into calculateAllStats. Mirrors
 * CalculatorEchoes.vue's `updateTotalStats` top-level merge exactly,
 * including the pre-existing asymmetry where only `setBonusTwoStats`
 * special-cases `EnableAttack` (overwrite instead of sum) —
 * `setBonusOnePieceStats`/`setBonusOneStats` do not. Main-echo buff stats
 * are merged separately, afterward, via `mergeMainEchoBuffStats` (see
 * `mainEchoBuffs.ts`) — the multi-buff-aware equivalent of what this used
 * to also do in a single pass.
 */
export function combineEchoStats(
  combinedEchoStats: Record<string, number>,
  setBonusOnePieceStats: Record<string, unknown>,
  setBonusOneStats: Record<string, unknown>,
  setBonusTwoStats: Record<string, unknown>,
): Record<string, unknown> {
  const stats: Record<string, unknown> = {};

  Object.entries(combinedEchoStats || {}).forEach(([stat, value]) => {
    stats[stat] = ((stats[stat] as number) || 0) + (value as number);
  });
  Object.entries(setBonusOnePieceStats || {}).forEach(([stat, value]) => {
    stats[stat] = ((stats[stat] as number) || 0) + (value as number);
  });
  Object.entries(setBonusOneStats || {}).forEach(([stat, value]) => {
    stats[stat] = ((stats[stat] as number) || 0) + (value as number);
  });
  Object.entries(setBonusTwoStats || {}).forEach(([stat, value]) => {
    if (stat === "EnableAttack") stats[stat] = value;
    else stats[stat] = ((stats[stat] as number) || 0) + (value as number);
  });

  return stats;
}
