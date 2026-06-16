#!/usr/bin/env node
import { Command } from "commander";
import { runGenerateCharacter } from "./commands/generateCharacter.js";

const program = new Command();

program
  .name("ww")
  .description("Wuthering Waves Optimizer CLI")
  .version("0.0.1");

const generate = program.command("generate").description("Generate project assets");

generate
  .command("character")
  .description("Scaffold a new character folder and register it in characters.ts")
  .action(async () => {
    try {
      await runGenerateCharacter();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Error: ${message}`);
      process.exit(1);
    }
  });

program.parse();
