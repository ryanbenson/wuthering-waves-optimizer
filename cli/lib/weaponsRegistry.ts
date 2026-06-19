import fs from "fs";

interface PickerEntry {
  key: string;
  name: string;
}

export interface WeaponRegistryEntry {
  key: string;
  name: string;
  typePlural: string;
  rarity: 1 | 2 | 3 | 4 | 5;
}

const RARITY_KEYS = ["five", "four", "three", "two", "one"] as const;
type RarityKey = (typeof RARITY_KEYS)[number];

const RARITY_TO_KEY: Record<WeaponRegistryEntry["rarity"], RarityKey> = {
  5: "five",
  4: "four",
  3: "three",
  2: "two",
  1: "one",
};

const TYPE_TO_LIST_NAME: Record<string, string> = {
  Swords: "swordsList",
  Broadblades: "broadbladesList",
  Rectifiers: "rectifiersList",
  Pistols: "pistolsList",
  Gauntlets: "gauntletsList",
};

function getListName(typePlural: string): string {
  const listName = TYPE_TO_LIST_NAME[typePlural];
  if (!listName) {
    throw new Error(`Unknown weapon type list: ${typePlural}`);
  }
  return listName;
}

function parsePickerEntries(
  listContent: string,
  rarity: RarityKey,
): PickerEntry[] {
  const rarityIndex = RARITY_KEYS.indexOf(rarity);
  const nextRarity = RARITY_KEYS[rarityIndex + 1];
  const pattern = nextRarity
    ? new RegExp(`${rarity}:\\s*\\[([\\s\\S]*?)\\],\\s*${nextRarity}:`)
    : new RegExp(`${rarity}:\\s*\\[([\\s\\S]*?)\\],?\\s*\\};`);
  const match = listContent.match(pattern);
  if (!match) {
    return [];
  }

  return [
    ...match[1].matchAll(/\{\s*key:\s*"([^"]+)",\s*name:\s*"([^"]+)"\s*\}/g),
  ].map(([, key, name]) => ({ key, name }));
}

function parseWeaponList(content: string, listName: string): string {
  const pattern = new RegExp(
    `(?:export\\s+)?const\\s+${listName}\\s*=\\s*\\{([\\s\\S]*?)\\n\\};`,
  );
  const match = content.match(pattern);
  if (!match) {
    throw new Error(`Could not find ${listName} in weapons.ts`);
  }
  return match[1];
}

function formatPickerEntry(entry: PickerEntry): string {
  return `    { key: "${entry.key}", name: "${entry.name}" },`;
}

function formatWeaponListBlock(
  listName: string,
  entriesByRarity: Record<RarityKey, PickerEntry[]>,
  isExported: boolean,
): string {
  const exportPrefix = isExported ? "export " : "";
  const sections = RARITY_KEYS.map((rarity) => {
    const entries = entriesByRarity[rarity]
      .slice()
      .sort((a, b) => a.key.localeCompare(b.key));
    const body =
      entries.length > 0 ? `\n${entries.map(formatPickerEntry).join("\n")}\n  ` : " ";
    return `  ${rarity}: [${body}],`;
  }).join("\n");

  return `${exportPrefix}const ${listName} = {
${sections}
};`;
}

function getAllListNames(content: string): string[] {
  return [...content.matchAll(/(?:export\s+)?const\s+(\w+List)\s*=/g)].map(
    ([, listName]) => listName,
  );
}

export function weaponExistsInRegistry(content: string, key: string): boolean {
  for (const listName of getAllListNames(content)) {
    const listContent = parseWeaponList(content, listName);
    for (const rarity of RARITY_KEYS) {
      if (parsePickerEntries(listContent, rarity).some((entry) => entry.key === key)) {
        return true;
      }
    }
  }
  return false;
}

export function patchWeaponsRegistry(
  filePath: string,
  entry: WeaponRegistryEntry,
): void {
  const content = fs.readFileSync(filePath, "utf8");
  const listName = getListName(entry.typePlural);
  const listContent = parseWeaponList(content, listName);
  const rarityKey = RARITY_TO_KEY[entry.rarity];
  const entriesByRarity = Object.fromEntries(
    RARITY_KEYS.map((rarity) => [
      rarity,
      parsePickerEntries(listContent, rarity).filter((item) => item.key !== entry.key),
    ]),
  ) as Record<RarityKey, PickerEntry[]>;

  entriesByRarity[rarityKey].push({ key: entry.key, name: entry.name });

  const updatedListBlock = formatWeaponListBlock(
    listName,
    entriesByRarity,
    listName === "swordsList",
  );
  const listPattern = new RegExp(
    `(?:export\\s+)?const\\s+${listName}\\s*=\\s*\\{[\\s\\S]*?\\n\\};`,
  );
  const updated = content.replace(listPattern, updatedListBlock);
  fs.writeFileSync(filePath, updated);
}
