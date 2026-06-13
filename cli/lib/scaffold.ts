import fs from "fs";
import path from "path";

export interface CharacterScaffoldInput {
  key: string;
  name: string;
  rarity: number;
  element: string;
  weaponPlural: string;
}

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

function getBasicFileContent(input: CharacterScaffoldInput): string {
  return `export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "${input.name}",
    rarity: ${input.rarity},
    weapon: "${input.weaponPlural}",
    avatarUrl: "${input.key}.png",
    gender: "female",
    element: "${input.element}",
  };
}
`;
}

function getCharacterFileContent(): string {
  return `interface CharacterData {
  [level: string]: LevelData;
}

interface LevelData {
  hp: number;
  attack: number;
  defense: number;
}

const characterData: CharacterData = {};

export const character = { ...characterData };

export function getCharacterStatsByLevel(level: string): LevelData {
  return characterData[level];
}
`;
}

function getAttackFileContent(exportName: string): string {
  return ATTACK_STUB.replace("ATTACK_NAME", exportName);
}

export function scaffoldCharacterFolder(
  charactersDir: string,
  input: CharacterScaffoldInput,
): string {
  const characterDir = path.join(charactersDir, input.key);
  fs.mkdirSync(characterDir, { recursive: true });

  const files: Record<string, string> = {
    "basic.ts": getBasicFileContent(input),
    "character.ts": getCharacterFileContent(),
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
