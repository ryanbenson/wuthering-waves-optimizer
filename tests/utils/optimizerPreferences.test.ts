import { describe, it, expect } from "vitest";
import {
  OPTIMIZER_WORKER_COUNT_OPTIONS,
  resolveOptimizerWorkerCount,
  resolveOptimizerResultCount,
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

describe("resolveOptimizerResultCount", () => {
  it("defaults to 5 when unset or not a number", () => {
    expect(resolveOptimizerResultCount(undefined)).toBe(5);
    expect(resolveOptimizerResultCount(null)).toBe(5);
    expect(resolveOptimizerResultCount("20")).toBe(5);
    expect(resolveOptimizerResultCount(Number.NaN)).toBe(5);
  });

  it("keeps whole numbers from 1 to 50", () => {
    expect(resolveOptimizerResultCount(0)).toBe(1);
    expect(resolveOptimizerResultCount(-3)).toBe(1);
    expect(resolveOptimizerResultCount(12.7)).toBe(12);
    expect(resolveOptimizerResultCount(50)).toBe(50);
    expect(resolveOptimizerResultCount(500)).toBe(50);
  });
});
