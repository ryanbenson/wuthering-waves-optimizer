import { computed, type ComputedRef, type Ref } from "vue";
import type { MatchableAction } from "../utils/actionTextMatch";

type AttackRow = { key?: string; label?: string; [key: string]: unknown };

/** Maps a characterData attack-group key to the short `type` string used on
 * a rotation action row (e.g. `{key: "...", type: "basic"}`) — matches
 * CalculatorRotationAction.vue's own skillKeyMap. */
const GROUP_KEY_TO_ACTION_TYPE: Record<string, string> = {
  basicAttacks: "basic",
  skillAttacks: "skill",
  forteCircuitAttacks: "forteCircuit",
  liberationAttacks: "liberation",
  introAttacks: "intro",
  outroAttacks: "outro",
  tuneBreakAttacks: "tuneBreak",
};

/**
 * Rotation Flow (Labs) — a flat, fuzzy-matchable list of a character's
 * real attacks (basic/skill/forteCircuit/liberation/intro/outro/tuneBreak
 * only; echo-set/utility/echo/negative-status attacks are intentionally out
 * of scope for v1's quick-add/paste-import), for `actionTextMatch.ts` to
 * search against. Each entry's `group` is the short action-type key (e.g.
 * "basic"), not a display label — callers needing a display label should
 * capitalize/format it themselves.
 */
export function useCharacterActionList(
  characterData: Ref<Record<string, unknown> | null | undefined> | ComputedRef<Record<string, unknown> | null | undefined>,
): ComputedRef<MatchableAction[]> {
  return computed<MatchableAction[]>(() => {
    const data = characterData.value;
    if (!data) return [];
    const out: MatchableAction[] = [];
    for (const [groupKey, actionType] of Object.entries(GROUP_KEY_TO_ACTION_TYPE)) {
      const group = data[groupKey] as { attacks?: AttackRow[] } | undefined;
      for (const attack of group?.attacks ?? []) {
        if (!attack?.key || !attack?.label) continue;
        out.push({ key: attack.key, label: attack.label, group: actionType });
      }
    }
    return out;
  });
}
