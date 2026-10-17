import { ref } from "vue";
import {
  TUNING_GOAL_PRESETS,
  getTuningGoalKey,
  type TuningGoal,
} from "../echoes/tuningOdds";

// Session-only tuning goal shared by the echo panel's Tune odds tab and the
// inventory's "Finish these first" filter, so picking a goal in one carries
// to the other. Deliberately not persisted (no store, no migration) until
// usage shows it's worth keeping — see docs/adr/0044.
const goal = ref<TuningGoal>(TUNING_GOAL_PRESETS["double-crit"].goal.map((l) => ({ ...l })));

// The tab the echo edit panel should open on next — set by the inventory's
// "Finish these first" view so tapping an echo lands on its odds.
const requestedPanelTab = ref<"stats" | "odds" | null>(null);

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

  function takeRequestedPanelTab() {
    const tab = requestedPanelTab.value;
    requestedPanelTab.value = null;
    return tab;
  }

  return {
    goal,
    setGoal,
    applyPreset,
    getActivePresetKey,
    requestedPanelTab,
    takeRequestedPanelTab,
  };
}
