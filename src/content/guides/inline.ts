export type InlineToken =
  | { kind: "text"; text: string }
  | { kind: "bold"; text: string }
  | { kind: "link"; text: string; to: string };

const INLINE_PATTERN = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;

/**
 * Splits guide text into tokens the renderer turns into elements, so guide copy never
 * needs v-html.
 */
export function parseInline(source: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let last = 0;
  for (const match of source.matchAll(INLINE_PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) tokens.push({ kind: "text", text: source.slice(last, index) });
    if (match[1] !== undefined) tokens.push({ kind: "bold", text: match[1] });
    else tokens.push({ kind: "link", text: match[2], to: match[3] });
    last = index + match[0].length;
  }
  if (last < source.length) tokens.push({ kind: "text", text: source.slice(last) });
  return tokens;
}

/** The text a reader sees, for search. */
export function inlineToPlainText(source: string): string {
  return parseInline(source)
    .map((token) => token.text)
    .join("");
}
