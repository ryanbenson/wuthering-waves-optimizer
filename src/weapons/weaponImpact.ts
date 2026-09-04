import {
  calcCharacterRotationDamage,
  type CharacterRotationInput,
} from "../calculator/characterRotation";
import { resolveComparisonRotation } from "../calculator/rotationComparison";
import { getCharByName } from "../characters/characters";
import { getWeaponByName } from "./weapons";
import type { TeamEnemyConfig } from "../calculator/buildCharacterContext";

export interface WeaponSwapCandidate {
  weaponKey: string;
  /** Defaults to the candidate weapon's own max level. */
  weaponLevel?: string;
  /** Defaults to "1". */
  refinement?: string;
}

export interface WeaponImpactRange {
  baselineDamage: number;
  statOnlyDamage: number;
  fullyBuffedDamage: number;
  statOnlyDelta: number;
  statOnlyPct: number;
  fullyBuffedDelta: number;
  fullyBuffedPct: number;
}

function resolveWeaponComparisonRotation(
  characterId: string,
  characters: Record<string, any>,
): Promise<CharacterRotationInput | null> {
  return resolveComparisonRotation(
    characterId,
    characters,
    "weapon-impact-preview",
    "Weapon impact preview",
  );
}

async function resolveCandidateWeaponConfig(
  characterId: string,
  characters: Record<string, any>,
  candidate: WeaponSwapCandidate,
): Promise<{ syntheticCharacters: Record<string, any> }> {
  const characterData = characters?.[characterId] ?? {};
  const chosenChar = (await getCharByName(characterId)) as Record<string, any> | null;
  const weaponType = chosenChar?.basic?.weapon ?? "Swords";
  const chosenWeapon = await getWeaponByName(weaponType, candidate.weaponKey);
  const weaponLevel = candidate.weaponLevel ?? chosenWeapon?.info?.maxLevel ?? "90";
  const refinement = candidate.refinement ?? "1";

  return {
    syntheticCharacters: {
      ...characters,
      [characterId]: {
        ...characterData,
        weapon: candidate.weaponKey,
        weapons: {
          ...(characterData.weapons ?? {}),
          [candidate.weaponKey]: { weaponLevel, refinement },
        },
      },
    },
  };
}

function toImpactRange(
  baselineDamage: number,
  statOnlyDamage: number,
  fullyBuffedDamage: number,
): WeaponImpactRange {
  const statOnlyDelta = statOnlyDamage - baselineDamage;
  const fullyBuffedDelta = fullyBuffedDamage - baselineDamage;
  return {
    baselineDamage,
    statOnlyDamage,
    fullyBuffedDamage,
    statOnlyDelta,
    statOnlyPct: baselineDamage ? statOnlyDelta / baselineDamage : 0,
    fullyBuffedDelta,
    fullyBuffedPct: baselineDamage ? fullyBuffedDelta / baselineDamage : 0,
  };
}

async function estimateOneCandidate(
  rotation: CharacterRotationInput,
  characterId: string,
  characters: Record<string, any>,
  candidate: WeaponSwapCandidate,
  enemyConfig: TeamEnemyConfig,
  inventoryEchoes: any[],
  baselineDamage: number,
): Promise<WeaponImpactRange> {
  const { syntheticCharacters } = await resolveCandidateWeaponConfig(characterId, characters, candidate);
  const [statOnlyResult, fullyBuffedResult] = await Promise.all([
    calcCharacterRotationDamage(
      rotation,
      null,
      characterId,
      syntheticCharacters,
      enemyConfig,
      inventoryEchoes,
      null,
      { weaponPassiveMode: "all-off" },
    ),
    calcCharacterRotationDamage(
      rotation,
      null,
      characterId,
      syntheticCharacters,
      enemyConfig,
      inventoryEchoes,
      null,
      { weaponPassiveMode: "all-max" },
    ),
  ]);
  return toImpactRange(
    baselineDamage,
    statOnlyResult.damageAggregation.avgDamage ?? 0,
    fullyBuffedResult.damageAggregation.avgDamage ?? 0,
  );
}

/**
 * Estimates the total-damage swing from swapping to `candidate`, relative
 * to the character's currently equipped weapon+build — as a 2-point range
 * rather than a single guessed number:
 * - `statOnlyDamage`: only the ATK/secondary-stat swap counted, every
 *   candidate passive (including any `alwaysEnabled` one) suppressed.
 * - `fullyBuffedDamage`: every candidate passive enabled at max stacks.
 *
 * Reuses the existing headless calculation pipeline (ADR 0011,
 * `buildCharacterCalculationContext` / `calcCharacterRotationDamage`) via
 * the new `weaponPassiveMode` option — no new damage math, and the store is
 * never touched (the candidate weapon is applied to a shallow clone of
 * `characters`, not the real record). Returns `null` when
 * `resolveComparisonRotation` finds nothing to compare against.
 *
 * For more than one candidate at once (a recommended rail, a browse list),
 * use `estimateWeaponSwapImpactBatch` instead — it computes the shared
 * baseline once rather than once per candidate.
 */
export async function estimateWeaponSwapImpact(
  characterId: string,
  characters: Record<string, any>,
  candidate: WeaponSwapCandidate,
  enemyConfig: TeamEnemyConfig,
  inventoryEchoes: any[] = [],
): Promise<WeaponImpactRange | null> {
  const rotation = await resolveWeaponComparisonRotation(characterId, characters);
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
 * Batch form of `estimateWeaponSwapImpact`: computes the shared baseline
 * once, then resolves every candidate's range against it in parallel.
 * Returns a `Map` keyed by `weaponKey` (values `null` for a candidate that
 * itself fails to resolve, or the whole `Map` is empty when there's nothing
 * to compare against at all).
 */
export async function estimateWeaponSwapImpactBatch(
  characterId: string,
  characters: Record<string, any>,
  candidates: WeaponSwapCandidate[],
  enemyConfig: TeamEnemyConfig,
  inventoryEchoes: any[] = [],
): Promise<Map<string, WeaponImpactRange | null>> {
  const results = new Map<string, WeaponImpactRange | null>();
  if (!candidates.length) {
    return results;
  }
  const rotation = await resolveWeaponComparisonRotation(characterId, characters);
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
        const range = await estimateOneCandidate(
          rotation,
          characterId,
          characters,
          candidate,
          enemyConfig,
          inventoryEchoes,
          baselineDamage,
        );
        results.set(candidate.weaponKey, range);
      } catch {
        results.set(candidate.weaponKey, null);
      }
    }),
  );
  return results;
}
