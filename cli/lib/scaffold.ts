import fs from "fs";
import path from "path";
import type { ApiCharacterDetail } from "./api.js";
import {
  buildCharacterStats,
  extractBasicData,
  formatBasicFileContent,
  formatCharacterFileContent,
} from "./characterStats.js";

const ATTACK_STUB = `export const ATTACK_NAME = {
  name: "",
  description: "",
  attacks: [],
};
`;

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

function getAttackFileContent(exportName: string): string {
  return ATTACK_STUB.replace("ATTACK_NAME", exportName);
}

export function scaffoldCharacterFolder(
  charactersDir: string,
  key: string,
  detail: ApiCharacterDetail,
): string {
  const characterDir = path.join(charactersDir, key);
  fs.mkdirSync(characterDir, { recursive: true });

  const basic = extractBasicData(detail, key);
  const stats = buildCharacterStats(detail);

  const files: Record<string, string> = {
    "basic.ts": formatBasicFileContent(basic),
    "character.ts": formatCharacterFileContent(stats),
    "basicAttacks.ts": getAttackFileContent("basicAttacks"),
    "skillAttacks.ts": getAttackFileContent("skillAttacks"),
    "liberationAttacks.ts": getAttackFileContent("liberationAttacks"),
    "forteCircuitAttacks.ts": getAttackFileContent("forteCircuitAttacks"),
    "introAttacks.ts": getAttackFileContent("introAttacks"),
    "outroAttacks.ts": getAttackFileContent("outroAttacks"),
    "tuneBreakAttacks.ts": getAttackFileContent("tuneBreakAttacks"),
    "buffs.ts": "export const buffs = [];\n",
    "resonanceChains.ts": "export const resonanceChains = [];\n",
    "presets.ts":
      "export const rotations: RotationPreset[] = [];\nexport const echoes = [];\n",
    "index.ts": INDEX_TEMPLATE,
  };

  for (const [fileName, fileContent] of Object.entries(files)) {
    fs.writeFileSync(path.join(characterDir, fileName), fileContent);
  }

  return characterDir;
}

export function characterFolderExists(
  charactersDir: string,
  key: string,
): boolean {
  return fs.existsSync(path.join(charactersDir, key));
}
