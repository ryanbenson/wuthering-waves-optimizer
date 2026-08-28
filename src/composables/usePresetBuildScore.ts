import { computed } from "vue";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import {
  getSubstatScoreGrade,
  getGradeForSubstatScorePercent,
  type RatingColor,
} from "../echoes/rating";

export interface PresetBuildScoreRollup {
  percent: number;
  provisional: boolean;
  grade: string;
  color: RatingColor;
}

// Same averaging approach as useTeamSubstatScoreRollup.ts, but over an
// explicit set of echo IDs (a saved preset) rather than a character's live
// equipped slots, and over an explicit (possibly absent) character context
// rather than always the live active character.
//
// Presets have no persisted "which character is this for" field, so the
// caller derives characterId from wherever it can (e.g. the preset's
// currently-equipped character, if any) and passes null when there's no
// character context to score against — this returns null in that case
// rather than guessing at a weight profile, so the caller can render "—".
export function usePresetBuildScore(
  getEchoIds: () => (string | null | undefined)[],
  getCharacterId: () => string | null,
) {
  const characterStore = useCharacterStore();
  const inventoryStore = useInventoryStore();

  const rollup = computed<PresetBuildScoreRollup | null>(() => {
    const characterId = getCharacterId();
    if (!characterId) return null;

    const weights = characterStore.getCharacterSubstatWeights(characterId);
    const scores: { percent: number; provisional: boolean }[] = [];
    for (const echoId of getEchoIds()) {
      if (!echoId) continue;
      const echo = inventoryStore.getEchoById(echoId);
      if (!echo) continue;
      const score = getSubstatScoreGrade(echo, weights);
      scores.push({ percent: score.percent, provisional: score.provisional });
    }
    if (scores.length === 0) return null;

    const averagePercent =
      scores.reduce((sum, s) => sum + s.percent, 0) / scores.length;
    const provisional = scores.length < 5 || scores.some((s) => s.provisional);
    const { grade, color } = getGradeForSubstatScorePercent(averagePercent);
    return { percent: averagePercent, provisional, grade, color };
  });

  return { rollup };
}
