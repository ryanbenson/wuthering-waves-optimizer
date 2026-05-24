import { getCharByName } from "../characters/characters";
import { resolveRotationActionToAttackData } from "./resolveRotationAction";
import {
  getPerformerAttackContext,
  resolvePerformerCharacterKey,
  type RotationPerformerId,
  type TeamBuffsState,
  type PerformerAttackContext,
} from "./rotationPerformer";

const performerContextCache = new Map<
  string,
  Promise<PerformerAttackContext | null>
>();

function getPerformerContextCached(
  performerCharacterKey: string,
  activeCharacterKey: string,
  charactersStore: Record<string, Record<string, unknown>>,
  teamBuffsData: Record<string, unknown>,
  customBuffs: Record<string, unknown>,
): Promise<PerformerAttackContext | null> {
  if (!performerCharacterKey || performerCharacterKey === activeCharacterKey) {
    return Promise.resolve(null);
  }
  const cacheKey = `${activeCharacterKey}:${performerCharacterKey}`;
  if (!performerContextCache.has(cacheKey)) {
    performerContextCache.set(
      cacheKey,
      getPerformerAttackContext(
        performerCharacterKey,
        activeCharacterKey,
        charactersStore,
        teamBuffsData,
        customBuffs,
      ),
    );
  }
  return performerContextCache.get(cacheKey)!;
}

export function clearPerformerContextCache() {
  performerContextCache.clear();
}

export async function buildRotationAttacksList(
  rotation: {
    actions: Array<Record<string, unknown>>;
    echo?: string | null;
    echoRank?: string | number | null;
  },
  activeCharacterKey: string,
  activeChosenChar: Record<string, unknown>,
  characterLevel: string | number,
  charactersStore: Record<string, Record<string, unknown>>,
  teamBuffsData: Record<string, unknown>,
  customBuffs: Record<string, unknown>,
): Promise<any[]> {
  clearPerformerContextCache();
  const teamBuffs = (charactersStore[activeCharacterKey]?.teamBuffs ??
    {}) as TeamBuffsState;
  const rotationMainEcho = (rotation.echo as string | null) ?? null;
  const rotationMainEchoRank = rotation.echoRank ?? null;
  const rotationActionInfo: any[] = [];

  for (const action of rotation.actions) {
    const performerId = (action.performer as RotationPerformerId) ?? "active";
    const performerCharacterKey = resolvePerformerCharacterKey(
      performerId,
      activeCharacterKey,
      teamBuffs,
    );
    let performerContext: PerformerAttackContext | null = null;
    let chosenChar = activeChosenChar;
    let level = characterLevel;

    if (performerCharacterKey !== activeCharacterKey) {
      chosenChar = (await getCharByName(performerCharacterKey)) as Record<
        string,
        unknown
      >;
      level = String(
        charactersStore[performerCharacterKey]?.characterLevel ?? "90",
      );
      performerContext = await getPerformerContextCached(
        performerCharacterKey,
        activeCharacterKey,
        charactersStore,
        teamBuffsData,
        customBuffs,
      );
    }

    const actionData = resolveRotationActionToAttackData(
      action,
      chosenChar,
      level,
      performerContext,
      rotationMainEcho,
      rotationMainEchoRank,
    );
    if (actionData) {
      if (!actionData.performerCharacterKey) {
        actionData.performerCharacterKey = activeCharacterKey;
      }
      rotationActionInfo.push(actionData);
    }
  }

  return rotationActionInfo;
}
