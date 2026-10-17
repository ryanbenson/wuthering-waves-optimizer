import { computed, type Ref } from "vue";
import { getEchoSubStatEntries, type EchoSubStatsSource } from "../echoes/stats";
import {
  ECHO_SUBSTAT_SLOTS,
  getTuningGoalKey,
  getUnfinishedEchoTag,
  goalOdds,
  type TuningGoal,
  type UnfinishedEchoTag,
} from "../echoes/tuningOdds";

export interface UnfinishedEchoOdds {
  chance: number;
  tunedCount: number;
  tag: UnfinishedEchoTag;
}

type RankableEcho = EchoSubStatsSource & { echoId: string };

/** An echo with fewer than 5 revealed substats still has tunes left. */
export function isEchoUnfinished(echo: EchoSubStatsSource): boolean {
  return getEchoSubStatEntries(echo).length < ECHO_SUBSTAT_SLOTS;
}

// The inventory's "Finish these first" view: each unfinished echo's chance
// of reaching the shared tuning goal, against a fresh +0 echo. Echoes with
// the same revealed substats share one solve (memoized per goal), so a big
// inventory costs a handful of tiny DP runs, not one per echo.
export function useUnfinishedEchoRanking(
  echoes: Ref<RankableEcho[]>,
  goal: Ref<TuningGoal>,
) {
  const freshChance = computed(() => goalOdds([], goal.value).chance);

  const oddsByEchoId = computed(() => {
    const cache = new Map<string, number>();
    const out = new Map<string, UnfinishedEchoOdds>();
    const goalKey = getTuningGoalKey(goal.value);
    for (const echo of echoes.value) {
      if (!isEchoUnfinished(echo)) continue;
      const tuned = getEchoSubStatEntries(echo);
      const key = `${goalKey}#${tuned.map(([s, v]) => `${s}=${v}`).sort().join(",")}`;
      let chance = cache.get(key);
      if (chance === undefined) {
        chance = goalOdds(tuned, goal.value).chance;
        cache.set(key, chance);
      }
      out.set(echo.echoId, {
        chance,
        tunedCount: tuned.length,
        tag: getUnfinishedEchoTag(chance, freshChance.value, tuned.length),
      });
    }
    return out;
  });

  /** Unfinished echoes only, best chance first (stable for ties). */
  function rankUnfinished<T extends RankableEcho>(list: T[]): T[] {
    const odds = oddsByEchoId.value;
    return list
      .filter((echo) => odds.has(echo.echoId))
      .map((echo, index) => ({ echo, index }))
      .sort(
        (a, b) =>
          odds.get(b.echo.echoId)!.chance - odds.get(a.echo.echoId)!.chance ||
          a.index - b.index,
      )
      .map(({ echo }) => echo);
  }

  return { freshChance, oddsByEchoId, rankUnfinished };
}
