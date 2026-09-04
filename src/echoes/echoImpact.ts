import {
  calcCharacterRotationDamage,
  type CharacterRotationInput,
  type DamageAggregation,
} from "../calculator/characterRotation";
import {
  resolveComparisonRotation,
  type ComparisonTargetOptions,
} from "../calculator/rotationComparison";
import {
  resolveCharacterEchoes,
  type TeamEnemyConfig,
} from "../calculator/buildCharacterContext";
import { ROTATION_DAMAGE_FIELD, type LiveResultBarDamageType } from "../calculator/liveResultBar";
import {
  getSetBonusEffects,
  getSetsFromEchoes,
  setBonusEffectsOnePiece,
  setBonusEffectsOne,
  setBonusEffectsTwo,
} from "./sets";

export type EchoSetBonusSelection = {
  setBonusOnePiece?: string | null;
  setBonusOne?: string | null;
  setBonusTwo?: string | null;
};

const SET_BONUS_SLOT_DEFS: Array<{
  slot: keyof EchoSetBonusSelection;
  defs: Record<string, { passives?: Array<{ key: string; maxStacks?: number }> }>;
}> = [
  { slot: "setBonusOnePiece", defs: setBonusEffectsOnePiece },
  { slot: "setBonusOne", defs: setBonusEffectsOne },
  { slot: "setBonusTwo", defs: setBonusEffectsTwo },
];

/**
 * A swap can make a set bonus apply that wasn't applying a moment ago (e.g.
 * completing a 5pc). That bonus's passives are ordinary toggle/stack
 * passives exactly like a weapon's (`resolveEchoSetPassiveInstance` reads
 * `characterData.echoSetPassives[key]`, defaulting to off unless
 * `alwaysEnabled`) — the player has to open the newly-unlocked bonus's
 * passive card and turn it on, the same way they would for a weapon
 * passive. Left alone, a synthetic swap has no such interaction: the
 * candidate correctly *names* the new bonus (`resolveCandidateEchoConfig`
 * already recomputes `echoSetBonus`), but scores its passives against
 * whatever `echoSetPassives` config the character happened to have stored
 * from *before* the bonus ever applied — almost always "off", since the
 * bonus's card was never even rendered for the player to toggle. Reported:
 * a swap that restored a 5pc bonus (a large, conditional 15-30%+ elemental
 * DMG passive, `alwaysEnabled: false`) was estimated at "+2,315 · +2.4%"
 * when it actually gained ~80K.
 *
 * Assumes a rational player turns on any bonus a swap newly makes
 * available — the same "credit the upside" assumption
 * `estimateWeaponSwapImpact`'s `weaponPassiveMode: "all-max"` makes for a
 * candidate weapon's passives. Only the *newly*-applicable bonus's own
 * passives are forced on; a bonus unchanged by this swap keeps the
 * character's real stored toggle state, so the estimate never overrides a
 * preference the player set for something this swap didn't touch.
 */
export function resolveNewlyActiveSetPassivesOverride(
  storedEchoSetPassives: Record<string, { isEnabled?: boolean; stacks?: number }>,
  previousEchoSetBonus: EchoSetBonusSelection,
  nextEchoSetBonus: EchoSetBonusSelection,
): Record<string, { isEnabled?: boolean; stacks?: number }> {
  const override: Record<string, { isEnabled?: boolean; stacks?: number }> = {
    ...storedEchoSetPassives,
  };
  for (const { slot, defs } of SET_BONUS_SLOT_DEFS) {
    const nextKey = nextEchoSetBonus[slot];
    if (!nextKey || nextKey === previousEchoSetBonus[slot]) continue;
    const passives = defs[nextKey]?.passives ?? [];
    for (const passive of passives) {
      override[passive.key] = { isEnabled: true, stacks: passive.maxStacks ?? 0 };
    }
  }
  return override;
}

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

export interface EchoImpactOptions extends ComparisonTargetOptions {
  /**
   * Which damage-aggregation field to compare (Normal/Average/Crit) — should
   * match whatever the caller currently has the Live Result Bar showing for
   * this character (`liveResultBarDamageType`), not always "Average", or the
   * estimate can disagree with the real number even when it picks the
   * exact-right rotation.
   */
  damageType?: LiveResultBarDamageType;
}

function resolveEchoComparisonRotation(
  characterId: string,
  characters: Record<string, any>,
  options: ComparisonTargetOptions,
): Promise<CharacterRotationInput | null> {
  return resolveComparisonRotation(
    characterId,
    characters,
    "echo-impact-preview",
    "Echo impact preview",
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
  const previousEchoSetBonus: EchoSetBonusSelection = characterData.echoSetBonus ?? {};
  const nextEchoPointers = {
    ...(characterData.echoes ?? {}),
    [candidate.slotIndex]: { echoId: candidate.echoId },
  };
  const echoSetBonus: EchoSetBonusSelection = characterData.setOverride
    ? previousEchoSetBonus
    : getSetBonusEffects(
        getSetsFromEchoes(resolveCharacterEchoes(nextEchoPointers, inventoryEchoes)),
      );
  const echoSetPassives = characterData.setOverride
    ? characterData.echoSetPassives
    : resolveNewlyActiveSetPassivesOverride(
        characterData.echoSetPassives ?? {},
        previousEchoSetBonus,
        echoSetBonus,
      );

  return {
    syntheticCharacters: {
      ...characters,
      [characterId]: {
        ...characterData,
        echoes: nextEchoPointers,
        echoSetBonus,
        echoSetPassives,
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
  damageType: LiveResultBarDamageType,
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
  return toImpactDelta(baselineDamage, readDamage(result, damageType));
}

/**
 * Estimates the total-damage swing from equipping `candidate` into its slot,
 * relative to the character's current build.
 *
 * Unlike `estimateWeaponSwapImpact`, this is a single exact number rather
 * than a 2-point range, but echoes turn out to have the same on/off
 * ambiguity weapons do — a *conditional* set-bonus passive (most 5pc/3pc
 * bonuses; commonly `alwaysEnabled: false` with real stacks) has to be
 * manually toggled on by the player once it exists, exactly like a weapon
 * passive. Rather than bracket every candidate (which would report an
 * "at worst"/"at best" range for a passive axis that's usually irrelevant —
 * most swaps don't touch which set bonuses apply at all), this assumes a
 * rational player turns on any bonus the swap *newly* makes available,
 * leaving every bonus the swap doesn't touch at the build's real stored
 * toggle state (see `resolveNewlyActiveSetPassivesOverride`). Swapping
 * across sets is handled by recomputing which set bonuses apply post-swap
 * (see `resolveCandidateEchoConfig`) — without that, a swap that completes
 * or breaks a set bonus would be scored against the pre-swap bonus and come
 * out badly wrong (both of these were real reported bugs: a swap that
 * restored a 5pc bonus estimated "+2,315 · +2.4%" against a real ~+80K).
 *
 * `options.target`/`options.damageType` should mirror whatever the caller
 * currently has the Live Result Bar showing for this character
 * (`liveResultBarTarget`/`liveResultBarDamageType`, persisted per-character
 * in `settingsStore.config.liveResultBarByCharacter`). Without them, this
 * falls back to a "first saved rotation, else a representative single
 * attack" guess (see `resolveComparisonRotation`) that can measure a
 * completely different, non-displayed number — a rotation-sensitive stat
 * (e.g. Crit Rate pushing some attacks over the 100% cap) can swing wildly
 * differently on a guessed single hit than across the user's real, full
 * rotation, which is what actually produced the originally-reported bug
 * (an estimated damage change several times larger than what equipping the
 * echo actually did).
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
  options: EchoImpactOptions = {},
): Promise<EchoImpactDelta | null> {
  const damageType = options.damageType ?? "Average";
  const rotation = await resolveEchoComparisonRotation(characterId, characters, options);
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
  options: EchoImpactOptions = {},
): Promise<Map<string, EchoImpactDelta | null>> {
  const results = new Map<string, EchoImpactDelta | null>();
  if (!candidates.length) {
    return results;
  }
  const damageType = options.damageType ?? "Average";
  const rotation = await resolveEchoComparisonRotation(characterId, characters, options);
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
        const delta = await estimateOneCandidate(
          rotation,
          characterId,
          characters,
          candidate,
          enemyConfig,
          inventoryEchoes,
          baselineDamage,
          damageType,
        );
        results.set(candidate.echoId, delta);
      } catch {
        results.set(candidate.echoId, null);
      }
    }),
  );
  return results;
}
