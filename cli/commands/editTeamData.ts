/**
 * `npm run cli -- edit team-data` (issue #732): report what Recommended teams
 * data is missing, then fill in teammates' typical buffs
 * (`src/buffs/teamBuffDefaults.ts`) and characters' `suggestedTeams`
 * (`src/characters/<Name>/basic.ts`) through prompts that only offer real
 * keys. The logic and file writers live in `cli/lib/teamData.ts`.
 */
import path from "path";
import fs from "fs";
import { spawnSync } from "child_process";
import { fileURLToPath, pathToFileURL } from "url";
import { checkbox, confirm, input, number, search, select } from "@inquirer/prompts";
import { allEchoBuffs, allWeaponTeamBuffs, buffsByCharacter } from "../../src/buffs/index.js";
import { getExclusiveTeamBuffKeys, type ElementName } from "../../src/buffs/teamBuffs.js";
import { TEAM_BUFF_DEFAULTS, type TeamBuffDefault } from "../../src/buffs/teamBuffDefaults.js";
import { characterPickerRoster } from "../../src/characters/characters.js";
import { TEAM_TAGS } from "../../src/characters/teamTags.js";
import {
  buildTeamDataReport,
  describeTeamBuff,
  findSignatureWeaponBuff,
  insertTag,
  listMissingTasks,
  previewChange,
  renderBasicWithTeams,
  renderTeamBuffDefaultsFile,
  renderTeamTagsFile,
  usualStacks,
  validateNewTag,
  type BuffDefLike,
  type SuggestedTeam,
  type TeamBuffDefaults,
  type TeamDataCharacter,
  type TeamDataTask,
} from "../lib/teamData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");
const charactersDir = path.join(projectRoot, "src/characters");
const defaultsFilePath = path.join(projectRoot, "src/buffs/teamBuffDefaults.ts");
const tagsFilePath = path.join(projectRoot, "src/characters/teamTags.ts");
const TEAM_DATA_TESTS = ["tests/buffs/teamBuffDefaults.test.ts", "tests/characters/recommendedTeams.test.ts"];

type BasicInfo = { element?: string; signatureWeapon?: string; suggestedTeams?: SuggestedTeam[] };

type State = { characters: TeamDataCharacter[]; defaults: TeamBuffDefaults; tags: string[] };

const ownBuffs = buffsByCharacter as Record<string, BuffDefLike[]>;
const echoBuffs = allEchoBuffs as BuffDefLike[];
const weaponBuffs = allWeaponTeamBuffs as BuffDefLike[];

function basicPath(key: string): string {
  return path.join(charactersDir, key, "basic.ts");
}

async function loadCharacters(): Promise<TeamDataCharacter[]> {
  const roster = [...characterPickerRoster.five!, ...characterPickerRoster.four!];
  const characters: TeamDataCharacter[] = [];
  for (const { key, name } of roster) {
    const file = basicPath(key);
    let info: BasicInfo = {};
    if (fs.existsSync(file)) {
      const mod = (await import(pathToFileURL(file).href)) as { getCharacterBasicInfo: () => BasicInfo };
      info = mod.getCharacterBasicInfo();
    }
    characters.push({
      key,
      name,
      element: info.element,
      signatureWeapon: info.signatureWeapon,
      suggestedTeams: (info.suggestedTeams ?? []).map((t) => ({ members: [...t.members], tags: t.tags && [...t.tags] })),
    });
  }
  return characters;
}

function nameOf(state: State, key: string): string {
  return state.characters.find((c) => c.key === key)?.name ?? key;
}

function printReport(state: State) {
  const report = buildTeamDataReport(state.characters, state.defaults);
  const withTeams = state.characters.length - report.missingTeams.length;
  console.log("");
  console.log(`Teams: ${withTeams} of ${state.characters.length} characters have suggested teams.`);
  if (report.missingDefaults.length) {
    console.log("Teammates used in a team with no typical buffs yet:");
    for (const m of report.missingDefaults) {
      console.log(`  - ${nameOf(state, m.key)} (in ${m.usedBy.map((k) => nameOf(state, k)).join(", ")})`);
    }
  } else {
    console.log("Every teammate used in a team has typical buffs.");
  }
  if (report.noTeamBuffs.length) {
    console.log(`No team buffs on purpose: ${report.noTeamBuffs.map((k) => nameOf(state, k)).join(", ")}`);
  }
  console.log("");
  return report;
}

function runTeamDataTests() {
  console.log("\nRunning the team data tests…");
  const result = spawnSync("npx", ["vitest", "run", ...TEAM_DATA_TESTS], { cwd: projectRoot, stdio: "inherit" });
  console.log(result.status === 0 ? "Team data tests passed." : "Team data tests FAILED — fix the data above.");
}

async function saveFile(file: string, before: string, after: string): Promise<boolean> {
  console.log(`\n${path.relative(projectRoot, file)}:`);
  console.log(previewChange(before, after));
  if (before === after) return false;
  if (!(await confirm({ message: "Save this change?", default: true }))) return false;
  fs.writeFileSync(file, after);
  return true;
}

function characterChoices(state: State, exclude: string[] = []) {
  return state.characters
    .filter((c) => !exclude.includes(c.key))
    .map((c) => ({ name: c.name === c.key ? c.name : `${c.name} (${c.key})`, value: c.key }));
}

async function pickCharacter(state: State, message: string, exclude: string[] = []): Promise<string> {
  const choices = characterChoices(state, exclude);
  return search({
    message,
    source: async (query) => {
      const q = (query ?? "").trim().toLowerCase();
      return q ? choices.filter((c) => c.name.toLowerCase().includes(q)) : choices;
    },
  });
}

// --- typical buffs ------------------------------------------------------------

async function editTypicalBuffs(state: State, key: string, runTests = true): Promise<void> {
  const character = state.characters.find((c) => c.key === key);
  const existing = state.defaults[key] ?? [];
  const existingByKey = new Map(existing.map((e) => [e.key, e]));
  const element = character?.element as ElementName | undefined;
  console.log(`\nTypical buffs for ${nameOf(state, key)}${state.defaults[key] ? "" : " (none yet)"}`);

  // Their own buffs.
  const defs = ownBuffs[key] ?? [];
  let own: string[] = [];
  if (defs.length) {
    own = await checkbox({
      message: "Which of their own buffs does Use team turn on?",
      pageSize: 15,
      loop: false,
      choices: defs.map((def) => {
        const entry = existingByKey.get(def.key);
        const exclusiveWith = getExclusiveTeamBuffKeys(def.key).map(
          (k) => defs.find((d) => d.key === k)?.name ?? k,
        );
        return {
          name: describeTeamBuff(def, {
            exclusiveWith,
            fullTeamElement: entry?.fullTeamElement,
            stacks: entry?.stacks,
          }),
          value: def.key,
          checked: existingByKey.has(def.key),
        };
      }),
    });
  } else {
    console.log("They have no team buffs of their own.");
  }

  // Stacks.
  const stacks = new Map<string, number>();
  const stacked = defs.filter((d) => own.includes(d.key) && d.hasStacks && d.maxStacks);
  const hasCustomStacks = stacked.some((d) => existingByKey.get(d.key)?.stacks != null);
  if (stacked.length && !(await confirm({ message: "Keep the usual stacks for all of them?", default: !hasCustomStacks }))) {
    for (const def of stacked) {
      const usual = usualStacks(def);
      const value = await number({
        message: `${def.name}: stacks (usual ${usual})`,
        default: existingByKey.get(def.key)?.stacks ?? usual,
        min: def.minStacks ?? 0,
        max: def.maxStacks,
        required: true,
      });
      if (value !== usual) stacks.set(def.key, value);
    }
  }

  // All-element team only.
  let fullTeam: string[] = [];
  if (own.length && element) {
    fullTeam = await checkbox({
      message: `Which of these only work when all three Resonators are ${element}? (a team requirement, not the element the buff boosts; usually none)`,
      loop: false,
      choices: own.map((k) => ({
        name: defs.find((d) => d.key === k)?.name ?? k,
        value: k,
        checked: existingByKey.get(k)?.fullTeamElement != null,
      })),
    });
  }

  // Signature weapon.
  const sigBuff = findSignatureWeaponBuff(character?.signatureWeapon, weaponBuffs);
  let withSig = false;
  if (sigBuff) {
    withSig = await confirm({
      message: `Include ${sigBuff.name}'s team buff (their signature weapon) when Sig is ticked?`,
      default: existing.length === 0 || existingByKey.has(sigBuff.key),
    });
  } else {
    console.log("Their signature weapon has no team buff.");
  }

  // Echoes, in the order picked.
  const existingEchoes = existing.filter((e) => echoBuffs.some((d) => d.key === e.key)).map((e) => e.key);
  let echoes: string[] = [];
  const echoName = (k: string) => echoBuffs.find((d) => d.key === k)?.name ?? k;
  if (
    existingEchoes.length &&
    (await confirm({ message: `Keep their echoes: ${existingEchoes.map(echoName).join(", ")}?`, default: true }))
  ) {
    echoes = existingEchoes;
  } else {
    const DONE = "__done__";
    for (;;) {
      const picked = await search({
        message: echoes.length ? `Echoes so far: ${echoes.map(echoName).join(", ")}. Add another?` : "Their usual echo buffs (set or main echo):",
        source: async (query) => {
          const q = (query ?? "").trim().toLowerCase();
          const options = echoBuffs
            .filter((d) => !echoes.includes(d.key) && (!q || d.name.toLowerCase().includes(q)))
            .map((d) => ({ name: d.name, value: d.key }));
          return [{ name: echoes.length ? "Done" : "None — no echo buffs", value: DONE }, ...options];
        },
      });
      if (picked === DONE) break;
      echoes.push(picked);
    }
  }

  const entries: TeamBuffDefault[] = [
    ...defs
      .filter((d) => own.includes(d.key))
      .map((d) => {
        const entry: TeamBuffDefault = { key: d.key };
        if (stacks.has(d.key)) entry.stacks = stacks.get(d.key);
        if (fullTeam.includes(d.key) && element) entry.fullTeamElement = element;
        return entry;
      }),
    ...(withSig && sigBuff ? [{ key: sigBuff.key, signature: true }] : []),
    ...echoes.map((k) => ({ key: k })),
  ];

  if (!entries.length && !(await confirm({ message: "Nothing picked. Save as 'no team buffs' on purpose?", default: true }))) {
    return;
  }

  const next = { ...state.defaults, [key]: entries };
  const before = fs.readFileSync(defaultsFilePath, "utf8");
  const after = renderTeamBuffDefaultsFile(before, next);
  if (await saveFile(defaultsFilePath, before, after)) {
    state.defaults = next;
    if (runTests) runTeamDataTests();
  }
}

// --- teams --------------------------------------------------------------------

function describeTeam(state: State, team: SuggestedTeam): string {
  const names = team.members.map((m) => nameOf(state, m)).join(" + ");
  const tags = team.tags?.length ? ` [${team.tags.join(", ")}]` : "";
  const missing = team.members.filter((m) => !state.defaults[m]).map((m) => nameOf(state, m));
  return `${names}${tags}${missing.length ? `  (no typical buffs: ${missing.join(", ")})` : ""}`;
}

/** Two teammates for `key`, or null when that pair is already in `others`. */
async function pickTeammates(
  state: State,
  key: string,
  others: SuggestedTeam[],
): Promise<[string, string] | null> {
  const first = await pickCharacter(state, "First teammate:", [key]);
  const second = await pickCharacter(state, "Second teammate:", [key, first]);
  if (others.some((t) => t.members.includes(first) && t.members.includes(second))) {
    console.log("That team is already in the list.");
    return null;
  }
  return [first, second];
}

/** Tags for a team, in the shared list's order; can add new tags to `teamTags.ts`. */
async function pickTags(state: State, current: string[] = []): Promise<string[]> {
  const picked = await checkbox({
    message: "Tags:",
    choices: state.tags.map((t) => ({ name: t, value: t, checked: current.includes(t) })),
  });
  while (await confirm({ message: "Add a new tag to the shared list?", default: false })) {
    const tag = (
      await input({ message: "New tag name (e.g. Tune Break):", validate: (v) => validateNewTag(v, state.tags) ?? true })
    ).trim();
    const after = await select<string | null>({
      message: "Put it after which tag? (this is the order players see)",
      choices: [{ name: "At the start", value: null }, ...state.tags.map((t) => ({ name: t, value: t }))],
      default: state.tags.at(-1),
    });
    const next = insertTag(state.tags, tag, after);
    const before = fs.readFileSync(tagsFilePath, "utf8");
    if (await saveFile(tagsFilePath, before, renderTeamTagsFile(before, next))) {
      state.tags = next;
      picked.push(tag);
    }
  }
  return state.tags.filter((t) => picked.includes(t));
}

function withTags(team: { members: [string, string] }, tags: string[]): SuggestedTeam {
  return tags.length ? { ...team, tags } : team;
}

async function editTeams(state: State, key: string): Promise<void> {
  const character = state.characters.find((c) => c.key === key);
  if (!character) return;
  const teams: SuggestedTeam[] = character.suggestedTeams.map((t) => ({ ...t, members: [...t.members] }));

  for (;;) {
    console.log(`\nTeams for ${character.name}, strongest first:`);
    if (!teams.length) console.log("  (none)");
    teams.forEach((t, i) => console.log(`  ${i + 1}. ${describeTeam(state, t)}`));
    const action = await select({
      message: "What next?",
      choices: [
        { name: "Add a team", value: "add" },
        ...(teams.length ? [{ name: "Edit a team (tags or teammates)", value: "edit" }] : []),
        ...(teams.length ? [{ name: "Remove a team", value: "remove" }] : []),
        ...(teams.length > 1 ? [{ name: "Move a team up", value: "up" }] : []),
        { name: "Save", value: "save" },
        { name: "Cancel (discard changes)", value: "cancel" },
      ],
    });
    if (action === "cancel") return;
    if (action === "add") {
      const members = await pickTeammates(state, key, teams);
      if (!members) continue;
      teams.push(withTags({ members }, await pickTags(state)));
    }
    if (action === "edit") {
      const index = await select({
        message: "Edit which team?",
        choices: teams.map((t, i) => ({ name: describeTeam(state, t), value: i })),
      });
      const team = teams[index]!;
      const part = await select({
        message: `Change ${team.members.map((m) => nameOf(state, m)).join(" + ")}'s…`,
        choices: [
          { name: "Tags", value: "tags" },
          { name: "Teammates", value: "members" },
          { name: "Both", value: "both" },
        ],
      });
      let members = team.members;
      if (part !== "tags") {
        const picked = await pickTeammates(state, key, teams.filter((_, i) => i !== index));
        if (!picked) continue;
        members = picked;
      }
      const tags = part === "members" ? (team.tags ?? []) : await pickTags(state, team.tags);
      teams[index] = withTags({ members }, tags);
    }
    if (action === "remove" || action === "up") {
      const index = await select({
        message: action === "remove" ? "Remove which team?" : "Move which team up?",
        choices: teams
          .map((t, i) => ({ name: describeTeam(state, t), value: i }))
          .filter((c) => action === "remove" || c.value > 0),
      });
      if (action === "remove") teams.splice(index, 1);
      else teams.splice(index - 1, 2, teams[index]!, teams[index - 1]!);
    }
    if (action === "save") break;
  }

  const file = basicPath(key);
  const before = fs.readFileSync(file, "utf8");
  const after = renderBasicWithTeams(before, teams);
  if (!(await saveFile(file, before, after))) return;
  character.suggestedTeams = teams;

  // Offer the missing teammates first, so the tests run once on the result.
  const missing = [...new Set(teams.flatMap((t) => t.members))].filter((m) => !state.defaults[m]);
  for (const teammate of missing) {
    if (await confirm({ message: `${nameOf(state, teammate)} has no typical buffs yet. Fill them in now?`, default: true })) {
      await editTypicalBuffs(state, teammate, false);
    }
  }
  runTeamDataTests();
}

// --- menu ---------------------------------------------------------------------

async function runTask(state: State, task: TeamDataTask) {
  if (task.kind === "defaults") await editTypicalBuffs(state, task.key);
  else await editTeams(state, task.key);
}

async function walkMissing(state: State) {
  const skipped = new Set<string>();
  for (;;) {
    const report = buildTeamDataReport(state.characters, state.defaults);
    const task = listMissingTasks(report).find((t) => !skipped.has(`${t.kind}:${t.key}`));
    if (!task) {
      console.log("Nothing else missing.");
      return;
    }
    const label =
      task.kind === "defaults"
        ? `${nameOf(state, task.key)}: typical buffs as a teammate`
        : `${nameOf(state, task.key)}: suggested teams`;
    const action = await select({
      message: `Next: ${label}`,
      choices: [
        { name: "Fill in", value: "fill" },
        { name: "Skip", value: "skip" },
        { name: "Back to the menu", value: "stop" },
      ],
    });
    if (action === "stop") return;
    if (action === "skip") skipped.add(`${task.kind}:${task.key}`);
    else {
      await runTask(state, task);
      // Whatever happened, don't offer the same gap again this round.
      skipped.add(`${task.kind}:${task.key}`);
    }
  }
}

export async function runEditTeamData() {
  const state: State = {
    characters: await loadCharacters(),
    defaults: structuredClone(TEAM_BUFF_DEFAULTS) as TeamBuffDefaults,
    tags: [...TEAM_TAGS],
  };

  for (;;) {
    printReport(state);
    const action = await select({
      message: "What do you want to do?",
      choices: [
        { name: "Next missing", value: "next" },
        { name: "A character", value: "character" },
        { name: "Done", value: "done" },
      ],
    });
    if (action === "done") return;
    if (action === "next") {
      await walkMissing(state);
      continue;
    }
    const key = await pickCharacter(state, "Which character?");
    const what = await select({
      message: `Edit ${nameOf(state, key)}'s…`,
      choices: [
        { name: "Teams (when building them)", value: "teams" },
        { name: "Typical buffs (as someone's teammate)", value: "defaults" },
        { name: "Back", value: "back" },
      ],
    });
    if (what !== "back") await runTask(state, { kind: what as TeamDataTask["kind"], key });
  }
}
