/** Classic edit-distance, used to fuzzy-match OCR'd echo names against the known echo list. */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let previousRow = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) previousRow[j] = j;

  for (let i = 0; i < a.length; i++) {
    const currentRow = [i + 1];
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      currentRow.push(
        Math.min(
          currentRow[j] + 1, // insertion
          previousRow[j + 1] + 1, // deletion
          previousRow[j] + cost, // substitution
        ),
      );
    }
    previousRow = currentRow;
  }
  return previousRow[b.length];
}

/** 1 = identical, 0 = completely different. */
export function levenshteinSimilarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshteinDistance(a, b) / maxLen;
}

/**
 * Like levenshteinSimilarity, but lets trailing characters of `text` be
 * dropped at a discount (`dropWeight` per char instead of a full edit).
 * Scores `name` against every prefix of `text` and keeps the best.
 *
 * Built for OCR'd echo names: the name crop is a fixed width sized for the
 * longest names, so a short name ("Dreamless") leaves background art in the
 * rest of the crop that tesseract reads as junk ("Dreamless LQ Va A").
 * Plain similarity charges every junk char as a full edit, so the same echo
 * passed or failed depending on how many junk chars a frame happened to
 * produce. Dropped chars still cost *something* so that a slightly garbled
 * longer name ("Chop Chop: Headlss") keeps beating its own prefix echo
 * ("Chop Chop") rather than tying it at a perfect score.
 *
 * A single DP pass over `text` (outer) × `name` (inner) yields the edit
 * distance of `name` against each prefix of `text` as the last cell of
 * each row, so this costs the same as one levenshteinDistance call.
 */
export function prefixTolerantSimilarity(text: string, name: string, dropWeight: number): number {
  if (text.length === 0 || name.length === 0) return levenshteinSimilarity(text, name);

  let previousRow = new Array(name.length + 1);
  for (let j = 0; j <= name.length; j++) previousRow[j] = j;
  // Prefix length 0 (drop everything) is never useful, so start scoring at 1.
  let best = 0;

  for (let i = 0; i < text.length; i++) {
    const currentRow = [i + 1];
    for (let j = 0; j < name.length; j++) {
      const cost = text[i] === name[j] ? 0 : 1;
      currentRow.push(Math.min(currentRow[j] + 1, previousRow[j + 1] + 1, previousRow[j] + cost));
    }
    previousRow = currentRow;

    const prefixLength = i + 1;
    const dropCost = dropWeight * (text.length - prefixLength);
    const distance = currentRow[name.length];
    const score = 1 - (distance + dropCost) / (Math.max(prefixLength, name.length) + dropCost);
    if (score > best) best = score;
  }
  return best;
}
