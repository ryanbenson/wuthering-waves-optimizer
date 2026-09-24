import { randomString } from "../utils/strings";

/**
 * One manually-entered custom buff on a single rotation action (`action.buffs`
 * — the "Configure Stats" / "Manage Buffs" rows, distinct from the
 * per-buff-definition `advancedConfig` toggles). `modifier` is unique within
 * one action's list — the row picker disables a modifier another row on the
 * same action already uses — which is what lets a bulk apply match by it.
 */
export interface RotationActionBuff {
  id: string;
  modifier?: string | null;
  modifierValue?: unknown;
}

/**
 * Bulk-writes one custom buff into every listed action's `buffs` — the
 * custom-buff counterpart to `applyBulkAdvancedConfigOverride`, backing the
 * same per-row "Duration" control (issue #564). Same one-time "fill down"
 * semantics: no persisted span, editing the source action later does not
 * retroactively change actions it was copied to.
 *
 * An action that already has a row for the same `modifier` gets that row's
 * value replaced in place (keeping its id); otherwise a new row is appended
 * with a fresh id, so ids stay unique per action.
 */
export function applyBulkActionBuff<T extends { id: string; buffs?: unknown }>(
  actions: T[],
  actionIds: string[],
  buff: { modifier: string; modifierValue: unknown },
  createId: () => string = randomString,
): T[] {
  const idSet = new Set(actionIds);
  return actions.map((action) => {
    if (!idSet.has(action.id)) return action;
    const existing: RotationActionBuff[] = Array.isArray(action.buffs) ? action.buffs : [];
    const index = existing.findIndex((row) => row.modifier === buff.modifier);
    const nextBuffs =
      index === -1
        ? [...existing, { id: createId(), modifier: buff.modifier, modifierValue: buff.modifierValue }]
        : existing.map((row, i) => (i === index ? { ...row, modifierValue: buff.modifierValue } : row));
    return { ...action, buffs: nextBuffs } as T;
  });
}
