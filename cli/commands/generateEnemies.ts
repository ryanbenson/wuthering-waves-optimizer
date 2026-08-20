import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { select } from "@inquirer/prompts";
import { fetchMonsterDetail, fetchMonsterList } from "../lib/api.js";
import {
  buildEnemyEntryBlock,
  buildOverwrittenEnemiesFile,
  hasUsableResistData,
  insertEnemyBlocks,
  parseEnemiesFile,
  selectNewEnemies,
} from "../lib/enemies.js";
import { createProgressSpinner, withSpinner } from "../lib/progress.js";
import { printReviewChecklist } from "../lib/reviewNotices.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");
const enemiesIndexPath = path.join(projectRoot, "src/enemies/index.ts");

const DETAIL_FETCH_CONCURRENCY = 8;

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    for (;;) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= items.length) return;
      results[index] = await fn(items[index]!, index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, worker),
  );
  return results;
}

export type EnemyGeneratorMode = "fill" | "overwrite";

export async function runGenerateEnemies(options: {
  mode?: EnemyGeneratorMode;
} = {}): Promise<void> {
  const mode =
    options.mode ??
    (await select<EnemyGeneratorMode>({
      message: "How should src/enemies/index.ts be generated?",
      choices: [
        {
          name: "Fill in missing enemies only (keep everything else as-is)",
          value: "fill",
        },
        {
          name: "Overwrite the whole file, rebuilding every enemy from the API",
          value: "overwrite",
        },
      ],
    }));

  const apiMonsters = await withSpinner(
    "Fetching monster list from Encore API",
    () => fetchMonsterList(),
    (result) => `Loaded ${result.length} monsters`,
  );

  const fileContent = fs.readFileSync(enemiesIndexPath, "utf8");
  const parsed = parseEnemiesFile(fileContent);

  const toGenerate =
    mode === "overwrite"
      ? selectNewEnemies(apiMonsters, {
          existingKeys: new Set(),
          existingNameCounts: new Map(),
        })
      : selectNewEnemies(apiMonsters, parsed);

  if (toGenerate.length === 0) {
    console.log("No new enemies found — src/enemies/index.ts is already up to date.");
    return;
  }

  const spinner = createProgressSpinner(
    `Fetching enemy details 0/${toGenerate.length}`,
  );
  let completed = 0;
  const details = await mapWithConcurrency(
    toGenerate,
    DETAIL_FETCH_CONCURRENCY,
    async ({ monster }) => {
      const detail = await fetchMonsterDetail(monster.Id);
      completed += 1;
      spinner.update(
        `Fetching enemy details ${completed}/${toGenerate.length} (${monster.Name})`,
      );
      return detail;
    },
  );
  spinner.succeed(
    `Fetched ${toGenerate.length} enemy detail${toGenerate.length === 1 ? "" : "s"}`,
  );

  const notices: string[] = [];
  const blocks: string[] = [];
  toGenerate.forEach(({ monster, key }, index) => {
    const detail = details[index]!;
    if (!hasUsableResistData(detail.Properties)) {
      notices.push(
        `Skipped "${monster.Name}" (${key}) — the Encore API detail response has no resistance data`,
      );
      return;
    }
    blocks.push(buildEnemyEntryBlock(monster, key, detail));
  });

  if (blocks.length === 0) {
    console.log("No new enemies found — src/enemies/index.ts is already up to date.");
    printReviewChecklist(notices);
    return;
  }

  const updatedContent =
    mode === "overwrite"
      ? buildOverwrittenEnemiesFile(fileContent, blocks)
      : insertEnemyBlocks(fileContent, parsed.insertAt, blocks);

  fs.writeFileSync(enemiesIndexPath, updatedContent);

  console.log(`Updated ${path.relative(projectRoot, enemiesIndexPath)}`);
  console.log(
    `${mode === "overwrite" ? "Regenerated" : "Added"} ${blocks.length} enem${blocks.length === 1 ? "y" : "ies"}.`,
  );
  printReviewChecklist(notices);
}
