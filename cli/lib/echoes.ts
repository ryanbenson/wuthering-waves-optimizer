import fs from "fs";
import type { ApiEchoListItem } from "./api.js";
import { toEchoKey } from "./naming.js";
import {
  parseEchoEntries,
  type ParsedEchoEntry,
  type ParsedEchoFile,
} from "./parseEchoEntries.js";

const RARITY_CLASS_MAP: Record<number, string> = {
  0: "Common",
  1: "Elite",
  2: "Overlord",
  3: "Calamity",
};

const IMAGE_BASE_URL =
  "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes";

const ECHO_NAME_BLACKLIST = new Set([
  "Jinhsi",
  "Changli",
  "Calcharo",
  "Shorekeeper",
  "Camellya",
  "Carlotta",
  "Roccia",
  "Brant",
  "Cantarella",
  "Zani",
  "Cartethyia",
  "Phoebe",
]);

export function loadEchoSetLabelToKeyMap(statsFilePath: string): Map<string, string> {
  const content = fs.readFileSync(statsFilePath, "utf8");
  const mapMatch = content.match(
    /export const echoSetLabelMap:\s*Record<string,\s*string>\s*=\s*\{([\s\S]*?)\n\};/,
  );
  if (!mapMatch) {
    throw new Error("Could not find echoSetLabelMap in stats.ts");
  }

  const labelToKey = new Map<string, string>();
  for (const [, key, label] of mapMatch[1]!.matchAll(
    /(\w+):\s*"((?:\\.|[^"\\])*)"/g,
  )) {
    labelToKey.set(label, key);
  }

  return labelToKey;
}

export function getEchoClassFromRarity(rarity: number): string {
  const echoClass = RARITY_CLASS_MAP[rarity];
  if (!echoClass) {
    throw new Error(`Unsupported echo rarity: ${rarity}`);
  }
  return echoClass;
}

export function getEchoImageUrl(key: string): string {
  return `${IMAGE_BASE_URL}/${key}.webp`;
}

function formatSets(sets: string[]): string {
  const items = sets.map((set) => `"${set}"`).join(", ");
  return `    sets: [${items}],`;
}

function trimPropertyBlock(text: string): string {
  return text.replace(/^\n+/, "").trimEnd();
}

function compactEchoEntryBlock(block: string): string {
  return block.replace(/\n[ \t]*\n(?=    \w)/g, "\n");
}

function formatEchoEntryBlock(options: {
  objectKey: string;
  name: string;
  echoClass: string;
  imageUrl: string;
  sets: string[];
  details: string;
  modifiers: string;
  stackProperties: string;
  actions: string;
}): string {
  const {
    objectKey,
    name,
    echoClass,
    imageUrl,
    sets,
    details,
    modifiers,
    stackProperties,
    actions,
  } = options;

  const stackBlock = stackProperties
    ? trimPropertyBlock(stackProperties)
    : "";

  const sections = [
    `    key: "${objectKey}",`,
    `    name: "${name}",`,
    `    class: "${echoClass}",`,
    `    image:\n      "${imageUrl}",`,
    trimPropertyBlock(details),
    trimPropertyBlock(modifiers),
    ...(stackBlock ? [stackBlock] : []),
    trimPropertyBlock(actions),
    formatSets(sets),
  ];

  return compactEchoEntryBlock(
    `  ${objectKey}: {\n${sections.join("\n")}\n  }`,
  );
}

function mapEchoSets(
  echo: ApiEchoListItem,
  labelToKey: Map<string, string>,
  notices: string[],
  notifiedUnknownSets: Set<string>,
): string[] {
  const sets: string[] = [];

  for (const group of echo.FetterGroups ?? []) {
    const setKey = labelToKey.get(group.Name);
    if (!setKey) {
      if (!notifiedUnknownSets.has(group.Name)) {
        notifiedUnknownSets.add(group.Name);
        notices.push(
          `Unknown echo set "${group.Name}" — add it to echoSetLabelMap in stats.ts`,
        );
      }
      continue;
    }
    if (!sets.includes(setKey)) {
      sets.push(setKey);
    }
  }

  return sets;
}

function findExistingEchoEntry(
  echo: ApiEchoListItem,
  existing: ParsedEchoFile,
): ParsedEchoEntry | undefined {
  const derivedKey = toEchoKey(echo.Name);
  const byKey = existing.entriesByKey.get(derivedKey);
  if (byKey) {
    return byKey;
  }

  const byName = existing.entriesByName.get(echo.Name.toLowerCase());
  if (byName) {
    return byName;
  }

  return existing.entriesInOrder.find(
    (entry) => toEchoKey(entry.name) === derivedKey,
  );
}

function shouldSkipApiEcho(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.toLowerCase() === "stay tuned") {
    return true;
  }
  if (trimmed.startsWith("Phantom")) {
    return true;
  }
  if (ECHO_NAME_BLACKLIST.has(trimmed)) {
    return true;
  }
  return false;
}

function dedupeApiEchoes(echoes: ApiEchoListItem[]): ApiEchoListItem[] {
  const byKey = new Map<string, ApiEchoListItem>();

  for (const echo of echoes) {
    if (shouldSkipApiEcho(echo.Name)) {
      continue;
    }

    const key = toEchoKey(echo.Name);
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, {
        ...echo,
        FetterGroups: [...(echo.FetterGroups ?? [])],
      });
      continue;
    }

    const groupIds = new Set(existing.FetterGroups.map((group) => group.Id));
    const mergedGroups = [...existing.FetterGroups];
    for (const group of echo.FetterGroups ?? []) {
      if (!groupIds.has(group.Id)) {
        mergedGroups.push(group);
        groupIds.add(group.Id);
      }
    }

    byKey.set(key, {
      ...existing,
      FetterGroups: mergedGroups,
    });
  }

  return [...byKey.values()];
}

function buildEchoEntryFromApi(
  echo: ApiEchoListItem,
  labelToKey: Map<string, string>,
  existing: ParsedEchoFile | undefined,
  notices: string[],
  notifiedUnknownSets: Set<string>,
): { objectKey: string; block: string; isNew: boolean; echoClass: string } {
  const echoClass = getEchoClassFromRarity(echo.Rarity);
  const sets = mapEchoSets(echo, labelToKey, notices, notifiedUnknownSets);
  const existingEntry = existing
    ? findExistingEchoEntry(echo, existing)
    : undefined;
  const objectKey = existingEntry?.objectKey ?? toEchoKey(echo.Name);
  const isNew = !existingEntry;

  const block = formatEchoEntryBlock({
    objectKey,
    name: echo.Name,
    echoClass,
    imageUrl: getEchoImageUrl(objectKey),
    sets,
    details: existingEntry?.details ?? "    details: ``,",
    modifiers: existingEntry?.modifiers ?? "    modifiers: [],",
    stackProperties: existingEntry?.stackProperties ?? "",
    actions: existingEntry?.actions ?? "    actions: [],",
  });

  return { objectKey, block, isNew, echoClass };
}

export interface ImportEchoesResult {
  content: string;
  addedCount: number;
  updatedCount: number;
  preservedCount: number;
  notices: string[];
}

export function buildImportedEchoesFile(options: {
  echoesFileContent: string;
  apiEchoes: ApiEchoListItem[];
  labelToKey: Map<string, string>;
}): ImportEchoesResult {
  const { echoesFileContent, apiEchoes, labelToKey } = options;
  const existing = parseEchoEntries(echoesFileContent);
  const dedupedApiEchoes = dedupeApiEchoes(apiEchoes);
  const notices: string[] = [];
  const usedExistingKeys = new Set<string>();
  const outputBlocks: Array<{ objectKey: string; block: string }> = [];
  const notifiedNewEchoKeys = new Set<string>();
  const notifiedUnknownSets = new Set<string>();

  let addedCount = 0;
  let updatedCount = 0;

  for (const echo of dedupedApiEchoes) {
    const built = buildEchoEntryFromApi(
      echo,
      labelToKey,
      existing,
      notices,
      notifiedUnknownSets,
    );
    if (built.isNew) {
      addedCount += 1;
      if (
        built.echoClass !== "Common" &&
        !notifiedNewEchoKeys.has(built.objectKey)
      ) {
        notifiedNewEchoKeys.add(built.objectKey);
        notices.push(
          `New ${built.echoClass} echo "${echo.Name}" (${built.objectKey}) — fill in details, modifiers, and actions`,
        );
      }
    } else {
      updatedCount += 1;
      usedExistingKeys.add(built.objectKey);
    }

    outputBlocks.push({
      objectKey: built.objectKey,
      block: built.block,
    });
  }

  let preservedCount = 0;
  for (const existingEntry of existing.entriesInOrder) {
    if (!usedExistingKeys.has(existingEntry.objectKey)) {
      if (shouldSkipApiEcho(existingEntry.name)) {
        continue;
      }

      preservedCount += 1;
      const preservedBlock = existingEntry.rawEntry.startsWith("  ")
        ? existingEntry.rawEntry.trimEnd()
        : `  ${existingEntry.rawEntry.trimEnd()}`;
      outputBlocks.push({
        objectKey: existingEntry.objectKey,
        block: compactEchoEntryBlock(preservedBlock),
      });
      notices.push(
        `Echo "${existingEntry.name}" (${existingEntry.objectKey}) was not found in API response and was kept`,
      );
    }
  }

  outputBlocks.sort((a, b) => a.objectKey.localeCompare(b.objectKey));

  const exportMatch = echoesFileContent.match(
    /export const mainEchoesData(?::\s*\w+)?\s*=\s*\{/,
  );
  if (!exportMatch || exportMatch.index === undefined) {
    throw new Error("Could not find mainEchoesData in echoes/index.ts");
  }

  const prefix = echoesFileContent.slice(0, exportMatch.index);
  const formattedBlocks = outputBlocks.map((entry, index) =>
    `${entry.block}${index < outputBlocks.length - 1 ? "," : ""}`,
  );

  const content = `${prefix}export const mainEchoesData: MainEchoes = {\n${formattedBlocks.join("\n")}\n};\n`;

  return {
    content,
    addedCount,
    updatedCount,
    preservedCount,
    notices,
  };
}

export function getEchoImportNotices(result: ImportEchoesResult): string[] {
  const summary = [
    `Added ${result.addedCount} echo${result.addedCount === 1 ? "" : "s"}`,
    `Updated ${result.updatedCount} echo${result.updatedCount === 1 ? "" : "s"}`,
  ];

  if (result.preservedCount > 0) {
    summary.push(
      `Kept ${result.preservedCount} echo${result.preservedCount === 1 ? "" : "s"} missing from API`,
    );
  }

  return [summary.join(", "), ...result.notices];
}
