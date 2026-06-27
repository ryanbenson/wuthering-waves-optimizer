import fs from "fs";
import path from "path";
import type { ApiCharacterDetail } from "./api.js";
import {
  buildCharacterStats,
  extractBasicData,
  formatBasicFileContent,
  formatCharacterFileContent,
} from "./characterStats.js";
import { buildSkillAttackFiles } from "./skillAttacks.js";
import {
  formatBuffsFileContent,
} from "./buffs.js";
import {
  buildResonanceChains,
  formatResonanceChainsFileContent,
} from "./resonanceChains.js";
import { formatTuneBreakAttacksFileContent } from "./tuneBreakAttacks.js";
import { readCharacterEntriesFromFile } from "./extractCharacterEntries.js";

const INDEX_TEMPLATE = `import { getCharacterBasicInfo } from "./basic.ts";
import { character, getCharacterStatsByLevel } from "./character.ts";
import { basicAttacks } from "./basicAttacks.ts";
import { skillAttacks } from "./skillAttacks.ts";
import { liberationAttacks } from "./liberationAttacks.ts";
import { forteCircuitAttacks } from "./forteCircuitAttacks.ts";
import { introAttacks } from "./introAttacks.ts";
import { buffs } from "./buffs.ts";
import { resonanceChains } from "./resonanceChains.ts";
import { outroAttacks } from "./outroAttacks.ts";
import { tuneBreakAttacks } from "./tuneBreakAttacks.ts";
import { rotations, echoes } from "./presets.ts";

export function getData() {
  return {
    basic: getCharacterBasicInfo(),
    character,
    getCharacterStatsByLevel,
    basicAttacks,
    skillAttacks,
    liberationAttacks,
    forteCircuitAttacks,
    introAttacks,
    buffs,
    resonanceChains,
    outroAttacks,
    tuneBreakAttacks,
    rotations,
    echoes,
  };
}
`;

export interface ScaffoldCharacterOptions {
  mergeModifiers?: boolean;
}

export function scaffoldCharacterFolder(
  charactersDir: string,
  key: string,
  detail: ApiCharacterDetail,
  onProgress?: (message: string) => void,
  displayName?: string,
  options: ScaffoldCharacterOptions = {},
): string {
  const characterDir = path.join(charactersDir, key);
  fs.mkdirSync(characterDir, { recursive: true });

  const existingBuffEntries = options.mergeModifiers
    ? readCharacterEntriesFromFile(path.join(characterDir, "buffs.ts"))
    : undefined;
  const existingResonanceEntries = options.mergeModifiers
    ? readCharacterEntriesFromFile(path.join(characterDir, "resonanceChains.ts"))
    : undefined;

  onProgress?.("Building basic info and character stats");
  const basic = extractBasicData(detail, key, displayName);
  const stats = buildCharacterStats(detail);

  onProgress?.("Building skill attack files");
  const skillAttackFiles = buildSkillAttackFiles(detail);

  onProgress?.("Building inherent skill buffs");
  const buffsContent = formatBuffsFileContent(detail, existingBuffEntries);

  onProgress?.("Building resonance chains");
  const resonanceChains = buildResonanceChains(detail);

  onProgress?.("Building tune break attacks");
  const tuneBreakAttacksContent = formatTuneBreakAttacksFileContent(detail);

  const files: Record<string, string> = {
    "basic.ts": formatBasicFileContent(basic),
    "character.ts": formatCharacterFileContent(stats),
    ...skillAttackFiles,
    "tuneBreakAttacks.ts": tuneBreakAttacksContent,
    "buffs.ts": buffsContent,
    "resonanceChains.ts": formatResonanceChainsFileContent(
      resonanceChains,
      existingResonanceEntries,
    ),
    "presets.ts":
      "export const rotations: RotationPreset[] = [];\nexport const echoes = [];\n",
    "index.ts": INDEX_TEMPLATE,
  };

  const fileNames = Object.keys(files);
  for (const [index, fileName] of fileNames.entries()) {
    onProgress?.(`Writing ${fileName} (${index + 1}/${fileNames.length})`);
    fs.writeFileSync(path.join(characterDir, fileName), files[fileName]);
  }

  return characterDir;
}

export function characterFolderExists(
  charactersDir: string,
  key: string,
): boolean {
  return fs.existsSync(path.join(charactersDir, key));
}
