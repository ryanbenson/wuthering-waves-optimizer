#!/usr/bin/env node
import { Command } from "commander";
import { runGenerateCharacter } from "./commands/generateCharacter.js";
import { runGenerateWeapon } from "./commands/generateWeapon.js";
import { runImportEchoes } from "./commands/importEchoes.js";
import { runGenerateEchoPreset } from "./commands/generateEchoPreset.js";
import { runBackfillIcons } from "./commands/backfillIcons.js";

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
  .action(async (commandOptions: { mergeModifiers?: boolean }) => {
    try {
      await runGenerateCharacter({
        mergeModifiers: commandOptions.mergeModifiers,
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
  .action(async () => {
    try {
      await runGenerateWeapon();
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

const importCommand = program
  .command("import")
  .description("Import data from external APIs");

importCommand
  .command("echoes")
  .description("Import echoes from Encore API into src/echoes/index.ts")
  .action(async () => {
    try {
      await runImportEchoes();
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
