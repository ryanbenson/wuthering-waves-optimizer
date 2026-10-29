import { computed, type Ref } from "vue";
import type { AttackFrames, FrameDataFile } from "../calculator/frameData";
import {
  buildTimingActions,
  computeRotationTiming,
  summarizeByActionId,
} from "../calculator/rotationTiming";
import { echoFrames } from "../echoes/frames";

/**
 * Frame-data timing for one character rotation (ADR 0047). Recomputed from
 * the actions every time; nothing here is stored.
 */
export function useRotationTiming(
  actions: Ref<Array<Record<string, unknown>>>,
  characterData: Ref<{ frames?: FrameDataFile } | null | undefined>,
  rotationEcho: Ref<string | null>,
) {
  const hasFrameData = computed(() => Boolean(characterData.value?.frames));

  const timing = computed(() =>
    computeRotationTiming(
      buildTimingActions(actions.value, () => characterData.value, echoFrames, rotationEcho.value),
    ),
  );

  const byActionId = computed(() => summarizeByActionId(timing.value));

  /** The frame data behind one action, for the "ends on" editor's hints. */
  function framesFor(action: Record<string, unknown>): AttackFrames | null {
    const key = action.key as string | undefined;
    if (!key) return null;
    if (action.type === "echoAttacks") {
      const echo = (action.mainEcho as string | null | undefined) ?? rotationEcho.value;
      return (echo && echoFrames[echo]?.[key]) || null;
    }
    return characterData.value?.frames?.attacks[key] ?? null;
  }

  return { hasFrameData, timing, byActionId, framesFor };
}
