#!/usr/bin/env node
import { Command } from "commander";
import { runGenerateCharacter } from "./commands/generateCharacter.js";
import { runGenerateWeapon } from "./commands/generateWeapon.js";
import { runImportEchoes } from "./commands/importEchoes.js";
import { runImportFrames } from "./commands/importFrames.js";
import { runGenerateEchoPreset } from "./commands/generateEchoPreset.js";
import { runGenerateEnemies, type EnemyGeneratorMode } from "./commands/generateEnemies.js";
import { runBackfillIcons } from "./commands/backfillIcons.js";

function parseIdOption(value: string): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`--id must be a positive integer, got '${value}'`);
  }
  return id;
}

const program = new Command();

program
  .name("ww")
  .description("Wuthering Waves Optimizer CLI")
  .version("0.0.1");

const generate = program.command("generate").description("Generate project assets");

generate
  .command("character")
  .description("Scaffold a new character folder and register it in characters.ts")
  .option(
    "--merge-modifiers",
    "When regenerating, update key/name/details from API and keep other entry properties",
  )
  .option("--beta", "Use the Beta API without prompting")
  .option("--no-beta", "Use the live API without prompting")
  .option("--id <id>", "Character ID to generate, skipping the search prompt", parseIdOption)
  .action(async (commandOptions: { mergeModifiers?: boolean; beta?: boolean; id?: number }) => {
    try {
      await runGenerateCharacter({
        mergeModifiers: commandOptions.mergeModifiers,
        beta: commandOptions.beta,
        id: commandOptions.id,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Error: ${message}`);
      process.exit(1);
    }
  });

generate
  .command("weapon")
  .description("Scaffold a new weapon file and register it in weapons.ts")
  .option("--id <id>", "Weapon ID to generate, skipping the search prompt", parseIdOption)
  .action(async (commandOptions: { id?: number }) => {
    try {
      await runGenerateWeapon({ id: commandOptions.id });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Error: ${message}`);
      process.exit(1);
    }
  });

generate
  .command("echo-preset")
  .description("Generate an echo preset and append it to a character presets.ts")
  .action(async () => {
    try {
      await runGenerateEchoPreset();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Error: ${message}`);
      process.exit(1);
    }
  });

generate
  .command("enemies")
  .description("Generate src/enemies/index.ts from the Encore API")
  .option(
    "--mode <mode>",
    "Skip the interactive prompt: 'fill' to add only missing enemies, 'overwrite' to rebuild every enemy from the API",
  )
  .action(async (commandOptions: { mode?: string }) => {
    try {
      if (
        commandOptions.mode !== undefined &&
        commandOptions.mode !== "fill" &&
        commandOptions.mode !== "overwrite"
      ) {
        throw new Error(`--mode must be 'fill' or 'overwrite', got '${commandOptions.mode}'`);
      }
      await runGenerateEnemies({
        mode: commandOptions.mode as EnemyGeneratorMode | undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Error: ${message}`);
      process.exit(1);
    }
  });

const importCommand = program
  .command("import")
  .description("Import data from external APIs");

importCommand
  .command("echoes")
  .description("Import echoes from Encore API into src/echoes/index.ts")
  .option(
    "--group <groups...>",
    "Only import echoes whose name starts with '<group>:' (e.g. --group phantom nightmare); everything else is left untouched",
  )
  .option("--beta", "Use the Beta API without prompting")
  .option("--no-beta", "Use the live API without prompting")
  .action(async (commandOptions: { group?: string[]; beta?: boolean }) => {
    try {
      await runImportEchoes({
        beta: commandOptions.beta,
        groups: commandOptions.group,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Error: ${message}`);
      process.exit(1);
    }
  });

importCommand
  .command("frames")
  .description("Import per-attack frame data from wuwalab into each character's frames.ts and src/echoes/frames.ts")
  .option("--character <names...>", "Only these character folders (e.g. --character Suoming Hsin)")
  .option("--no-echoes", "Skip echo frames")
  .option("--from <dir>", "Read a saved copy of the wuwalab API from this folder instead of fetching")
  .action(async (commandOptions: { character?: string[]; echoes?: boolean; from?: string }) => {
    try {
      await runImportFrames({
        characters: commandOptions.character,
        echoes: commandOptions.echoes,
        from: commandOptions.from,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Error: ${message}`);
      process.exit(1);
    }
  });

const backfill = program
  .command("backfill")
  .description("Backfill missing data onto existing characters from the Encore API");

backfill
  .command("icons")
  .description(
    "Add icon references (resonance chains, attack files, character portrait + inherent skills) to every existing character",
  )
  .option(
    "--character <key>",
    "Only backfill this one character folder (e.g. Lynae), for testing",
  )
  .action(async (commandOptions: { character?: string }) => {
    try {
      await runBackfillIcons({ character: commandOptions.character });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Error: ${message}`);
      process.exit(1);
    }
  });

program.parse();
