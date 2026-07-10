import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { confirm, input, search, select } from "@inquirer/prompts";
import {
  appendEchoPreset,
  buildEchoPreset,
  ELEMENT_MAIN_STATS,
  getElementLabel,
  loadEchoCandidates,
  loadEchoSetLabels,
  parseCharacterOptions,
  type AttackTypeChoice,
  type EchoPresetInput,
  type ElementMainStat,
  type MainStatFocus,
  type SetCombo,
  type SetStyle,
  type ThreeCostMainStat,
} from "../lib/echoPresets.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");
const charactersDir = path.join(projectRoot, "src/characters");
const charactersRegistryPath = path.join(charactersDir, "characters.ts");
const echoesFilePath = path.join(projectRoot, "src/echoes/index.ts");
const statsFilePath = path.join(projectRoot, "src/echoes/stats.ts");

const ELEMENT_LABELS = Object.fromEntries(
  ELEMENT_MAIN_STATS.map((element) => [element, getElementLabel(element)]),
) as Record<ElementMainStat, string>;

function normalizeElementMainStat(element: string): ElementMainStat {
  if (ELEMENT_MAIN_STATS.includes(element as ElementMainStat)) {
    return element as ElementMainStat;
  }
  return "Spectro";
}

async function promptSetKey(
  message: string,
  setLabels: Map<string, string>,
): Promise<string> {
  const options = [...setLabels.entries()]
    .sort((left, right) => left[1].localeCompare(right[1]))
    .map(([key, label]) => ({
      name: label,
      value: key,
    }));

  return search({
    message,
    source: async (query) => {
      const normalized = (query ?? "").trim().toLowerCase();
      if (!normalized) {
        return options;
      }

      return options.filter(
        (option) =>
          option.name.toLowerCase().includes(normalized) ||
          option.value.toLowerCase().includes(normalized),
      );
    },
  });
}

async function promptFourCostMains(
  setStyle: SetStyle,
): Promise<Array<"CritRate" | "CritDMG" | "ATK" | "HP" | "DEF" | "HealingBonus">> {
  const fourCostChoices = [
    { name: "Crit Rate (CR)", value: "CritRate" as const },
    { name: "Crit DMG (CD)", value: "CritDMG" as const },
    { name: "ATK%", value: "ATK" as const },
    { name: "HP%", value: "HP" as const },
    { name: "DEF%", value: "DEF" as const },
    { name: "Healing Bonus", value: "HealingBonus" as const },
  ];

  if (setStyle === "44111") {
    const first = await select({
      message: "4-cost echo #1 main stat",
      choices: fourCostChoices,
    });
    const second = await select({
      message: "4-cost echo #2 main stat",
      choices: fourCostChoices,
    });
    return [first, second];
  }

  const main = await select({
    message: "4-cost main stat",
    choices: fourCostChoices,
  });

  return [main];
}

async function promptThreeCostConfig(
  setStyle: SetStyle,
  characterElement: ElementMainStat,
): Promise<{
  threeCostMainCount: 0 | 1 | 2;
  threeCostMain: ThreeCostMainStat | null;
  threeCostElement: ElementMainStat | null;
}> {
  if (setStyle === "44111") {
    return {
      threeCostMainCount: 0,
      threeCostMain: null,
      threeCostElement: null,
    };
  }

  const threeCostMainCount = await select({
    message: "How many 3-cost echoes share a special main stat? (0, 1, or 2)",
    choices: [
      { name: "0 — filler 3-cost mains only", value: 0 as const },
      { name: "1 — one 3-cost with a special main stat", value: 1 as const },
      { name: "2 — two 3-cost echoes (e.g. 2x Glacio, 2x ATK)", value: 2 as const },
    ],
  });

  if (threeCostMainCount === 0) {
    return { threeCostMainCount, threeCostMain: null, threeCostElement: null };
  }

  const threeCostMain = await select({
    message: "3-cost main stat",
    choices: [
      { name: "Element DMG Bonus", value: "element" as const },
      { name: "ATK%", value: "ATK" as const },
      { name: "Energy Regen", value: "EnergyRegen" as const },
      { name: "HP%", value: "HP" as const },
      { name: "DEF%", value: "DEF" as const },
    ],
  });

  if (threeCostMain !== "element") {
    return { threeCostMainCount, threeCostMain, threeCostElement: null };
  }

  const threeCostElement = await select({
    message: "Element DMG Bonus",
    default: characterElement,
    choices: ELEMENT_MAIN_STATS.map((element) => ({
      name:
        element === characterElement
          ? `${ELEMENT_LABELS[element]} (character element)`
          : ELEMENT_LABELS[element],
      value: element,
    })),
  });

  return { threeCostMainCount, threeCostMain, threeCostElement };
}

export async function runGenerateEchoPreset(): Promise<void> {
  const charactersContent = fs.readFileSync(charactersRegistryPath, "utf8");
  const characters = parseCharacterOptions(charactersContent, charactersDir);
  const setLabels = loadEchoSetLabels(statsFilePath);
  const echoCandidates = loadEchoCandidates(echoesFilePath);

  const selectedCharacterKey = await search({
    message: "Select a character",
    source: async (query) => {
      const normalized = (query ?? "").trim().toLowerCase();
      return characters
        .filter((character) => {
          if (!normalized) {
            return true;
          }
          return (
            character.name.toLowerCase().includes(normalized) ||
            character.key.toLowerCase().includes(normalized)
          );
        })
        .map((character) => ({
          name: `${character.name} (${character.presetCount} echo preset${character.presetCount === 1 ? "" : "s"})`,
          value: character.key,
        }));
    },
  });

  const character = characters.find((entry) => entry.key === selectedCharacterKey);
  if (!character) {
    throw new Error(`Unknown character: ${selectedCharacterKey}`);
  }

  const presetsPath = path.join(charactersDir, character.key, "presets.ts");
  if (!fs.existsSync(presetsPath)) {
    throw new Error(`Missing presets file: ${presetsPath}`);
  }

  const setCombo = await select({
    message: "Set bonus combination",
    choices: [
      {
        name: "5-piece — all 5 echoes from one set (also grants 2-piece)",
        value: "5" as const,
      },
      {
        name: "2+5 — 5-piece from one set (2-piece must match the 5-piece set)",
        value: "25" as const,
      },
      {
        name: "2+3 — 3 echoes from main set, 2 from secondary set",
        value: "23" as const,
      },
      {
        name: "2+2+1 — 2 echoes each from two sets, 1 from a third set",
        value: "221" as const,
      },
    ],
  });

  const setKeys: string[] = [];
  const primarySet = await promptSetKey("Primary echo set", setLabels);
  setKeys.push(primarySet);

  if (setCombo === "23") {
    const secondarySet = await promptSetKey("Secondary echo set (2-piece)", setLabels);
    if (secondarySet === primarySet) {
      throw new Error("Secondary set must differ from the primary set for 2+3 builds");
    }
    setKeys.push(secondarySet);
  }

  if (setCombo === "221") {
    const secondarySet = await promptSetKey("Secondary echo set (2-piece)", setLabels);
    const tertiarySet = await promptSetKey("Tertiary echo set (1-piece)", setLabels);
    setKeys.push(secondarySet, tertiarySet);
  }

  if (setCombo === "25" && setKeys.length === 1) {
    // 2+5 uses the same set for all echoes; the 2-piece automatically matches.
  }

  const setStyle = await select({
    message: "Echo cost layout",
    choices: [
      {
        name: "43311 — 1x 4-cost, 2x 3-cost, 2x 1-cost",
        value: "43311" as const,
      },
      {
        name: "44111 — 2x 4-cost, 3x 1-cost",
        value: "44111" as const,
      },
    ],
  });

  const targetErInput = await input({
    message: "Target ER% from echo substats",
    default: "18.4",
    validate: (value) => {
      const parsed = Number(value);
      if (Number.isNaN(parsed) || parsed < 0) {
        return "Enter a non-negative number";
      }
      return true;
    },
  });

  const fourCostMains = await promptFourCostMains(setStyle);
  const characterElement = normalizeElementMainStat(character.element);
  const { threeCostMainCount, threeCostMain, threeCostElement } =
    await promptThreeCostConfig(setStyle, characterElement);

  const attackType = await select({
    message: "Main attack type bonus",
    choices: [
      { name: "Basic Attack", value: "basic" as const },
      { name: "Heavy Attack", value: "heavy" as const },
      { name: "Resonance Skill", value: "skill" as const },
      { name: "Resonance Liberation", value: "liberation" as const },
      { name: "None", value: "none" as const },
    ],
  });

  const mainStatFocus = await select({
    message: "Main stat focus for substats",
    choices: [
      { name: "ATK", value: "atk" as const },
      { name: "HP", value: "hp" as const },
      { name: "DEF", value: "def" as const },
    ],
  });

  const presetName = await input({
    message: "Preset name",
    default:
      setStyle === "44111"
        ? "Standard Build"
        : `Standard ${fourCostMains[0] === "CritRate" ? "CR" : "CD"} Build`,
  });

  const author = await input({
    message: "Author",
    default: "thundertooth",
  });

  const presetInput: EchoPresetInput = {
    characterKey: character.key,
    characterElement,
    presetName,
    author,
    setCombo: setCombo as SetCombo,
    setKeys,
    setStyle: setStyle as SetStyle,
    targetEr: Number(targetErInput),
    fourCostMains,
    threeCostMain,
    threeCostMainCount,
    ...(threeCostElement ? { threeCostElement } : {}),
    mainStatFocus: mainStatFocus as MainStatFocus,
    attackType: attackType as AttackTypeChoice,
  };

  const preset = buildEchoPreset(presetInput, echoCandidates, setLabels);

  console.log("\nGenerated preset preview:");
  console.log(`  Name: ${preset.name}`);
  console.log(`  Description: ${preset.description}`);
  console.log(`  Author: ${preset.author}`);
  console.log("  Echoes:");
  for (const [slot, echo] of Object.entries(preset.data.echoes)) {
    console.log(`    [${slot}] ${echo.echo} (${echo.type}-cost, ${echo.stat})`);
  }

  const shouldWrite = await confirm({
    message: `Append this preset to ${presetsPath}?`,
    default: true,
  });

  if (!shouldWrite) {
    console.log("Cancelled.");
    return;
  }

  appendEchoPreset(presetsPath, preset);
  console.log(`Added echo preset to ${presetsPath}`);
}
