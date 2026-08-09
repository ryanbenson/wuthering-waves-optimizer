import { describe, it, expect } from "vitest";
import {
  OPTIMIZER_WORKER_COUNT_OPTIONS,
  resolveOptimizerWorkerCount,
} from "../../src/utils/optimizerPreferences";

describe("resolveOptimizerWorkerCount", () => {
  it("returns 8 for undefined, null, or invalid values", () => {
    expect(resolveOptimizerWorkerCount(undefined)).toBe(8);
    expect(resolveOptimizerWorkerCount(null)).toBe(8);
    expect(resolveOptimizerWorkerCount("8")).toBe(8);
    expect(resolveOptimizerWorkerCount(3)).toBe(8);
    expect(resolveOptimizerWorkerCount(0)).toBe(8);
    expect(resolveOptimizerWorkerCount(-1)).toBe(8);
    expect(resolveOptimizerWorkerCount(NaN)).toBe(8);
  });

  it("returns the exact value for each allowed option", () => {
    for (const value of [2, 4, 8, 16, 32] as const) {
      expect(resolveOptimizerWorkerCount(value)).toBe(value);
    }
  });
});

describe("OPTIMIZER_WORKER_COUNT_OPTIONS", () => {
  it("has the 5 expected entries in order", () => {
    expect(OPTIMIZER_WORKER_COUNT_OPTIONS).toEqual([
      { value: 2, label: "2" },
      { value: 4, label: "4" },
      { value: 8, label: "8" },
      { value: 16, label: "16" },
      { value: 32, label: "32" },
    ]);
  });
});
