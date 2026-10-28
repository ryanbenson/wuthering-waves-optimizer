import path from "path";
import fs from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import type { AttackFrames } from "../../src/calculator/frameData.js";
import {
  describeFrameChanges,
  matchAttacks,
  renderCharacterFramesFile,
  renderEchoFramesFile,
  wuwalabSlugFor,
  type OurAttack,
} from "../lib/frames.js";
import { frameOverrides } from "../lib/frameOverrides.js";
import {
  directorySource,
  liveSource,
  politePause,
  type WuwalabCard,
  type WuwalabDetail,
} from "../lib/wuwalab.js";
import { withSpinner } from "../lib/progress.js";
import { printReviewChecklist } from "../lib/reviewNotices.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");
const charactersDir = path.join(projectRoot, "src/characters");
const echoFramesPath = path.join(projectRoot, "src/echoes/frames.ts");

const ATTACK_GROUPS = [
  "basicAttacks",
  "skillAttacks",
  "liberationAttacks",
  "forteCircuitAttacks",
  "introAttacks",
  "outroAttacks",
  "tuneBreakAttacks",
];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function characterFolders(only?: string[]): string[] {
  const wanted = only?.map((name) => name.toLowerCase());
  return fs
    .readdirSync(charactersDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(charactersDir, entry.name, "index.ts")))
    .map((entry) => entry.name)
    .filter((name) => !wanted || wanted.includes(name.toLowerCase()))
    .sort();
}

async function importModule(file: string): Promise<any> {
  return import(pathToFileURL(file).href);
}

function collectAttacks(data: any): OurAttack[] {
  return ATTACK_GROUPS.flatMap((group) =>
    (data?.[group]?.attacks ?? []).map((attack: any) => ({
      key: attack.key,
      label: attack.label,
      group,
      talents: attack.talents,
    })),
  );
}

/** Makes the character's index.ts load and return its generated frames. */
export function addFramesToIndex(source: string): string {
  if (source.includes('from "./frames.ts"')) return source;
  const eol = source.includes("\r\n") ? "\r\n" : "\n";
  const lines = source.split(eol);
  let lastImport = -1;
  lines.forEach((line, index) => {
    if (line.startsWith("import ")) lastImport = index;
  });
  lines.splice(lastImport + 1, 0, 'import { frames } from "./frames.ts";');
  return lines.join(eol).replace(/(export function getData\(\) \{\r?\n\s*return \{\r?\n)/, `$1    frames,${eol}`);
}

export async function runImportFrames(
  options: { characters?: string[]; echoes?: boolean; from?: string } = {},
): Promise<void> {
  const source = options.from ? directorySource(path.resolve(options.from)) : liveSource;
  const pause = () => (source.offline ? Promise.resolve() : politePause());
  const syncedAt = today();
  const notices: string[] = [];
  const summary: string[] = [];

  const roster = await withSpinner(
    "Fetching wuwalab character list",
    () => source.characters(),
    (cards) => `wuwalab lists ${cards.length} characters`,
  );
  const rosterSlugs = new Set(roster.map((card) => card.slug));
  const cache = new Map<string, WuwalabDetail | null>();

  for (const folder of characterFolders(options.characters)) {
    const slug = wuwalabSlugFor(folder);
    if (!rosterSlugs.has(slug)) {
      summary.push(`${folder}: not on wuwalab, skipped`);
      continue;
    }
    if (!cache.has(slug)) {
      cache.set(slug, await source.character(slug));
      await pause();
    }
    const detail = cache.get(slug);
    if (!detail?.abilities?.length) {
      summary.push(`${folder}: no frame data on wuwalab yet`);
      continue;
    }

    const folderPath = path.join(charactersDir, folder);
    const framesPath = path.join(folderPath, "frames.ts");
    const previous = fs.existsSync(framesPath)
      ? ((await importModule(framesPath)).frames?.attacks as Record<string, AttackFrames> | undefined)
      : undefined;
    const data = (await importModule(path.join(folderPath, "index.ts"))).getData();

    const attacks = collectAttacks(data);
    const result = matchAttacks(folder, attacks, detail.abilities, frameOverrides[folder]);
    fs.writeFileSync(framesPath, renderCharacterFramesFile({ syncedAt, attacks: result.attacks }));
    const indexPath = path.join(folderPath, "index.ts");
    fs.writeFileSync(indexPath, addFramesToIndex(fs.readFileSync(indexPath, "utf8")));

    notices.push(...result.notices, ...describeFrameChanges(folder, previous, result.attacks));
    if (result.unmatched.length) {
      notices.push(`${folder}: no frames for ${result.unmatched.join(", ")}`);
    }
    summary.push(`${folder}: ${Object.keys(result.attacks).length}/${attacks.length} attacks`);
  }

  if (options.echoes !== false) {
    const echoList = await withSpinner(
      "Fetching wuwalab echo list",
      () => source.echoes(),
      (cards) => `wuwalab lists ${cards.length} echoes`,
    );
    const { mainEchoesData } = await importModule(path.join(projectRoot, "src/echoes/index.ts"));
    const ours = Object.values(mainEchoesData as Record<string, any>);
    const byName = new Map(ours.map((echo: any) => [echo.name, echo]));
    const echoFrames: Record<string, Record<string, AttackFrames>> = {};
    for (const card of echoList as (WuwalabCard & { implemented?: boolean })[]) {
      const echo = byName.get(card.name);
      if (!echo || card.implemented === false) continue;
      const detail = await source.echo(card.slug);
      await pause();
      if (!detail?.abilities?.length) continue;
      const attacks: OurAttack[] = (echo.actions ?? []).map((action: any) => ({
        key: action.key,
        label: action.label,
        group: "echoAttacks",
        talents: action.talents,
      }));
      const result = matchAttacks(echo.key, attacks, detail.abilities);
      if (Object.keys(result.attacks).length) echoFrames[echo.key] = result.attacks;
      notices.push(...result.notices);
    }
    fs.writeFileSync(echoFramesPath, renderEchoFramesFile(syncedAt, echoFrames));
    summary.push(`echoes: ${Object.keys(echoFrames).length} with frames`);
  }

  console.log(`\n${summary.join("\n")}`);
  printReviewChecklist(notices);
}
