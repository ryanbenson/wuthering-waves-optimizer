import { mainEchoesData } from "./index";

export interface MainEchoConfig {
  echo?: string | null;
  rank?: string | number;
  isEnabled?: boolean;
  stacks?: number;
}

interface MainEchoModifier {
  specificCharacters?: string[];
  modifySpecificTalents?: string[];
  modifierValue?: number;
  modifier?: string;
}

interface MainEchoData {
  modifiers?: MainEchoModifier[];
  hasStacks?: boolean;
  maxStacks?: number;
  alwaysEnabled?: boolean;
  details?: string;
}

/**
 * Resolves a character's main-echo self-buff into a numeric stats object.
 * Mirrors CalculatorEchoes.vue's `updateTotalStats` main-echo-buff branch
 * exactly. Note: unlike weapon/echo-set passives, an "alwaysEnabled" main
 * echo is NOT force-enabled here — the live component has no such watcher
 * either, so `mainEchoConfig.isEnabled` is honored as-is (a pre-existing
 * quirk, preserved intentionally).
 */
export function resolveMainEchoBuffStats(
  character: string,
  mainEchoConfig: MainEchoConfig | undefined,
): Record<string, unknown> {
  const stats: Record<string, unknown> = {};
  const echoKey = mainEchoConfig?.echo;
  if (!echoKey) {
    return stats;
  }
  const chosenMainEchoData = (mainEchoesData as Record<string, MainEchoData>)?.[echoKey] ?? null;
  if (!chosenMainEchoData) {
    return stats;
  }
  if (!(mainEchoConfig?.isEnabled ?? false)) {
    return stats;
  }
  const hasStacks = chosenMainEchoData.hasStacks ?? false;
  const stacks = mainEchoConfig?.stacks ?? 0;
  const buffs = chosenMainEchoData.modifiers ?? [];
  for (const mainEchoBuff of buffs) {
    const specificCharacters = mainEchoBuff?.specificCharacters ?? [];
    if (specificCharacters.length > 0 && !specificCharacters.includes(character)) {
      continue;
    }
    if (mainEchoBuff?.modifySpecificTalents) {
      stats.specificTalentBuffs = {};
      mainEchoBuff.modifySpecificTalents.forEach((buffTalentName: string) => {
        (stats.specificTalentBuffs as Record<string, number>)[buffTalentName] =
          mainEchoBuff.modifierValue as number;
      });
    } else {
      const buffVal = (mainEchoBuff.modifierValue as number) * 100;
      const appliedVal = hasStacks ? buffVal * stacks : buffVal;
      stats[mainEchoBuff.modifier as string] =
        ((stats[mainEchoBuff.modifier as string] as number) || 0) + appliedVal;
    }
  }
  return stats;
}

/**
 * Combines the base echo stats, the three echo-set-bonus stat objects, and
 * the main-echo buff into the final `echoStats` object fed into
 * calculateAllStats. Mirrors CalculatorEchoes.vue's `updateTotalStats`
 * top-level merge exactly, including the pre-existing asymmetry where only
 * `setBonusTwoStats` special-cases `EnableAttack` (overwrite instead of
 * sum) — `setBonusOnePieceStats`/`setBonusOneStats` do not.
 */
export function combineEchoStats(
  combinedEchoStats: Record<string, number>,
  setBonusOnePieceStats: Record<string, unknown>,
  setBonusOneStats: Record<string, unknown>,
  setBonusTwoStats: Record<string, unknown>,
  mainEchoBuffStats: Record<string, unknown>,
): Record<string, unknown> {
  const stats: Record<string, unknown> = {};

  Object.entries(combinedEchoStats || {}).forEach(([stat, value]) => {
    stats[stat] = ((stats[stat] as number) || 0) + (value as number);
  });
  Object.entries(setBonusOnePieceStats || {}).forEach(([stat, value]) => {
    stats[stat] = ((stats[stat] as number) || 0) + (value as number);
  });
  Object.entries(setBonusOneStats || {}).forEach(([stat, value]) => {
    stats[stat] = ((stats[stat] as number) || 0) + (value as number);
  });
  Object.entries(setBonusTwoStats || {}).forEach(([stat, value]) => {
    if (stat === "EnableAttack") stats[stat] = value;
    else stats[stat] = ((stats[stat] as number) || 0) + (value as number);
  });

  Object.entries(mainEchoBuffStats || {}).forEach(([stat, value]) => {
    if (stat === "specificTalentBuffs") {
      stats[stat] = value;
    } else {
      stats[stat] = ((stats[stat] as number) || 0) + (value as number);
    }
  });

  return stats;
}
