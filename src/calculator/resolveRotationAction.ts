import { getEchoData } from "../echoes";
import { utilityAttacks } from "../buffs";
import { echoSetAttacks } from "../echoes/stats";
import { negativeStatusAttacks } from "./negativeStatusAttacks";
/**
 * Maps a persisted rotation action to a full attack object for processAttacks.
 */
export function resolveRotationActionToAttackData(
  action: any,
  chosenChar: any,
  _characterLevel: string | number,
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
    const echoData = getEchoData(actionMainEcho);
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

  const actionData: any = {
    ...foundAction,
    buffs: buffsData,
    actionType: actionType === "negativeStatus" ? "negativeStatus" : actionType,
    count: actionCount,
    id: actionId,
    excludeSelfBuffs: action.excludeSelfBuffs ?? false,
    excludeTeamBuffs: action.excludeTeamBuffs ?? false,
    excludeWeaponBuffs: action.excludeWeaponBuffs ?? false,
    actionMainEcho,
    actionMainEchoRank,
  };

  if (actionType === "echoAttacks") {
    actionData.excludeEchoes =
      action.excludeSelfBuffs ||
      action.excludeTeamBuffs ||
      action.excludeWeaponBuffs ||
      false;
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
