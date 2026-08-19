import { resolveRotationActionToAttackData } from "./resolveRotationAction";
import { hasAdvancedConfigOverrides, type RotationAdvancedConfig } from "./rotationAdvancedBuffs";

export interface OptimizerRotationOverrideAction {
  actionId: string;
  attack: any;
  advancedConfig: RotationAdvancedConfig;
}

export interface OptimizerRotationData {
  id: string;
  name: string;
  description?: string | null;
  duration?: number | string | null;
  echo?: string | null;
  /** Actions with no real `advancedConfig` override — scored together against one shared context. */
  plainAttacks: any[];
  /** Actions with a real per-buff override — each scored against its own rebuilt context. */
  overrideActions: OptimizerRotationOverrideAction[];
  /** Original active-action ids, in rotation order, for re-merging plain + override results afterward. */
  actionOrder: string[];
}

/**
 * Resolves a persisted rotation's actions once per optimizer run (not per
 * loadout) into the shape `scoreOptimizerRotation` needs: actions with no
 * `advancedConfig` override go in `plainAttacks` (the existing cheap,
 * shared-context path); actions with a real override go in `overrideActions`,
 * carrying their own `advancedConfig` so a per-action buff variant can be
 * built once and reused across every loadout. Mirrors the plain/override
 * split `characterRotation.ts`'s `calcCharacterRotationDamage` already uses
 * for the live Character Rotation display.
 */
export function buildOptimizerRotationData(
  rotation: {
    id: string;
    name: string;
    description?: string | null;
    duration?: number | string | null;
    echo?: string | null;
    actions: any[];
  },
  chosenChar: any,
  characterLevel: string | number,
): OptimizerRotationData {
  const activeActions = (rotation.actions ?? []).filter((action: any) => !action?.isDisabled);
  const plainAttacks: any[] = [];
  const overrideActions: OptimizerRotationOverrideAction[] = [];
  const actionOrder: string[] = [];

  for (const action of activeActions) {
    actionOrder.push(action.id);
    const attack = resolveRotationActionToAttackData(action, chosenChar, characterLevel);
    if (!attack) continue;

    if (hasAdvancedConfigOverrides(action.advancedConfig)) {
      overrideActions.push({ actionId: action.id, attack, advancedConfig: action.advancedConfig });
    } else {
      plainAttacks.push(attack);
    }
  }

  return {
    id: rotation.id,
    name: rotation.name,
    description: rotation.description ?? null,
    duration: rotation.duration ?? null,
    echo: rotation.echo ?? null,
    plainAttacks,
    overrideActions,
    actionOrder,
  };
}
