export type OptimizerWorkerCount = 2 | 4 | 8 | 16 | 32;

export const OPTIMIZER_WORKER_COUNT_OPTIONS: Array<{
  value: OptimizerWorkerCount;
  label: string;
}> = [2, 4, 8, 16, 32].map((value) => ({
  value: value as OptimizerWorkerCount,
  label: String(value),
}));

export function resolveOptimizerWorkerCount(value: unknown): OptimizerWorkerCount {
  if (
    value === 2 ||
    value === 4 ||
    value === 8 ||
    value === 16 ||
    value === 32
  ) {
    return value;
  }
  return 8;
}

export const OPTIMIZER_RESULT_COUNT_DEFAULT = 5;
export const OPTIMIZER_RESULT_COUNT_MIN = 1;
export const OPTIMIZER_RESULT_COUNT_MAX = 50;

/** How many top loadouts the optimizer keeps: a whole number from 1 to 50, default 5. */
export function resolveOptimizerResultCount(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return OPTIMIZER_RESULT_COUNT_DEFAULT;
  }
  return Math.min(
    OPTIMIZER_RESULT_COUNT_MAX,
    Math.max(OPTIMIZER_RESULT_COUNT_MIN, Math.floor(value)),
  );
}
