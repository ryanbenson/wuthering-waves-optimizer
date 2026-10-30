import { landingFrame, normalizeActionEnd, type ActionEnd, type RotationTiming, type TimedAction } from "./rotationTiming";

/**
 * The rotation editors' charts on a time axis (ADR 0049): one block per
 * action, placed where it starts on the game clock and as wide as the field
 * time it takes, a running damage total, turns on field and time vs damage
 * shares. Pure: frames in, frames out; the components lay them out.
 */

/** Kinds of action a character rotation's charts color by, in legend order. */
export const ACTION_KINDS = ["introOutro", "basic", "skill", "forte", "liberation", "echo", "other"] as const;
export type ActionKind = (typeof ACTION_KINDS)[number];

export const ACTION_KIND_LABELS: Record<ActionKind, string> = {
  introOutro: "Intro & Outro",
  basic: "Basic & Heavy",
  skill: "Skill",
  forte: "Forte Circuit",
  liberation: "Liberation",
  echo: "Echo & set effects",
  other: "Other",
};

/**
 * Maps an action's ability group to the kind its charts show. Pass the
 * persisted action's `type`, not the attack's damage type: an Outro can deal
 * Basic Attack DMG but still reads as an Outro to players.
 */
export function actionKind(type: string | undefined): ActionKind {
  switch ((type ?? "").toLowerCase()) {
    case "intro":
    case "outro":
      return "introOutro";
    case "basic":
    case "heavy":
      return "basic";
    case "skill":
      return "skill";
    case "fortecircuit":
      return "forte";
    case "liberation":
      return "liberation";
    case "echo":
    case "echoattacks":
    case "echosetattacks":
      return "echo";
    default:
      return "other";
  }
}

/** What the strip needs from each persisted action besides its timing. */
export interface StripActionInput {
  id: string;
  /** The action's damage (or healing/shield), summed over its count. */
  value: number;
  label?: string;
  /** The persisted action's ability group (`intro`, `forteCircuit`,
   * `echoSetAttacks`, …), for the kind of action (see `actionKind`). */
  type?: string;
  /** Team slot (0–2), for per-character colors; undefined on a character rotation. */
  slot?: number;
  end?: unknown;
  /** False for healing and shields: they get a block but stay out of the
   * running damage total. Defaults to true. */
  isDamage?: boolean;
}

export interface StripBlock {
  id: string;
  label: string;
  slot: number | null;
  kind: ActionKind;
  value: number;
  /** False for healing and shields, which stay out of the damage totals. */
  isDamage: boolean;
  /** Game frame the action starts. */
  startFrame: number;
  /** Game frames of field time, over every repeat. 0 for off-field actions,
   * echo set procs and the second part of a shared ability. */
  frames: number;
  /** Game frame its damage lands (the first repeat's, see `landingFrame`). */
  landingFrame: number;
  end: ActionEnd["type"];
  /** No frame data, so it takes no time. */
  missing: boolean;
}

export interface CumulativePoint {
  frame: number;
  value: number;
}

export interface TimelineStrip {
  blocks: StripBlock[];
  /** The axis length: the rotation's game length, or the last landing (of
   * any action, healing included) if later. */
  totalFrames: number;
  /** Running damage total as each repeat lands, starting at 0. */
  cumulative: CumulativePoint[];
  maxValue: number;
}

export function buildTimelineStrip(timing: RotationTiming, actions: StripActionInput[]): TimelineStrip {
  const repeatsById = new Map<string, TimedAction[]>();
  for (const timed of timing.actions) {
    if (timed.id == null) continue;
    const repeats = repeatsById.get(timed.id) ?? [];
    repeats.push(timed);
    repeatsById.set(timed.id, repeats);
  }

  const blocks: StripBlock[] = [];
  const landings: CumulativePoint[] = [];
  for (const action of actions) {
    // Disabled actions have no timing entry; they aren't in the rotation.
    const repeats = repeatsById.get(action.id);
    if (!repeats?.length) continue;
    blocks.push({
      id: action.id,
      label: action.label ?? "Action",
      slot: action.slot ?? null,
      kind: actionKind(action.type),
      value: action.value,
      isDamage: action.isDamage !== false,
      startFrame: repeats[0].start,
      frames: repeats.reduce((sum, timed) => sum + timed.gameFrames, 0),
      landingFrame: landingFrame(repeats[0]),
      end: normalizeActionEnd(action.end)?.type ?? "full",
      missing: repeats.some((timed) => timed.missing),
    });
    if (action.isDamage === false) continue;
    // Same split as the team summary's frame timeline (ADR 0048): the damage
    // already covers every repeat, so each lands an equal share.
    for (const timed of repeats) {
      landings.push({ frame: landingFrame(timed), value: action.value / repeats.length });
    }
  }
  blocks.sort((a, b) => a.startFrame - b.startFrame);

  let running = 0;
  const cumulative: CumulativePoint[] = [{ frame: 0, value: 0 }];
  // Stable sort keeps rotation order for repeats landing on the same frame.
  for (const landing of landings.sort((a, b) => a.frame - b.frame)) {
    running += landing.value;
    cumulative.push({ frame: landing.frame, value: running });
  }

  // Healing and shields stay out of the total but still need to fit on the axis.
  const lastLanding = Math.max(0, ...blocks.map((block) => block.landingFrame));
  return {
    blocks,
    totalFrames: Math.max(timing.gameFrames, lastLanding),
    cumulative,
    maxValue: Math.max(0, ...blocks.map((block) => block.value)),
  };
}

/** The running damage total at a frame, counting landings on that frame. */
export function damageAt(strip: TimelineStrip, frame: number): number {
  let value = 0;
  for (const point of strip.cumulative) {
    if (point.frame > frame) break;
    value = point.value;
  }
  return value;
}

/** One continuous turn on field in a team rotation. */
export interface Stint {
  slot: number | null;
  startFrame: number;
  endFrame: number;
  /** The blocks played in it, in order. */
  blocks: StripBlock[];
  /** Damage the whole team landed during it (off-field hits included). The
   * last turn also takes anything landing after the rotation's field time. */
  value: number;
}

/**
 * Groups the field-time blocks into turns: a new turn starts whenever a
 * different slot takes the field. Off-field and zero-time blocks don't break a
 * turn; their damage counts toward whichever turn it lands in.
 */
export function buildStints(strip: TimelineStrip): Stint[] {
  const stints: Stint[] = [];
  for (const block of strip.blocks) {
    if (block.frames <= 0) continue;
    const last = stints[stints.length - 1];
    const end = block.startFrame + block.frames;
    if (last && last.slot === block.slot) {
      last.blocks.push(block);
      last.endFrame = Math.max(last.endFrame, end);
    } else {
      stints.push({ slot: block.slot, startFrame: block.startFrame, endFrame: end, blocks: [block], value: 0 });
    }
  }
  stints.forEach((stint, index) => {
    const isLast = index === stints.length - 1;
    // `damageAt` counts landings on the frame itself, so a turn ends just
    // before the next one starts and the first starts before frame 0.
    const before = index === 0 ? 0 : damageAt(strip, stint.startFrame - 1);
    const after = isLast ? damageAt(strip, Number.POSITIVE_INFINITY) : damageAt(strip, stint.endFrame - 1);
    stint.value = after - before;
  });
  return stints;
}

/** Field time and damage for one group of blocks (a kind or a slot). */
export interface ShareRow<K> {
  key: K;
  frames: number;
  value: number;
}

/**
 * Sums field time and damage per group, in the order the groups first appear
 * in `order`. Healing and shields add field time but no damage.
 */
export function sharesBy<K>(strip: TimelineStrip, keyOf: (block: StripBlock) => K, order: readonly K[]): ShareRow<K>[] {
  const rows = new Map<K, ShareRow<K>>(order.map((key) => [key, { key, frames: 0, value: 0 }]));
  for (const block of strip.blocks) {
    const row = rows.get(keyOf(block));
    if (!row) continue;
    row.frames += block.frames;
    if (block.isDamage) row.value += block.value;
  }
  return [...rows.values()].filter((row) => row.frames > 0 || row.value > 0);
}
