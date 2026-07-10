import fs from "fs";

export interface ParsedEchoEntry {
  objectKey: string;
  name: string;
  details: string;
  modifiers: string;
  actions: string;
  stackProperties: string;
  rawEntry: string;
}

export interface ParsedEchoFile {
  entriesInOrder: ParsedEchoEntry[];
  entriesByKey: Map<string, ParsedEchoEntry>;
  entriesByName: Map<string, ParsedEchoEntry>;
}

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

function skipComments(content: string, index: number): number {
  let cursor = index;

  while (cursor < content.length) {
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
    index = skipComments(content, index);
    if (index >= bodyEnd) {
      break;
    }

    if (content[index] === "}") {
      break;
    }

    const nameMatch = /^(\s*)(\w+):/.exec(content.slice(index));
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
      name: nameMatch[2]!,
      text: content.slice(propertyStart, propertyEnd),
    });

    index = propertyEnd;
  }

  return properties;
}

function parsePropertyStringValue(propertyText: string): string | null {
  const colonIndex = propertyText.indexOf(":");
  const valueStart = skipCommentsAndWhitespace(propertyText, colonIndex + 1);
  const valueEnd = parseQuotedValueEnd(propertyText, valueStart);
  if (valueEnd === null) {
    return null;
  }

  return propertyText.slice(valueStart + 1, valueEnd - 1);
}

function findMainEchoEntries(
  content: string,
): Array<{ objectKey: string; entryStart: number; bodyStart: number; end: number }> {
  const exportMatch = content.match(
    /export const mainEchoesData(?::\s*\w+)?\s*=\s*\{/,
  );
  if (!exportMatch || exportMatch.index === undefined) {
    return [];
  }

  const entries: Array<{
    objectKey: string;
    entryStart: number;
    bodyStart: number;
    end: number;
  }> = [];
  let objectDepth = 0;
  let entryStart: number | null = null;
  let bodyStart: number | null = null;
  let entryKey: string | null = null;
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

    if (character === "{") {
      if (objectDepth === 1) {
        const preceding = content.slice(scanStart, index + 1);
        const keyMatch = /([A-Za-z][A-Za-z0-9]*)\s*:\s*\{$/.exec(preceding);
        entryKey = keyMatch?.[1] ?? null;
        entryStart =
          keyMatch?.index !== undefined
            ? scanStart + keyMatch.index
            : index;
        bodyStart = index;
      }
      objectDepth += 1;
      continue;
    }

    if (character === "}") {
      objectDepth -= 1;
      if (
        objectDepth === 1 &&
        entryStart !== null &&
        bodyStart !== null &&
        entryKey !== null
      ) {
        entries.push({
          objectKey: entryKey,
          entryStart,
          bodyStart,
          end: index + 1,
        });
        entryStart = null;
        bodyStart = null;
        entryKey = null;
      }
    }
  }

  return entries;
}

function getPropertyText(
  properties: ParsedProperty[],
  name: string,
): string | undefined {
  return properties.find((property) => property.name === name)?.text;
}

function formatStackProperties(properties: ParsedProperty[]): string {
  return properties
    .filter((property) =>
      ["hasStacks", "minStacks", "maxStacks"].includes(property.name),
    )
    .map((property) => property.text.replace(/^[\r\n]+/, "").trimEnd())
    .join("\n");
}

export function parseEchoEntries(content: string): ParsedEchoFile {
  const entriesInOrder: ParsedEchoEntry[] = [];
  const entriesByKey = new Map<string, ParsedEchoEntry>();
  const entriesByName = new Map<string, ParsedEchoEntry>();

  for (const { objectKey, entryStart, bodyStart, end } of findMainEchoEntries(
    content,
  )) {
    const properties = parsePropertyBlocks(content, bodyStart + 1, end - 1);
    const name = parsePropertyStringValue(
      getPropertyText(properties, "name") ?? "",
    );
    if (!name) {
      continue;
    }

    const entry: ParsedEchoEntry = {
      objectKey,
      name,
      details: getPropertyText(properties, "details") ?? "    details: ``,",
      modifiers: getPropertyText(properties, "modifiers") ?? "    modifiers: [],",
      actions: getPropertyText(properties, "actions") ?? "    actions: [],",
      stackProperties: formatStackProperties(properties),
      rawEntry: content.slice(entryStart, end),
    };

    entriesInOrder.push(entry);
    entriesByKey.set(objectKey, entry);
    entriesByName.set(name.toLowerCase(), entry);
  }

  return { entriesInOrder, entriesByKey, entriesByName };
}

export function readEchoEntriesFromFile(
  filePath: string,
): ParsedEchoFile | undefined {
  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  return parseEchoEntries(fs.readFileSync(filePath, "utf8"));
}
