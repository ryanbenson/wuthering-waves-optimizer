import {
  calcCharacterRotationDamage,
  type CharacterRotationInput,
  type DamageAggregation,
} from "../calculator/characterRotation";
import {
  resolveComparisonRotation,
  type ComparisonTargetOptions,
} from "../calculator/rotationComparison";
import { getCharByName } from "../characters/characters";
import { getWeaponByName } from "./weapons";
import type { TeamEnemyConfig } from "../calculator/buildCharacterContext";
import { ROTATION_DAMAGE_FIELD, type LiveResultBarDamageType } from "../calculator/liveResultBar";

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

export interface WeaponImpactOptions extends ComparisonTargetOptions {
  /**
   * Which damage-aggregation field to compare (Normal/Average/Crit) — should
   * match whatever the caller currently has the Live Result Bar showing for
   * this character (`liveResultBarDamageType`), not always "Average".
   */
  damageType?: LiveResultBarDamageType;
}

function resolveWeaponComparisonRotation(
  characterId: string,
  characters: Record<string, any>,
  options: ComparisonTargetOptions,
): Promise<CharacterRotationInput | null> {
  return resolveComparisonRotation(
    characterId,
    characters,
    "weapon-impact-preview",
    "Weapon impact preview",
    options,
  );
}

function readDamage(
  result: { damageAggregation: DamageAggregation },
  damageType: LiveResultBarDamageType,
): number {
  const field = ROTATION_DAMAGE_FIELD[damageType] as keyof DamageAggregation;
  return result.damageAggregation[field] ?? 0;
}

/**
 * Unlike `resolveCandidateEchoConfig` in `src/echoes/echoImpact.ts`, this
 * needs no cached-field recompute list: `buildCharacterCalculationContext`
 * derives weapon passive strength live from `weaponPassiveMode` on every
 * call rather than reading it from a stored, echo-swap-style pointer field on
 * `characters[characterId]` — which is exactly why weapon impact stays a
 * `statOnly`/`fullyBuffed` bracket instead of echo's single exact delta (see
 * the module doc comment below). If a future change gives weapons their own
 * stored/cached derived field the same way echoes have `echoSetBonus`, add
 * an equivalent contract comment here and keep both lists honest — see
 * `docs/adr/0011-headless-character-calculation-context.md`.
 */
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
  damageType: LiveResultBarDamageType,
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
    readDamage(statOnlyResult, damageType),
    readDamage(fullyBuffedResult, damageType),
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
  options: WeaponImpactOptions = {},
): Promise<WeaponImpactRange | null> {
  const damageType = options.damageType ?? "Average";
  const rotation = await resolveWeaponComparisonRotation(characterId, characters, options);
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
    readDamage(baselineResult, damageType),
    damageType,
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
  options: WeaponImpactOptions = {},
): Promise<Map<string, WeaponImpactRange | null>> {
  const results = new Map<string, WeaponImpactRange | null>();
  if (!candidates.length) {
    return results;
  }
  const damageType = options.damageType ?? "Average";
  const rotation = await resolveWeaponComparisonRotation(characterId, characters, options);
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
  const baselineDamage = readDamage(baselineResult, damageType);

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
          damageType,
        );
        results.set(candidate.weaponKey, range);
      } catch {
        results.set(candidate.weaponKey, null);
      }
    }),
  );
  return results;
}
