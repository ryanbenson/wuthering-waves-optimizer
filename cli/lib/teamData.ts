/**
 * `npm run cli -- edit team-data` (issue #732): the report, buff labels and
 * file writers behind the interactive editor for Recommended teams data
 * (`suggestedTeams` in each `basic.ts`) and teammates' typical buffs
 * (`src/buffs/teamBuffDefaults.ts`, ADR 0059). No prompts here, so it can be
 * unit-tested; `cli/commands/editTeamData.ts` does the asking.
 */
import type { TeamBuffDefault } from "../../src/buffs/teamBuffDefaults.js";
import { buffMinSequence } from "../../src/buffs/recommendedTeamBuffs.js";
import { getRealisticMaxStacks } from "../../src/characters/effectiveBuffStacks.js";

export type SuggestedTeam = { members: [string, string]; tags?: string[] };

export type TeamDataCharacter = {
  key: string;
  name: string;
  element?: string;
  signatureWeapon?: string;
  suggestedTeams: SuggestedTeam[];
};

export type TeamBuffDefaults = Record<string, TeamBuffDefault[]>;

export type BuffDefLike = {
  key: string;
  name: string;
  hasStacks?: boolean;
  minStacks?: number;
  maxStacks?: number;
  realisticMaxStacks?: number;
  inputBase?: boolean;
  realisticBaseAttrValue?: number;
  imageUrl?: string;
};

export type TeamDataReport = {
  /** Characters with no suggested teams, in roster order. */
  missingTeams: string[];
  /** Teammates used in a team with no typical buffs entry, most-used first. */
  missingDefaults: Array<{ key: string; usedBy: string[] }>;
  /** Characters with an empty typical buffs list ("no team buffs" on purpose). */
  noTeamBuffs: string[];
};

export type TeamDataTask = { kind: "defaults" | "teams"; key: string };

export function buildTeamDataReport(characters: TeamDataCharacter[], defaults: TeamBuffDefaults): TeamDataReport {
  const usedBy = new Map<string, string[]>();
  for (const character of characters) {
    for (const team of character.suggestedTeams) {
      for (const member of team.members) {
        if (defaults[member]) continue;
        const users = usedBy.get(member) ?? [];
        if (!users.includes(character.key)) users.push(character.key);
        usedBy.set(member, users);
      }
    }
  }
  return {
    missingTeams: characters.filter((c) => c.suggestedTeams.length === 0).map((c) => c.key),
    missingDefaults: [...usedBy.entries()]
      .map(([key, users]) => ({ key, usedBy: users }))
      .sort((a, b) => b.usedBy.length - a.usedBy.length || a.key.localeCompare(b.key)),
    noTeamBuffs: Object.keys(defaults)
      .filter((key) => defaults[key]!.length === 0)
      .sort((a, b) => a.localeCompare(b)),
  };
}

/** What "Next missing" walks through: supports' typical buffs first, then teams. */
export function listMissingTasks(report: TeamDataReport): TeamDataTask[] {
  return [
    ...report.missingDefaults.map((m) => ({ kind: "defaults" as const, key: m.key })),
    ...report.missingTeams.map((key) => ({ kind: "teams" as const, key })),
  ];
}

/** The stacks "Use team" turns a buff on at when the entry doesn't set them. */
export function usualStacks(def: BuffDefLike): number {
  return getRealisticMaxStacks(def.maxStacks ?? 0, def.realisticMaxStacks);
}

/**
 * A checklist label for a buff: its name plus what matters when picking it,
 * e.g. "Sequence Node 2: … · S2 · stacks 1–3 (usual 3) · can't be on with …".
 */
export function describeTeamBuff(
  def: BuffDefLike,
  options: { exclusiveWith?: string[]; fullTeamElement?: string; stacks?: number } = {},
): string {
  const parts = [def.name];
  const sequence = buffMinSequence(def.key);
  if (sequence > 0) parts.push(`S${sequence}`);
  if (def.hasStacks && def.maxStacks) {
    const usual = options.stacks ?? usualStacks(def);
    parts.push(`stacks ${def.minStacks ?? 1}–${def.maxStacks} (${options.stacks != null ? "set" : "usual"} ${usual})`);
  }
  if (def.inputBase && def.realisticBaseAttrValue != null) parts.push(`base ${def.realisticBaseAttrValue}`);
  if (options.exclusiveWith?.length) parts.push(`can't be on with ${options.exclusiveWith.join(", ")}`);
  if (options.fullTeamElement) parts.push(`all-${options.fullTeamElement} only`);
  return parts.join(" · ");
}

/** The weapon team buff of this signature weapon, matched by image file name, or null. */
export function findSignatureWeaponBuff<T extends BuffDefLike>(
  signatureWeapon: string | undefined,
  weaponBuffs: T[],
): T | null {
  if (!signatureWeapon) return null;
  return (
    weaponBuffs.find(
      (w) =>
        w.imageUrl
          ?.split("/")
          .pop()
          ?.replace(/\.\w+$/, "") === signatureWeapon,
    ) ?? null
  );
}

// --- teamBuffDefaults.ts writer -------------------------------------------

const PRINT_WIDTH = 120;
const DEFAULTS_START = "export const TEAM_BUFF_DEFAULTS: Record<string, TeamBuffDefault[]> = {";

function renderDefault(entry: TeamBuffDefault): string {
  const fields = [`key: ${JSON.stringify(entry.key)}`];
  if (entry.signature) fields.push("signature: true");
  if (entry.stacks != null) fields.push(`stacks: ${entry.stacks}`);
  if (entry.fullTeamElement) fields.push(`fullTeamElement: ${JSON.stringify(entry.fullTeamElement)}`);
  return `{ ${fields.join(", ")} }`;
}

function renderObjectKey(key: string): string {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);
}

function renderDefaultsObject(defaults: TeamBuffDefaults): string {
  const lines = [DEFAULTS_START];
  for (const character of Object.keys(defaults).sort((a, b) => a.localeCompare(b))) {
    const entries = defaults[character]!.map(renderDefault);
    const name = renderObjectKey(character);
    const oneLine = `  ${name}: [${entries.join(", ")}],`;
    if (oneLine.length <= PRINT_WIDTH) {
      lines.push(oneLine);
    } else {
      lines.push(`  ${name}: [`, ...entries.map((e) => `    ${e},`), "  ],");
    }
  }
  lines.push("};");
  return lines.join("\n");
}

/** The file with `TEAM_BUFF_DEFAULTS` rewritten from `defaults`; everything before it (header, imports) is kept. */
export function renderTeamBuffDefaultsFile(content: string, defaults: TeamBuffDefaults): string {
  const start = content.indexOf(DEFAULTS_START);
  if (start === -1) throw new Error("Couldn't find TEAM_BUFF_DEFAULTS in teamBuffDefaults.ts");
  const end = content.indexOf("\n};", start);
  if (end === -1) throw new Error("Couldn't find the end of TEAM_BUFF_DEFAULTS in teamBuffDefaults.ts");
  return content.slice(0, start) + renderDefaultsObject(defaults) + content.slice(end + "\n};".length);
}

// --- basic.ts writer --------------------------------------------------------

/** Index just past the `]` that closes the `[` at `open`, skipping string contents. */
function matchBracket(content: string, open: number): number {
  let depth = 0;
  let quote: string | null = null;
  for (let i = open; i < content.length; i++) {
    const ch = content[i]!;
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if (ch === "[") depth++;
    else if (ch === "]" && --depth === 0) return i + 1;
  }
  throw new Error("Unbalanced brackets in suggestedTeams");
}

function renderSuggestedTeams(teams: SuggestedTeam[], indent: string): string {
  const rows = teams.map((team) => {
    const fields = [`members: [${team.members.map((m) => JSON.stringify(m)).join(", ")}]`];
    if (team.tags?.length) fields.push(`tags: [${team.tags.map((t) => JSON.stringify(t)).join(", ")}]`);
    return `${indent}  { ${fields.join(", ")} },`;
  });
  return [`${indent}suggestedTeams: [`, ...rows, `${indent}],`].join("\n");
}

/**
 * The `basic.ts` content with its `suggestedTeams` block replaced by `teams`:
 * added before the end of the returned object when missing, removed when
 * `teams` is empty. Nothing else in the file changes.
 */
export function renderBasicWithTeams(content: string, teams: SuggestedTeam[]): string {
  const property = /^([ \t]*)suggestedTeams\s*:\s*\[/m.exec(content);
  if (property) {
    const lineStart = property.index;
    let end = matchBracket(content, property.index + property[0].length - 1);
    if (content[end] === ",") end++;
    if (content[end] === "\n") end++;
    const replacement = teams.length ? `${renderSuggestedTeams(teams, property[1]!)}\n` : "";
    return content.slice(0, lineStart) + replacement + content.slice(end);
  }
  if (!teams.length) return content;

  const close = /\n([ \t]*)\};\s*\n\}\s*$/.exec(content);
  if (!close) throw new Error("Couldn't find the end of getCharacterBasicInfo's returned object");
  const indent = `${close[1]}  `;
  let before = content.slice(0, close.index);
  if (!/[,{]\s*$/.test(before)) before += ",";
  return `${before}\n${renderSuggestedTeams(teams, indent)}${content.slice(close.index)}`;
}

// --- teamTags.ts writer -----------------------------------------------------

const TAGS_LINE = /^export const TEAM_TAGS = \[[^\]]*\] as const;$/m;

/** Why `name` can't be a new tag, or null when it can. */
export function validateNewTag(name: string, existing: readonly string[]): string | null {
  const tag = name.trim();
  if (!tag) return "Type a tag name.";
  if (tag.length > 20) return "Keep it to 20 characters or fewer.";
  if (!/^[A-Za-z0-9][A-Za-z0-9 &+'-]*$/.test(tag)) return "Use letters, numbers, spaces and - + & ' only.";
  if (existing.some((t) => t.toLowerCase() === tag.toLowerCase())) return `"${tag}" is already a tag.`;
  return null;
}

/** The tags with `tag` inserted after `after` (or first when `after` is null). */
export function insertTag(tags: readonly string[], tag: string, after: string | null): string[] {
  const next = [...tags];
  next.splice(after === null ? 0 : next.indexOf(after) + 1, 0, tag.trim());
  return next;
}

/** The file with the `TEAM_TAGS` list rewritten; everything else is kept. */
export function renderTeamTagsFile(content: string, tags: readonly string[]): string {
  if (!TAGS_LINE.test(content)) throw new Error("Couldn't find the TEAM_TAGS line in teamTags.ts");
  const list = tags.map((t) => JSON.stringify(t));
  const oneLine = `export const TEAM_TAGS = [${list.join(", ")}] as const;`;
  const rendered =
    oneLine.length <= PRINT_WIDTH ? oneLine : ["export const TEAM_TAGS = [", ...list.map((t) => `  ${t},`), "] as const;"].join("\n");
  return content.replace(TAGS_LINE, rendered);
}

// --- preview ------------------------------------------------------------------

/** The changed lines between two versions of a file, as "- old" / "+ new" lines. */
export function previewChange(before: string, after: string): string {
  if (before === after) return "(no changes)";
  const a = before.split("\n");
  const b = after.split("\n");
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;
  let endA = a.length;
  let endB = b.length;
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA--;
    endB--;
  }
  return [...a.slice(start, endA).map((l) => `- ${l}`), ...b.slice(start, endB).map((l) => `+ ${l}`)].join("\n");
}
