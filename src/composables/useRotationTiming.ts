import { computed, type Ref } from "vue";
import type { AttackFrames, FrameDataFile } from "../calculator/frameData";
import {
  buildTeamTimingActions,
  buildTimingActions,
  computeRotationTiming,
  summarizeByActionId,
  type TimingAction,
  type TimingSlot,
} from "../calculator/rotationTiming";
import { echoFrames } from "../echoes/frames";

type CharacterFrames = { frames?: FrameDataFile } | null | undefined;

function framesForAction(action: Record<string, unknown>, data: CharacterFrames, echo: string | null): AttackFrames | null {
  const key = action.key as string | undefined;
  if (!key) return null;
  if (action.type === "echoAttacks") {
    const actionEcho = (action.mainEcho as string | null | undefined) ?? echo;
    return (actionEcho && echoFrames[actionEcho]?.[key]) || null;
  }
  return data?.frames?.attacks[key] ?? null;
}

function useTiming(timingActions: Ref<TimingAction[]>) {
  const timing = computed(() => computeRotationTiming(timingActions.value));
  const byActionId = computed(() => summarizeByActionId(timing.value));
  return { timing, byActionId };
}

/**
 * Frame-data timing for one character rotation (ADR 0047). Recomputed from
 * the actions every time; nothing here is stored.
 */
export function useRotationTiming(
  actions: Ref<Array<Record<string, unknown>>>,
  characterData: Ref<CharacterFrames>,
  rotationEcho: Ref<string | null>,
) {
  const hasFrameData = computed(() => Boolean(characterData.value?.frames));

  const { timing, byActionId } = useTiming(
    computed(() => buildTimingActions(actions.value, () => characterData.value, echoFrames, rotationEcho.value)),
  );

  /** The frame data behind one action, for the "ends on" editor's hints. */
  function framesFor(action: Record<string, unknown>): AttackFrames | null {
    return framesForAction(action, characterData.value, rotationEcho.value);
  }

  return { hasFrameData, timing, byActionId, framesFor };
}

/** The same for a team rotation, whose actions name a slot (0–2). */
export function useTeamRotationTiming(
  actions: Ref<Array<Record<string, unknown>>>,
  slots: Ref<Array<TimingSlot | null>>,
) {
  const hasFrameData = computed(() => slots.value.some((slot) => Boolean(slot?.data?.frames)));

  const { timing, byActionId } = useTiming(
    computed(() => buildTeamTimingActions(actions.value, slots.value, echoFrames)),
  );

  function framesFor(action: Record<string, unknown>): AttackFrames | null {
    const slot = slots.value[Number(action.slot)] ?? null;
    return slot ? framesForAction(action, slot.data, slot.mainEcho) : null;
  }

  return { hasFrameData, timing, byActionId, framesFor };
}
