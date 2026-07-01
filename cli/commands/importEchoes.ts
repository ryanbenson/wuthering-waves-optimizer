import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { fetchEchoList } from "../lib/api.js";
import {
  buildImportedEchoesFile,
  getEchoImportNotices,
  loadEchoSetLabelToKeyMap,
} from "../lib/echoes.js";
import { withSpinner } from "../lib/progress.js";
import { printReviewChecklist } from "../lib/reviewNotices.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");
const echoesIndexPath = path.join(projectRoot, "src/echoes/index.ts");
const echoStatsPath = path.join(projectRoot, "src/echoes/stats.ts");

export async function runImportEchoes(): Promise<void> {
  const apiEchoes = await withSpinner(
    "Fetching echo list from Encore API",
    () => fetchEchoList(),
    (result) => `Loaded ${result.length} echoes`,
  );

  const labelToKey = loadEchoSetLabelToKeyMap(echoStatsPath);
  const echoesFileContent = fs.readFileSync(echoesIndexPath, "utf8");
  const result = buildImportedEchoesFile({
    echoesFileContent,
    apiEchoes,
    labelToKey,
  });

  fs.writeFileSync(echoesIndexPath, result.content);

  console.log(`Updated ${path.relative(projectRoot, echoesIndexPath)}`);
  printReviewChecklist(getEchoImportNotices(result));
}
