import {
  getMainEchoBuffs,
  getMainEchoBuffStacks,
  isMainEchoBuffEnabled,
  type MainEchoBuffState,
  type OptimizerMainEchoBuffEntry,
} from "../echoes/mainEchoBuffs";
import { mainEchoesData } from "../echoes/index";

type OptimizerBuffSource = {
  optimizer?: {
    mainEchoBuffs?: Record<string, OptimizerMainEchoBuffEntry>;
    echoSetPassives?: Record<string, MainEchoBuffState>;
  };
};

export type LoadoutEcho = {
  echo?: string;
  echoId?: string;
};

export type CharacterBuffUpdates = {
  mainEcho?: {
    isEnabled?: boolean;
    stacks?: number;
    buffs?: Record<string, MainEchoBuffState>;
  };
  echoSetPassives?: Record<string, MainEchoBuffState>;
};

export function buildCharacterBuffUpdatesFromOptimizer(
  characterData: OptimizerBuffSource,
  loadout: LoadoutEcho[],
  resolveEchoKey?: (echoId: string) => string | undefined,
): CharacterBuffUpdates {
  const updates: CharacterBuffUpdates = {};
  const optimizer = characterData.optimizer ?? {};

  const firstEcho = loadout[0];
  const mainEchoKey =
    firstEcho?.echo ??
    (firstEcho?.echoId && resolveEchoKey
      ? resolveEchoKey(firstEcho.echoId)
      : undefined);

  if (mainEchoKey) {
    const mainEchoBuffEntry = optimizer.mainEchoBuffs?.[mainEchoKey];
    const echoData = mainEchoesData[mainEchoKey];
    const buffs = getMainEchoBuffs(echoData);
    const buffUpdates: Record<string, MainEchoBuffState> = {};

    for (const buff of buffs) {
      if (!isMainEchoBuffEnabled(mainEchoBuffEntry, buff.key)) {
        continue;
      }
      const entry: MainEchoBuffState = { isEnabled: true };
      if (buff.hasStacks) {
        const stacks = getMainEchoBuffStacks(mainEchoBuffEntry, buff.key);
        if (stacks != null) {
          entry.stacks = stacks;
        }
      }
      buffUpdates[buff.key] = entry;
    }

    if (Object.keys(buffUpdates).length > 0) {
      updates.mainEcho = { buffs: buffUpdates };
    }
  }

  const optimizerPassives = optimizer.echoSetPassives ?? {};
  const echoSetPassivesUpdates: Record<string, MainEchoBuffState> = {};
  for (const [passiveKey, passiveState] of Object.entries(optimizerPassives)) {
    if (!passiveState?.isEnabled) {
      continue;
    }
    echoSetPassivesUpdates[passiveKey] = { isEnabled: true };
    if (passiveState.stacks != null) {
      echoSetPassivesUpdates[passiveKey].stacks = passiveState.stacks;
    }
  }

  if (Object.keys(echoSetPassivesUpdates).length > 0) {
    updates.echoSetPassives = echoSetPassivesUpdates;
  }

  return updates;
}
