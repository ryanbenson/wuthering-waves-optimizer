import { computed } from "vue";
import { useCharacterStore } from "../stores/character";
import { getReadableSubStatLabel, subStats } from "../echoes/stats";
import {
  ECHO_SUBSTAT_SLOTS,
  goalOdds,
  rollPercentile,
  wantedDrawOdds,
  type TunedSubstats,
} from "../echoes/tuningOdds";
import { useEchoEditFields, type EchoEditTarget } from "./useEchoEditFields";
import { useTuningGoal } from "./useTuningGoal";

export type TuneOddsAdvice = "met" | "impossible" | "keep" | "fresh-better" | "no-goal";

// Everything the echo panel's Tune odds tab shows, derived from the echo
// being edited (live, via useEchoEditFields) and the shared session goal.
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
  // (a curated profile or user edits), else the goal's own substats — an
  // all-equal neutral profile would call every substat wanted.
  const wantedSource = computed<"character" | "goal">(() => {
    const t = target.value;
    if (t.context !== "build" || !t.character) return "goal";
    const weights = characterStore.getCharacterSubstatWeights(t.character);
    const distinct = new Set(subStats.map((stat) => weights[stat] ?? 1));
    return distinct.size > 1 ? "character" : "goal";
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

  const timesFresh = computed(() =>
    freshOdds.value.chance > 0 ? odds.value.chance / freshOdds.value.chance : null,
  );

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
    timesFresh,
  };
}
