import fs from "fs";

interface PickerEntry {
  key: string;
  name: string;
}

interface MetaEntry {
  key: string;
  name: string;
  element: string;
  rarity: number;
  weapon: string;
}

export interface RegistryEntry {
  key: string;
  name: string;
  element: string;
  rarity: 4 | 5;
  weapon: string;
}

function parsePickerEntries(
  content: string,
  rarity: "five" | "four",
): PickerEntry[] {
  const pattern =
    rarity === "five"
      ? /five:\s*\[([\s\S]*?)\],\s*four:/
      : /four:\s*\[([\s\S]*?)\]\s*,\s*\};/;
  const match = content.match(pattern);
  if (!match) {
    return [];
  }

  return [...match[1].matchAll(/\{\s*key:\s*"([^"]+)",\s*name:\s*"([^"]+)"\s*\}/g)].map(
    ([, key, name]) => ({ key, name }),
  );
}

function parseAllCharactersList(content: string): MetaEntry[] {
  const match = content.match(/export const allCharactersList = \[([\s\S]*?)\];/);
  if (!match) {
    return [];
  }

  return [
    ...match[1].matchAll(
      /\{\s*key:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*element:\s*"([^"]+)",\s*rarity:\s*(\d+),\s*weapon:\s*"([^"]+)",?\s*\}/g,
    ),
  ].map(([, key, name, element, rarity, weapon]) => ({
    key,
    name,
    element,
    rarity: Number(rarity),
    weapon,
  }));
}

function formatPickerRoster(five: PickerEntry[], four: PickerEntry[]): string {
  const formatEntry = (entry: PickerEntry) =>
    `    { key: "${entry.key}", name: "${entry.name}" },`;

  return `export const characterPickerRoster: CharacterList = {
  five: [
${five.map(formatEntry).join("\n")}
  ],
  four: [
${four.map(formatEntry).join("\n")}
  ],
};`;
}

function formatMetaEntry(entry: MetaEntry): string {
  return `  {
    key: "${entry.key}",
    name: "${entry.name}",
    element: "${entry.element}",
    rarity: ${entry.rarity},
    weapon: "${entry.weapon}",
  },`;
}

function formatAllCharactersList(entries: MetaEntry[]): string {
  const five = entries
    .filter((entry) => entry.rarity === 5)
    .sort((a, b) => a.key.localeCompare(b.key));
  const four = entries
    .filter((entry) => entry.rarity === 4)
    .sort((a, b) => a.key.localeCompare(b.key));

  return `export const allCharactersList = [
  // rarity 5
${five.map(formatMetaEntry).join("\n")}
  // rarity 4
${four.map(formatMetaEntry).join("\n")}
];`;
}

export function characterExistsInRegistry(
  content: string,
  key: string,
): boolean {
  return (
    parsePickerEntries(content, "five").some((entry) => entry.key === key) ||
    parsePickerEntries(content, "four").some((entry) => entry.key === key) ||
    parseAllCharactersList(content).some((entry) => entry.key === key)
  );
}

export function patchCharactersRegistry(
  filePath: string,
  entry: RegistryEntry,
): void {
  const content = fs.readFileSync(filePath, "utf8");
  const fiveEntries = parsePickerEntries(content, "five").filter(
    (item) => item.key !== entry.key,
  );
  const fourEntries = parsePickerEntries(content, "four").filter(
    (item) => item.key !== entry.key,
  );
  const pickerEntry = { key: entry.key, name: entry.name };

  if (entry.rarity === 5) {
    fiveEntries.push(pickerEntry);
  } else {
    fourEntries.push(pickerEntry);
  }

  fiveEntries.sort((a, b) => a.key.localeCompare(b.key));
  fourEntries.sort((a, b) => a.key.localeCompare(b.key));

  const metaEntries = parseAllCharactersList(content).filter(
    (item) => item.key !== entry.key,
  );
  metaEntries.push({
    key: entry.key,
    name: entry.name,
    element: entry.element,
    rarity: entry.rarity,
    weapon: entry.weapon,
  });

  let updated = content.replace(
    /export const characterPickerRoster: CharacterList = \{[\s\S]*?\};/,
    formatPickerRoster(fiveEntries, fourEntries),
  );
  updated = updated.replace(
    /export const allCharactersList = \[[\s\S]*?\];/,
    formatAllCharactersList(metaEntries),
  );

  fs.writeFileSync(filePath, updated);
}
