import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { confirm, input, search } from "@inquirer/prompts";
import {
  fetchCharacterDetail,
  fetchCharacterList,
  getCharacterName,
  getCharacterNameUncertaintyHints,
  getSuggestedCharacterName,
  isCharacterNameUncertain,
  type ApiCharacterListItem,
} from "../lib/api.js";
import { getBasicGenerationNotices } from "../lib/characterStats.js";
import {
  characterExistsInRegistry,
  patchCharactersRegistry,
} from "../lib/charactersRegistry.js";
import { toCharacterKey, toSingularWeapon } from "../lib/naming.js";
import { createProgressSpinner, withSpinner } from "../lib/progress.js";
import {
  characterFolderExists,
  scaffoldCharacterFolder,
} from "../lib/scaffold.js";
import { getSkillGenerationNotices } from "../lib/skillAttacks.js";
import { getBuffGenerationNotices } from "../lib/buffs.js";
import { getResonanceChainNotices } from "../lib/resonanceChains.js";
import { getTuneBreakGenerationNotices } from "../lib/tuneBreakAttacks.js";
import { printReviewChecklist } from "../lib/reviewNotices.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");
const charactersDir = path.join(projectRoot, "src/characters");
const charactersRegistryPath = path.join(charactersDir, "characters.ts");

function getCharacterLabel(character: ApiCharacterListItem): string {
  return `${character.Name} (${character.Id}, ${character.QualityId}★ ${character.Element.Name}, ${character.WeaponType.Name})`;
}

function characterExists(key: string): boolean {
  const registryContent = fs.readFileSync(charactersRegistryPath, "utf8");
  return (
    characterFolderExists(charactersDir, key) ||
    characterExistsInRegistry(registryContent, key)
  );
}

export interface GenerateCharacterOptions {
  mergeModifiers?: boolean;
}

export async function runGenerateCharacter(
  options: GenerateCharacterOptions = {},
): Promise<void> {
  const characters = await withSpinner(
    "Fetching character list from Encore API",
    () => fetchCharacterList(),
    (result) => `Loaded ${result.length} characters`,
  );

  const selectedId = await search({
    message: "Select a character to generate",
    source: async (input) => {
      const query = (input ?? "").trim().toLowerCase();
      return characters
        .filter((character) => {
          if (!query) {
            return true;
          }
          return getCharacterLabel(character).toLowerCase().includes(query);
        })
        .map((character) => ({
          name: getCharacterLabel(character),
          value: character.Id,
        }));
    },
  });

  if (selectedId === undefined) {
    console.log("Cancelled.");
    return;
  }

  const listItem = characters.find((character) => character.Id === selectedId);

  const detail = await withSpinner(
    `Fetching character sheet for ID ${selectedId}`,
    () => fetchCharacterDetail(selectedId),
    (result) => {
      const label =
        getSuggestedCharacterName(result, listItem) || `ID ${result.Id}`;
      return `Loaded ${label} (${result.QualityId}★ ${result.ElementName})`;
    },
  );

  let name: string;
  if (isCharacterNameUncertain(detail)) {
    const suggestedName = getSuggestedCharacterName(detail, listItem);
    const hints = getCharacterNameUncertaintyHints(detail, listItem);
    const hintSuffix = hints.length > 0 ? ` (${hints.join("; ")})` : "";

    name = (
      await input({
        message: `Confirm character name${hintSuffix}`,
        default: suggestedName || undefined,
        validate: (value) =>
          value.trim().length > 0 ? true : "Name is required",
      })
    ).trim();
  } else {
    name = getCharacterName(detail);
  }
  const key = toCharacterKey(name);
  const rarity = detail.QualityId as 4 | 5;
  const element = detail.ElementName;
  const weapon = toSingularWeapon(detail.WeaponTypeName);

  if (rarity !== 4 && rarity !== 5) {
    throw new Error(`Unsupported rarity QualityId=${detail.QualityId}`);
  }

  if (characterExists(key)) {
    console.log(
      `\n${name} already exists (key: ${key}) at src/characters/${key} or in characters.ts`,
    );
    const shouldOverwrite = await confirm({
      message: "Overwrite existing character files and registry entries?",
      default: false,
    });

    if (!shouldOverwrite) {
      console.log("Cancelled.");
      return;
    }
  }

  const progress = createProgressSpinner(`Generating ${name}`);
  let characterDir = "";

  if (options.mergeModifiers && characterExists(key)) {
    console.log(
      "Merging existing entry properties from buffs.ts and resonanceChains.ts (key, name, and details will update)",
    );
  }

  try {
    characterDir = scaffoldCharacterFolder(
      charactersDir,
      key,
      detail,
      (message) => {
        progress.update(`Generating ${name} — ${message}`);
      },
      name,
      { mergeModifiers: options.mergeModifiers },
    );

    progress.update(`Generating ${name} — Updating characters.ts registry`);
    patchCharactersRegistry(charactersRegistryPath, {
      key,
      name,
      element,
      rarity,
      weapon,
    });

    progress.succeed(
      `Generated ${name} at ${path.relative(projectRoot, characterDir)}`,
    );
  } catch (error) {
    progress.fail(`Failed to generate ${name}`);
    throw error;
  }

  console.log(`Updated ${path.relative(projectRoot, charactersRegistryPath)}`);

  printReviewChecklist([
    ...getBasicGenerationNotices(detail),
    ...getSkillGenerationNotices(detail),
    ...getBuffGenerationNotices(detail),
    ...getResonanceChainNotices(detail),
    ...getTuneBreakGenerationNotices(detail),
  ]);
}
