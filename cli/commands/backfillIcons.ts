import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import {
  fetchCharacterDetail,
  fetchCharacterList,
  resolveEncoreAssetUrl,
  type ApiCharacterDetail,
  type ApiCharacterListItem,
} from "../lib/api.js";
import { getCombatInherentSkills } from "../lib/buffs.js";
import {
  patchBasicFileFields,
  patchResonanceChainIcons,
  patchSkillAttackIcon,
} from "../lib/iconBackfill.js";
import { toCharacterKey } from "../lib/naming.js";
import { withSpinner } from "../lib/progress.js";
import { printReviewChecklist } from "../lib/reviewNotices.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");
const charactersDir = path.join(projectRoot, "src/characters");

// SkillType -> attack file export name, matching cli/lib/skillAttacks.ts's
// SKILL_TYPE_TO_EXPORT. "Tune Break" isn't in that map (tuneBreakAttacks.ts
// has its own generator in cli/lib/tuneBreakAttacks.ts) but uses the exact
// same {name, description, icon, attacks} shape, so it patches the same way.
const SKILL_TYPE_TO_FILE: Record<string, string> = {
  "Normal Attack": "basicAttacks.ts",
  "Resonance Skill": "skillAttacks.ts",
  "Resonance Liberation": "liberationAttacks.ts",
  "Intro Skill": "introAttacks.ts",
  "Forte Circuit": "forteCircuitAttacks.ts",
  "Outro Skill": "outroAttacks.ts",
  "Tune Break": "tuneBreakAttacks.ts",
};

interface LocalBasicInfo {
  name: string;
  element: string;
  gender: string;
  rarity: number;
}

async function loadLocalBasicInfo(key: string): Promise<LocalBasicInfo | null> {
  const basicPath = path.join(charactersDir, key, "basic.ts");
  if (!fs.existsSync(basicPath)) {
    return null;
  }
  const moduleUrl = `${pathToFileURL(basicPath).href}?t=${Date.now()}`;
  const mod = await import(moduleUrl);
  const info = mod.getCharacterBasicInfo();
  return {
    name: info.name,
    element: info.element,
    gender: info.gender,
    rarity: info.rarity,
  };
}

function getCharacterFolderKeys(): string[] {
  return fs
    .readdirSync(charactersDir)
    .filter((entry) => fs.statSync(path.join(charactersDir, entry)).isDirectory())
    .sort();
}

const ROVER_PATTERN = /^Rover(Aero|Havoc|Spectro|Electro)(Male|Female)$/i;

interface Resolution {
  key: string;
  id: number;
}

interface UnresolvedCharacter {
  key: string;
  reason: string;
}

async function resolveRoverId(
  folderKey: string,
  match: RegExpExecArray,
  apiList: ApiCharacterListItem[],
  localGender: string,
  detailCache: Map<number, ApiCharacterDetail>,
): Promise<Resolution | UnresolvedCharacter> {
  const element = match[1]!.toLowerCase();
  const candidates = apiList.filter(
    (entry) =>
      entry.Name.replace(/[^a-zA-Z]/g, "").toLowerCase() === `rover${element}`,
  );

  if (candidates.length === 0) {
    return { key: folderKey, reason: `No API entries found for Rover ${element}` };
  }

  for (const candidate of candidates) {
    let detail = detailCache.get(candidate.Id);
    if (!detail) {
      detail = await fetchCharacterDetail(candidate.Id);
      detailCache.set(candidate.Id, detail);
      await sleep(150);
    }
    const apiGender = detail.favorRole?.Sex?.Content?.toLowerCase();
    if (apiGender === localGender.toLowerCase()) {
      return { key: folderKey, id: candidate.Id };
    }
  }

  return {
    key: folderKey,
    reason: `Could not match gender "${localGender}" among ${candidates.length} Rover ${element} candidates (IDs: ${candidates.map((c) => c.Id).join(", ")})`,
  };
}

async function resolveCharacterIds(
  folderKeys: string[],
  apiList: ApiCharacterListItem[],
): Promise<{ resolved: Resolution[]; unresolved: UnresolvedCharacter[] }> {
  const apiEntriesByKey = new Map<string, ApiCharacterListItem[]>();
  for (const entry of apiList) {
    const key = toCharacterKey(entry.Name);
    if (!apiEntriesByKey.has(key)) {
      apiEntriesByKey.set(key, []);
    }
    apiEntriesByKey.get(key)!.push(entry);
  }

  const resolved: Resolution[] = [];
  const unresolved: UnresolvedCharacter[] = [];
  const detailCache = new Map<number, ApiCharacterDetail>();

  for (const folderKey of folderKeys) {
    const roverMatch = ROVER_PATTERN.exec(folderKey);
    if (roverMatch) {
      const localInfo = await loadLocalBasicInfo(folderKey);
      if (!localInfo) {
        unresolved.push({ key: folderKey, reason: "Could not load basic.ts" });
        continue;
      }
      // A couple of Rover folders have "unknown" in basic.ts's own gender
      // field (a pre-existing data gap) even though the folder name itself
      // spells out the gender (e.g. Roverelectrofemale) — fall back to that.
      const gender =
        localInfo.gender && localInfo.gender.toLowerCase() !== "unknown"
          ? localInfo.gender
          : roverMatch[2]!.toLowerCase();
      const result = await resolveRoverId(
        folderKey,
        roverMatch,
        apiList,
        gender,
        detailCache,
      );
      if ("id" in result) {
        resolved.push(result);
      } else {
        unresolved.push(result);
      }
      continue;
    }

    const candidates = apiEntriesByKey.get(folderKey);
    if (!candidates || candidates.length === 0) {
      unresolved.push({
        key: folderKey,
        reason: "No API character found with a matching name",
      });
      continue;
    }
    if (candidates.length > 1) {
      unresolved.push({
        key: folderKey,
        reason: `${candidates.length} API entries share this name (IDs: ${candidates.map((c) => c.Id).join(", ")}) — needs manual resolution`,
      });
      continue;
    }
    resolved.push({ key: folderKey, id: candidates[0]!.Id });
  }

  return { resolved, unresolved };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface CharacterBackfillOutcome {
  key: string;
  changedFiles: string[];
  notices: string[];
}

async function backfillCharacter(
  key: string,
  detail: ApiCharacterDetail,
): Promise<CharacterBackfillOutcome> {
  const characterDir = path.join(charactersDir, key);
  const changedFiles: string[] = [];
  const notices: string[] = [];

  const resonanceChainsPath = path.join(characterDir, "resonanceChains.ts");
  if (fs.existsSync(resonanceChainsPath) && detail.ResonantChain) {
    const iconBySequence = new Map<number, string>();
    for (const chain of detail.ResonantChain) {
      if (chain.NodeIcon) {
        iconBySequence.set(chain.GroupIndex, resolveEncoreAssetUrl(chain.NodeIcon));
      }
    }
    const content = fs.readFileSync(resonanceChainsPath, "utf8");
    const result = patchResonanceChainIcons(content, iconBySequence);
    notices.push(...result.notices);
    if (result.changed) {
      fs.writeFileSync(resonanceChainsPath, result.content);
      changedFiles.push("resonanceChains.ts");
    }
  }

  for (const [skillType, fileName] of Object.entries(SKILL_TYPE_TO_FILE)) {
    const filePath = path.join(characterDir, fileName);
    if (!fs.existsSync(filePath)) {
      continue;
    }
    const skill = detail.Skills.find((entry) => entry.SkillType === skillType);
    if (!skill?.Icon) {
      notices.push(`${fileName}: no Icon from the API for "${skillType}".`);
      continue;
    }
    const content = fs.readFileSync(filePath, "utf8");
    const result = patchSkillAttackIcon(content, skill.Icon);
    notices.push(...result.notices.map((notice) => `${fileName}: ${notice}`));
    if (result.changed) {
      fs.writeFileSync(filePath, result.content);
      changedFiles.push(fileName);
    }
  }

  const basicPath = path.join(characterDir, "basic.ts");
  if (fs.existsSync(basicPath)) {
    const combatInherentSkills = getCombatInherentSkills(detail);
    if (combatInherentSkills.length !== 2) {
      notices.push(
        `basic.ts: expected 2 combat inherent skills but found ${combatInherentSkills.length}.`,
      );
    }
    const inherentSkillIcons = combatInherentSkills
      .map((skill) => skill.Icon)
      .filter((icon): icon is string => Boolean(icon));

    const content = fs.readFileSync(basicPath, "utf8");
    const result = patchBasicFileFields(content, {
      image: detail.RolePortrait,
      inherentSkillIcons,
    });
    notices.push(...result.notices);
    if (result.changed) {
      fs.writeFileSync(basicPath, result.content);
      changedFiles.push("basic.ts");
    }
  }

  return { key, changedFiles, notices };
}

export interface BackfillIconsOptions {
  character?: string;
}

export async function runBackfillIcons(
  options: BackfillIconsOptions = {},
): Promise<void> {
  const apiList = await withSpinner(
    "Fetching character list from Encore API",
    () => fetchCharacterList(),
    (result) => `Loaded ${result.length} characters`,
  );

  const allFolderKeys = getCharacterFolderKeys();
  const folderKeys = options.character
    ? allFolderKeys.filter((key) => key === options.character)
    : allFolderKeys;

  if (options.character && folderKeys.length === 0) {
    throw new Error(
      `No character folder named "${options.character}" under src/characters.`,
    );
  }

  const { resolved, unresolved } = await withSpinner(
    `Resolving ${folderKeys.length} character(s) to API IDs`,
    () => resolveCharacterIds(folderKeys, apiList),
    (result) => `Resolved ${result.resolved.length}/${folderKeys.length}`,
  );

  const outcomes: CharacterBackfillOutcome[] = [];
  const allNotices: string[] = [];

  for (const { key, id } of resolved) {
    try {
      const detail = await fetchCharacterDetail(id);
      const outcome = await backfillCharacter(key, detail);
      outcomes.push(outcome);
      console.log(
        `${key}: ${
          outcome.changedFiles.length > 0
            ? `updated ${outcome.changedFiles.join(", ")}`
            : "already up to date"
        }`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`${key}: FAILED: ${message}`);
      allNotices.push(`${key}: failed to backfill — ${message}`);
    }
    await sleep(150);
  }

  for (const outcome of outcomes) {
    for (const notice of outcome.notices) {
      allNotices.push(`${outcome.key} — ${notice}`);
    }
  }
  for (const { key, reason } of unresolved) {
    allNotices.push(`${key}: could not resolve to an API character — ${reason}`);
  }

  const totalChangedFiles = outcomes.reduce(
    (sum, outcome) => sum + outcome.changedFiles.length,
    0,
  );
  console.log(
    `\nBackfilled ${outcomes.filter((o) => o.changedFiles.length > 0).length}/${folderKeys.length} character(s), ${totalChangedFiles} file(s) changed.`,
  );

  printReviewChecklist(allNotices);
}
