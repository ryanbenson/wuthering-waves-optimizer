import { FRAMES_PER_SECOND, type AttackFrames, type FrameDataFile } from "./frameData";

/**
 * Rotation timing from per-attack frame data (ADR 0047). Pure: no Vue, no
 * stores, safe for workers.
 *
 * Two clocks:
 * - **game** frames skip time stop, the way the in-game challenge timer and
 *   community rotation lengths (and wuwalab) count. DPS uses this clock.
 * - **real** frames add time stop back, for the breakdown.
 *
 * The rules below were checked frame by frame against five verified wuwalab
 * rotations (tests/calculator/rotationTimingReference.test.ts).
 */

/** Extra frames a dash cancel costs after the cancel frame. */
export const DASH_CANCEL_FRAMES = 22;
/** Extra frames a jump cancel costs after the cancel frame. */
export const JUMP_CANCEL_FRAMES = 3;
/** Where a swap happens when the action doesn't say. */
export const DEFAULT_SWAP_FRAME = 10;

/** How an action ends. Absent means it plays out (`full`). */
export interface ActionEnd {
  type: "full" | "cancel" | "dash" | "jump" | "swap";
  /** Frame (from the start of the ability) the cancel or swap happens. For
   * `cancel` it defaults to the ability's earliest cancel, for `dash`/`jump`
   * to the same, and for `swap` to `DEFAULT_SWAP_FRAME`. */
  frame?: number;
  /** Extra frames to wait afterwards (walking back into range, waiting on a
   * cooldown). Rarely needed. */
  wait?: number;
}

const END_TYPES = new Set<ActionEnd["type"]>(["full", "cancel", "dash", "jump", "swap"]);

/** What each end type is called in the UI (the end editor, the frames chip, the timeline strip). */
export const ACTION_END_LABELS: Record<ActionEnd["type"], string> = {
  full: "Plays out",
  cancel: "Cancel",
  dash: "Dash cancel",
  jump: "Jump cancel",
  swap: "Swap out",
};

function frameCount(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
}

/**
 * Reads a persisted (or imported) action's `end`. Anything unrecognised
 * becomes null, which plays the action out.
 */
export function normalizeActionEnd(raw: unknown): ActionEnd | null {
  if (!raw || typeof raw !== "object") return null;
  const { type, frame, wait } = raw as Record<string, unknown>;
  if (!END_TYPES.has(type as ActionEnd["type"])) return null;
  const end: ActionEnd = { type: type as ActionEnd["type"] };
  const at = frameCount(frame);
  if (at !== undefined && type !== "full") end.frame = at;
  const extra = frameCount(wait);
  if (extra) end.wait = extra;
  return end;
}

export interface TimingAction {
  id?: string;
  /** Who acts; consecutive shared-ability actions only merge for the same
   * character. */
  characterId?: string | null;
  frames: AttackFrames | null;
  /** Takes no field time (echo set procs, negative status ticks, utility). */
  noFieldTime?: boolean;
  /** A plain wait of this many frames (a "Wait" or "Jump" action). */
  waitFrames?: number;
  count?: number;
  end?: ActionEnd | null;
}

export interface TimedHit {
  /** Game frame the hit lands, from the start of the rotation. */
  frame: number;
  energy: number;
  concerto: number;
}

export interface TimedAction {
  id?: string;
  /** Game frame the action starts. */
  start: number;
  /** Game frames until the next action starts. */
  gameFrames: number;
  /** Real frames, time stop included. */
  realFrames: number;
  hits: TimedHit[];
  /** True when the action has no frame data and was counted as 0. */
  missing: boolean;
}

export interface RotationTiming {
  actions: TimedAction[];
  gameFrames: number;
  realFrames: number;
  /** Ids (or indexes, when an action has no id) of actions without frame data. */
  missing: (string | number)[];
}

/** Frames of time stop between `from` and `to` (ability-relative). */
export function frozenFrames(frames: AttackFrames, from: number, to: number): number {
  if (!frames.timeStop) return 0;
  const [stopStart, stopEnd] = frames.timeStop;
  return Math.max(0, Math.min(stopEnd, to) - Math.max(stopStart, from));
}

/**
 * Where the character leaves the ability and how long until the next action,
 * on both clocks. `exitFrame` is ability-relative and decides which hits land.
 */
export function actionLength(
  frames: AttackFrames,
  end: ActionEnd | null | undefined,
): { exitFrame: number; gameFrames: number; realFrames: number } {
  const length = exitLength(frames, end);
  const wait = end?.wait ?? 0;
  return { ...length, gameFrames: length.gameFrames + wait, realFrames: length.realFrames + wait };
}

function exitLength(
  frames: AttackFrames,
  end: ActionEnd | null | undefined,
): { exitFrame: number; gameFrames: number; realFrames: number } {
  const type = end?.type ?? "full";
  const earliestCancel = frames.cancel && frames.cancel > 0 ? frames.cancel : frames.total;

  if (type === "swap") {
    // The author's swap frame counts as-is (a swap during a liberation's
    // freeze still costs its frames); NoSwap holds it back, measured in game
    // time.
    const swapFrame = end?.frame ?? DEFAULT_SWAP_FRAME;
    const noSwap = frames.noSwap ?? 0;
    const heldBy = noSwap - frozenFrames(frames, 0, noSwap);
    const gameFrames = Math.max(swapFrame, heldBy);
    const exitFrame = Math.max(swapFrame, noSwap);
    return { exitFrame, gameFrames, realFrames: Math.max(gameFrames, exitFrame) };
  }

  const exitFrame = type === "full" ? frames.total : (end?.frame ?? earliestCancel);
  const extra = type === "dash" ? DASH_CANCEL_FRAMES : type === "jump" ? JUMP_CANCEL_FRAMES : 0;
  const frozen = frozenFrames(frames, 0, exitFrame);
  return { exitFrame, gameFrames: exitFrame - frozen + extra, realFrames: exitFrame + extra };
}

/** Game frame (ability-relative) a hit lands: frozen time before it doesn't count. */
function hitGameFrame(frames: AttackFrames, hitFrame: number): number {
  return hitFrame - frozenFrames(frames, 0, hitFrame);
}

export function computeRotationTiming(actions: TimingAction[]): RotationTiming {
  const timed: TimedAction[] = [];
  const missing: (string | number)[] = [];
  let clock = 0;
  let realClock = 0;
  let lastShared: { characterId: string | null; ability: string; start: number } | null = null;

  actions.forEach((action, index) => {
    const count = Math.max(1, Number(action.count) || 1);

    if (action.waitFrames != null) {
      const frames = Math.max(0, action.waitFrames) * count;
      timed.push({ id: action.id, start: clock, gameFrames: frames, realFrames: frames, hits: [], missing: false });
      clock += frames;
      realClock += frames;
      lastShared = null;
      return;
    }

    const frames = action.frames;
    if (!frames) {
      if (!action.noFieldTime) missing.push(action.id ?? index);
      timed.push({ id: action.id, start: clock, gameFrames: 0, realFrames: 0, hits: [], missing: !action.noFieldTime });
      return;
    }

    const characterId = action.characterId ?? null;
    const continuesShared =
      frames.shared &&
      lastShared?.ability === frames.ability &&
      lastShared.characterId === characterId;

    for (let i = 0; i < count; i++) {
      const length = actionLength(frames, action.end);
      const fieldTime = !frames.offField && !(continuesShared && i === 0);
      const start = continuesShared && i === 0 ? lastShared!.start : clock;
      const hits = frames.hits
        .filter(([, commit]) => commit <= length.exitFrame)
        .map(([frame, , energy, concerto]) => ({
          frame: start + hitGameFrame(frames, frame),
          energy,
          concerto,
        }));
      const gameFrames = fieldTime ? length.gameFrames : 0;
      const realFrames = fieldTime ? length.realFrames : 0;
      timed.push({ id: action.id, start, gameFrames, realFrames, hits, missing: false });
      if (fieldTime) {
        lastShared = frames.shared ? { characterId, ability: frames.ability, start: clock } : null;
        clock += gameFrames;
        realClock += realFrames;
      }
    }
  });

  return { actions: timed, gameFrames: clock, realFrames: realClock, missing };
}

/** Attack groups whose actions never take field time of their own. */
const NO_FIELD_TIME_TYPES = new Set(["echoSetAttacks", "utilityAttacks", "negativeStatus"]);

/**
 * Turns persisted rotation actions (character or team) into timing actions.
 * `characterData` returns a character's loaded data (`getCharByName` output,
 * which carries `frames`); `echoFrames` is `src/echoes/frames.ts`'s map,
 * keyed by echo key then by our echo attack key.
 */
export function buildTimingActions(
  actions: any[],
  characterData: (characterId: string | null) => { frames?: FrameDataFile } | null | undefined,
  echoFrames: Record<string, Record<string, AttackFrames>>,
  /** Echo used by echo actions that don't name their own (a character
   * rotation's main echo). */
  defaultEcho: string | null = null,
): TimingAction[] {
  return actions
    .filter((action) => !action?.isDisabled)
    .map((action) => {
      const characterId: string | null = action.characterId ?? null;
      const base = { id: action.id, characterId, count: action.count, end: normalizeActionEnd(action.end) };
      if (action.type === "wait") {
        return { ...base, frames: null, waitFrames: Number(action.frames) || 0 };
      }
      if (NO_FIELD_TIME_TYPES.has(action.type)) {
        return { ...base, frames: null, noFieldTime: true };
      }
      if (action.type === "echoAttacks") {
        return { ...base, frames: echoFrames[action.mainEcho ?? defaultEcho]?.[action.key] ?? null };
      }
      return { ...base, frames: characterData(characterId)?.frames?.attacks[action.key] ?? null };
    });
}

/** What a team slot contributes to timing: who is in it, their loaded data
 * (carrying `frames`) and their main echo. */
export interface TimingSlot {
  characterId: string;
  data: { frames?: FrameDataFile } | null | undefined;
  mainEcho: string | null;
}

/**
 * `buildTimingActions` for a team rotation: actions name a `slot`, not a
 * character, and run in `order` across all three slots. Echo actions without
 * their own echo use their slot's main echo; actions on an empty slot count
 * as missing.
 */
export function buildTeamTimingActions(
  actions: any[],
  slots: Array<TimingSlot | null>,
  echoFrames: Record<string, Record<string, AttackFrames>>,
): TimingAction[] {
  const dataById = new Map(slots.filter((slot): slot is TimingSlot => !!slot).map((slot) => [slot.characterId, slot.data]));
  const withCharacters = [...actions]
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map((action) => {
      const slot = slots[action.slot] ?? null;
      return { ...action, characterId: slot?.characterId ?? null, mainEcho: action.mainEcho ?? slot?.mainEcho ?? null };
    });
  return buildTimingActions(withCharacters, (characterId) => (characterId ? dataById.get(characterId) : null), echoFrames);
}

function byOrder(actions: any[]): any[] {
  return [...actions].sort((a, b) => Number(a.order) - Number(b.order));
}

/** Timing for one character rotation, or null when the character has no
 * frame data at all. */
export function characterRotationTiming(
  actions: any[],
  characterData: { frames?: FrameDataFile } | null | undefined,
  echoFrames: Record<string, Record<string, AttackFrames>>,
  mainEcho: string | null,
): RotationTiming | null {
  if (!characterData?.frames) return null;
  return computeRotationTiming(buildTimingActions(byOrder(actions), () => characterData, echoFrames, mainEcho));
}

/** Timing for a team rotation, or null when no slot has frame data. */
export function teamRotationTiming(
  actions: any[],
  slots: Array<TimingSlot | null>,
  echoFrames: Record<string, Record<string, AttackFrames>>,
): RotationTiming | null {
  if (!slots.some((slot) => slot?.data?.frames)) return null;
  return computeRotationTiming(buildTeamTimingActions(actions, slots, echoFrames));
}

/** The totals of a rotation's timing, small enough to carry on a damage result. */
export interface RotationLength {
  gameFrames: number;
  realFrames: number;
  /** Actions without frame data, counted as 0. */
  missing: number;
}

export function rotationLength(timing: RotationTiming): RotationLength {
  return { gameFrames: timing.gameFrames, realFrames: timing.realFrames, missing: timing.missing.length };
}

export function framesToSeconds(frames: number): number {
  return frames / FRAMES_PER_SECOND;
}

/** Damage per second on the game clock, or 0 when the length is unknown. */
export function damagePerSecond(damage: number, gameFrames: number): number {
  return gameFrames > 0 ? damage / framesToSeconds(gameFrames) : 0;
}

export interface ActionTimingSummary {
  gameFrames: number;
  realFrames: number;
  missing: boolean;
}

/** Sums each action's repeats (`count`) into one entry per action id. */
export function summarizeByActionId(timing: RotationTiming): Record<string, ActionTimingSummary> {
  const byId: Record<string, ActionTimingSummary> = {};
  for (const action of timing.actions) {
    if (action.id == null) continue;
    const entry = (byId[action.id] ??= { gameFrames: 0, realFrames: 0, missing: false });
    entry.gameFrames += action.gameFrames;
    entry.realFrames += action.realFrames;
    entry.missing ||= action.missing;
  }
  return byId;
}
