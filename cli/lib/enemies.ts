import type { ApiMonsterDetail, ApiMonsterListItem } from "./api.js";
import { toEnemyKey } from "./naming.js";

const RARITY_TYPE_MAP: Record<string, string> = {
  "Standard Class": "Standard",
  "Elite Class": "Elite",
  "Overlord Class": "Overlord",
  "Calamity Class": "Calamity",
};

export function getEnemyTypeFromRarity(rarity: string): string {
  const type = RARITY_TYPE_MAP[rarity];
  if (!type) {
    throw new Error(`Unsupported monster rarity: ${rarity}`);
  }
  return type;
}

/** Resist property keys from the monster detail API, mapped to this project's element names. */
const RESIST_PROPERTY_TO_ELEMENT: Array<[property: string, element: string]> = [
  ["DamageResistancePhys", "Physical"],
  ["DamageResistanceElement1", "Glacio"],
  ["DamageResistanceElement2", "Fusion"],
  ["DamageResistanceElement3", "Electro"],
  ["DamageResistanceElement4", "Aero"],
  ["DamageResistanceElement5", "Spectro"],
  ["DamageResistanceElement6", "Havoc"],
];

/** Matches the alphabetical field order every existing `resist` object uses. */
const RESIST_OUTPUT_ORDER = [
  "Aero",
  "Electro",
  "Fusion",
  "Glacio",
  "Havoc",
  "Physical",
  "Spectro",
];

export function buildResistFromProperties(
  properties: ApiMonsterDetail["Properties"],
): Record<string, number> {
  const byElement = new Map<string, number>();
  for (const [property, element] of RESIST_PROPERTY_TO_ELEMENT) {
    const value = properties[property]?.Value;
    byElement.set(element, typeof value === "number" ? value / 100 : 0);
  }

  const resist: Record<string, number> = {};
  for (const element of RESIST_OUTPUT_ORDER) {
    resist[element] = byElement.get(element) ?? 0;
  }
  return resist;
}

/**
 * Unreleased monsters show up in the API either as a "Stay tuned" placeholder
 * or, for ones further out, as a raw untranslated localization key (e.g.
 * `MonsterInfo_340000111_Name`). Neither is real content — never ship them.
 */
export function shouldSkipApiMonster(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.toLowerCase() === "stay tuned") {
    return true;
  }
  return /^[A-Za-z]+_\d+_[A-Za-z]+$/.test(trimmed);
}

/**
 * A handful of monster detail pages (seen on some "Phantom" training-mode
 * enemies) come back with an empty `Properties` payload — no resist values
 * at all. Treat those as incomplete rather than guessing at 0% resist,
 * which would silently feed wrong numbers into damage calculations.
 */
export function hasUsableResistData(properties: ApiMonsterDetail["Properties"]): boolean {
  return RESIST_PROPERTY_TO_ELEMENT.every(
    ([property]) => typeof properties?.[property]?.Value === "number",
  );
}

function formatEnemyEntryBlock(options: {
  objectKey: string;
  imageUrl: string;
  name: string;
  type: string;
  resist: Record<string, number>;
}): string {
  const { objectKey, imageUrl, name, type, resist } = options;
  const resistLines = RESIST_OUTPUT_ORDER.map(
    (element) => `      ${element}: ${resist[element]},`,
  ).join("\n");

  return [
    `  ${objectKey}: {`,
    `    imageUrl: ${JSON.stringify(imageUrl)},`,
    `    name: ${JSON.stringify(name)},`,
    `    type: ${JSON.stringify(type)},`,
    `    resist: {`,
    resistLines,
    `    },`,
    `  },`,
  ].join("\n");
}

// --- Comment-aware parsing of the existing `const enemies: Record<string, Enemy> = { ... }` block ---
// Ported from the same primitives in parseEchoEntries.ts / extractCharacterEntries.ts.

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

function findMatchingBraceEnd(content: string, openBraceIndex: number): number | null {
  let depth = 0;
  let inString = false;
  let stringChar = "";

  for (let index = openBraceIndex; index < content.length; index += 1) {
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

    if (character === "{") {
      depth += 1;
    }

    if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  return null;
}

interface TopLevelEnemyEntry {
  objectKey: string;
  bodyText: string;
}

function findTopLevelEnemyEntries(
  content: string,
  bodyStart: number,
  bodyEnd: number,
): TopLevelEnemyEntry[] {
  const entries: TopLevelEnemyEntry[] = [];
  let index = bodyStart;

  while (index < bodyEnd) {
    index = skipCommentsAndWhitespace(content, index);
    if (index >= bodyEnd) {
      break;
    }

    const keyMatch = /^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*\{/.exec(content.slice(index, bodyEnd));
    if (!keyMatch) {
      break;
    }

    const objectKey = keyMatch[1]!;
    const braceStart = index + keyMatch[0].length - 1;
    const braceEnd = findMatchingBraceEnd(content, braceStart);
    if (braceEnd === null) {
      break;
    }

    entries.push({ objectKey, bodyText: content.slice(index, braceEnd + 1) });

    index = braceEnd + 1;
    index = skipCommentsAndWhitespace(content, index);
    if (content[index] === ",") {
      index += 1;
    }
  }

  return entries;
}

export interface ParsedEnemiesFile {
  /** Index of the closing `}` of the `enemies` object — where new entries get inserted. */
  insertAt: number;
  existingKeys: Set<string>;
  /** Lowercased display name -> count of existing entries with that name. */
  existingNameCounts: Map<string, number>;
}

export function parseEnemiesFile(content: string): ParsedEnemiesFile {
  const exportMatch = content.match(/const enemies: Record<string, Enemy> = \{/);
  if (!exportMatch || exportMatch.index === undefined) {
    throw new Error(
      "Could not find `const enemies: Record<string, Enemy> = {` in src/enemies/index.ts",
    );
  }

  const braceStart = exportMatch.index + exportMatch[0].length - 1;
  const braceEnd = findMatchingBraceEnd(content, braceStart);
  if (braceEnd === null) {
    throw new Error("Could not find the end of the `enemies` object in src/enemies/index.ts");
  }

  const entries = findTopLevelEnemyEntries(content, braceStart + 1, braceEnd);
  const existingKeys = new Set<string>();
  const existingNameCounts = new Map<string, number>();

  for (const entry of entries) {
    existingKeys.add(entry.objectKey);
    const nameMatch = /name:\s*"((?:\\.|[^"\\])*)"/.exec(entry.bodyText);
    if (nameMatch) {
      const lowerName = nameMatch[1]!.toLowerCase();
      existingNameCounts.set(lowerName, (existingNameCounts.get(lowerName) ?? 0) + 1);
    }
  }

  return { insertAt: braceEnd, existingKeys, existingNameCounts };
}

/** Assigns a unique camelCase object key, appending 2, 3, ... on collision (matches existing "hecate"/"hecate2" style entries). */
export function assignUniqueEnemyKey(name: string, usedKeys: Set<string>): string {
  const baseKey = toEnemyKey(name);
  let key = baseKey;
  let suffix = 2;
  while (usedKeys.has(key)) {
    key = `${baseKey}${suffix}`;
    suffix += 1;
  }
  usedKeys.add(key);
  return key;
}

export interface EnemyToGenerate {
  monster: ApiMonsterListItem;
  key: string;
}

/** Selects which API monsters are new — i.e. not already covered by an existing entry with the same name — and assigns each a unique key. */
export function selectNewEnemies(
  apiMonsters: ApiMonsterListItem[],
  existing: Pick<ParsedEnemiesFile, "existingKeys" | "existingNameCounts">,
): EnemyToGenerate[] {
  const usedKeys = new Set(existing.existingKeys);
  const seenNameCounts = new Map<string, number>();
  const toGenerate: EnemyToGenerate[] = [];

  for (const monster of apiMonsters) {
    if (shouldSkipApiMonster(monster.Name)) {
      continue;
    }

    const lowerName = monster.Name.toLowerCase();
    const occurrence = (seenNameCounts.get(lowerName) ?? 0) + 1;
    seenNameCounts.set(lowerName, occurrence);

    const existingCount = existing.existingNameCounts.get(lowerName) ?? 0;
    if (occurrence <= existingCount) {
      continue;
    }

    toGenerate.push({ monster, key: assignUniqueEnemyKey(monster.Name, usedKeys) });
  }

  return toGenerate;
}

export function buildEnemyEntryBlock(monster: ApiMonsterListItem, key: string, detail: ApiMonsterDetail): string {
  return formatEnemyEntryBlock({
    objectKey: key,
    imageUrl: detail.Icon,
    name: monster.Name,
    type: getEnemyTypeFromRarity(monster.Rarity),
    resist: buildResistFromProperties(detail.Properties),
  });
}

export function insertEnemyBlocks(content: string, insertAt: number, blocks: string[]): string {
  if (blocks.length === 0) {
    return content;
  }
  const insertion = blocks.map((block) => `${block}\n`).join("");
  return content.slice(0, insertAt) + insertion + content.slice(insertAt);
}

export function buildOverwrittenEnemiesFile(content: string, blocks: string[]): string {
  const exportMatch = content.match(/const enemies: Record<string, Enemy> = \{/);
  if (!exportMatch || exportMatch.index === undefined) {
    throw new Error(
      "Could not find `const enemies: Record<string, Enemy> = {` in src/enemies/index.ts",
    );
  }

  const braceStart = exportMatch.index + exportMatch[0].length - 1;
  const braceEnd = findMatchingBraceEnd(content, braceStart);
  if (braceEnd === null) {
    throw new Error("Could not find the end of the `enemies` object in src/enemies/index.ts");
  }

  const prefix = content.slice(0, braceStart + 1);
  const suffix = content.slice(braceEnd);
  const body = blocks.length > 0 ? `\n${blocks.join("\n")}\n` : "\n";

  return `${prefix}${body}${suffix}`;
}
