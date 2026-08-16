import { resolveRotationActionToAttackData } from "./resolveRotationAction";
import { calcDamages } from "./attacks";
import { buildCharacterCalculationContext, type CalculationContext, type TeamEnemyConfig } from "./buildCharacterContext";
import { applyAdvancedOverrides, hasAdvancedConfigOverrides, type RotationAdvancedConfig } from "./rotationAdvancedBuffs";
import { addDamageAggregation, type DamageAggregation } from "./teamRotation";

const EMPTY_DAMAGE_AGGREGATION: DamageAggregation = {
  normalDamage: null,
  avgDamage: null,
  critDamage: null,
  healing: null,
  shield: null,
};

export interface CharacterRotationAction {
  id: string;
  order?: number;
  key: string;
  type: string;
  count?: number;
  mainEcho?: string | null;
  mainEchoRank?: number | null;
  buffs?: Array<{ id: string; modifier: string; modifierValue: number }>;
  isDisabled?: boolean;
  negativeStatusStacks?: number;
  electroRageStacks?: number;
  advancedConfig?: RotationAdvancedConfig;
}

export interface CharacterRotationInput {
  id: string;
  name: string;
  description?: string | null;
  duration?: number | string | null;
  mainEcho?: string | null;
  mainEchoRank?: number | null;
  actions: CharacterRotationAction[];
}

export interface CharacterRotationDamageResult {
  id: string;
  name: string;
  description?: string | null;
  duration?: number | string | null;
  mainEcho: string | null;
  mainEchoRank: number | null;
  attacks: any[];
  damageAggregation: DamageAggregation;
}

/**
 * A calculation context already built for the active character (reused
 * as-is by Calculator.vue for its stat cards / echo damage / elemental
 * reactions) — reusing it here for the fast path avoids paying
 * `buildCharacterCalculationContext`'s async character/weapon re-fetch cost
 * for the common case where no action in the rotation overrides any buffs.
 */
export interface CharacterRotationBaseContext {
  chosenChar: any;
  characterLevel: string | number;
  context: CalculationContext;
}

/**
 * Computes one rotation's damage, mirroring `calcTeamRotationDamage`'s
 * advanced-mode branch but scoped to a single character/rotation: actions
 * with no `advancedConfig` share `baseContext` (a single batched
 * `calcDamages` call, exactly like before this feature existed); actions
 * with a real per-buff override each get their own freshly-rebuilt context
 * via `buildCharacterCalculationContext`, exactly like Team Rotation's
 * Advanced mode already does. Results from both paths are merged back into
 * the rotation's original action order.
 */
export async function calcCharacterRotationDamage(
  rotation: CharacterRotationInput,
  baseContext: CharacterRotationBaseContext,
  characterId: string,
  characters: Record<string, any>,
  enemyConfig: TeamEnemyConfig,
  inventoryEchoes: any[] = [],
): Promise<CharacterRotationDamageResult> {
  const characterData = characters?.[characterId] ?? {};
  const activeActions = rotation.actions.filter((action) => !action.isDisabled);
  const overrideActions = activeActions.filter((action) => hasAdvancedConfigOverrides(action.advancedConfig));
  const plainActions = activeActions.filter((action) => !hasAdvancedConfigOverrides(action.advancedConfig));

  let attacks: any[] = [];
  let damageAggregation: DamageAggregation = { ...EMPTY_DAMAGE_AGGREGATION };

  if (plainActions.length) {
    const plainAttacks = plainActions
      .map((action) => resolveRotationActionToAttackData(action, baseContext.chosenChar, baseContext.characterLevel))
      .filter((attack) => attack != null);
    baseContext.context.rotationsList = [
      { id: rotation.id, name: rotation.name, duration: rotation.duration, order: 0, attacks: plainAttacks },
    ];
    const damageData = calcDamages(baseContext.context);
    attacks = attacks.concat(damageData?.rotations?.[0]?.attacks ?? []);
    damageAggregation = addDamageAggregation(
      damageAggregation,
      damageData?.rotations?.[0]?.damageAggregation ?? EMPTY_DAMAGE_AGGREGATION,
    );
  }

  for (const action of overrideActions) {
    const overriddenCharacters = {
      ...characters,
      [characterId]: applyAdvancedOverrides(characterData, action.advancedConfig),
    };
    const built = await buildCharacterCalculationContext(characterId, overriddenCharacters, enemyConfig, inventoryEchoes);
    const attack = resolveRotationActionToAttackData(action, built.chosenChar, built.characterLevel);
    if (attack == null) continue;
    built.context.rotationsList = [
      { id: rotation.id, name: rotation.name, duration: rotation.duration, order: 0, attacks: [attack] },
    ];
    const damageData = calcDamages(built.context);
    attacks = attacks.concat(damageData?.rotations?.[0]?.attacks ?? []);
    damageAggregation = addDamageAggregation(
      damageAggregation,
      damageData?.rotations?.[0]?.damageAggregation ?? EMPTY_DAMAGE_AGGREGATION,
    );
  }

  // Restore the rotation's original action order — the two passes above ran
  // independently, so attacks came back grouped by path, not by action order.
  const attacksById = new Map(attacks.map((attack) => [attack.id, attack]));
  const orderedAttacks = activeActions
    .map((action) => attacksById.get(action.id))
    .filter((attack) => attack !== undefined);

  return {
    id: rotation.id,
    name: rotation.name,
    description: rotation.description ?? null,
    duration: rotation.duration ?? null,
    mainEcho: rotation.mainEcho ?? null,
    mainEchoRank: rotation.mainEchoRank ?? null,
    attacks: orderedAttacks,
    damageAggregation,
  };
}
