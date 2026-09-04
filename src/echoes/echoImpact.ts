import {
  calcCharacterRotationDamage,
  type CharacterRotationInput,
} from "../calculator/characterRotation";
import { resolveComparisonRotation } from "../calculator/rotationComparison";
import {
  resolveCharacterEchoes,
  type TeamEnemyConfig,
} from "../calculator/buildCharacterContext";
import { getSetBonusEffects, getSetsFromEchoes } from "./sets";

export interface EchoSwapCandidate {
  /** An inventory echo's `echoId` — must already exist in `inventoryEchoes`. */
  echoId: string;
  /** Which of the character's 5 echo slots (0-4) this candidate would fill. */
  slotIndex: number;
}

export interface EchoImpactDelta {
  baselineDamage: number;
  damage: number;
  delta: number;
  pct: number;
}

function resolveEchoComparisonRotation(
  characterId: string,
  characters: Record<string, any>,
): Promise<CharacterRotationInput | null> {
  return resolveComparisonRotation(
    characterId,
    characters,
    "echo-impact-preview",
    "Echo impact preview",
  );
}

/**
 * Applies a candidate echo to one slot on a shallow clone of `characters` —
 * never the real store record. Only the pointer (`echoId`) is written, which
 * is exactly what `resolveCharacterEchoes` reads: it looks the id up in
 * `inventoryEchoes` and uses that echo's real stats, so no substat/main-stat
 * fields need copying here (and copying them would risk going stale against
 * the inventory, the same trap the character-record placeholder fields
 * already fell into).
 *
 * `echoSetBonus` — which 1pc/2pc/3pc/5pc bonuses actually apply — is a
 * separate stored field, not something `buildCharacterCalculationContext`
 * derives from the 5 slots itself; in the real app it's kept in sync by
 * `CalculatorEchoes.vue`'s `updateEchoSets()` reacting to each slot's set
 * changing. A synthetic swap has no such reactivity, so left alone this
 * field would stay frozen at its pre-swap value — invisible to a swap that
 * completes, breaks, or shifts a set bonus, which is exactly the kind of
 * swap whose damage impact is most worth estimating correctly. Recompute it
 * here with `getSetBonusEffects`/`getSetsFromEchoes`, the same pure
 * derivation the Optimizer already uses to score a candidate loadout
 * (`optimizer.ts`'s `computeLoadoutFinalStats`) — unless the character has a
 * manually pinned override (`setOverride`), which the real UI also leaves
 * alone (`CalculatorEchoes.vue`'s `if (setOverride.value) return;`).
 */
function resolveCandidateEchoConfig(
  characterId: string,
  characters: Record<string, any>,
  candidate: EchoSwapCandidate,
  inventoryEchoes: any[],
): { syntheticCharacters: Record<string, any> } {
  const characterData = characters?.[characterId] ?? {};
  const nextEchoPointers = {
    ...(characterData.echoes ?? {}),
    [candidate.slotIndex]: { echoId: candidate.echoId },
  };
  const echoSetBonus = characterData.setOverride
    ? characterData.echoSetBonus
    : getSetBonusEffects(
        getSetsFromEchoes(resolveCharacterEchoes(nextEchoPointers, inventoryEchoes)),
      );

  return {
    syntheticCharacters: {
      ...characters,
      [characterId]: {
        ...characterData,
        echoes: nextEchoPointers,
        echoSetBonus,
      },
    },
  };
}

function toImpactDelta(baselineDamage: number, damage: number): EchoImpactDelta {
  const delta = damage - baselineDamage;
  return {
    baselineDamage,
    damage,
    delta,
    pct: baselineDamage ? delta / baselineDamage : 0,
  };
}

async function estimateOneCandidate(
  rotation: CharacterRotationInput,
  characterId: string,
  characters: Record<string, any>,
  candidate: EchoSwapCandidate,
  enemyConfig: TeamEnemyConfig,
  inventoryEchoes: any[],
  baselineDamage: number,
): Promise<EchoImpactDelta> {
  const { syntheticCharacters } = resolveCandidateEchoConfig(
    characterId,
    characters,
    candidate,
    inventoryEchoes,
  );
  const result = await calcCharacterRotationDamage(
    rotation,
    null,
    characterId,
    syntheticCharacters,
    enemyConfig,
    inventoryEchoes,
  );
  return toImpactDelta(baselineDamage, result.damageAggregation.avgDamage ?? 0);
}

/**
 * Estimates the total-damage swing from equipping `candidate` into its slot,
 * relative to the character's current build.
 *
 * Unlike `estimateWeaponSwapImpact`, this is a single exact number rather
 * than a 2-point range: a weapon needs bracketing because its passive may or
 * may not be active in play (hence `weaponPassiveMode`), but an echo has no
 * equivalent on/off axis — set bonuses and main-echo buffs resolve
 * unconditionally from whatever is equipped, so one calculation gives the
 * real answer. Swapping across sets is handled by recomputing which set
 * bonuses apply post-swap (see `resolveCandidateEchoConfig`) — without that,
 * a swap that completes or breaks a set bonus would be scored against the
 * pre-swap bonus and come out badly wrong.
 *
 * Reuses the existing headless pipeline (ADR 0011,
 * `buildCharacterCalculationContext` / `calcCharacterRotationDamage`) — no
 * new damage math, and the store is never touched. Returns `null` when
 * `resolveComparisonRotation` finds nothing to compare against.
 *
 * For more than one candidate at once (a browse list), use
 * `estimateEchoSwapImpactBatch` — it computes the shared baseline once
 * rather than once per candidate.
 */
export async function estimateEchoSwapImpact(
  characterId: string,
  characters: Record<string, any>,
  candidate: EchoSwapCandidate,
  enemyConfig: TeamEnemyConfig,
  inventoryEchoes: any[] = [],
): Promise<EchoImpactDelta | null> {
  const rotation = await resolveEchoComparisonRotation(characterId, characters);
  if (!rotation) {
    return null;
  }
  const baselineResult = await calcCharacterRotationDamage(
    rotation,
    null,
    characterId,
    characters,
    enemyConfig,
    inventoryEchoes,
  );
  return estimateOneCandidate(
    rotation,
    characterId,
    characters,
    candidate,
    enemyConfig,
    inventoryEchoes,
    baselineResult.damageAggregation.avgDamage ?? 0,
  );
}

/**
 * Batch form of `estimateEchoSwapImpact`: computes the shared baseline once,
 * then resolves every candidate against it. Returns a `Map` keyed by
 * `echoId` (values `null` for a candidate that itself fails to resolve, or
 * the whole `Map` is empty when there's nothing to compare against at all).
 *
 * Callers should bound `candidates` themselves — an echo inventory can hold
 * hundreds of echoes, and each candidate costs a full context rebuild. The
 * browse UI computes badges for the visible page automatically and only
 * widens to the full filtered list when the user explicitly sorts by impact.
 */
export async function estimateEchoSwapImpactBatch(
  characterId: string,
  characters: Record<string, any>,
  candidates: EchoSwapCandidate[],
  enemyConfig: TeamEnemyConfig,
  inventoryEchoes: any[] = [],
): Promise<Map<string, EchoImpactDelta | null>> {
  const results = new Map<string, EchoImpactDelta | null>();
  if (!candidates.length) {
    return results;
  }
  const rotation = await resolveEchoComparisonRotation(characterId, characters);
  if (!rotation) {
    return results;
  }
  const baselineResult = await calcCharacterRotationDamage(
    rotation,
    null,
    characterId,
    characters,
    enemyConfig,
    inventoryEchoes,
  );
  const baselineDamage = baselineResult.damageAggregation.avgDamage ?? 0;

  await Promise.all(
    candidates.map(async (candidate) => {
      try {
        const delta = await estimateOneCandidate(
          rotation,
          characterId,
          characters,
          candidate,
          enemyConfig,
          inventoryEchoes,
          baselineDamage,
        );
        results.set(candidate.echoId, delta);
      } catch {
        results.set(candidate.echoId, null);
      }
    }),
  );
  return results;
}
