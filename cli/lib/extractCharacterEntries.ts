import fs from "fs";

export interface ParsedCharacterEntry {
  key: string;
  preservedProperties: string;
  rawEntry: string;
}

export interface ParsedCharacterFile {
  entriesInOrder: ParsedCharacterEntry[];
  entriesByKey: Map<string, ParsedCharacterEntry>;
}

const PRESERVED_PROPERTY_SKIP = new Set(["key", "name", "details"]);

interface ParsedProperty {
  name: string;
  text: string;
}

function skipLineComment(content: string, index: number): number {
  let cursor = index + 2;
  while (cursor < content.length && content[cursor] !== "\n") {
    cursor += 1;
  }
  return cursor;
}

function skipBlockComment(content: string, index: number): number {
  let cursor = index + 2;
  while (cursor < content.length - 1) {
    if (content[cursor] === "*" && content[cursor + 1] === "/") {
      return cursor + 2;
    }
    cursor += 1;
  }
  return content.length;
}

function skipCommentsAndWhitespace(content: string, index: number): number {
  let cursor = index;

  while (cursor < content.length) {
    if (/\s/.test(content[cursor]!)) {
      cursor += 1;
      continue;
    }

    if (content[cursor] === "/" && content[cursor + 1] === "/") {
      cursor = skipLineComment(content, cursor);
      continue;
    }

    if (content[cursor] === "/" && content[cursor + 1] === "*") {
      cursor = skipBlockComment(content, cursor);
      continue;
    }

    break;
  }

  return cursor;
}

function parseQuotedValueEnd(content: string, start: number): number | null {
  const quote = content[start];
  if (quote !== "`" && quote !== '"' && quote !== "'") {
    return null;
  }

  for (let index = start + 1; index < content.length; index += 1) {
    const character = content[index]!;

    if (character === "\\") {
      index += 1;
      continue;
    }

    if (character === quote) {
      return index + 1;
    }
  }

  return null;
}

function parseBracketedValueEnd(
  content: string,
  start: number,
  openChar: "{" | "[",
): number | null {
  const closeChar = openChar === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  let stringChar = "";

  for (let index = start; index < content.length; index += 1) {
    const character = content[index]!;

    if (!inString) {
      if (character === "/" && content[index + 1] === "/") {
        index = skipLineComment(content, index) - 1;
        continue;
      }

      if (character === "/" && content[index + 1] === "*") {
        index = skipBlockComment(content, index) - 1;
        continue;
      }
    }

    if (inString) {
      if (character === "\\") {
        index += 1;
        continue;
      }

      if (character === stringChar) {
        inString = false;
      }

      continue;
    }

    if (character === '"' || character === "'" || character === "`") {
      inString = true;
      stringChar = character;
      continue;
    }

    if (character === openChar) {
      depth += 1;
    }

    if (character === closeChar) {
      depth -= 1;
      if (depth === 0) {
        return index + 1;
      }
    }
  }

  return null;
}

function parseValueEnd(content: string, start: number): number | null {
  const valueStart = skipCommentsAndWhitespace(content, start);
  if (valueStart >= content.length) {
    return null;
  }

  const character = content[valueStart]!;

  if (character === "`" || character === '"' || character === "'") {
    return parseQuotedValueEnd(content, valueStart);
  }

  if (character === "{" || character === "[") {
    return parseBracketedValueEnd(content, valueStart, character);
  }

  const match = content.slice(valueStart).match(/^[^\s,}]+/);
  if (!match) {
    return null;
  }

  return valueStart + match[0].length;
}

function parsePropertyBlocks(
  content: string,
  bodyStart: number,
  bodyEnd: number,
): ParsedProperty[] {
  const properties: ParsedProperty[] = [];
  let index = bodyStart;

  while (index < bodyEnd) {
    index = skipCommentsAndWhitespace(content, index);
    if (index >= bodyEnd) {
      break;
    }

    if (content[index] === "}") {
      break;
    }

    const nameMatch = /^(\w+):/.exec(content.slice(index));
    if (!nameMatch) {
      break;
    }

    const propertyStart = index;
    const valueStart = index + nameMatch[0].length;
    const valueEnd = parseValueEnd(content, valueStart);
    if (valueEnd === null) {
      break;
    }

    let propertyEnd = valueEnd;
    propertyEnd = skipCommentsAndWhitespace(content, propertyEnd);
    if (content[propertyEnd] === ",") {
      propertyEnd += 1;
    }

    properties.push({
      name: nameMatch[1]!,
      text: content.slice(propertyStart, propertyEnd),
    });

    index = propertyEnd;
  }

  return properties;
}

function findTopLevelEntries(
  content: string,
): Array<{ start: number; end: number }> {
  const exportMatch = content.match(/export const \w+ = \[/);
  if (!exportMatch || exportMatch.index === undefined) {
    return [];
  }

  const entries: Array<{ start: number; end: number }> = [];
  let arrayDepth = 0;
  let objectDepth = 0;
  let entryStart: number | null = null;
  let inString = false;
  let stringChar = "";

  const scanStart = exportMatch.index + exportMatch[0].length - 1;

  for (let index = scanStart; index < content.length; index += 1) {
    const character = content[index]!;

    if (!inString) {
      if (character === "/" && content[index + 1] === "/") {
        index = skipLineComment(content, index);
        continue;
      }

      if (character === "/" && content[index + 1] === "*") {
        index = skipBlockComment(content, index);
        continue;
      }
    }

    if (inString) {
      if (character === "\\") {
        index += 1;
        continue;
      }

      if (character === stringChar) {
        inString = false;
      }

      continue;
    }

    if (character === '"' || character === "'" || character === "`") {
      inString = true;
      stringChar = character;
      continue;
    }

    if (character === "[") {
      arrayDepth += 1;
      continue;
    }

    if (character === "]") {
      arrayDepth -= 1;
      continue;
    }

    if (character === "{") {
      if (arrayDepth === 1 && objectDepth === 0) {
        entryStart = index;
      }
      objectDepth += 1;
      continue;
    }

    if (character === "}") {
      objectDepth -= 1;
      if (arrayDepth === 1 && objectDepth === 0 && entryStart !== null) {
        entries.push({ start: entryStart, end: index + 1 });
        entryStart = null;
      }
    }
  }

  return entries;
}

function parseEntryKey(
  content: string,
  entryStart: number,
  entryEnd: number,
): string | null {
  const properties = parsePropertyBlocks(content, entryStart + 1, entryEnd - 1);
  const keyProperty = properties.find((property) => property.name === "key");
  if (!keyProperty) {
    return null;
  }

  const colonIndex = keyProperty.text.indexOf(":");
  const valueStart = skipCommentsAndWhitespace(keyProperty.text, colonIndex + 1);
  const valueEnd = parseQuotedValueEnd(keyProperty.text, valueStart);
  if (valueEnd === null) {
    return null;
  }

  return keyProperty.text.slice(valueStart + 1, valueEnd - 1);
}

function parseEntryPreservedProperties(
  content: string,
  entryStart: number,
  entryEnd: number,
): string | null {
  const properties = parsePropertyBlocks(content, entryStart + 1, entryEnd - 1);
  if (properties.length === 0) {
    return null;
  }

  const preserved = properties
    .filter((property) => !PRESERVED_PROPERTY_SKIP.has(property.name))
    .map((property) => property.text.trimEnd());

  return preserved.join("\n");
}

export function parseCharacterEntries(content: string): ParsedCharacterFile {
  const entriesInOrder: ParsedCharacterEntry[] = [];
  const entriesByKey = new Map<string, ParsedCharacterEntry>();

  for (const { start: entryStart, end: entryEnd } of findTopLevelEntries(
    content,
  )) {
    const key = parseEntryKey(content, entryStart, entryEnd);
    if (!key) {
      continue;
    }

    const preservedProperties = parseEntryPreservedProperties(
      content,
      entryStart,
      entryEnd,
    );
    if (preservedProperties === null) {
      continue;
    }

    const rawEntry = content.slice(entryStart, entryEnd);
    const entry: ParsedCharacterEntry = {
      key,
      preservedProperties,
      rawEntry,
    };

    entriesInOrder.push(entry);
    entriesByKey.set(key, entry);
  }

  return { entriesInOrder, entriesByKey };
}

export function readCharacterEntriesFromFile(
  filePath: string,
): ParsedCharacterFile | undefined {
  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  return parseCharacterEntries(fs.readFileSync(filePath, "utf8"));
}

export function formatDefaultBuffProperties(modifiersBlock: string): string {
  return [
    "    hasStacks: false,",
    modifiersBlock,
    "    minStacks: 0,",
    "    maxStacks: 0,",
    "    alwaysEnabled: false,",
  ].join("\n");
}

export function formatDefaultResonanceChainProperties(): string {
  return [
    "    hasStacks: false,",
    "    modifiers: [],",
    "    minStacks: 0,",
    "    maxStacks: 0,",
    "    alwaysEnabled: false,",
  ].join("\n");
}

export function mergeCharacterEntriesFile(options: {
  exportName: string;
  generatedBlocks: string[];
  generatedKeys: string[];
  existing?: ParsedCharacterFile;
  formatFreshEntry: (key: string) => string;
  formatMergedEntry: (key: string, preservedProperties: string) => string;
}): string {
  const {
    exportName,
    generatedBlocks,
    generatedKeys,
    existing,
    formatFreshEntry,
    formatMergedEntry,
  } = options;

  if (generatedBlocks.length === 0) {
    return `export const ${exportName} = [];\n`;
  }

  if (!existing) {
    const formattedBlocks = generatedBlocks.map((block, index) =>
      `${block}${index < generatedBlocks.length - 1 ? "," : ""}`,
    );
    return `export const ${exportName} = [\n${formattedBlocks.join("\n")}\n];\n`;
  }

  const generatedByKey = new Map(
    generatedKeys.map((key, index) => [key, generatedBlocks[index]!]),
  );
  const usedGeneratedKeys = new Set<string>();
  const outputBlocks: string[] = [];

  for (const existingEntry of existing.entriesInOrder) {
    const generatedBlock = generatedByKey.get(existingEntry.key);
    if (generatedBlock) {
      outputBlocks.push(
        formatMergedEntry(
          existingEntry.key,
          existingEntry.preservedProperties,
        ),
      );
      usedGeneratedKeys.add(existingEntry.key);
      continue;
    }

    outputBlocks.push(existingEntry.rawEntry);
  }

  for (const [key, block] of generatedByKey) {
    if (!usedGeneratedKeys.has(key)) {
      outputBlocks.push(block);
    }
  }

  const formattedBlocks = outputBlocks.map((block, index) =>
    `${block}${index < outputBlocks.length - 1 ? "," : ""}`,
  );

  return `export const ${exportName} = [\n${formattedBlocks.join("\n")}\n];\n`;
}
