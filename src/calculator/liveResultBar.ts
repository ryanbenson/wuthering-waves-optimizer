/**
 * Pure helpers for the Live Result Bar (Labs-flagged pinned summary strip —
 * see `CalculatorLiveResultBar.vue` / `CalculatorLiveResultDetail.vue`).
 *
 * Targets are encoded as the same `"Stat:key"` / `"Attack:group|key"` /
 * `"Rotation:id"` strings `CalculatorOptimizerTarget.vue` already uses, so a
 * character's declared default (or the bar's own picker) stays compatible
 * with the Optimizer's target vocabulary instead of inventing a second one.
 * Unlike the Optimizer (which re-derives a target's value per loadout via
 * `optimize()`), this resolves directly against the already-computed
 * `allDamages` / stat refs the rest of the calculator is already showing —
 * no recomputation.
 */

export const LIVE_RESULT_BAR_STAT_META: Record<
  string,
  { label: string; format: "int" | "percent" }
> = {
  totalHp: { label: "HP", format: "int" },
  totalAtk: { label: "ATK", format: "int" },
  totalDef: { label: "DEF", format: "int" },
  totalCritRate: { label: "Crit Rate", format: "percent" },
  totalCritDMG: { label: "Crit DMG", format: "percent" },
  energyRegen: { label: "Energy Regen", format: "percent" },
};

export const DEFAULT_LIVE_RESULT_BAR_STATS = [
  "totalAtk",
  "totalCritRate",
  "totalCritDMG",
  "energyRegen",
];

// Preference order when a character hasn't declared `liveResultBarDefaultTarget`
// and has no saved rotation yet — picks the first group with any attacks.
const FALLBACK_ATTACK_GROUP_PRIORITY: LiveResultBarAttackGroup[] = [
  "liberationAttacks",
  "skillAttacks",
  "forteCircuitAttacks",
  "basicAttacks",
  "introAttacks",
  "tuneBreakAttacks",
  "outroAttacks",
];

export interface ResolvedLiveResultBarTarget {
  value: number;
  label: string;
}

export type LiveResultBarDamageType = "Normal" | "Average" | "Crit";

// Matches optimizer.ts's own two field maps (individual attacks vs.
// rotation aggregates use different field names for the same three modes).
const ATTACK_DAMAGE_FIELD: Record<LiveResultBarDamageType, string> = {
  Normal: "totalDamage",
  Average: "avgDamage",
  Crit: "critDamage",
};
const ROTATION_DAMAGE_FIELD: Record<LiveResultBarDamageType, string> = {
  Normal: "normalDamage",
  Average: "avgDamage",
  Crit: "critDamage",
};

/**
 * Turns a character's declared `liveResultBarDefaultTarget` into a target
 * string, given that character's currently saved rotations. A `"rotation"`
 * preference with no saved rotations yet resolves to `null` (nothing to
 * default to) rather than guessing a rotation that doesn't exist.
 */
export function buildLiveResultBarTarget(
  config: CharacterBasicInfo["liveResultBarDefaultTarget"] | undefined | null,
  rotations: Array<{ id: string }> | undefined | null,
): string | null {
  if (!config) return null;
  if (config.type === "rotation") {
    return rotations?.length ? `Rotation:${rotations[0].id}` : null;
  }
  return `Attack:${config.group}|${config.key}`;
}

/**
 * Cross-character fallback for when neither a character-declared default
 * nor a saved rotation is available — the first attack in the
 * highest-priority non-empty group, so every character shows *something*
 * rather than an empty bar on first load.
 */
export function fallbackLiveResultBarTarget(
  allDamages: Record<string, any> | null | undefined,
): string | null {
  for (const group of FALLBACK_ATTACK_GROUP_PRIORITY) {
    const list = allDamages?.[group];
    if (Array.isArray(list) && list.length) {
      return `Attack:${group}|${list[0].key}`;
    }
  }
  return null;
}

/**
 * Resolves a target string against already-computed data. Returns `null`
 * when the target can't be resolved yet (e.g. stale target after a
 * character switch, or data still loading) — callers should treat that as
 * "no value to show" rather than falling back silently, since a stale
 * resolution reads as more misleading than an empty state.
 */
export function resolveLiveResultBarTarget(
  target: string | null | undefined,
  allDamages: Record<string, any> | null | undefined,
  stats: Record<string, number>,
  damageType: LiveResultBarDamageType = "Average",
): ResolvedLiveResultBarTarget | null {
  if (!target) return null;
  const separatorIndex = target.indexOf(":");
  if (separatorIndex === -1) return null;
  const type = target.slice(0, separatorIndex);
  const rest = target.slice(separatorIndex + 1);

  if (type === "Stat") {
    if (!(rest in stats)) return null;
    return {
      value: stats[rest] ?? 0,
      label: LIVE_RESULT_BAR_STAT_META[rest]?.label ?? rest,
    };
  }

  if (type === "Attack") {
    const pipeIndex = rest.indexOf("|");
    if (pipeIndex === -1) return null;
    const group = rest.slice(0, pipeIndex);
    const key = rest.slice(pipeIndex + 1);
    const list = allDamages?.[group];
    if (!Array.isArray(list)) return null;
    const attack = list.find((a: any) => a?.key === key);
    if (!attack) return null;
    const field = ATTACK_DAMAGE_FIELD[damageType];
    const value =
      attack.damage?.[field] ??
      attack.damage?.healAmount ??
      attack.damage?.shieldAmount ??
      0;
    return { value, label: attack.label ?? key };
  }

  if (type === "Rotation") {
    const rotations = allDamages?.rotations;
    if (!Array.isArray(rotations)) return null;
    const rotation = rotations.find((r: any) => r?.id === rest);
    if (!rotation) return null;
    const field = ROTATION_DAMAGE_FIELD[damageType];
    return {
      value: rotation.damageAggregation?.[field] ?? 0,
      label: rotation.name ?? "Rotation",
    };
  }

  return null;
}
