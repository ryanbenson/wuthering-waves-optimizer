import { getCharByName } from "../characters/characters";
import { resolveRotationActionToAttackData } from "./resolveRotationAction";
import {
  computeRotationActionBuildContext,
  createGetEchoByIdFromInventory,
} from "./rotationBuffOverrides";
import { buildManualPerformerContextFromStore } from "./performerContextFromStore";
import {
  getRotationPerformerConfig,
  resolvePerformerCharacterKey,
  type RotationPerformerId,
  type TeamBuffsState,
  type PerformerAttackContext,
} from "./rotationPerformer";

async function buildPerformerContextForRotationAction(
  action: Record<string, unknown>,
  performerCharacterKey: string,
  activeCharacterKey: string,
  charactersStore: Record<string, Record<string, unknown>>,
  teamBuffsData: Record<string, unknown>,
  customBuffs: Record<string, unknown>,
  teamBuffs: TeamBuffsState,
  getEchoById: (echoId: string) => import("../echoes/stats").EchoObject | undefined,
): Promise<PerformerAttackContext> {
  const charStore = charactersStore[performerCharacterKey] ?? {};

  if (performerCharacterKey !== activeCharacterKey) {
    const performerConfig = getRotationPerformerConfig(
      performerCharacterKey,
      teamBuffs,
    );
    if (performerConfig.useSavedBuild === false) {
      const manual = await buildManualPerformerContextFromStore(
        performerCharacterKey,
        charStore,
        performerConfig,
      );
      if (manual) {
        return manual;
      }
    }
  }

  return computeRotationActionBuildContext(
    performerCharacterKey,
    charStore,
    teamBuffsData,
    customBuffs,
    (action.buffOverrides as never) ?? null,
    action,
    charactersStore,
    activeCharacterKey,
    getEchoById,
  );
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
  inventoryEchoes: Array<{ echoId?: string | null } & Record<string, unknown>> = [],
): Promise<any[]> {
  const teamBuffs = (charactersStore[activeCharacterKey]?.teamBuffs ??
    {}) as TeamBuffsState;
  const rotationMainEcho = (rotation.echo as string | null) ?? null;
  const rotationMainEchoRank = rotation.echoRank ?? null;
  const getEchoById = createGetEchoByIdFromInventory(inventoryEchoes);
  const rotationActionInfo: any[] = [];

  for (const action of rotation.actions) {
    const performerId = (action.performer as RotationPerformerId) ?? "active";
    const performerCharacterKey = resolvePerformerCharacterKey(
      performerId,
      activeCharacterKey,
      teamBuffs,
    );
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
    }

    const performerContext = await buildPerformerContextForRotationAction(
      action,
      performerCharacterKey,
      activeCharacterKey,
      charactersStore,
      teamBuffsData,
      customBuffs,
      teamBuffs,
      getEchoById,
    );

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
        actionData.performerCharacterKey = performerCharacterKey;
      }
      rotationActionInfo.push(actionData);
    }
  }

  return rotationActionInfo;
}
