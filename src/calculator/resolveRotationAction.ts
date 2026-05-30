import { getEchoData } from "../echoes";
import { utilityAttacks } from "../buffs";
import { echoSetAttacks } from "../echoes/stats";
import { negativeStatusAttacks } from "./negativeStatusAttacks";
import { actionNeedsCustomBuild } from "./rotationBuffOverrides";
import type { PerformerAttackContext } from "./rotationPerformer";
import { getPerformerMainEchoForEchoAttacks } from "./rotationPerformer";

/**
 * Maps a persisted rotation action to a full attack object for processAttacks.
 */
export function resolveRotationActionToAttackData(
  action: any,
  chosenChar: any,
  _characterLevel: string | number,
  performerContext: PerformerAttackContext | null = null,
  rotationMainEcho: string | null = null,
  rotationMainEchoRank: number | string | null = null,
): any | null {
  if (action?.isDisabled) {
    return null;
  }
  const actionKey = action.key;
  const actionType = action.type;
  const actionCount = action.count;
  const actionId = action.id;
  const actionMainEcho = action?.mainEcho ?? null;
  const actionMainEchoRank = action?.mainEchoRank ?? null;

  const attacksList = chosenChar?.[`${actionType}Attacks`]?.attacks ?? [];
  let foundAction: any;

  if (actionType === "echoSetAttacks") {
    foundAction = echoSetAttacks.find((attack) => attack.key === actionKey);
  } else if (actionType === "utilityAttacks") {
    foundAction = utilityAttacks.find((attack) => attack.key === actionKey);
  } else if (actionType === "echoAttacks") {
    const echoKey =
      getPerformerMainEchoForEchoAttacks(
        performerContext,
        rotationMainEcho,
        rotationMainEchoRank,
        actionMainEcho,
        actionMainEchoRank,
      ).mainEcho ?? actionMainEcho;
    const echoData = getEchoData(echoKey);
    const echoAttacks = echoData?.actions ?? [];
    foundAction = echoAttacks.find((attack) => attack.key === actionKey);
  } else if (actionType === "negativeStatus") {
    foundAction = negativeStatusAttacks.find((attack) => attack.key === actionKey);
  } else {
    foundAction = attacksList.find((attack: any) => attack.key === actionKey);
  }

  if (!foundAction) {
    return null;
  }

  let buffsData: Record<string, number> | null = null;
  if (action?.buffs?.length) {
    buffsData = {};
    action.buffs.forEach((buff: any) => {
      let buffValue;
      if (["ATK_FLAT", "HP_FLAT", "DEF_FLAT"].includes(buff.modifier)) {
        buffValue = Number(buff.modifierValue);
      } else {
        buffValue = Number(buff.modifierValue) / 100;
      }
      buffsData![buff.modifier] = buffValue;
    });
  }

  const usesActionBuildOverrides = actionNeedsCustomBuild(action);
  const actionData: any = {
    ...foundAction,
    buffs: buffsData,
    actionType: actionType === "negativeStatus" ? "negativeStatus" : actionType,
    count: actionCount,
    id: actionId,
    excludeSelfBuffs: usesActionBuildOverrides
      ? false
      : (action.excludeSelfBuffs ?? false),
    excludeTeamBuffs: action.excludeTeamBuffs ?? false,
    excludeWeaponBuffs: usesActionBuildOverrides
      ? false
      : (action.excludeWeaponBuffs ?? false),
  };

  if (performerContext) {
    actionData.performerCharacterKey = performerContext.performerCharacterKey;
    actionData.performerStats = performerContext.performerStats;
    actionData.performerTalentData = performerContext.performerTalentData;
    actionData.performerBuffs = performerContext.performerBuffs;
    actionData.performerChosenChar = performerContext.performerChosenChar;
    actionData.performerTeamBuffsData =
      performerContext.performerTeamBuffsData;
    actionData.performerCustomBuffs = performerContext.performerCustomBuffs;
    actionData.performerEchoStats = performerContext.performerEchoStats;
    actionData.performerWeaponPassiveStats =
      performerContext.performerWeaponPassiveStats;
  }

  if (actionType === "echoAttacks") {
    const resolvedEcho = getPerformerMainEchoForEchoAttacks(
      performerContext,
      rotationMainEcho,
      rotationMainEchoRank,
      actionMainEcho,
      actionMainEchoRank,
    );
    actionData.actionMainEcho = resolvedEcho.mainEcho;
    actionData.actionMainEchoRank = resolvedEcho.mainEchoRank;
    actionData.excludeEchoes = usesActionBuildOverrides
      ? (action.excludeTeamBuffs ?? false)
      : Boolean(
          action.excludeSelfBuffs ||
            action.excludeTeamBuffs ||
            action.excludeWeaponBuffs,
        );
  }

  if (actionType === "negativeStatus") {
    const stacks = Number(action.negativeStatusStacks ?? 1);
    const electroRageStacks =
      foundAction.subType === "ElectroFlare"
        ? Number(action.electroRageStacks ?? 0)
        : 0;
    actionData.talent = "";
    actionData.stacks = stacks;
    actionData.electroRageStacks = electroRageStacks;
  }

  return actionData;
}
