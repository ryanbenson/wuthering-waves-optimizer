import { ref } from "vue";
import {
  TUNING_GOAL_PRESETS,
  getTuningGoalKey,
  type TuningGoal,
} from "../echoes/tuningOdds";

// Session-only tuning goal shared by the echo Odds dialog and the
// inventory's "Finish these first" filter, so picking a goal in one carries
// to the other. Deliberately not persisted (no store, no migration) until
// usage shows it's worth keeping — see docs/adr/0044.
const goal = ref<TuningGoal>(TUNING_GOAL_PRESETS["double-crit"].goal.map((l) => ({ ...l })));

export function useTuningGoal() {
  function setGoal(next: TuningGoal) {
    goal.value = next.map((line) => ({ ...line }));
  }

  function applyPreset(presetKey: string) {
    const preset = TUNING_GOAL_PRESETS[presetKey];
    if (preset) setGoal(preset.goal);
  }

  /** The preset the current goal matches, or null for a custom goal. */
  function getActivePresetKey(): string | null {
    const key = getTuningGoalKey(goal.value);
    for (const [presetKey, preset] of Object.entries(TUNING_GOAL_PRESETS)) {
      if (getTuningGoalKey(preset.goal) === key) return presetKey;
    }
    return null;
  }

  return {
    goal,
    setGoal,
    applyPreset,
    getActivePresetKey,
  };
}
