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
