import { subStats, subStatsTable } from "../echoes/stats";
import { ECHO_SUBSTAT_SLOTS, type TuningGoal } from "../echoes/tuningOdds";

// The tuning planner's goal lives in the URL (`?goal=CritRate:8.1,CritDMG:any`)
// so a plan can be linked without persisting anything. Decoding treats the
// query as untrusted: unknown substats and values that aren't real roll
// tiers are dropped rather than passed to the odds engine.

export function encodeTuningGoalQuery(goal: TuningGoal): Record<string, string> {
  if (!goal.length) return {};
  return {
    goal: goal.map((line) => `${line.stat}:${line.min ?? "any"}`).join(","),
  };
}

export function decodeTuningGoalQuery(raw: unknown): TuningGoal {
  const text = Array.isArray(raw) ? raw[0] : raw;
  if (typeof text !== "string" || !text) return [];
  const goal: TuningGoal = [];
  for (const part of text.split(",")) {
    const [stat, minText] = part.split(":");
    if (!subStats.includes(stat) || goal.some((line) => line.stat === stat)) continue;
    let min: number | null = null;
    if (minText && minText !== "any") {
      const value = Number(minText);
      if (!(subStatsTable[stat] ?? []).includes(value)) continue;
      min = value;
    }
    goal.push({ stat, min });
    if (goal.length >= ECHO_SUBSTAT_SLOTS) break;
  }
  return goal;
}
