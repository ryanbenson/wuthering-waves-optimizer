/**
 * Pure fuzzy-matching engine for the rotation builder's "paste import" feature.
 *
 * Given free-form pasted text (one action per line, optionally with a
 * trailing count suffix like "x2"), matches each line against a character's
 * real list of available actions. No Vue/DOM/Pinia — safe to unit test in
 * isolation and reuse from workers if needed later.
 */

export interface MatchableAction {
  key: string;
  label: string;
  group?: string; // e.g. "Basic", "Skill", "Liberation" — for display only, not matching
}

export interface MatchCandidate {
  key: string;
  label: string;
  group?: string;
  score: number; // 0..1
}

export type LineMatchStatus = "matched" | "ambiguous" | "unmatched";

export interface LineMatchResult {
  raw: string; // original pasted line, with only a trailing newline stripped
  text: string; // the line with any trailing count suffix stripped and trimmed
  count: number; // parsed count multiplier, default 1
  status: LineMatchStatus;
  // best-first. "matched" -> [top]. "ambiguous" -> the close cluster (2-3).
  // "unmatched" -> always empty (see matchActionLine for rationale).
  candidates: MatchCandidate[];
}

/** Candidates scoring below this are treated as unrelated noise. */
const UNMATCHED_SCORE_THRESHOLD = 0.35;
/** A candidate within this many points of the top score joins its "close cluster". */
const AMBIGUOUS_SCORE_WINDOW = 0.12;
/** Cluster members must also clear this absolute floor to count as a real contender. */
const AMBIGUOUS_SCORE_FLOOR = 0.5;
/** Ambiguous clusters are capped to this many candidates for display. */
const MAX_AMBIGUOUS_CANDIDATES = 3;

/** Matches a trailing count suffix like "x2", "×2", "*3" (case-insensitive, optional surrounding whitespace). */
const COUNT_SUFFIX_RE = /\s*[x×*]\s*(\d+)\s*$/i;

/**
 * Splits a raw pasted line into its action text and count multiplier.
 * "Heavy Attack x2" -> { text: "Heavy Attack", count: 2 }
 * "Heavy Attack" -> { text: "Heavy Attack", count: 1 }
 */
export function parseActionLine(rawLine: string): { text: string; count: number } {
  const trimmed = rawLine.trim();
  const match = trimmed.match(COUNT_SUFFIX_RE);

  if (!match) {
    return { text: trimmed, count: 1 };
  }

  const parsedCount = parseInt(match[1], 10);
  const text = trimmed.slice(0, match.index).trim();
  const count = Number.isFinite(parsedCount) && parsedCount > 0 ? parsedCount : 1;

  return { text, count };
}

/** Lowercases, collapses all non-alphanumeric runs to single spaces, and trims. */
function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Builds the multiset (frequency map) of adjacent-character bigrams for a string. */
function bigramCounts(input: string): Map<string, number> {
  const counts = new Map<string, number>();

  for (let i = 0; i < input.length - 1; i++) {
    const bigram = input.slice(i, i + 2);
    counts.set(bigram, (counts.get(bigram) ?? 0) + 1);
  }

  return counts;
}

/**
 * Sørensen–Dice coefficient over adjacent-character bigram multisets.
 * Uses a frequency-map intersection so repeated bigrams are counted correctly
 * (not a plain set intersection). Returns 0 if either string has fewer than
 * 2 characters, since there are no bigrams to compare.
 */
function bigramDiceCoefficient(a: string, b: string): number {
  if (a.length < 2 || b.length < 2) {
    return 0;
  }

  const countsA = bigramCounts(a);
  const countsB = bigramCounts(b);

  let overlap = 0;
  for (const [bigram, countA] of countsA) {
    const countB = countsB.get(bigram);
    if (countB) {
      overlap += Math.min(countA, countB);
    }
  }

  const totalBigrams = (a.length - 1) + (b.length - 1);
  if (totalBigrams === 0) {
    return 0;
  }

  return (2 * overlap) / totalBigrams;
}

/**
 * Scores a raw query against a raw label, 0..1. See module docs / spec for
 * the tier breakdown: exact (1.0) > prefix (0.85) > all-tokens-present
 * (0.72) > substring (0.6) > bigram Dice fallback (scaled by 0.55).
 */
function scoreMatch(query: string, label: string): number {
  const normalizedQuery = normalize(query);
  const normalizedLabel = normalize(label);

  if (!normalizedQuery) {
    return 0;
  }

  if (normalizedQuery === normalizedLabel) {
    return 1.0;
  }

  if (normalizedLabel.startsWith(normalizedQuery)) {
    return 0.85;
  }

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const labelTokens = new Set(normalizedLabel.split(" ").filter(Boolean));
  if (queryTokens.length > 0 && queryTokens.every((token) => labelTokens.has(token))) {
    return 0.72;
  }

  if (normalizedLabel.includes(normalizedQuery)) {
    return 0.6;
  }

  return bigramDiceCoefficient(normalizedQuery, normalizedLabel) * 0.55;
}

/**
 * Scores `query` against every provided action's label and returns all of
 * them, sorted best-first. Never drops any input action — callers filter
 * by score/threshold as needed. Ties preserve input order (stable sort).
 */
export function rankActionMatches(query: string, actions: MatchableAction[]): MatchCandidate[] {
  return actions
    .map((action, index) => ({
      candidate: {
        key: action.key,
        label: action.label,
        group: action.group,
        score: scoreMatch(query, action.label),
      },
      index,
    }))
    .sort((a, b) => {
      const scoreDiff = b.candidate.score - a.candidate.score;
      if (scoreDiff !== 0) {
        return scoreDiff;
      }
      return a.index - b.index; // stable: preserve input order on ties
    })
    .map((entry) => entry.candidate);
}

/**
 * Parses and matches a single pasted line against the given actions.
 *
 * Classification:
 * - Zero actions, or the top score is below the unmatched threshold ->
 *   "unmatched" with no candidates (low-confidence junk isn't worth showing).
 * - Otherwise, candidates within AMBIGUOUS_SCORE_WINDOW of the top score
 *   (and at/above AMBIGUOUS_SCORE_FLOOR) form a "close cluster". If that
 *   cluster has 2+ members -> "ambiguous", capped at the top 3.
 * - Otherwise -> "matched", with just the top candidate.
 */
export function matchActionLine(rawLine: string, actions: MatchableAction[]): LineMatchResult {
  const raw = rawLine.replace(/(\r\n|\r|\n)$/, "");
  const { text, count } = parseActionLine(raw);
  const ranked = rankActionMatches(text, actions);
  const top = ranked[0];

  if (!top || top.score < UNMATCHED_SCORE_THRESHOLD) {
    return { raw, text, count, status: "unmatched", candidates: [] };
  }

  const closeCluster = ranked.filter(
    (candidate) =>
      candidate.score >= top.score - AMBIGUOUS_SCORE_WINDOW && candidate.score >= AMBIGUOUS_SCORE_FLOOR,
  );

  if (closeCluster.length >= 2) {
    return {
      raw,
      text,
      count,
      status: "ambiguous",
      candidates: closeCluster.slice(0, MAX_AMBIGUOUS_CANDIDATES),
    };
  }

  return { raw, text, count, status: "matched", candidates: [top] };
}

/**
 * Splits pasted multi-line text into per-line match results. Blank lines
 * (empty after trim) are skipped entirely and never appear in the output.
 */
export function matchActionLines(text: string, actions: MatchableAction[]): LineMatchResult[] {
  return text
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => matchActionLine(line, actions));
}
