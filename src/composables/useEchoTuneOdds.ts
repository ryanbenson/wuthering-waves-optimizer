import { computed } from "vue";
import { useCharacterStore } from "../stores/character";
import { getReadableSubStatLabel, subStats } from "../echoes/stats";
import {
  ECHO_SUBSTAT_SLOTS,
  finalLineGoal,
  goalLineBreakdown,
  goalOdds,
  rollPercentile,
  wantedDrawOdds,
  type TunedSubstats,
} from "../echoes/tuningOdds";
import { useEchoEditFields, type EchoEditTarget } from "./useEchoEditFields";
import { useTuningGoal } from "./useTuningGoal";

export type TuneOddsAdvice = "met" | "impossible" | "keep" | "fresh-better" | "no-goal";

// Everything the Odds dialog's goal half shows, derived from the echo
// being edited (live, via useEchoEditFields) and the shared session goal.
// In a build the dialog judges the echo by the character's Substat Score
// instead (useEchoScoreOdds, given `weightsCharacter`); the goal is for
// the inventory, which has no character.
export function useEchoTuneOdds(getTarget: () => EchoEditTarget) {
  const characterStore = useCharacterStore();
  const { slots, target } = useEchoEditFields(getTarget);
  const { goal, setGoal } = useTuningGoal();

  const tuned = computed<TunedSubstats>(() =>
    slots
      .filter((slot) => slot.type.value && slot.type.value !== "none")
      .map((slot) => [slot.type.value, Number(slot.value.value) || 0]),
  );

  const tunedRows = computed(() =>
    tuned.value.map(([stat, value]) => ({
      stat,
      label: getReadableSubStatLabel(stat),
      value,
      percentile: value ? rollPercentile(stat, value) : null,
    })),
  );

  const untunedSlots = computed(() => ECHO_SUBSTAT_SLOTS - tuned.value.length);

  // "Stats you want": the build's character weights when they say anything
  // (a curated profile or user edits), else none in a build (an all-equal
  // neutral profile would call every substat wanted); the goal's own
  // substats in the inventory.
  const wantedSource = computed<"character" | "goal" | "none">(() => {
    const t = target.value;
    if (t.context !== "build") return "goal";
    if (!t.character) return "none";
    const weights = characterStore.getCharacterSubstatWeights(t.character);
    const distinct = new Set(subStats.map((stat) => weights[stat] ?? 1));
    return distinct.size > 1 ? "character" : "none";
  });

  const wantedStats = computed<string[]>(() => {
    const t = target.value;
    if (wantedSource.value === "character" && t.context === "build") {
      const weights = characterStore.getCharacterSubstatWeights(t.character);
      return subStats.filter((stat) => (weights[stat] ?? 0) > 0);
    }
    return goal.value.map((line) => line.stat);
  });

  const draws = computed(() => wantedDrawOdds(tuned.value, wantedStats.value));

  const odds = computed(() => goalOdds(tuned.value, goal.value));
  const freshOdds = computed(() => goalOdds([], goal.value));

  // Keep tuning while this echo is at least as likely to hit the goal as a
  // fresh +0 one — past that, farming a new echo is the better bet.
  const advice = computed<TuneOddsAdvice>(() => {
    if (!goal.value.length) return "no-goal";
    if (odds.value.chance >= 1) return "met";
    if (odds.value.chance <= 0) return "impossible";
    return odds.value.chance >= freshOdds.value.chance ? "keep" : "fresh-better";
  });

  // Per goal line: does the substat still need drawing, and how likely is
  // a high enough roll ("Needs Crit DMG in 3 / 11 draws", "Then rolls ≥ …").
  const breakdown = computed(() => goalLineBreakdown(tuned.value, goal.value));

  // The line this echo ends on if it succeeds, and a fresh echo's chance of
  // landing that exact line — the "this echo is N× closer" comparison.
  const finalLine = computed(() => finalLineGoal(tuned.value, goal.value));
  const freshLineOdds = computed(() => goalOdds([], finalLine.value));
  const timesFreshLine = computed(() =>
    freshLineOdds.value.chance > 0 ? odds.value.chance / freshLineOdds.value.chance : null,
  );

  // Whose substat weights score this echo: the build's character. An
  // inventory echo has none — the same echo suits different characters
  // differently — so there it gets goal-based odds only.
  const weightsCharacter = computed<string | null>(() => {
    const t = target.value;
    return t.context === "build" ? t.character || null : null;
  });

  return {
    goal,
    setGoal,
    tuned,
    tunedRows,
    untunedSlots,
    wantedSource,
    wantedStats,
    draws,
    odds,
    freshOdds,
    advice,
    breakdown,
    finalLine,
    freshLineOdds,
    timesFreshLine,
    weightsCharacter,
  };
}
