/**
 * Review-list logic for scanned candidates: what "needs attention" means,
 * the results view's filter tabs, and the counts behind the save button.
 * Pure TS so it's unit-testable — EchoScannerCapture.vue owns the UI
 * state (which ids the user marked "Looks right", which are already in
 * the inventory) and passes it in.
 */
import type { ScanCandidate } from "./types";

export type ReviewFilter = "all" | "attention" | "unknown" | "inventory";

export type ReviewContext = {
  /** Candidates the user marked "Looks right" — no longer need attention, though their confidence is unchanged. */
  reviewedIds: ReadonlySet<string>;
  /** Candidates whose exact echo is already in the inventory. */
  inventoryIds: ReadonlySet<string>;
};

export function hasLowConfidence(candidate: ScanCandidate): boolean {
  const c = candidate.confidence;
  return (
    c.name === "low" ||
    c.cost === "low" ||
    c.mainStat === "low" ||
    c.set === "low" ||
    c.substats.some((s) => s === "low")
  );
}

export function isUnknownEcho(candidate: ScanCandidate): boolean {
  return !candidate.slot.echo;
}

/** Flagged by the parser (a low-confidence field or no echo match), ignoring anything the user has since dismissed. */
export function needsAttention(candidate: ScanCandidate): boolean {
  return isUnknownEcho(candidate) || hasLowConfidence(candidate);
}

/** needsAttention, minus the ones the user marked "Looks right". An unknown echo can't be dismissed — it has no echo to save. */
export function stillNeedsAttention(candidate: ScanCandidate, context: ReviewContext): boolean {
  if (isUnknownEcho(candidate)) return true;
  return hasLowConfidence(candidate) && !context.reviewedIds.has(candidate.id);
}

export function filterCandidates(
  candidates: ScanCandidate[],
  filter: ReviewFilter,
  context: ReviewContext,
): ScanCandidate[] {
  switch (filter) {
    case "attention":
      return candidates.filter((c) => stillNeedsAttention(c, context));
    case "unknown":
      return candidates.filter(isUnknownEcho);
    case "inventory":
      return candidates.filter((c) => context.inventoryIds.has(c.id));
    default:
      return candidates;
  }
}

export type ReviewSummary = {
  total: number;
  /** Not already in the inventory — what "Save" adds without a duplicate step. */
  newCount: number;
  inventoryCount: number;
  attentionCount: number;
  unknownCount: number;
};

export function summarizeCandidates(candidates: ScanCandidate[], context: ReviewContext): ReviewSummary {
  let inventoryCount = 0;
  let attentionCount = 0;
  let unknownCount = 0;
  for (const c of candidates) {
    if (context.inventoryIds.has(c.id)) inventoryCount++;
    if (stillNeedsAttention(c, context)) attentionCount++;
    if (isUnknownEcho(c)) unknownCount++;
  }
  return {
    total: candidates.length,
    newCount: candidates.length - inventoryCount,
    inventoryCount,
    attentionCount,
    unknownCount,
  };
}
