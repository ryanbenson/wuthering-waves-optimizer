import {
  getMainEchoBuffs,
  getMainEchoBuffStacks,
  isMainEchoBuffEnabled,
  type MainEchoBuffState,
  type MainEchoState,
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

type BuildBuffState = {
  mainEcho?: MainEchoState | null;
  echoSetPassives?: Record<string, MainEchoBuffState>;
};

function matchesBuildSetting(
  current: { isEnabled: boolean; stacks: number },
  wanted: MainEchoBuffState,
): boolean {
  if (!current.isEnabled) return false;
  return wanted.stacks == null || current.stacks === wanted.stacks;
}

/**
 * The part of {@link buildCharacterBuffUpdatesFromOptimizer} that would
 * actually change the build: main echo buffs and set passives the optimizer
 * turns on (or sets stacks for) that the build doesn't already have that way.
 * Compares effective settings, so a legacy single-toggle main echo state that
 * is on counts as on for every buff. Empty when the build already matches —
 * the "Use optimizer buffs" button (issue #705) only shows when it isn't.
 */
export function getOptimizerBuffSyncUpdates(
  characterData: OptimizerBuffSource & BuildBuffState,
  loadout: LoadoutEcho[],
  resolveEchoKey?: (echoId: string) => string | undefined,
): CharacterBuffUpdates {
  const all = buildCharacterBuffUpdatesFromOptimizer(characterData, loadout, resolveEchoKey);
  const changes: CharacterBuffUpdates = {};

  const mainEchoChanges: Record<string, MainEchoBuffState> = {};
  for (const [buffKey, wanted] of Object.entries(all.mainEcho?.buffs ?? {})) {
    const current = {
      isEnabled: isMainEchoBuffEnabled(characterData.mainEcho, buffKey),
      stacks: getMainEchoBuffStacks(characterData.mainEcho, buffKey),
    };
    if (!matchesBuildSetting(current, wanted)) mainEchoChanges[buffKey] = wanted;
  }
  if (Object.keys(mainEchoChanges).length > 0) changes.mainEcho = { buffs: mainEchoChanges };

  const passiveChanges: Record<string, MainEchoBuffState> = {};
  for (const [passiveKey, wanted] of Object.entries(all.echoSetPassives ?? {})) {
    const state = characterData.echoSetPassives?.[passiveKey];
    const current = { isEnabled: Boolean(state?.isEnabled), stacks: state?.stacks ?? 0 };
    if (!matchesBuildSetting(current, wanted)) passiveChanges[passiveKey] = wanted;
  }
  if (Object.keys(passiveChanges).length > 0) changes.echoSetPassives = passiveChanges;

  return changes;
}
