import { landingFrame, normalizeActionEnd, type ActionEnd, type RotationTiming, type TimedAction } from "./rotationTiming";

/**
 * The rotation editors' damage strip on a time axis (ADR 0049): one block per
 * action, placed where it starts on the game clock, as wide as the field time
 * it takes and as tall as its damage. Pure: frames in, frames out; the
 * component turns them into percentages.
 */

/** What the strip needs from each persisted action besides its timing. */
export interface StripActionInput {
  id: string;
  /** The action's damage (or healing/shield), summed over its count. */
  value: number;
  label?: string;
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
  value: number;
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
  /** The axis length: the rotation's game length, or the last landing if later. */
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
      value: action.value,
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

  const lastLanding = landings.length ? landings[landings.length - 1].frame : 0;
  return {
    blocks,
    totalFrames: Math.max(timing.gameFrames, lastLanding),
    cumulative,
    maxValue: Math.max(0, ...blocks.map((block) => block.value)),
  };
}
