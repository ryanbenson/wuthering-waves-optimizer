import {
  extractSequenceNumber,
  findTopLevelEntries,
  parseBracketedValueEnd,
  parsePropertyBlocks,
} from "./extractCharacterEntries.js";

export interface PatchResult {
  content: string;
  /** True when at least one icon property was inserted or updated. */
  changed: boolean;
  notices: string[];
}

interface Edit {
  start: number;
  end: number;
  replacement: string;
}

function applyEdits(content: string, edits: Edit[]): string {
  // Apply from the end of the file backward so earlier offsets stay valid.
  const sorted = [...edits].sort((a, b) => b.start - a.start);
  let result = content;
  for (const edit of sorted) {
    result = result.slice(0, edit.start) + edit.replacement + result.slice(edit.end);
  }
  return result;
}

/**
 * A sibling property's leading whitespace, to match when inserting a new
 * property at the same indentation level. Deliberately sourced from the
 * *first* property in the object rather than whichever one we're anchoring
 * the insertion to: parsePropertyBlocks only captures a property's leading
 * `\n    ` when nothing before it consumed that whitespace already, which a
 * skipped trailing `// comment` on the *previous* property does — so an
 * arbitrary anchor's own text isn't reliably prefixed with it, but the
 * first property in the object never has anything before it to interfere.
 */
// Also used to recover a property's own leading whitespace when replacing it
// in place: its `start`/`end` range includes that leading `\n    ` (per
// parsePropertyBlocks), so dropping it from the replacement text merges the
// new value onto the end of the previous property's line instead of keeping
// it on its own line.
function getIndent(property: { text: string }): string {
  const match = /^\s*/.exec(property.text);
  return match ? match[0] : "\n    ";
}

/**
 * When inserting a brand-new property right after an anchor property, a
 * same-line trailing `// comment` on the anchor (not part of its parsed
 * range) would otherwise end up stranded after the inserted lines instead
 * of staying attached to the anchor. Advances past it so insertions land on
 * their own line.
 */
function skipTrailingLineComment(content: string, index: number): number {
  let cursor = index;
  while (content[cursor] === " " || content[cursor] === "\t") {
    cursor += 1;
  }
  if (content[cursor] === "/" && content[cursor + 1] === "/") {
    while (cursor < content.length && content[cursor] !== "\n") {
      cursor += 1;
    }
  }
  return cursor;
}

function extractQuotedPropertyValue(propertyText: string): string | null {
  const colonIndex = propertyText.indexOf(":");
  if (colonIndex === -1) {
    return null;
  }

  let index = colonIndex + 1;
  while (index < propertyText.length && /\s/.test(propertyText[index]!)) {
    index += 1;
  }

  const quote = propertyText[index];
  if (quote !== "`" && quote !== '"' && quote !== "'") {
    return null;
  }

  for (let cursor = index + 1; cursor < propertyText.length; cursor += 1) {
    const character = propertyText[cursor]!;
    if (character === "\\") {
      cursor += 1;
      continue;
    }
    if (character === quote) {
      return propertyText.slice(index + 1, cursor);
    }
  }

  return null;
}

/**
 * Inserts or updates an `icon` property (backtick-quoted, matching this
 * file's `key`/`name`/`details` style) on every top-level entry of an
 * `export const X = [...]` array whose key resolves — via
 * extractSequenceNumber — to a sequence number present in `iconBySequence`.
 * A single sequence number can match multiple entries (some characters
 * intentionally split one resonance chain into several entries for buff
 * implementation reasons), and every match gets the icon.
 */
export function patchResonanceChainIcons(
  content: string,
  iconBySequence: Map<number, string>,
): PatchResult {
  const entries = findTopLevelEntries(content);
  const edits: Edit[] = [];
  const notices: string[] = [];
  let matchedAnySequence = false;

  for (const { start, end } of entries) {
    const properties = parsePropertyBlocks(content, start + 1, end - 1);
    const keyProperty = properties.find((property) => property.name === "key");
    if (!keyProperty) {
      continue;
    }

    const key = extractQuotedPropertyValue(keyProperty.text);
    if (!key) {
      continue;
    }

    const sequenceNumber = extractSequenceNumber(key);
    if (sequenceNumber === null) {
      continue;
    }

    const icon = iconBySequence.get(sequenceNumber);
    if (!icon) {
      notices.push(
        `resonanceChains.ts: no NodeIcon from the API for sequence ${sequenceNumber} (entry "${key}").`,
      );
      continue;
    }
    matchedAnySequence = true;

    const iconProperty = properties.find((property) => property.name === "icon");
    if (iconProperty) {
      if (extractQuotedPropertyValue(iconProperty.text) === icon) {
        continue;
      }
      edits.push({
        start: iconProperty.start,
        end: iconProperty.end,
        replacement: `${getIndent(iconProperty)}icon: \`${icon}\`,`,
      });
      continue;
    }

    const detailsProperty = properties.find((property) => property.name === "details");
    const anchorProperty = detailsProperty ?? keyProperty;
    const indent = getIndent(properties[0]!);
    const insertAt = skipTrailingLineComment(content, anchorProperty.end);
    edits.push({
      start: insertAt,
      end: insertAt,
      replacement: `${indent}icon: \`${icon}\`,`,
    });
  }

  for (const sequenceNumber of iconBySequence.keys()) {
    if (
      !entries.some(({ start, end }) => {
        const properties = parsePropertyBlocks(content, start + 1, end - 1);
        const keyProperty = properties.find((property) => property.name === "key");
        const key = keyProperty ? extractQuotedPropertyValue(keyProperty.text) : null;
        return key !== null && extractSequenceNumber(key) === sequenceNumber;
      })
    ) {
      notices.push(
        `resonanceChains.ts: no local entry found for sequence ${sequenceNumber} from the API.`,
      );
    }
  }

  if (!matchedAnySequence && iconBySequence.size > 0) {
    notices.push(
      "resonanceChains.ts: could not match any local entries to API sequence numbers.",
    );
  }

  return {
    content: edits.length > 0 ? applyEdits(content, edits) : content,
    changed: edits.length > 0,
    notices,
  };
}

function findTopLevelObjectBody(
  content: string,
): { start: number; end: number } | null {
  const exportMatch = content.match(/export const \w+ = \{/);
  if (!exportMatch || exportMatch.index === undefined) {
    return null;
  }

  const braceStart = exportMatch.index + exportMatch[0].length - 1;
  const end = parseBracketedValueEnd(content, braceStart, "{");
  if (end === null) {
    return null;
  }

  return { start: braceStart, end };
}

/**
 * Inserts or updates a top-level `icon` property (double-quoted, matching
 * this file's `name`/`description` style) on the single
 * `export const X = { name, description, attacks: [...] }` object.
 */
export function patchSkillAttackIcon(
  content: string,
  icon: string,
): PatchResult {
  const body = findTopLevelObjectBody(content);
  if (!body) {
    return {
      content,
      changed: false,
      notices: ["Could not find a top-level export object to patch."],
    };
  }

  const properties = parsePropertyBlocks(content, body.start + 1, body.end - 1);
  const iconProperty = properties.find((property) => property.name === "icon");

  if (iconProperty) {
    if (extractQuotedPropertyValue(iconProperty.text) === icon) {
      return { content, changed: false, notices: [] };
    }
    const edit: Edit = {
      start: iconProperty.start,
      end: iconProperty.end,
      replacement: `${getIndent(iconProperty)}icon: ${JSON.stringify(icon)},`,
    };
    return { content: applyEdits(content, [edit]), changed: true, notices: [] };
  }

  const descriptionProperty = properties.find(
    (property) => property.name === "description",
  );
  const nameProperty = properties.find((property) => property.name === "name");
  const anchorProperty = descriptionProperty ?? nameProperty;
  if (!anchorProperty) {
    return {
      content,
      changed: false,
      notices: ["Could not find name/description property to anchor the new icon property."],
    };
  }

  const indent = getIndent(properties[0]!);
  const insertAt = skipTrailingLineComment(content, anchorProperty.end);
  const edit: Edit = {
    start: insertAt,
    end: insertAt,
    replacement: `${indent}icon: ${JSON.stringify(icon)},`,
  };

  return { content: applyEdits(content, [edit]), changed: true, notices: [] };
}

/**
 * Inserts or updates `image` and `inherentSkillIcons` on the object literal
 * returned from `getCharacterBasicInfo()` in basic.ts.
 */
export function patchBasicFileFields(
  content: string,
  fields: { image?: string; inherentSkillIcons?: string[] },
): PatchResult {
  const returnMatch = content.match(/return \{/);
  if (!returnMatch || returnMatch.index === undefined) {
    return {
      content,
      changed: false,
      notices: ["basic.ts: could not find `return {` to patch."],
    };
  }

  const braceStart = returnMatch.index + returnMatch[0].length - 1;
  const bodyEnd = parseBracketedValueEnd(content, braceStart, "{");
  if (bodyEnd === null) {
    return {
      content,
      changed: false,
      notices: ["basic.ts: could not parse the returned object body."],
    };
  }

  const properties = parsePropertyBlocks(content, braceStart + 1, bodyEnd - 1);
  if (properties.length === 0) {
    return {
      content,
      changed: false,
      notices: ["basic.ts: returned object has no properties to anchor on."],
    };
  }

  const edits: Edit[] = [];
  const freshInsertLines: string[] = [];
  const lastProperty = properties[properties.length - 1]!;
  const indent = getIndent(properties[0]!);

  if (fields.image) {
    const imageProperty = properties.find((property) => property.name === "image");
    if (imageProperty) {
      if (extractQuotedPropertyValue(imageProperty.text) !== fields.image) {
        edits.push({
          start: imageProperty.start,
          end: imageProperty.end,
          replacement: `${getIndent(imageProperty)}image: ${JSON.stringify(fields.image)},`,
        });
      }
    } else {
      freshInsertLines.push(`${indent}image: ${JSON.stringify(fields.image)},`);
    }
  }

  if (fields.inherentSkillIcons && fields.inherentSkillIcons.length > 0) {
    const iconsProperty = properties.find(
      (property) => property.name === "inherentSkillIcons",
    );
    const serialized = JSON.stringify(fields.inherentSkillIcons);
    if (iconsProperty) {
      const currentArrayText = iconsProperty.text
        .slice(iconsProperty.text.indexOf("["), iconsProperty.text.lastIndexOf("]") + 1)
        .replace(/\s+/g, "");
      if (currentArrayText !== serialized) {
        edits.push({
          start: iconsProperty.start,
          end: iconsProperty.end,
          replacement: `${getIndent(iconsProperty)}inherentSkillIcons: ${serialized},`,
        });
      }
    } else {
      freshInsertLines.push(`${indent}inherentSkillIcons: ${serialized},`);
    }
  }

  if (freshInsertLines.length > 0) {
    const insertAt = skipTrailingLineComment(content, lastProperty.end);
    edits.push({
      start: insertAt,
      end: insertAt,
      replacement: freshInsertLines.join(""),
    });
  }

  return {
    content: edits.length > 0 ? applyEdits(content, edits) : content,
    changed: edits.length > 0,
    notices: [],
  };
}
