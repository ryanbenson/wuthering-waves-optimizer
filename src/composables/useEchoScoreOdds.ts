import { computed, ref } from "vue";
import { useCharacterStore } from "../stores/character";
import { getCharacterRosterDisplayName } from "../characters/characters";
import { SUBSTAT_SCORE_GRADES, getGradeForSubstatScorePercent, type RatingColor } from "../echoes/rating";
import { echoResources, resourcesPerSuccess, type EchoResources } from "../echoes/levelingCost";
import { ECHO_SUBSTAT_SLOTS, normalizeTuned, type GoalOdds, type TunedSubstats } from "../echoes/tuningOdds";
import {
  SCORE_GRADES,
  betterEchoOdds,
  defaultScoreTarget,
  echoScorePoints,
  freshShareBelow,
  gradeReachChances,
  scorePercent,
  scoreTargetKey,
  scoreTargetOdds,
  type ScoreTarget,
} from "../echoes/scoreOdds";

export type ScoreOddsAdvice = "met" | "impossible" | "keep" | "fresh-better";

export interface ScoreTargetOption {
  key: string;
  target: ScoreTarget;
  /** "S or higher", "Any higher score". */
  label: string;
  /** Chance a fresh echo gets there; for an unfinished echo also this one's. */
  freshChance: number;
  echoChance: number | null;
}

/** Expected spend of one attempt, and the per-success spend with and without feeding misses back. */
export function oddsResources(odds: GoalOdds) {
  const perAttempt = echoResources(odds.expectedExp, odds.expectedTuners);
  const onSuccess = echoResources(odds.successExp, odds.successTuners);
  return {
    perAttempt,
    perSuccess: resourcesPerSuccess(perAttempt, onSuccess, odds.chance, false),
    perSuccessFed: resourcesPerSuccess(perAttempt, onSuccess, odds.chance, true),
  } satisfies Record<string, EchoResources | null>;
}

// A build's Odds, in the build character's Substat Score: where this echo
// can finish by grade, against a fresh echo. "Better" is a grade target,
// by default the next grade up from where the echo stands (see
// defaultScoreTarget); the user can pick another. See
// docs/adr/0044-echo-tuning-odds.md.
export function useEchoScoreOdds(
  getTuned: () => TunedSubstats,
  getCharacter: () => string,
) {
  const characterStore = useCharacterStore();
  const weights = computed(() => characterStore.getCharacterSubstatWeights(getCharacter()));
  const characterName = computed(() => getCharacterRosterDisplayName(getCharacter()));
  const tuned = computed(() => normalizeTuned(getTuned()));
  const isFinished = computed(() => tuned.value.length >= ECHO_SUBSTAT_SLOTS);

  const points = computed(() => echoScorePoints(tuned.value, weights.value));
  const score = computed(() => {
    const percent = scorePercent(points.value, weights.value);
    return { percent, ...getGradeForSubstatScorePercent(percent) };
  });
  const gradeIndex = computed(() => SCORE_GRADES.indexOf(score.value.grade));

  /** Finished echo: share of fresh echoes it beats. */
  const percentile = computed(() => freshShareBelow(points.value, weights.value));

  const echoReach = computed(() => gradeReachChances(tuned.value, weights.value));
  const freshReach = computed(() => gradeReachChances([], weights.value));

  const targetOptions = computed<ScoreTargetOption[]>(() => {
    const options: ScoreTargetOption[] = [];
    if (isFinished.value) {
      const beat: ScoreTarget = { kind: "beat", points: points.value };
      options.push({
        key: scoreTargetKey(beat),
        target: beat,
        label: "Any higher score",
        freshChance: betterEchoOdds(tuned.value, weights.value).better,
        echoChance: null,
      });
    }
    SCORE_GRADES.forEach((grade, i) => {
      if (i === 0) return;
      const echoChance = isFinished.value ? null : echoReach.value[i];
      const freshChance = freshReach.value[i];
      // Grades already locked in add nothing; ones nothing can reach either.
      if (isFinished.value ? i <= gradeIndex.value : echoChance! >= 1 - 1e-9) return;
      if (freshChance <= 0 && !(echoChance && echoChance > 0)) return;
      options.push({
        key: grade,
        target: { kind: "grade", grade: i },
        label: `${grade} or higher`,
        freshChance,
        echoChance,
      });
    });
    return options;
  });

  // The user's pick by key; falls back to the default whenever the pick
  // isn't on offer (another echo, or edited weights).
  const selectedKey = ref<string | null>(null);
  const defaultTarget = computed(() => defaultScoreTarget(tuned.value, weights.value));
  const target = computed<ScoreTarget>(
    () => targetOptions.value.find((o) => o.key === selectedKey.value)?.target ?? defaultTarget.value,
  );
  const targetKey = computed(() => scoreTargetKey(target.value));
  const targetLabel = computed(() =>
    target.value.kind === "grade" ? SCORE_GRADES[target.value.grade] : "a higher score",
  );
  function selectTarget(key: string) {
    selectedKey.value = key;
  }

  const freshOdds = computed(() => scoreTargetOdds([], weights.value, target.value));
  const echoOdds = computed(() =>
    isFinished.value ? null : scoreTargetOdds(tuned.value, weights.value, target.value),
  );
  const freshResources = computed(() => oddsResources(freshOdds.value));
  const echoResourcesFromHere = computed(() =>
    echoOdds.value ? echoResources(echoOdds.value.expectedExp, echoOdds.value.expectedTuners) : null,
  );

  // Unfinished only: keep tuning while this echo is at least as likely as
  // a fresh one to reach the target.
  const advice = computed<ScoreOddsAdvice | null>(() => {
    const odds = echoOdds.value;
    if (!odds) return null;
    if (odds.chance >= 1) return "met";
    if (odds.chance <= 0) return "impossible";
    return odds.chance >= freshOdds.value.chance ? "keep" : "fresh-better";
  });

  return {
    weights,
    characterName,
    tuned,
    isFinished,
    score,
    percentile,
    targetOptions,
    target,
    targetKey,
    targetLabel,
    selectTarget,
    freshOdds,
    echoOdds,
    freshResources,
    echoResourcesFromHere,
    advice,
  };
}

export const SCORE_GRADE_COLORS: Record<string, RatingColor> = Object.fromEntries(
  SUBSTAT_SCORE_GRADES.map((band) => [band.grade, band.color]),
);
