import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { confirm, input, search } from "@inquirer/prompts";
import {
  fetchWeaponDetail,
  fetchWeaponList,
  getSuggestedWeaponName,
  getWeaponName,
  getWeaponNameUncertaintyHints,
  isWeaponNameUncertain,
  type ApiWeaponListItem,
} from "../lib/api.js";
import { toCharacterKey, toPluralWeapon } from "../lib/naming.js";
import { createProgressSpinner, withSpinner } from "../lib/progress.js";
import { printReviewChecklist } from "../lib/reviewNotices.js";
import {
  buildWeaponData,
  extractWeaponBasicData,
  formatWeaponFileContent,
  getWeaponGenerationNotices,
} from "../lib/weaponStats.js";
import {
  patchWeaponsRegistry,
  weaponExistsInRegistry,
} from "../lib/weaponsRegistry.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");
const weaponsDir = path.join(projectRoot, "src/weapons");
const weaponsRegistryPath = path.join(weaponsDir, "weapons.ts");

function getWeaponLabel(weapon: ApiWeaponListItem): string {
  return `${weapon.Name} (${weapon.Id}, ${weapon.QualityId}★ ${weapon.TypeName})`;
}

function weaponExists(key: string, typePlural: string): boolean {
  const registryContent = fs.readFileSync(weaponsRegistryPath, "utf8");
  const weaponFilePath = path.join(weaponsDir, typePlural, `${key}.ts`);
  return (
    fs.existsSync(weaponFilePath) || weaponExistsInRegistry(registryContent, key)
  );
}

export async function runGenerateWeapon(): Promise<void> {
  const weapons = await withSpinner(
    "Fetching weapon list from Encore API",
    () => fetchWeaponList(),
    (result) => `Loaded ${result.length} weapons`,
  );

  const selectedId = await search({
    message: "Select a weapon to generate",
    source: async (input) => {
      const query = (input ?? "").trim().toLowerCase();
      return weapons
        .filter((weapon) => {
          if (!query) {
            return true;
          }
          return getWeaponLabel(weapon).toLowerCase().includes(query);
        })
        .map((weapon) => ({
          name: getWeaponLabel(weapon),
          value: weapon.Id,
        }));
    },
  });

  if (selectedId === undefined) {
    console.log("Cancelled.");
    return;
  }

  const listItem = weapons.find((weapon) => weapon.Id === selectedId);

  const detail = await withSpinner(
    `Fetching weapon sheet for ID ${selectedId}`,
    () => fetchWeaponDetail(selectedId),
    (result) => {
      const label =
        getSuggestedWeaponName(result, listItem) || `ID ${result.ItemId}`;
      return `Loaded ${label} (${result.QualityId}★ ${result.WeaponTypeName})`;
    },
  );

  let name: string;
  if (isWeaponNameUncertain(detail)) {
    const suggestedName = getSuggestedWeaponName(detail, listItem);
    const hints = getWeaponNameUncertaintyHints(detail, listItem);
    const hintSuffix = hints.length > 0 ? ` (${hints.join("; ")})` : "";

    name = (
      await input({
        message: `Confirm weapon name${hintSuffix}`,
        default: suggestedName || undefined,
        validate: (value) =>
          value.trim().length > 0 ? true : "Name is required",
      })
    ).trim();
  } else {
    name = getWeaponName(detail);
  }

  const key = toCharacterKey(name);
  const rarity = detail.QualityId as 1 | 2 | 3 | 4 | 5;
  const typePlural = toPluralWeapon(detail.WeaponTypeName);

  if (rarity < 1 || rarity > 5) {
    throw new Error(`Unsupported rarity QualityId=${detail.QualityId}`);
  }

  if (weaponExists(key, typePlural)) {
    console.log(
      `\n${name} already exists (key: ${key}) at src/weapons/${typePlural}/${key}.ts or in weapons.ts`,
    );
    const shouldOverwrite = await confirm({
      message: "Overwrite existing weapon file and registry entry?",
      default: false,
    });

    if (!shouldOverwrite) {
      console.log("Cancelled.");
      return;
    }
  }

  const progress = createProgressSpinner(`Generating ${name}`);
  const weaponTypeDir = path.join(weaponsDir, typePlural);
  const weaponFilePath = path.join(weaponTypeDir, `${key}.ts`);

  try {
    progress.update(`Generating ${name} — Building weapon stats`);
    const basic = extractWeaponBasicData(detail, name);
    const stats = buildWeaponData(detail);
    const fileContent = formatWeaponFileContent(basic, stats);

    progress.update(`Generating ${name} — Writing ${key}.ts`);
    fs.mkdirSync(weaponTypeDir, { recursive: true });
    fs.writeFileSync(weaponFilePath, fileContent);

    progress.update(`Generating ${name} — Updating weapons.ts registry`);
    patchWeaponsRegistry(weaponsRegistryPath, {
      key,
      name,
      typePlural,
      rarity,
    });

    progress.succeed(
      `Generated ${name} at ${path.relative(projectRoot, weaponFilePath)}`,
    );
  } catch (error) {
    progress.fail(`Failed to generate ${name}`);
    throw error;
  }

  console.log(`Updated ${path.relative(projectRoot, weaponsRegistryPath)}`);

  printReviewChecklist(getWeaponGenerationNotices());
}
