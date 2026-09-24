/**
 * Turns the raw OCR text pulled from the name line, the main/secondary
 * stat rows, and the substat label/value columns (layout.ts's NAME_BLOCK /
 * MAIN_STAT_ROW / SECONDARY_STAT_ROW / SUBSTAT_LABEL_COLUMN /
 * SUBSTAT_VALUE_COLUMN, with SUBSTAT_ROWS and SUBSTAT_BLOCK as fallbacks) into
 * a ParsedEchoSlot candidate — the same shape CalculatorEchoParser.vue
 * already emits, so the result can be handed straight to
 * CalculatorEchoImporter.vue's existing mapParsedEchoes →
 * duplicate-review → save pipeline.
 *
 * No cost or level OCR: the app doesn't persist echo level (every scanned
 * echo is treated as max-level, so there's nothing to gain reading "+n"),
 * and cost is derived from the resolved echo's own class
 * (getCostByClass) — the same fallback CalculatorEchoParser.vue already
 * has for when its own cost OCR misses, just always taken here instead of
 * only as a fallback.
 *
 * Echo identification is name-first, not set-icon-first (revised from an
 * earlier set-first design — see docs/scanner.md's "Echo identification"
 * section for the full reasoning and the real mismatch that motivated it).
 * Short version: of 182 echoes, none share a name, but 122 (67%) support
 * more than one set — so even a *correct* set-icon match alone often
 * can't identify the echo, and a *wrong* one (the persistent problem this
 * scanner kept hitting) actively misidentifies it. Name text, tolerant of
 * OCR noise via Levenshtein similarity, doesn't have that ceiling: it
 * alone is enough to identify the echo, no image matching needed at all,
 * for any echo whose set happens to be unambiguous (33% of the pool) or
 * once the echo itself is known regardless of set. `resolveEchoByNameAndCost`
 * below does exactly that — cost (inferred from the fixed secondary
 * stat's value, deterministic, no image involved) narrows the name-match
 * candidate pool as a soft optimization (never a hard filter: a bad
 * narrowing just means no narrowing, not a wrong answer — it always
 * retries unfiltered before giving up).
 *
 * Set-icon image matching still has a real, necessary job: when the
 * resolved echo supports more than one set, *something* has to say which
 * one the player actually slotted it into — the pixels are the only
 * signal for that. useEchoScanner.ts calls the shared worker's `matchSet`
 * (narrowed to just that echo's 2-3 real candidates) for this, which is a
 * fundamentally easier, more forgiving comparison than picking correctly
 * out of all 30 sets blind — and it's the same narrowed-comparison
 * function (`compareImages`, not `matchSetFirst`'s bucketed/heuristic
 * scoring) the Discord-bot flow already relies on for its own multi-set
 * disambiguation. Full-pool set-icon matching (`matchSetFirst`) is kept
 * only as a last-resort fallback for when name+cost matching can't
 * confidently resolve an echo at all (badly garbled name OCR) — the old
 * primary path, still exercised, just no longer trusted first.
 */
import { mainEchoesData, getEchoData, getCostByClass, type Echo } from "../echoes/index";
import { statsTable, subStatsTable, verboseStatLabelMap, flatBonusesByRankByType } from "../echoes/stats";
import { getSubstatType, getSubstatValue } from "../echoes/parsedEchoMapping";
import { levenshteinSimilarity } from "./levenshtein";
import type { FieldConfidence, OcrLine, ParsedEchoSlot, ParsedSubstat, SubstatSource } from "./types";

export const NAME_MATCH_THRESHOLD = 0.68;
/** Loose sanity floor for the "set already narrowed to one echo" case — just enough to catch a set icon that was clearly misread, not to require a strong text match. */
const NAME_SANITY_THRESHOLD = 0.4;
/** How many substats a max-level echo has — the app doesn't track echo level, so every scanned echo is assumed to be at this many. */
const EXPECTED_SUBSTAT_COUNT = 5;

type StatRow = { rawLabel: string; rawValue: string };
type ResolvedRow = { label: string; formatted: string; exact: boolean };

/**
 * Lowercases, transliterates accented Latin letters to their base form
 * (é→e, ü→u, …), then strips anything left that isn't alphanumeric.
 *
 * The transliteration step matters: stripping accents outright (dropping
 * "é" instead of collapsing it to "e") silently loses a whole letter from
 * an echo name like "Jué", shrinking its normalized form to "ju" (2 chars)
 * while OCR reading the same glyph as a plain "e" (a common, often-correct
 * simplification for an English-trained model) normalizes to "jue" (3
 * chars) — a spurious mismatch caused entirely by this function being
 * asymmetric, not by OCR actually getting anything wrong. Confirmed via a
 * real "Jué" (4-cost) scan that came back "Unknown echo". Same technique
 * `slugify` already uses in `src/utils/strings.ts`.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // combining diacritical marks
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

const KNOWN_LABEL_WORDS = ["ATK", "DEF", "HP"];

/**
 * verboseStatLabelMap deliberately carries multiple aliases per stat for
 * fuzzy-matching purposes elsewhere (e.g. "Resonance Liberation DMG
 * Bonus", "Resonance Liberation DMG", and "Resonance Liberation" all map
 * to the same canonical key) — useful for normalizeStatLabel's tolerance,
 * but wrong to treat as "this label is complete, stop extending it" in
 * scanStatRows: "Resonance Liberation" alone being a registered key made
 * that check fire before "DMG Bonus" (a real wrapped label's continuation
 * line) was ever consumed, truncating the row. Only the *longest* alias
 * per canonical key — the one WuWa actually displays in full — counts as
 * "complete" here.
 */
const CANONICAL_COMPLETE_LABELS: Set<string> = (() => {
  const longestByCanonicalKey = new Map<string, string>();
  for (const [label, canonicalKey] of Object.entries(verboseStatLabelMap)) {
    const current = longestByCanonicalKey.get(canonicalKey);
    if (!current || label.length > current.length) {
      longestByCanonicalKey.set(canonicalKey, label);
    }
  }
  return new Set(longestByCanonicalKey.values());
})();

function bestKnownLabelMatch(text: string): { label: string; score: number } | null {
  const target = normalize(text);
  if (!target) return null;
  if (verboseStatLabelMap[text]) return { label: text, score: 1 };

  let best: { label: string; score: number } | null = null;
  for (const label of Object.keys(verboseStatLabelMap)) {
    const score = levenshteinSimilarity(target, normalize(label));
    if (!best || score > best.score) {
      best = { label, score };
    }
  }
  return best;
}

/**
 * Matches OCR'd label noise (missing/extra periods, spacing) against the
 * known display labels in verboseStatLabelMap, returning the exact
 * canonical label string mapParsedEchoes expects — or null if nothing is
 * close enough to trust.
 *
 * Tries the *whole* string first, then progressively drops leading words
 * and retries — real footage showed a row's label sometimes carries a
 * garbled prefix, most often OCR misreading the small stat-type icon
 * glyph that used to sit at the start of each row's crop as text (e.g.
 * "QQ HP 957" — layout.ts's stat-row crops now exclude that icon
 * entirely, but this stays robust to whatever noise still gets through)
 * or, in the SUBSTAT_BLOCK fallback path, a neighboring row's crop
 * overlap. The true label is always at the *end*, right before the
 * value, so stripping noise word-by-word from the front recovers it.
 */
export function normalizeStatLabel(rawLabel: string): string | null {
  const words = rawLabel.split(/\s+/).filter(Boolean);
  if (!words.length) return null;

  for (let start = 0; start < words.length; start++) {
    const candidate = words.slice(start).join(" ");
    const best = bestKnownLabelMatch(candidate);
    if (best && best.score >= 0.75) return best.label;
  }
  return null;
}

/** Same tolerance normalizeStatLabel uses, but a yes/no check — used by parseStatRow/splitStatBlock to decide whether a candidate row's label looks real enough to accept, or whether to keep scanning further lines. */
function isPlausibleLabel(rawLabel: string): boolean {
  const trimmed = rawLabel.trim();
  if (KNOWN_LABEL_WORDS.includes(trimmed) || trimmed === "DEF Y") return true;
  return normalizeStatLabel(trimmed) !== null;
}

/** A line that's *only* a value, no label text at all — e.g. a value that landed on its own OCR'd line with nothing else on it. */
const VALUE_ONLY_PATTERN = /^[+-]?\d+(?:\.\d+)?%?$/;
/** A line carrying both a label and a trailing value. */
const LABEL_AND_VALUE_PATTERN = /^(.*?)\s+([+-]?\d+(?:\.\d+)?%?)$/;

/**
 * Scans a crop's OCR'd lines for stat rows, tolerating the label and value
 * landing on the same line, on separate lines, or a multi-line label with
 * the value attached to only one of its lines — accumulating label text
 * from *both* directions around wherever the value actually is, since
 * real footage confirmed more than one shape:
 *  - normal: "Healing Bonus 26.4%" (label + value, one line).
 *  - value-only continuation: "% DEF" / "11.3%" (label on its own line,
 *    the value lands alone on the next).
 *  - wrapped label, value on its first line: "Resonance Liberation 10.9%"
 *    / "DMG Bonus" (the rest of the label continues below with no value
 *    of its own) — this is the game's actual layout for a wrapped label
 *    (value right-aligned to the label's *first* line, not its last), the
 *    opposite of what an earlier version of this function assumed, which
 *    could never recover a wrapped row as a result.
 *
 * A line whose own trailing number *doesn't* belong to the row currently
 * being accumulated (i.e. a second value shows up before the pending
 * label has become plausible) ends that pending attempt — it's someone
 * else's row, most likely OCR garbage that coincidentally looked
 * value-shaped (confirmed from real footage: a crop reading "72 DdIIC
 * ALAC DITO DOIIUS 4.4170" *before* a legitimate "Crit. Rate 6.3%") — and
 * that same line is then reprocessed as a fresh row's start rather than
 * dropped.
 *
 * Returns every row whose accumulated label became plausible
 * (isPlausibleLabel), in order, plus the very first attempted row (even
 * if it never became plausible) as a last-resort fallback for callers
 * that need *something* rather than nothing.
 *
 * Committing a fuzzy (non-exact) match as soon as it crosses the
 * plausibility threshold was a real bug: "Resonance Skill DMG" alone is
 * *already* ~0.77 similar to the real label "Resonance Skill DMG Bonus"
 * (just barely over the 0.75 tolerance meant for OCR typos, not for
 * incomplete prefixes) — so it kept committing the truncated label
 * without ever looking at the next line ("Bonus") that would have
 * completed it. Only an *exact* known-label match short-circuits early
 * now (safe — it can't get more complete than exact); a fuzzy match keeps
 * accumulating through any further non-value lines until it hits a real
 * boundary (a new value line, or the end of input), and only then is
 * plausibility (fuzzy or exact) checked and the row committed or dropped.
 */
function scanStatRows(lines: string[]): { plausible: StatRow[]; firstAttempt: StatRow | null } {
  const plausible: StatRow[] = [];
  let firstAttempt: StatRow | null = null;
  let bufferLabel = "";
  let bufferValue: string | null = null;

  function isExactLabel(label: string): boolean {
    return CANONICAL_COMPLETE_LABELS.has(label.trim());
  }

  function recordAttempt(): void {
    if (bufferValue !== null && !firstAttempt) {
      firstAttempt = { rawLabel: bufferLabel, rawValue: bufferValue };
    }
  }

  function reset(): void {
    bufferLabel = "";
    bufferValue = null;
  }

  /** Boundary reached (a new value line, or end of input) — commit the pending buffer if it's at least fuzzy-plausible, otherwise drop it as noise. */
  function finalizeBuffer(): void {
    if (bufferValue === null) return;
    recordAttempt();
    if (isPlausibleLabel(bufferLabel)) {
      plausible.push({ rawLabel: bufferLabel, rawValue: bufferValue });
    }
    reset();
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const labelAndValue = line.match(LABEL_AND_VALUE_PATTERN);
    const isValueOnly = VALUE_ONLY_PATTERN.test(line);

    if (bufferValue !== null && (labelAndValue || isValueOnly)) {
      // A new value showed up while the pending row's label still hadn't
      // been finalized — it belongs to a different row. Close out the
      // pending one and reprocess this same line as a fresh start.
      finalizeBuffer();
      i--;
      continue;
    }

    if (labelAndValue) {
      bufferLabel = bufferLabel ? `${bufferLabel} ${labelAndValue[1].trim()}` : labelAndValue[1].trim();
      bufferValue = labelAndValue[2].trim();
    } else if (isValueOnly) {
      bufferValue = line;
    } else {
      bufferLabel = bufferLabel ? `${bufferLabel} ${line}` : line;
    }
    recordAttempt();

    if (bufferValue !== null && isExactLabel(bufferLabel)) {
      plausible.push({ rawLabel: bufferLabel, rawValue: bufferValue });
      reset();
    }
  }
  finalizeBuffer(); // trailing buffer at end of input

  return { plausible, firstAttempt };
}

/**
 * Resolves one individually-cropped stat row's OCR text to a {label,
 * value} pair. Mirrors CalculatorEchoParser.vue's per-row crops (5
 * separate substat crops there too) rather than asking tesseract to
 * segment a multi-line block itself.
 *
 * The crop is deliberately taller than one line (see SUBSTAT_ROWS in
 * layout.ts) so a wrapped label still resolves correctly (see
 * scanStatRows' doc comment for the shapes that actually occur), and so
 * it tolerates the row shifting down a bit when an *earlier* row wrapped
 * (the panel reflows, so every row below a wrap sits lower than this
 * crop's fixed position assumes). That overlap has a real cost though: a
 * crop can end up containing a neighboring row's actual text ahead of
 * this row's own content, which scanStatRows also has to tell apart from
 * this row's own (possibly still-accumulating) label.
 *
 * Only the *first* plausible row scanStatRows finds is this row's own —
 * a second one that leaked in from crop overlap is a different row,
 * handled by that row's own crop instead.
 *
 * When a per-row crop still can't recover all 5 substats (most often a
 * wrap having shifted rows below it by an amount this fixed-position crop
 * didn't anticipate), parseEchoCandidate falls back to splitStatBlock
 * against a wider SUBSTAT_BLOCK crop instead of trusting an incomplete
 * per-row result.
 */
export function parseStatRow(rawText: string): StatRow | null {
  const lines = rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const { plausible, firstAttempt } = scanStatRows(lines);
  // Nothing in the crop ever looked like a real label — the first
  // attempted match is still a better answer than nothing (matches prior
  // behavior), just one that'll correctly come back low-confidence downstream.
  return plausible[0] ?? firstAttempt;
}

/**
 * The fallback pass: extracts as many {label, value} rows as it can find
 * from one wide multi-line block (SUBSTAT_BLOCK), used only when the 5
 * individual per-row crops don't add up to all 5 substats. Just
 * scanStatRows' full plausible-rows list — see its doc comment for the
 * label/value shapes this handles.
 */
export function splitStatBlock(rawText: string): StatRow[] {
  const lines = rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return scanStatRows(lines).plausible;
}

/**
 * A wrapped label's continuation line starts closer under its first line
 * than the next row does. Measured top-to-top (descenders like "Energy
 * Regen"'s g stretch a box's bottom, not its top) on real 3x-upscaled
 * column crops, in multiples of a value line's height: continuation
 * ≈ 1.65-1.75x, next row ≈ 2.05x, Echo Skill text below the substats ≥ 3x.
 */
const CONTINUATION_MAX_OFFSET_RATIO = 1.85;

function lineCenter(line: OcrLine): number {
  return (line.y0 + line.y1) / 2;
}

/** Strips OCR noise hugging a value ("10.9%.", ",40", "8.6 %") without touching its digits. */
function cleanValueText(text: string): string {
  return text.replace(/\s+/g, "").replace(/^[^\d+-]+/, "").replace(/[^\d%]+$/, "");
}

/**
 * The primary substat pass: SUBSTAT_LABEL_COLUMN and SUBSTAT_VALUE_COLUMN
 * are OCR'd separately, then each value is paired with the label line at
 * the same height.
 *
 * Values never wrap, so the value column reads one clean line per row. A
 * wrapped label ("Resonance Skill DMG" / "Bonus", "Resonance Liberation" /
 * "DMG Bonus") only adds a line to the label column, and the value lines up
 * with the label's *first* line. So the label line nearest each value's
 * center is that row's label; an unpaired label line sitting just under it
 * is its continuation and gets appended. Pairing by position (rather than
 * list index) means one dropped or garbled line only costs its own row.
 *
 * The columns extend past the last substat into the Echo Skill
 * description, so pairs whose label isn't a plausible stat name are
 * dropped, and a continuation is only appended when it's close below
 * (CONTINUATION_MAX_OFFSET_RATIO) and the merged text reads as one label.
 */
export function parseSubstatColumns(labelLines: OcrLine[], valueLines: OcrLine[]): StatRow[] {
  const values = valueLines
    .map((line) => ({ ...line, text: cleanValueText(line.text) }))
    .filter((line) => VALUE_ONLY_PATTERN.test(line.text))
    .sort((a, b) => a.y0 - b.y0);
  const labels = labelLines.filter((line) => line.text.trim()).sort((a, b) => a.y0 - b.y0);

  const anchors: { value: OcrLine; labelIndex: number }[] = [];
  const anchored = new Set<number>();
  for (const value of values) {
    const tolerance = (value.y1 - value.y0) / 2;
    let bestIndex = -1;
    let bestDistance = Infinity;
    labels.forEach((label, i) => {
      if (anchored.has(i)) return;
      const distance = Math.abs(lineCenter(label) - lineCenter(value));
      if (distance < bestDistance) {
        bestIndex = i;
        bestDistance = distance;
      }
    });
    if (bestIndex < 0 || bestDistance > tolerance) continue;
    anchored.add(bestIndex);
    anchors.push({ value, labelIndex: bestIndex });
  }

  const rows: StatRow[] = [];
  for (const { value, labelIndex } of anchors) {
    let rawLabel = labels[labelIndex].text.trim();
    const next = labels[labelIndex + 1];
    const maxOffset = (value.y1 - value.y0) * CONTINUATION_MAX_OFFSET_RATIO;
    if (next && !anchored.has(labelIndex + 1) && next.y0 - labels[labelIndex].y0 <= maxOffset) {
      // The merged text has to read as one real label on its own —
      // normalizeStatLabel's drop-leading-words tolerance would happily turn
      // "Crit. Rate" + an unpaired "HP" into "HP".
      const merged = `${rawLabel} ${next.text.trim()}`;
      if ((bestKnownLabelMatch(merged)?.score ?? 0) >= 0.75) rawLabel = merged;
    }
    if (isPlausibleLabel(rawLabel)) rows.push({ rawLabel, rawValue: value.text });
  }
  return rows.slice(0, EXPECTED_SUBSTAT_COUNT);
}

/**
 * NAME_BLOCK is a single line by design (WuWa shrinks the font for a long
 * name rather than wrapping it) and contains nothing else — unlike the
 * old multi-purpose header crop (name + level + cost), there's no other
 * line shape to distinguish this from, so any non-blank text here is the
 * name. No minimum-letter-count gate: that check (inherited from the old
 * header parser, which used it to tell a name line apart from a "+25" or
 * "COST 4" line) wrongly rejected legitimately short/accented names like
 * "Jué" (only 2 plain-ASCII letters).
 */
export function parseNameText(rawText: string): string | null {
  const line = rawText
    .split("\n")
    .map((l) => l.trim())
    .find(Boolean);
  if (!line) return null;
  const cleaned = line.replace(/[|_]/g, "").trim();
  // Require at least one letter (any script) so pure OCR noise ("12",
  // stray punctuation) doesn't get treated as a name — but nothing
  // stricter than that, unlike the old 3-plain-ASCII-letter gate.
  return /\p{L}/u.test(cleaned) ? cleaned : null;
}

export type EchoNameMatch = { key: string; name: string; similarity: number };

function bestNameMatch(rawName: string, pool: Echo[]): EchoNameMatch | null {
  const target = normalize(rawName);
  if (!target) return null;
  let best: EchoNameMatch | null = null;
  for (const echo of pool) {
    const similarity = levenshteinSimilarity(target, normalize(echo.name));
    if (!best || similarity > best.similarity) {
      best = { key: echo.key, name: echo.name, similarity };
    }
  }
  return best;
}

/** Kept as the fallback path for when set-based narrowing (see resolveEchoBySet) comes up empty — matches by name against every echo, unfiltered. */
export function matchEchoName(rawName: string): EchoNameMatch | null {
  return bestNameMatch(rawName, Object.values(mainEchoesData ?? {}));
}

/**
 * The fixed secondary stat's value is entirely determined by cost at max
 * level (assumed always — see this file's top doc comment): 2280 (HP) for
 * cost-1, 100 (ATK) for cost-3, 150 (ATK) for cost-4, straight from
 * flatBonusesByRankByType's own rank-5 entries. That identifies cost
 * before the specific echo is even known or any image matching happens.
 *
 * Used only to *narrow* resolveEchoByNameAndCost's candidate pool, never
 * as a hard filter — a bad OCR read here (or a value that doesn't land
 * near any of the three) just means no narrowing happens, not a wrong
 * answer, since that function always retries unfiltered before giving up.
 */
export function inferCostFromSecondaryStat(secondaryStatText: string): number | null {
  const row = parseStatRow(secondaryStatText);
  if (!row) return null;
  const value = getSubstatValue(row.rawValue);
  if (value === null) return null;
  // The three real values (2280/100/150) are tens apart at minimum, so
  // even a generous tolerance here can't confuse one for another — this
  // only needs to absorb a minor OCR digit misread.
  const TOLERANCE = 3;
  for (const [costKey, byRank] of Object.entries(flatBonusesByRankByType)) {
    const maxRankValue = byRank[5];
    if (maxRankValue !== undefined && Math.abs(maxRankValue - value) <= TOLERANCE) {
      return Number(costKey);
    }
  }
  return null;
}

export type EchoIdentityResult = {
  echo: string | null;
  confidence: FieldConfidence;
  /** The resolved echo's own possible sets — 0 means no echo resolved, 1 means unambiguous (the caller needs no image matching at all), >1 means the caller should run a *narrowed* image match (just these candidates) to disambiguate. */
  candidateSets: string[];
};

/**
 * Primary identification path — see this file's top doc comment for why
 * name text now comes before set-icon image matching. Cost-narrows the
 * candidate pool when the secondary stat's value confidently infers one,
 * but always falls back to the full unfiltered pool if that narrowed
 * search doesn't turn up a confident match, so a bad cost inference can
 * only cost some discriminating power, never silently exclude the right
 * answer.
 */
export function resolveEchoByNameAndCost(nameText: string, secondaryStatText: string): EchoIdentityResult {
  const name = parseNameText(nameText);
  if (!name) return { echo: null, confidence: "low", candidateSets: [] };

  const all = Object.values(mainEchoesData ?? {});
  const inferredCost = inferCostFromSecondaryStat(secondaryStatText);

  if (inferredCost !== null) {
    const narrowedPool = all.filter((echo) => getCostByClass(echo.class) === inferredCost);
    const narrowedMatch = bestNameMatch(name, narrowedPool);
    if (narrowedMatch && narrowedMatch.similarity >= NAME_MATCH_THRESHOLD) {
      const echoData = getEchoData(narrowedMatch.key);
      return { echo: narrowedMatch.key, confidence: "high", candidateSets: echoData.sets ?? [] };
    }
  }

  const fullMatch = bestNameMatch(name, all);
  if (fullMatch && fullMatch.similarity >= NAME_MATCH_THRESHOLD) {
    const echoData = getEchoData(fullMatch.key);
    return { echo: fullMatch.key, confidence: "high", candidateSets: echoData.sets ?? [] };
  }

  return { echo: null, confidence: "low", candidateSets: [] };
}

function narrowEchoCandidates(matchedSet: string | null): Echo[] {
  const all = Object.values(mainEchoesData ?? {});
  if (!matchedSet) return all;
  return all.filter((echo) => echo.sets?.includes(matchedSet));
}

/**
 * The old set-first identification path — narrow by the matched set,
 * break ties by name text within that narrowed pool. Kept as
 * parseEchoCandidate's fallback for when resolveEchoByNameAndCost can't
 * confidently resolve an echo at all (badly garbled name OCR): useEchoScanner.ts
 * then falls back to full-pool set-icon image matching (matchSetFirst) to
 * get *some* matchedSet, and this narrows/confirms an echo from it exactly
 * as it always did. See this module's top doc comment for why this is no
 * longer the primary path.
 */
function resolveEchoBySet(
  headerName: string | null,
  matchedSet: string | null,
): { echo: string | null; confidence: FieldConfidence } {
  const pool = narrowEchoCandidates(matchedSet);

  if (matchedSet && pool.length === 1) {
    const only = pool[0];
    const similarity = headerName ? levenshteinSimilarity(normalize(headerName), normalize(only.name)) : null;
    // No name text to sanity-check against, or it's at least a loose match: trust the set narrowing.
    const trusted = similarity === null || similarity >= NAME_SANITY_THRESHOLD;
    return { echo: only.key, confidence: trusted ? "high" : "low" };
  }

  if (matchedSet && pool.length > 1) {
    const match = headerName ? bestNameMatch(headerName, pool) : null;
    if (match && match.similarity >= NAME_MATCH_THRESHOLD) {
      return { echo: match.key, confidence: "high" };
    }
    return { echo: null, confidence: "low" };
  }

  // No set match at all — the set read was probably wrong. Fall back to
  // matching by name against every echo.
  const fallback = headerName ? matchEchoName(headerName) : null;
  if (fallback && fallback.similarity >= NAME_MATCH_THRESHOLD) {
    return { echo: fallback.key, confidence: "high" };
  }
  return { echo: null, confidence: "low" };
}

/**
 * Snaps a raw OCR'd value to the nearest legal roll for its stat.
 *
 * `exact` reflects whether the *number* OCR read already equalled a legal
 * roll (diff 0), not whether the formatted string round-trips unchanged —
 * comparing formatted strings was a real bug: OCR reading "21.0%" for a
 * Crit DMG roll of 21 (a legal, correct roll — subStatsTable.CritDMG ends
 * at 21) reformats to "21%", which is a different STRING from "21.0%" even
 * though it's the same, exactly-correct NUMBER. That was flagging
 * objectively-correct values as low-confidence "questionable" — the value
 * was always right, only the trailing ".0" changed. Confirmed via a real
 * "Crit. DMG 21%" scan reported as looking questionable despite being correct.
 */
function resolveSubstatValue(rawLabel: string, rawValue: string): { formatted: string; exact: boolean } {
  const canonicalKey = getSubstatType({ subStat: rawLabel, subStatValue: rawValue });
  const numericValue = getSubstatValue(rawValue);
  if (!canonicalKey || numericValue === null) {
    return { formatted: rawValue, exact: false };
  }

  const legalRolls = subStatsTable[canonicalKey];
  if (!legalRolls?.length) {
    return { formatted: rawValue, exact: false };
  }

  let nearest = legalRolls[0];
  let smallestDiff = Math.abs(legalRolls[0] - numericValue);
  for (const roll of legalRolls) {
    const diff = Math.abs(roll - numericValue);
    if (diff < smallestDiff) {
      nearest = roll;
      smallestDiff = diff;
    }
  }
  const formatted = rawValue.includes("%") ? `${nearest}%` : `${nearest}`;
  return { formatted, exact: smallestDiff < 1e-9 };
}

function resolveRow(row: StatRow): ResolvedRow {
  const label = normalizeStatLabel(row.rawLabel) ?? row.rawLabel;
  return { label, ...resolveSubstatValue(label, row.rawValue) };
}

export type ParseCandidateResult = {
  slot: ParsedEchoSlot;
  needsMainStatSelection: boolean;
  /** Which substat pass produced the result — see parseEchoCandidate. */
  substatSource: SubstatSource;
  confidence: {
    name: FieldConfidence;
    cost: FieldConfidence;
    mainStat: FieldConfidence;
    set: FieldConfidence;
    substats: FieldConfidence[];
  };
  /** Raw OCR text, kept only for surfacing in the review UI's diagnostics when something's low-confidence — not used for parsing itself. */
  rawHeaderText: string;
  rawStatsText: string;
};

export function parseEchoCandidate(input: {
  nameText: string;
  mainStatText: string;
  secondaryStatText: string;
  /** SUBSTAT_LABEL_COLUMN / SUBSTAT_VALUE_COLUMN OCR lines — the primary substat pass (parseSubstatColumns). */
  substatLabelLines?: OcrLine[];
  substatValueLines?: OcrLine[];
  /** Fallback: the 5 per-row SUBSTAT_ROWS crops' text, in panel order. Only OCR'd when the column pass comes up short. */
  substatTexts?: string[];
  /** Fallback: SUBSTAT_BLOCK's OCR text, parsed with splitStatBlock. Only OCR'd when the column pass comes up short. */
  substatBlockText?: string;
  /**
   * The final resolved set (single-set lookup, narrowed image match, or
   * full-pool fallback match — see useEchoScanner.ts's resolveEchoIdentity),
   * always used as this candidate's set output regardless of how it was
   * obtained.
   */
  matchedSet: string | null;
  /**
   * Already resolved by resolveEchoByNameAndCost (the primary, name-first
   * path) — when given, trusted directly instead of re-deriving the echo
   * from matchedSet's pool, only cross-checked against matchedSet for a
   * confidence flag. Omitted when that path couldn't confidently resolve
   * an echo at all, in which case the old set-first fallback (resolveEchoBySet)
   * runs exactly as it always did.
   */
  preResolvedEcho?: string | null;
}): ParseCandidateResult {
  const name = parseNameText(input.nameText);
  let resolvedEcho: string | null;
  let nameConfidence: FieldConfidence;
  if (input.preResolvedEcho) {
    const echoData = getEchoData(input.preResolvedEcho);
    const sets = echoData.sets ?? [];
    // Trust it fully unless we do have a resolved set to check against and
    // it disagrees with this echo's own known sets — that combination
    // means the narrowed image match (or the caller's matchedSet) picked
    // something that isn't even a legal set for this echo, worth flagging.
    const trusted = !input.matchedSet || sets.length === 0 || sets.includes(input.matchedSet);
    resolvedEcho = input.preResolvedEcho;
    nameConfidence = trusted ? "high" : "low";
  } else {
    ({ echo: resolvedEcho, confidence: nameConfidence } = resolveEchoBySet(name, input.matchedSet));
  }
  const cost = resolvedEcho ? getCostByClass(getEchoData(resolvedEcho).class) : null;

  const mainRow = parseStatRow(input.mainStatText);
  const mainStatLabel = mainRow ? (normalizeStatLabel(mainRow.rawLabel) ?? mainRow.rawLabel) : "";
  const mainStatLegal = Boolean(
    cost && mainStatLabel && statsTable[cost]?.[verboseStatLabelMap[mainStatLabel] ?? ""],
  );

  // Column pass first. If it comes up short, whichever fallback pass
  // recovers the most rows replaces it outright — two partial views aren't
  // merged position by position. Ties keep the earlier pass.
  const passes: { source: SubstatSource; rows: StatRow[] }[] = [
    { source: "columns", rows: parseSubstatColumns(input.substatLabelLines ?? [], input.substatValueLines ?? []) },
  ];
  if (passes[0].rows.length < EXPECTED_SUBSTAT_COUNT) {
    if (input.substatTexts) {
      const perRow = input.substatTexts.map(parseStatRow);
      passes.push({ source: "rows", rows: perRow.filter((row): row is StatRow => row !== null) });
    }
    if (input.substatBlockText) {
      passes.push({ source: "block", rows: splitStatBlock(input.substatBlockText).slice(0, EXPECTED_SUBSTAT_COUNT) });
    }
  }
  const best = passes.reduce((a, b) => (b.rows.length > a.rows.length ? b : a));
  const substatSource = best.source;
  const resolvedSubstats: (ResolvedRow | null)[] = best.rows.map(resolveRow);
  while (resolvedSubstats.length < EXPECTED_SUBSTAT_COUNT) resolvedSubstats.push(null);

  const substats: ParsedSubstat[] = resolvedSubstats.map((resolved) =>
    resolved ? { subStat: resolved.label, subStatValue: resolved.formatted } : { subStat: "", subStatValue: "" },
  );

  const substatConfidence: FieldConfidence[] = resolvedSubstats.map((resolved) => {
    if (!resolved) return "low"; // max level is assumed for every echo now, so a missing slot is a miss, not a legitimately-absent row
    const known = Boolean(verboseStatLabelMap[resolved.label] || ["ATK", "DEF", "HP"].includes(resolved.label));
    return known && resolved.exact ? "high" : "low";
  });

  const needsMainStatSelection = !mainRow || !mainStatLabel;
  const costConfidence: FieldConfidence = resolvedEcho ? nameConfidence : "low";

  return {
    slot: {
      cost,
      mainStatLabel,
      substats,
      echo: resolvedEcho,
      set: input.matchedSet,
    },
    needsMainStatSelection,
    substatSource,
    confidence: {
      name: resolvedEcho ? nameConfidence : "low",
      cost: costConfidence,
      mainStat: mainStatLegal ? "high" : "low",
      set: input.matchedSet ? "high" : "low",
      substats: substatConfidence,
    },
    rawHeaderText: input.nameText,
    rawStatsText: [
      input.mainStatText,
      input.secondaryStatText,
      (input.substatLabelLines ?? []).map((line) => line.text).join("\n"),
      (input.substatValueLines ?? []).map((line) => line.text).join("\n"),
      ...(input.substatTexts ?? []),
    ].join("\n---\n"),
  };
}
