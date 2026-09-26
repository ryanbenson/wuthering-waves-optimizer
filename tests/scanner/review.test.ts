import { describe, it, expect } from "vitest";
import {
  filterCandidates,
  hasLowConfidence,
  needsAttention,
  stillNeedsAttention,
  summarizeCandidates,
  type ReviewContext,
} from "../../src/scanner/review";
import type { ScanCandidate } from "../../src/scanner/types";

function candidate(id: string, overrides: { echo?: string | null; lowSubstat?: boolean; lowName?: boolean } = {}): ScanCandidate {
  const { echo = "Jué", lowSubstat = false, lowName = false } = overrides;
  return {
    id,
    captureIndex: 1,
    slot: { cost: 4, mainStatLabel: "Crit. DMG", substats: [], echo, set: null },
    confidence: {
      name: lowName ? "low" : "high",
      cost: "high",
      mainStat: "high",
      set: "high",
      substats: ["high", lowSubstat ? "low" : "high", "high", "high", "high"],
    },
    needsMainStatSelection: false,
    substatSource: "columns",
    signature: id,
    rawHeaderText: "",
    rawStatsText: "",
  };
}

const empty: ReviewContext = { reviewedIds: new Set(), inventoryIds: new Set() };

const clean = candidate("clean");
const flagged = candidate("flagged", { lowSubstat: true });
const unknown = candidate("unknown", { echo: null, lowName: true });
const owned = candidate("owned");
const all = [clean, flagged, unknown, owned];

describe("attention rules", () => {
  it("flags any low-confidence field or an unrecognized echo", () => {
    expect(hasLowConfidence(clean)).toBe(false);
    expect(hasLowConfidence(flagged)).toBe(true);
    expect(needsAttention(unknown)).toBe(true);
    expect(needsAttention(clean)).toBe(false);
  });

  it("drops a flagged echo the user marked 'Looks right'", () => {
    const context = { ...empty, reviewedIds: new Set(["flagged"]) };
    expect(stillNeedsAttention(flagged, context)).toBe(false);
  });

  it("keeps an unknown echo flagged even if marked reviewed — there's nothing to save", () => {
    const context = { ...empty, reviewedIds: new Set(["unknown"]) };
    expect(stillNeedsAttention(unknown, context)).toBe(true);
  });
});

describe("filterCandidates", () => {
  const context: ReviewContext = { reviewedIds: new Set(), inventoryIds: new Set(["owned"]) };

  it.each([
    ["all", ["clean", "flagged", "unknown", "owned"]],
    ["attention", ["flagged", "unknown"]],
    ["unknown", ["unknown"]],
    ["inventory", ["owned"]],
  ] as const)("%s", (filter, expected) => {
    expect(filterCandidates(all, filter, context).map((c) => c.id)).toEqual(expected);
  });

  it("removes reviewed echoes from 'attention' only", () => {
    const reviewed = { ...context, reviewedIds: new Set(["flagged"]) };
    expect(filterCandidates(all, "attention", reviewed).map((c) => c.id)).toEqual(["unknown"]);
    expect(filterCandidates(all, "all", reviewed)).toHaveLength(4);
  });
});

describe("summarizeCandidates", () => {
  it("counts what the save button reports", () => {
    const context: ReviewContext = { reviewedIds: new Set(), inventoryIds: new Set(["owned"]) };
    expect(summarizeCandidates(all, context)).toEqual({
      total: 4,
      newCount: 3,
      inventoryCount: 1,
      attentionCount: 2,
      unknownCount: 1,
    });
  });

  it("handles an empty scan", () => {
    expect(summarizeCandidates([], empty)).toEqual({
      total: 0,
      newCount: 0,
      inventoryCount: 0,
      attentionCount: 0,
      unknownCount: 0,
    });
  });
});
