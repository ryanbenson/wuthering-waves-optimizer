type PassiveBuffState = {
  isEnabled?: boolean;
  stacks?: number;
};

type OptimizerBuffSource = {
  optimizer?: {
    mainEchoBuffs?: Record<string, PassiveBuffState>;
    echoSetPassives?: Record<string, PassiveBuffState>;
  };
};

export type LoadoutEcho = {
  echo?: string;
  echoId?: string;
};

export type CharacterBuffUpdates = {
  mainEcho?: { isEnabled?: boolean; stacks?: number };
  echoSetPassives?: Record<string, PassiveBuffState>;
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
    const mainEchoBuff = optimizer.mainEchoBuffs?.[mainEchoKey];
    if (mainEchoBuff?.isEnabled) {
      updates.mainEcho = { isEnabled: true };
      if (mainEchoBuff.stacks != null) {
        updates.mainEcho.stacks = mainEchoBuff.stacks;
      }
    }
  }

  const optimizerPassives = optimizer.echoSetPassives ?? {};
  const echoSetPassivesUpdates: Record<string, PassiveBuffState> = {};
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
