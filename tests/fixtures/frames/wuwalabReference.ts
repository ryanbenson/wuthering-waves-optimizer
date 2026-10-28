/**
 * Helpers for checking the timing engine against wuwalab's verified rotations
 * (ADR 0047). The rotations themselves live in the gitignored `reference/`
 * folder (`npm run fixtures:wuwalab`); the ability snapshots in `abilities/`
 * are committed.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { toAttackFrames } from "../../../cli/lib/frames";
import type { WuwalabAbility } from "../../../cli/lib/wuwalab";
import type { AttackFrames } from "../../../src/calculator/frameData";
import type { ActionEnd, TimingAction } from "../../../src/calculator/rotationTiming";

export const framesFixturesDir = path.dirname(fileURLToPath(import.meta.url));
export const referenceDir = path.join(framesFixturesDir, "reference");

export interface ReferenceRow {
  index: number;
  charId: number;
  skill: string;
  frame: number;
  cancel: string | null;
  cancelFrame: number | null;
  swapFrame: number | null;
}

export interface ReferenceRotation {
  id: number;
  team: { id: number; slug: string }[];
  loopRange: { start: number; end: number };
  loopFrames: number;
  loopDps: number | null;
  loopDpr: number;
  twoMinDps: number;
  twoMinDpr: number;
  totalFrames: number;
  energyNeeds: Record<string, number>;
  rows: ReferenceRow[];
}

const abilityCache = new Map<string, Map<string, WuwalabAbility>>();

export function loadAbilities(slug: string): Map<string, WuwalabAbility> {
  let abilities = abilityCache.get(slug);
  if (!abilities) {
    const file = JSON.parse(fs.readFileSync(path.join(framesFixturesDir, "abilities", `${slug}.json`), "utf8"));
    abilities = new Map((file.abilities as WuwalabAbility[]).map((ability) => [ability.name, ability]));
    abilityCache.set(slug, abilities);
  }
  return abilities;
}

/** Frames for one wuwalab ability, converted exactly as `import frames` converts them. */
export function abilityFrames(slug: string, name: string): AttackFrames {
  const ability = loadAbilities(slug).get(name);
  if (!ability) throw new Error(`${slug} has no ability "${name}" in the fixture`);
  return toAttackFrames(ability);
}

export function referenceRotationIds(): number[] {
  if (!fs.existsSync(referenceDir)) return [];
  return fs
    .readdirSync(referenceDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => Number(file.slice(0, -5)))
    .sort((a, b) => a - b);
}

export function loadReferenceRotation(id: number): ReferenceRotation {
  return JSON.parse(fs.readFileSync(path.join(referenceDir, `${id}.json`), "utf8"));
}

/** How the author ended the row, in the engine's terms. */
export function rowEnd(row: ReferenceRow): ActionEnd | null {
  if (row.swapFrame != null) return { type: "swap", frame: row.swapFrame };
  if (row.cancel == null || row.cancelFrame == null) return null;
  if (row.cancel === "dash" || row.cancel === "idash") return { type: "dash", frame: row.cancelFrame };
  if (row.cancel === "jump") return { type: "jump", frame: row.cancelFrame };
  return { type: "cancel", frame: row.cancelFrame };
}

/** One engine action per row: their abilities, their author's cancels and swaps. */
export function referenceTimingActions(rotation: ReferenceRotation): TimingAction[] {
  const slugById = new Map(rotation.team.map((member) => [member.id, member.slug]));
  return rotation.rows.map((row) => {
    const slug = slugById.get(row.charId)!;
    const base = { id: String(row.index), characterId: slug, end: rowEnd(row) };
    if (row.skill === "Jump") return { ...base, frames: null, waitFrames: 3 };
    // A "Wait" row keeps its length in cancelFrame.
    if (row.skill === "Wait") return { ...base, frames: null, waitFrames: row.cancelFrame ?? 0 };
    const ability = loadAbilities(slug).get(row.skill);
    // Echo casts aren't in the character snapshots; their summons take no field time.
    if (!ability) return { ...base, frames: null, noFieldTime: true };
    return { ...base, frames: toAttackFrames(ability) };
  });
}

/** The author's gap from each row to the next (the last row has none). */
export function referenceGaps(rotation: ReferenceRotation): number[] {
  return rotation.rows.slice(0, -1).map((row, i) => rotation.rows[i + 1].frame - row.frame);
}
