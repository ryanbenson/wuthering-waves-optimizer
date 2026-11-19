/**
 * Turns a recommended team's typical buffs (`teamBuffDefaults.ts`) into the
 * team buff changes to save (issue #663 PR 2, ADR 0059). Pure: no Vue, no
 * stores.
 */
import { allEchoBuffs, allWeaponTeamBuffs, buffsByCharacter } from "./index";
import { getExclusiveTeamBuffKeys } from "./teamBuffs";
import { TEAM_BUFF_DEFAULTS, type TeamBuffDefault } from "./teamBuffDefaults";
import { getRealisticMaxStacks } from "../characters/effectiveBuffStacks";

/** A player's copy of a teammate: sequence 0–6 and whether they have the signature weapon. */
export type TeammateCopy = { sequence: number; signature: boolean };

export const DEFAULT_TEAMMATE_COPY: TeammateCopy = { sequence: 0, signature: false };

/**
 * A saved copy (`settings.config.teammateCopies[key]`, never migrated) read
 * defensively: anything missing or malformed means S0 without the signature.
 */
export function parseTeammateCopy(saved: unknown): TeammateCopy {
  const value = (saved && typeof saved === "object" ? saved : {}) as { sequence?: unknown; signature?: unknown };
  const sequence = Number(value.sequence);
  return {
    sequence: Number.isInteger(sequence) && sequence >= 0 && sequence <= 6 ? sequence : DEFAULT_TEAMMATE_COPY.sequence,
    signature: value.signature === true,
  };
}

export type StoredTeamBuff = {
  isEnabled: boolean;
  stacks?: number;
  refinement?: string;
  baseAttrValue?: number;
};

type BuffDef = {
  key: string;
  name: string;
  hasStacks?: boolean;
  maxStacks?: number;
  realisticMaxStacks?: number;
  inputBase?: boolean;
  realisticBaseAttrValue?: number;
};

export type TeamBuffSource = "character" | "weapon" | "echo";

/** The sequence a `SequenceNodeN…` key needs, or 0. */
export function buffMinSequence(key: string): number {
  const match = /^SequenceNode(\d+)/.exec(key);
  return match ? Number(match[1]) : 0;
}

/** Where a typical buff for this teammate is defined, or null when the key isn't theirs to give. */
export function findTeamBuffDef(
  teammate: string,
  key: string,
): { def: BuffDef; source: TeamBuffSource } | null {
  const own = ((buffsByCharacter as Record<string, BuffDef[]>)[teammate] ?? []).find((d) => d.key === key);
  if (own) return { def: own, source: "character" };
  const weapon = (allWeaponTeamBuffs as BuffDef[]).find((d) => d.key === key);
  if (weapon) return { def: weapon, source: "weapon" };
  const echo = (allEchoBuffs as BuffDef[]).find((d) => d.key === key);
  if (echo) return { def: echo, source: "echo" };
  return null;
}

/** True when the teammate has a typical buff that needs their signature weapon. */
export function hasSignatureTeamBuff(teammate: string): boolean {
  return (TEAM_BUFF_DEFAULTS[teammate] ?? []).some((d) => d.signature);
}

export function hasTeamBuffDefaults(teammate: string): boolean {
  return (TEAM_BUFF_DEFAULTS[teammate] ?? []).length > 0;
}

/** Names of the teammate's usual echo buffs (set or main echo), for the card's note. */
export function getTeammateEchoBuffNames(teammate: string): string[] {
  return (TEAM_BUFF_DEFAULTS[teammate] ?? [])
    .map((d) => findTeamBuffDef(teammate, d.key))
    .filter((found): found is NonNullable<typeof found> => found?.source === "echo")
    .map((found) => found.def.name);
}

/** The typical buffs that apply to this copy of the teammate in this team. */
export function getApplicableTeamBuffDefaults(
  teammate: string,
  copy: TeammateCopy,
  teamElements: string[],
): TeamBuffDefault[] {
  return (TEAM_BUFF_DEFAULTS[teammate] ?? []).filter((d) => {
    if (buffMinSequence(d.key) > copy.sequence) return false;
    if (d.signature && !copy.signature) return false;
    if (d.fullTeamElement && !(teamElements.length === 3 && teamElements.every((e) => e === d.fullTeamElement))) {
      return false;
    }
    return true;
  });
}

export type RecommendedTeamBuffsInput = {
  teammates: Array<{ key: string; copy: TeammateCopy }>;
  /** Elements of the main character and both teammates. */
  teamElements: string[];
  /** The character's saved team buffs, to turn off on "replace". */
  existing: Record<string, { isEnabled?: boolean }>;
  mode: "replace" | "add";
};

/**
 * The team buff changes to save: with "replace", every enabled buff is turned
 * off first; then each teammate's applicable typical buffs are turned on at
 * realistic max stacks (or the entry's `stacks`), refinement 1 for weapons,
 * and `realisticBaseAttrValue` for base-stat buffs. Buffs that can't be on
 * together keep the first one turned on.
 */
export function buildRecommendedTeamBuffs(input: RecommendedTeamBuffsInput): Record<string, StoredTeamBuff> {
  const changes: Record<string, StoredTeamBuff> = {};
  if (input.mode === "replace") {
    for (const [key, entry] of Object.entries(input.existing ?? {})) {
      if (entry?.isEnabled) changes[key] = { isEnabled: false };
    }
  }
  const turnedOn = new Set<string>();
  for (const { key: teammate, copy } of input.teammates) {
    for (const entry of getApplicableTeamBuffDefaults(teammate, copy, input.teamElements)) {
      const found = findTeamBuffDef(teammate, entry.key);
      if (!found || turnedOn.has(entry.key)) continue;
      const exclusive = getExclusiveTeamBuffKeys(entry.key);
      if (exclusive.some((k) => turnedOn.has(k))) continue;
      const { def, source } = found;
      const buff: StoredTeamBuff = { isEnabled: true };
      if (def.hasStacks) {
        const max = getRealisticMaxStacks(def.maxStacks ?? 0, def.realisticMaxStacks);
        buff.stacks = Math.min(entry.stacks ?? max, def.maxStacks ?? max);
      }
      if (source === "weapon") buff.refinement = "1";
      if (def.inputBase && def.realisticBaseAttrValue != null) buff.baseAttrValue = def.realisticBaseAttrValue;
      changes[entry.key] = buff;
      turnedOn.add(entry.key);
      for (const k of exclusive) changes[k] = { isEnabled: false };
    }
  }
  return changes;
}
