function damagesRoot(all: unknown): Record<string, unknown> | undefined {
  if (all && typeof all === "object" && "value" in (all as object)) {
    return (all as { value: Record<string, unknown> }).value;
  }
  if (all && typeof all === "object") return all as Record<string, unknown>;
  return undefined;
}

/** Finds which key of a damage block (totalDamage/avgDamage/critDamage, ...)
 * a value came from, so the same field can be read off a different loadout's
 * damage block for comparison — avoids needing to separately track which
 * damage type (Normal/Average/Crit) the run used. */
function findMatchingKey(
  obj: Record<string, unknown> | undefined,
  value: number,
): string | null {
  if (!obj) return null;
  for (const [key, v] of Object.entries(obj)) {
    if (typeof v === "number" && Math.abs(v - value) < 1e-6) return key;
  }
  return null;
}

export type OptimizerResultRow = {
  targetValue: number;
  context: Record<string, unknown>;
};

/**
 * % difference between a result row's target value and the same target
 * computed for the character's currently-equipped loadout. Returns null
 * when no matching baseline can be found (never guesses a wrong delta).
 */
export function getResultDeltaPercent(
  targetType: string,
  targetValue: string,
  row: OptimizerResultRow,
  allDamages: unknown,
  statBaselines: Record<string, number>,
): number | null {
  if (targetType === "Stat") {
    const baseline = statBaselines[targetValue];
    if (!baseline) return null;
    return ((row.targetValue - baseline) / baseline) * 100;
  }

  const root = damagesRoot(allDamages);
  if (!root) return null;

  if (targetType === "Rotation") {
    const rotation = row.context.rotation as
      | { id?: string; damageAggregation?: Record<string, number> }
      | undefined;
    if (!rotation?.id) return null;
    const key = findMatchingKey(rotation.damageAggregation, row.targetValue);
    if (!key) return null;
    const rotations = root.rotations;
    const baselineRotation = Array.isArray(rotations)
      ? (rotations as Array<{ id?: string; damageAggregation?: Record<string, number> }>).find(
          (r) => r.id === rotation.id,
        )
      : undefined;
    const baselineValue = baselineRotation?.damageAggregation?.[key];
    if (!baselineValue) return null;
    return ((row.targetValue - baselineValue) / baselineValue) * 100;
  }

  if (targetType === "Attack") {
    const [attackType, attackKey] = targetValue.split("|");
    const attacks = row.context.attacks as
      | Array<{ key?: string; damage?: Record<string, number> }>
      | undefined;
    const damageBlock = attacks?.[0]?.damage;
    const key = findMatchingKey(damageBlock, row.targetValue);
    if (!key) return null;
    const list = root[attackType];
    const baselineAttack = Array.isArray(list)
      ? (list as Array<{ key?: string; damage?: Record<string, number> }>).find(
          (a) => a.key === attackKey,
        )
      : undefined;
    const baselineValue = baselineAttack?.damage?.[key];
    if (!baselineValue) return null;
    return ((row.targetValue - baselineValue) / baselineValue) * 100;
  }

  return null;
}
