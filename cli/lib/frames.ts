import type { AttackFrames, FrameDataFile, FrameHit } from "../../src/calculator/frameData.js";
import type { WuwalabAbility } from "./wuwalab.js";

/**
 * Matches wuwalab abilities to our attack entries and renders the generated
 * `frames.ts` files (ADR 0047).
 *
 * wuwalab's `motion_value` is our highest-level talent multiplier ×100
 * (Suoming's intro: `110.89%*2+36.97%*4` here, hits of 11089, 11089 and
 * 3697 ×4 there), so attacks are matched on that multiset of numbers instead
 * of on names, which differ between the two sites.
 */

export interface OurAttack {
  key: string;
  label?: string;
  /** The attack file it came from: `basicAttacks`, `skillAttacks`, … */
  group: string;
  talents?: Record<string, string>;
}

/** Override value for a proc that never takes field time of its own (bonus or delayed damage, a status tick). */
export const OFF_FIELD = "off-field";

/** Per character: attack key → wuwalab ability name to force, `OFF_FIELD`, or null for "no frames". */
export type FrameOverrides = Record<string, string | null>;

export interface MatchResult {
  attacks: Record<string, AttackFrames>;
  notices: string[];
  unmatched: string[];
}

/** Two motion values closer than this (in ×100 units) are the same number. */
const TOLERANCE = 2;

/** `"110.89%*2+36.97%*4"` → percents `[11089, 11089, 3697, 3697, 3697, 3697]`; `"350 + 2.5%"` → flats `[350]`, percents `[250]`. */
export function parseTalentValue(value: string | undefined): { percents: number[]; flats: number[] } | null {
  if (!value) return null;
  const percents: number[] = [];
  const flats: number[] = [];
  for (const raw of value.split("+")) {
    const term = raw.trim();
    if (!term) continue;
    const percent = term.match(/^([\d.]+)%\s*(?:ATK|HP|DEF)?\s*(?:[*×]\s*(\d+))?$/i);
    if (percent) {
      const times = Number(percent[2] ?? 1);
      for (let i = 0; i < times; i++) percents.push(Math.round(Number(percent[1]) * 100));
      continue;
    }
    const flat = term.match(/^([\d.]+)$/);
    if (flat) {
      flats.push(Number(flat[1]));
      continue;
    }
    return null;
  }
  return percents.length || flats.length ? { percents, flats } : null;
}

/** The highest talent level's value (level 10 for skills, rank 5 for echoes). */
export function topTalent(talents: Record<string, string> | undefined): string | undefined {
  if (!talents) return undefined;
  const levels = Object.keys(talents).filter((level) => /^\d+$/.test(level));
  if (!levels.length) return undefined;
  return talents[String(Math.max(...levels.map(Number)))];
}

function sameMultiset(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const x = [...a].sort((p, q) => p - q);
  const y = [...b].sort((p, q) => p - q);
  return x.every((value, i) => Math.abs(value - y[i]) <= TOLERANCE);
}

function containsMultiset(outer: number[], inner: number[]): boolean {
  const pool = [...outer];
  for (const value of inner) {
    const index = pool.findIndex((candidate) => Math.abs(candidate - value) <= TOLERANCE);
    if (index === -1) return false;
    pool.splice(index, 1);
  }
  return true;
}

function damageValues(ability: WuwalabAbility): number[] {
  return ability.hits.map((hit) => hit.motion_value).filter((value) => value > 0);
}

const GROUP_LABELS: Record<string, string[]> = {
  basicAttacks: ["basic attack", "heavy attack"],
  skillAttacks: ["resonance skill"],
  liberationAttacks: ["resonance liberation"],
  forteCircuitAttacks: ["forte"],
  introAttacks: ["intro / outro"],
  outroAttacks: ["intro / outro"],
  tuneBreakAttacks: ["tune break skill"],
};

const NAME_HINTS: [RegExp, RegExp][] = [
  [/dodge|counter/i, /dodge counter/i],
  [/mid-?air|plunging/i, /mid-?air/i],
  [/parry/i, /parry/i],
  [/unison/i, /unison/i],
  [/hold/i, /hold/i],
];

const IGNORED_WORDS = new Set(["dmg", "the", "of", "a", "attack", "damage", "per", "instance"]);

/** `"MidAirHeavyAttackBreakdownFormDMG"` → mid, air, heavy, breakdown, form; `"Stage4"` → stage, 4. */
export function nameWords(text: string): Set<string> {
  const words = text
    .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
    .replace(/([0-9])([A-Za-z])/g, "$1 $2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word && !IGNORED_WORDS.has(word));
  return new Set(words);
}

/** Higher is a better fit for this attack when several abilities have the same motion values. */
function fitScore(attack: OurAttack, ability: WuwalabAbility): number {
  let score = 0;
  if (GROUP_LABELS[attack.group]?.includes(ability.group_label ?? "")) score += 4;
  const ourText = `${attack.key} ${attack.label ?? ""}`;
  for (const [ours, theirs] of NAME_HINTS) {
    if (ours.test(ourText) === theirs.test(ability.name)) score += 1;
  }
  const ourWords = nameWords(ourText);
  for (const word of nameWords(ability.name)) {
    if (ourWords.has(word)) score += 2;
  }
  return score;
}

function timingSignature(ability: WuwalabAbility): string {
  return JSON.stringify([
    ability.total_frames,
    ability.earliest_frame_cancel,
    ability.no_swap ?? 0,
    ability.time_stop ?? 0,
    ability.hits.map((hit) => [hit.frame, hit.commit_frame]),
  ]);
}

export function toAttackFrames(
  ability: WuwalabAbility,
  options: { shared?: boolean; offField?: boolean } = {},
): AttackFrames {
  const frames = { ability: ability.name, total: ability.total_frames } as AttackFrames;
  if (ability.earliest_frame_cancel) frames.cancel = ability.earliest_frame_cancel;
  if (ability.no_swap) frames.noSwap = ability.no_swap;
  if (ability.time_stop) frames.timeStop = [ability.time_stop_start ?? 0, ability.time_stop];
  if (ability.motion_stop) frames.motionStop = [ability.motion_stop_start ?? 0, ability.motion_stop];
  if (ability.cooldown) frames.cooldown = ability.cooldown;
  if (ability.on_cast_energy || ability.on_cast_concerto) {
    frames.onCast = {};
    if (ability.on_cast_energy) frames.onCast.energy = ability.on_cast_energy;
    if (ability.on_cast_concerto) frames.onCast.concerto = ability.on_cast_concerto;
  }
  frames.hits = ability.hits.map(
    (hit): FrameHit => [hit.frame, hit.commit_frame, hit.energy ?? 0, hit.concerto ?? 0],
  );
  // Outros play while the next character is already on field (a 180-frame
  // outro is followed by the next action on the same frame), and genre
  // "none" is a lingering effect, so neither takes field time.
  if (options.offField || ability.genre === "none" || ability.genre === "outro") frames.offField = true;
  if (options.shared) frames.shared = true;
  return frames;
}

function pickBest(
  attack: OurAttack,
  candidates: WuwalabAbility[],
  notices: string[],
  who: string,
): WuwalabAbility {
  const ranked = [...candidates].sort((a, b) => fitScore(attack, b) - fitScore(attack, a));
  const [best, ...rest] = ranked;
  const differing = rest.filter((other) => timingSignature(other) !== timingSignature(best));
  if (differing.length && fitScore(attack, differing[0]) === fitScore(attack, best)) {
    notices.push(
      `${who}: ${attack.key} matched "${best.name}" over "${differing[0].name}" (same motion values, different frames). Check the pick.`,
    );
  }
  return best;
}

/**
 * Matches one character's (or echo's) attacks. Order of rules:
 * override → same motion values → healing by base value + % → tune break by
 * genre → our attack is part of a bigger ability (`shared`) → a lone outro.
 */
export function matchAttacks(
  who: string,
  attacks: OurAttack[],
  abilities: WuwalabAbility[],
  overrides: FrameOverrides = {},
): MatchResult {
  const result: MatchResult = { attacks: {}, notices: [], unmatched: [] };
  const byName = new Map(abilities.map((ability) => [ability.name, ability]));

  for (const attack of attacks) {
    if (attack.key in overrides) {
      const forced = overrides[attack.key];
      if (forced === null) continue;
      if (forced === OFF_FIELD) {
        result.attacks[attack.key] = { ability: OFF_FIELD, total: 0, hits: [], offField: true };
        continue;
      }
      const ability = byName.get(forced);
      if (ability) {
        result.attacks[attack.key] = toAttackFrames(ability);
      } else {
        result.notices.push(`${who}: override for ${attack.key} names "${forced}", which wuwalab no longer has.`);
        result.unmatched.push(attack.key);
      }
      continue;
    }

    const parsed = parseTalentValue(topTalent(attack.talents));

    if (parsed && parsed.percents.length && !parsed.flats.length) {
      const exact = abilities.filter((ability) => sameMultiset(damageValues(ability), parsed.percents));
      if (exact.length) {
        result.attacks[attack.key] = toAttackFrames(pickBest(attack, exact, result.notices, who));
        continue;
      }
    }

    if (parsed && parsed.flats.length === 1 && parsed.percents.length === 1) {
      const healer = abilities.find((ability) =>
        ability.heals.some(
          (heal) =>
            Math.abs(heal.base_cure - parsed.flats[0]) <= 1 &&
            Math.abs(heal.motion_value - parsed.percents[0]) <= TOLERANCE,
        ),
      );
      if (healer) {
        // A heal that rides on a damaging ability happens alongside it, so
        // as its own action it takes no field time. A heal-only cast does.
        result.attacks[attack.key] = toAttackFrames(healer, { offField: damageValues(healer).length > 0 });
        continue;
      }
    }

    if (attack.group === "tuneBreakAttacks") {
      const tuneBreak = abilities.find((ability) => ability.genre === "tunebreak");
      if (tuneBreak) {
        result.attacks[attack.key] = toAttackFrames(tuneBreak);
        continue;
      }
    }

    if (parsed && parsed.percents.length && !parsed.flats.length) {
      const containing = abilities.filter((ability) => containsMultiset(damageValues(ability), parsed.percents));
      if (containing.length) {
        const best = pickBest(attack, containing, result.notices, who);
        result.attacks[attack.key] = toAttackFrames(best, { shared: true });
        continue;
      }
    }

    // Outros never take field time, so when the motion values don't line up
    // the closest-named outro is good enough for its hit timing.
    if (attack.group === "outroAttacks") {
      const outros = abilities.filter((ability) => ability.genre === "outro" && !/unison/i.test(ability.name));
      if (outros.length) {
        const ranked = [...outros].sort((a, b) => fitScore(attack, b) - fitScore(attack, a));
        result.attacks[attack.key] = toAttackFrames(ranked[0]);
        continue;
      }
    }

    result.unmatched.push(attack.key);
  }

  return result;
}

const HEADER = `// Generated by \`npm run cli -- import frames\` from wuwalab frame data
// (https://wuwalab.com, used with permission; ADR 0047). Don't edit by hand:
// re-run the import, or add an override in cli/lib/frameOverrides.ts.`;

export function renderCharacterFramesFile(file: FrameDataFile): string {
  const entries = Object.entries(file.attacks)
    .map(([key, frames]) => `    ${key}: ${JSON.stringify(frames)},`)
    .join("\n");
  return `${HEADER}
import type { FrameDataFile } from "../../calculator/frameData";

export const frames: FrameDataFile = {
  syncedAt: "${file.syncedAt}",
  attacks: {
${entries}
  },
};
`;
}

export function renderEchoFramesFile(syncedAt: string, echoes: Record<string, Record<string, AttackFrames>>): string {
  const entries = Object.entries(echoes)
    .map(([echoKey, attacks]) => {
      const inner = Object.entries(attacks)
        .map(([key, frames]) => `    ${key}: ${JSON.stringify(frames)},`)
        .join("\n");
      return `  ${echoKey}: {\n${inner}\n  },`;
    })
    .join("\n");
  return `${HEADER}
import type { AttackFrames } from "../calculator/frameData";

export const echoFramesSyncedAt = "${syncedAt}";

/** Echo key → our echo attack key → frames. */
export const echoFrames: Record<string, Record<string, AttackFrames>> = {
${entries}
};
`;
}

/** wuwalab slug for one of our character folders; null when the folder has no wuwalab page. */
export function wuwalabSlugFor(characterKey: string): string {
  const rover = characterKey.match(/^Rover(aero|electro|havoc|spectro)/i);
  if (rover) return `rover${rover[1].toLowerCase()}`;
  if (characterKey === "YangyangXuanling") return "xuanling";
  return characterKey.toLowerCase();
}

/** Lines describing frames that moved since the last import (the user-visible part of a re-sync). */
export function describeFrameChanges(
  who: string,
  before: Record<string, AttackFrames> | undefined,
  after: Record<string, AttackFrames>,
): string[] {
  if (!before) return [];
  const lines: string[] = [];
  for (const [key, next] of Object.entries(after)) {
    const prev = before[key];
    if (!prev) continue;
    if (prev.total !== next.total || prev.cancel !== next.cancel || prev.noSwap !== next.noSwap) {
      lines.push(
        `${who}: ${key} changed (total ${prev.total}→${next.total}, cancel ${prev.cancel ?? "-"}→${next.cancel ?? "-"}, no-swap ${prev.noSwap ?? "-"}→${next.noSwap ?? "-"}).`,
      );
    }
  }
  return lines;
}
