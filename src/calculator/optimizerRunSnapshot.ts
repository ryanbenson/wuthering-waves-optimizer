/**
 * What an optimizer run's results are compared against, and how to tell the
 * build has changed since (issue #706).
 *
 * Results are fixed at run time. Their "vs current" comparisons follow the
 * live build while its non-echo inputs still match the run, so equipping a
 * result updates them; once those inputs change, the comparisons stay on the
 * last build that matched and the run is flagged as out of date. The inputs
 * key covers only what isn't the echoes: equipping a result (or syncing the
 * optimizer's main echo/set buffs, #705) is the expected next step and must
 * not mark the run as out of date.
 */

export type OptimizerRunInputs = {
  characterLevel: unknown;
  talents: unknown;
  weapon: unknown;
  characterBuffs: unknown;
  resonanceChains: unknown;
  teamBuffs: unknown;
  customBuffs: unknown;
  enemy: unknown;
  stance: unknown;
  rotations: unknown;
};

export type OptimizerSnapshotStats = {
  totalAtk: number;
  totalHp: number;
  totalDef: number;
  totalCritRate: number;
  totalCritDMG: number;
  energyRegen: number;
  /** The %-stat and flat-stat pools behind HP, ATK and DEF, for the stat-change lines (#746). */
  hpPercent?: number;
  hpFlat?: number;
  attackPercent?: number;
  attackFlat?: number;
  defPercent?: number;
  defFlat?: number;
};

export type OptimizerRunSnapshot = {
  inputsKey: string;
  stats: OptimizerSnapshotStats;
  allDamages: unknown;
};

/** JSON with object keys sorted, so the same data always gives the same string. */
function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_key, val) => {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      return Object.fromEntries(
        Object.keys(val as Record<string, unknown>)
          .sort()
          .map((k) => [k, (val as Record<string, unknown>)[k]]),
      );
    }
    return val;
  });
}

export function buildOptimizerInputsKey(inputs: OptimizerRunInputs): string {
  return stableStringify(inputs);
}

export function createOptimizerRunSnapshot(
  inputs: OptimizerRunInputs,
  stats: OptimizerSnapshotStats,
  allDamages: unknown,
): OptimizerRunSnapshot {
  return {
    inputsKey: buildOptimizerInputsKey(inputs),
    stats: { ...stats },
    allDamages: JSON.parse(JSON.stringify(allDamages ?? {})),
  };
}

/** The same run with its comparison baseline moved to the current build (inputs still matching). */
export function refreshOptimizerSnapshotBaseline(
  snapshot: OptimizerRunSnapshot,
  stats: OptimizerSnapshotStats,
  allDamages: unknown,
): OptimizerRunSnapshot {
  return {
    inputsKey: snapshot.inputsKey,
    stats: { ...stats },
    allDamages: JSON.parse(JSON.stringify(allDamages ?? {})),
  };
}

/** True when there are results and the build's non-echo inputs changed since their run. */
export function isOptimizerSnapshotStale(
  snapshot: OptimizerRunSnapshot | null | undefined,
  currentInputs: OptimizerRunInputs,
): boolean {
  if (!snapshot) return false;
  return snapshot.inputsKey !== buildOptimizerInputsKey(currentInputs);
}
