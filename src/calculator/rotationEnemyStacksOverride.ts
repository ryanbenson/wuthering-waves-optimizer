import type { RotationBuffOverride } from "./rotationAdvancedBuffs";

/**
 * The enemy buff-stack fields a single rotation action is allowed to
 * override. Deliberately excludes enemyLevel/enemyResist/enemyType — those
 * describe one enemy for the whole fight and must stay rotation/team-wide
 * only, so they are simply not members of this type.
 */
export type EnemyStackKey =
  | "strainStacks"
  | "havocBaneStacks"
  | "spectroFrazzleStacks"
  | "aeroErosionStacks"
  | "fusionBurstStacks"
  | "electroFlareStacks"
  | "electroRageStacks"
  | "glacioChafeStacks";

/**
 * Per-action enemy-stack overrides. Reuses `RotationBuffOverride`'s
 * `{isEnabled?, stacks?}` shape, but `isEnabled` here means "this action pins
 * its own value for this stack instead of following the rotation/team
 * default" rather than a gameplay toggle.
 */
export type EnemyStacksOverride = Partial<Record<EnemyStackKey, RotationBuffOverride>>;

/**
 * Single source of truth for the per-action enemy-stacks panel's row order,
 * labels, and caps. Deliberately a subset of `EnemyStackKey` — the per-action
 * override panel (`RotationEnemyStacksPanel.vue`, used by both Character and
 * Team Rotation action editors) only exposes Tune Strain and Havoc Bane;
 * the other elemental-effect stacks are still configured on the global enemy
 * panels (CalculatorEnemy.vue / CalculatorEnemyWorkspace.vue /
 * TeamRotationEnemySettings.vue) but are not overridable per-action.
 * Min is always 0 for every field.
 */
export const ENEMY_STACK_FIELDS: Array<{ key: EnemyStackKey; label: string; max: number }> = [
  { key: "strainStacks", label: "Tune Strain Stacks", max: 9 },
  { key: "havocBaneStacks", label: "Havoc Bane Stacks", max: 9 },
];

const ENEMY_STACK_KEYS = ENEMY_STACK_FIELDS.map((field) => field.key);

/**
 * True when a config actually overrides at least one stack field. Distinguishes
 * an action whose enemy-settings panel was opened-but-untouched (should stay on
 * the cheap shared-context path) from one with a real per-stack override (needs
 * its own rebuilt context) — the enemy-stacks counterpart to
 * `hasAdvancedConfigOverrides`.
 */
export function hasEnemyStacksOverride(override: EnemyStacksOverride | undefined | null): boolean {
  if (!override) return false;
  return ENEMY_STACK_KEYS.some((key) => override[key]?.isEnabled);
}

/**
 * Merges an action's enemy-stacks override onto a base object carrying the
 * same 8 stack fields — a full `TeamEnemyConfig` in the live Character/Team
 * Rotation path, or a bare stack record in the Optimizer path. Only fields
 * where the override is enabled and has a defined `stacks` value are
 * replaced; everything else (including enemyLevel/enemyResist/enemyType on a
 * `TeamEnemyConfig`, which aren't `EnemyStackKey` members) passes through
 * untouched. No-op when `override` is undefined.
 */
export function mergeEnemyStacksOverride<T extends Partial<Record<EnemyStackKey, number>>>(
  base: T,
  override: EnemyStacksOverride | undefined | null,
): T {
  if (!override) return base;
  const next = { ...base };
  for (const key of ENEMY_STACK_KEYS) {
    const fieldOverride = override[key];
    if (fieldOverride?.isEnabled && fieldOverride.stacks !== undefined) {
      next[key] = fieldOverride.stacks;
    }
  }
  return next;
}

/**
 * Adds/updates exactly one stack field's override — the write-path
 * counterpart used by the panel's per-field update handler.
 */
export function applyEnemyStacksOverride(
  existing: EnemyStacksOverride | undefined,
  key: EnemyStackKey,
  override: RotationBuffOverride,
): EnemyStacksOverride {
  return { ...(existing ?? {}), [key]: { ...override } };
}

/**
 * Removes exactly one stack field's override, letting it fall back to the
 * rotation/team-wide value again. Returns `undefined` (not `{}`) once the
 * last override is removed, so `hasEnemyStacksOverride` correctly reports
 * "no override" again.
 */
export function removeEnemyStacksOverride(
  existing: EnemyStacksOverride | undefined,
  key: EnemyStackKey,
): EnemyStacksOverride | undefined {
  if (!existing) return undefined;
  const next = { ...existing };
  delete next[key];
  return Object.keys(next).length > 0 ? next : undefined;
}

/**
 * Bulk-writes one stack field's override into every listed action's
 * `enemyStacksOverride` — the mechanism behind the per-field "Duration"
 * copy-forward control, mirroring `applyBulkAdvancedConfigOverride`'s
 * one-time "fill down" semantics (not a persisted, re-evaluated-at-calc-time
 * span — editing the source action later does not retroactively change
 * actions it was previously copied to).
 */
export function applyBulkEnemyStacksOverride<T extends { id: string; enemyStacksOverride?: EnemyStacksOverride }>(
  actions: T[],
  actionIds: string[],
  key: EnemyStackKey,
  override: RotationBuffOverride,
): T[] {
  const idSet = new Set(actionIds);
  return actions.map((action) =>
    idSet.has(action.id)
      ? { ...action, enemyStacksOverride: applyEnemyStacksOverride(action.enemyStacksOverride, key, override) }
      : action,
  );
}

/** Count of stack fields this action currently overrides — backs the panel's "N overridden" badge. */
export function countEnemyStacksOverrides(override: EnemyStacksOverride | undefined | null): number {
  if (!override) return 0;
  return ENEMY_STACK_KEYS.filter((key) => override[key]?.isEnabled).length;
}
